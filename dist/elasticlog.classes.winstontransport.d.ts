import { Transport } from "winston-transport";
import { ElasticLog, IElasticLogConstructorOptions } from "./elasticlog.classes.elasticlog";
export interface IWinstonStandardLogParams {
    message: string;
    level: string;
}
export declare class ElasticWinstonTransport extends Transport {
    client: ElasticLog<any>;
    constructor(optsArg: IElasticLogConstructorOptions);
    log(info: any, callback: any): void;
}
