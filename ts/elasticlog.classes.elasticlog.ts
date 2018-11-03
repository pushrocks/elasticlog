// interfaces
import { Client as ElasticClient } from 'elasticsearch';
import { ILogContext, ILogPackage } from '@pushrocks/smartlog-interfaces';

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
}

export class ElasticLog<T> {
  client: ElasticClient;
  logScheduler = new LogScheduler(this);

  /**
   * sets up an instance of Elastic log
   * @param optionsArg
   */
  constructor(optionsArg: IElasticLogConstructorOptions) {
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

  public async log(logPackageArg: ILogPackage, scheduleOverwrite = false) {
    const now = new Date();
    if (this.logScheduler.logsScheduled && !scheduleOverwrite) {
      this.logScheduler.scheduleLog(logPackageArg);
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
          zone: logPackageArg.context.zone,
          container: logPackageArg.context.containerName,
          environment: logPackageArg.context.environment,
          severity: logPackageArg.level,
          message: logPackageArg.message
        }
      },
      (error, response) => {
        if (error) {
          console.log('ElasticLog encountered an error:');
          console.log(error);
          this.logScheduler.addFailedLog(logPackageArg);
        } else {
          console.log(`ElasticLog: ${logPackageArg.message}`);
        }
      }
    );
  }
}
