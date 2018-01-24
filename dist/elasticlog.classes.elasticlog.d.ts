export declare type Environment = 'local' | 'test' | 'staging' | 'production';
import { Client as ElasticClient } from 'elasticsearch';
export interface LogContext {
    zone?: string;
    containerName?: string;
    environment: Environment;
}
export declare type TLogSeverity = 'log' | 'info' | 'warn' | 'error' | 'fatal';
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
    logContext: LogContext;
}
export declare class ElasticLog<T> {
    client: ElasticClient;
    logContext: LogContext;
    logScheduler: LogScheduler;
    /**
     * sets up an instance of Elastic log
     * @param optionsArg
     */
    constructor(optionsArg: IElasticLogConstructorOptions);
    /**
     * computes the host string from the constructor options
     * @param optionsArg
     */
    private computeHostString(optionsArg);
    log(logObject: IStandardLogParams): void;
}
export declare class LogScheduler {
    logStorage: any[];
    addFailedLog(objectArg: any | IStandardLogParams): void;
}
