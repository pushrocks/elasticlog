import { ElasticLog, IStandardLogParams } from "./elasticlog.classes.elasticlog";
export declare class LogScheduler {
    elasticLogRef: ElasticLog<any>;
    logsScheduled: boolean;
    logStorage: any[];
    constructor(elasticLogRefArg: ElasticLog<any>);
    addFailedLog(objectArg: any | IStandardLogParams): void;
    scheduleLog(logObject: any): void;
    setRetry(): void;
    deferSend(): void;
}
