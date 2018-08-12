import { Client as ElasticClient } from 'elasticsearch';
import { ILogContext } from 'smartlog-interfaces';
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
export declare class ElasticLog<T> {
    client: ElasticClient;
    logContext: ILogContext;
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
    log(logObject: IStandardLogParams, scheduleOverwrite?: boolean): Promise<void>;
}
