export type Environment = 'local' | 'test' | 'staging' | 'production' ;

// interfaces
import { Client as ElasticClient } from 'elasticsearch'

export interface LogContext {
  zone?: string,
  containerName?: string
  environment: Environment
}

export type TLogSeverity = 'log' | 'info' | 'warn' | 'error' | 'fatal'

export interface IStandardLogParams {
  message: string
  severity: string
}

export interface IElasticLogConstructorOptions {
  port: number
  domain: string
  ssl: boolean
  user?: string
  pass?: string
  logContext: LogContext
}

export class ElasticLog<T> {
  client: ElasticClient
  logContext: LogContext
  logScheduler = new LogScheduler()

  /**
   * sets up an instance of Elastic log
   * @param optionsArg
   */
  constructor (optionsArg: IElasticLogConstructorOptions) {
    this.logContext = optionsArg.logContext
    this.client = new ElasticClient({
      host: this.computeHostString(optionsArg),
      log: 'trace'
    });
  };

  /**
   * computes the host string from the constructor options
   * @param optionsArg
   */
  private computeHostString(optionsArg: IElasticLogConstructorOptions): string {
    let hostString = `${optionsArg.domain}:${optionsArg.port}`;
    if(optionsArg.user && optionsArg.pass) {
      hostString = `${optionsArg.user}:${optionsArg.pass}@${hostString}`
    }
    if(optionsArg.ssl) {
      hostString = `https://${hostString}`
    } else {
      hostString = `http://${hostString}`
    }
    return hostString;
  }

  log(logObject: IStandardLogParams) {
    const now = new Date()
    this.client.index({
      index: `logs-${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}`,
      type: 'log',
      body: {
        '@timestamp': now.toISOString(),
        container: this.logContext.containerName,
        environment: this.logContext.environment,
        severity: logObject.severity,
        message: logObject.message
      }
    }, (error, response) => {
      if(error) {
        console.log(error)
        this.logScheduler.addFailedLog(logObject)
      }
    })
  }

};

export class LogScheduler {
  logStorage: any[]
  addFailedLog(objectArg: any | IStandardLogParams) {

  }
} 
