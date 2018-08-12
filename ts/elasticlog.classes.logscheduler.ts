import { ElasticLog, IStandardLogParams } from './elasticlog.classes.elasticlog';

export class LogScheduler {
  elasticLogRef: ElasticLog<any>;
  logsScheduled = false;
  logStorage: any[] = [];

  constructor(elasticLogRefArg: ElasticLog<any>) {
    this.elasticLogRef = elasticLogRefArg;
  }

  addFailedLog(objectArg: any | IStandardLogParams) {
    this.logStorage.push(objectArg);
    this.setRetry();
  }
  scheduleLog(logObject: any) {
    this.logStorage.push(logObject);
  }

  setRetry() {
    setTimeout(() => {
      const oldStorage = this.logStorage;
      this.logStorage = [];
      for (let logObject of oldStorage) {
        this.elasticLogRef.log(logObject, true);
      }
      if (this.logStorage.length === 0) {
        console.log('ElasticLog retry success!!!');
        this.logsScheduled = false;
      } else {
        console.log('ElasticLog retry failed');
        this.setRetry();
      }
    }, 5000);
  }

  deferSend() {
    if (!this.logsScheduled) {
      console.log('Retry ElasticLog in 5 seconds!');
      this.logsScheduled = true;
      this.setRetry();
    }
  }
}
