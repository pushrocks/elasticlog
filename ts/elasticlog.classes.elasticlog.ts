// interfaces
import { Client as ElasticClient } from 'elasticsearch';
import { ILogContext } from '@pushrocks/smartlog-interfaces';

// other classes
import { LogScheduler } from './elasticlog.classes.logscheduler';

export interface IStandardLogParams {
  message: string;
  severity: string;
}

export interface IElasticLogConstructorOptions {
  port: number;
  domain: string;
  ssl: boolean;
  user?: string;
  pass?: string;
  logContext: ILogContext;
}

export class ElasticLog<T> {
  client: ElasticClient;
  logContext: ILogContext;
  logScheduler = new LogScheduler(this);

  /**
   * sets up an instance of Elastic log
   * @param optionsArg
   */
  constructor(optionsArg: IElasticLogConstructorOptions) {
    this.logContext = optionsArg.logContext;
    this.client = new ElasticClient({
      host: this.computeHostString(optionsArg),
      log: 'trace'
    });
  }

  /**
   * computes the host string from the constructor options
   * @param optionsArg
   */
  private computeHostString(optionsArg: IElasticLogConstructorOptions): string {
    let hostString = `${optionsArg.domain}:${optionsArg.port}`;
    if (optionsArg.user && optionsArg.pass) {
      hostString = `${optionsArg.user}:${optionsArg.pass}@${hostString}`;
    }
    if (optionsArg.ssl) {
      hostString = `https://${hostString}`;
    } else {
      hostString = `http://${hostString}`;
    }
    return hostString;
  }

  async log(logObject: IStandardLogParams, scheduleOverwrite = false) {
    const now = new Date();
    if (this.logScheduler.logsScheduled && !scheduleOverwrite) {
      this.logScheduler.scheduleLog(logObject);
      return;
    }
    this.client.index(
      {
        index: `logstash-${now.getFullYear()}.${('0' + (now.getMonth() + 1)).slice(-2)}.${(
          '0' + now.getDate()
        ).slice(-2)}`,
        type: 'log',
        body: {
          '@timestamp': now.toISOString(),
          zone: this.logContext.zone,
          container: this.logContext.containerName,
          environment: this.logContext.environment,
          severity: logObject.severity,
          message: logObject.message
        }
      },
      (error, response) => {
        if (error) {
          console.log('ElasticLog encountered an error:');
          console.log(error);
          this.logScheduler.addFailedLog(logObject);
        } else {
          console.log(`ElasticLog: ${logObject.message}`);
        }
      }
    );
  }
}
