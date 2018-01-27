import { Transport } from "winston-transport";
import {
  ElasticLog,
  IElasticLogConstructorOptions
} from "./elasticlog.classes.elasticlog";

export interface IWinstonStandardLogParams {
  message: string;
  level: string;
}

export class ElasticWinstonTransport extends Transport {
  client: ElasticLog<any>;

  constructor(optsArg: IElasticLogConstructorOptions) {
    super(optsArg);
    this.client = new ElasticLog(optsArg);
  }

  log(info, callback) {
    this.client.log({
      severity: info.level,
      message: info.message
    });
    callback();
  }
}
