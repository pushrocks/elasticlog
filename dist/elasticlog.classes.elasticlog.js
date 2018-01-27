"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// interfaces
const elasticsearch_1 = require("elasticsearch");
// other classes
const elasticlog_classes_logscheduler_1 = require("./elasticlog.classes.logscheduler");
class ElasticLog {
    /**
     * sets up an instance of Elastic log
     * @param optionsArg
     */
    constructor(optionsArg) {
        this.logScheduler = new elasticlog_classes_logscheduler_1.LogScheduler(this);
        this.logContext = optionsArg.logContext;
        this.client = new elasticsearch_1.Client({
            host: this.computeHostString(optionsArg),
            log: "trace"
        });
    }
    /**
     * computes the host string from the constructor options
     * @param optionsArg
     */
    computeHostString(optionsArg) {
        let hostString = `${optionsArg.domain}:${optionsArg.port}`;
        if (optionsArg.user && optionsArg.pass) {
            hostString = `${optionsArg.user}:${optionsArg.pass}@${hostString}`;
        }
        if (optionsArg.ssl) {
            hostString = `https://${hostString}`;
        }
        else {
            hostString = `http://${hostString}`;
        }
        return hostString;
    }
    log(logObject, scheduleOverwrite = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            if (this.logScheduler.logsScheduled && !scheduleOverwrite) {
                this.logScheduler.scheduleLog(logObject);
                return;
            }
            this.client.index({
                index: `logs-${now.getFullYear()}.${("0" + (now.getMonth() + 1)).slice(-2)}.${now.getDate()}`,
                type: "log",
                body: {
                    "@timestamp": now.toISOString(),
                    container: this.logContext.containerName,
                    environment: this.logContext.environment,
                    severity: logObject.severity,
                    message: logObject.message
                }
            }, (error, response) => {
                if (error) {
                    console.log("ElasticLog encountered an error:");
                    console.log(error);
                    this.logScheduler.addFailedLog(logObject);
                }
                else {
                    console.log(`ElasticLog: ${logObject.message}`);
                }
            });
        });
    }
}
exports.ElasticLog = ElasticLog;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxhc3RpY2xvZy5jbGFzc2VzLmVsYXN0aWNsb2cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90cy9lbGFzdGljbG9nLmNsYXNzZXMuZWxhc3RpY2xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBRUEsYUFBYTtBQUNiLGlEQUF3RDtBQUd4RCxnQkFBZ0I7QUFDaEIsdUZBQWlFO0FBd0JqRTtJQUtFOzs7T0FHRztJQUNILFlBQVksVUFBeUM7UUFOckQsaUJBQVksR0FBRyxJQUFJLDhDQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFPcEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxzQkFBYSxDQUFDO1lBQzlCLElBQUksRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDO1lBQ3hDLEdBQUcsRUFBRSxPQUFPO1NBQ2IsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7T0FHRztJQUNLLGlCQUFpQixDQUFDLFVBQXlDO1FBQ2pFLElBQUksVUFBVSxHQUFHLEdBQUcsVUFBVSxDQUFDLE1BQU0sSUFBSSxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDM0QsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN2QyxVQUFVLEdBQUcsR0FBRyxVQUFVLENBQUMsSUFBSSxJQUFJLFVBQVUsQ0FBQyxJQUFJLElBQUksVUFBVSxFQUFFLENBQUM7UUFDckUsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ25CLFVBQVUsR0FBRyxXQUFXLFVBQVUsRUFBRSxDQUFDO1FBQ3ZDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLFVBQVUsR0FBRyxVQUFVLFVBQVUsRUFBRSxDQUFDO1FBQ3RDLENBQUM7UUFDRCxNQUFNLENBQUMsVUFBVSxDQUFDO0lBQ3BCLENBQUM7SUFFSyxHQUFHLENBQUMsU0FBNkIsRUFBRSxpQkFBaUIsR0FBRyxLQUFLOztZQUNoRSxNQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ3ZCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO2dCQUMxRCxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDekMsTUFBTSxDQUFDO1lBQ1QsQ0FBQztZQUNELElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUNmO2dCQUNFLEtBQUssRUFBRSxRQUFRLEdBQUcsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FDcEUsQ0FBQyxDQUFDLENBQ0gsSUFBSSxHQUFHLENBQUMsT0FBTyxFQUFFLEVBQUU7Z0JBQ3BCLElBQUksRUFBRSxLQUFLO2dCQUNYLElBQUksRUFBRTtvQkFDSixZQUFZLEVBQUUsR0FBRyxDQUFDLFdBQVcsRUFBRTtvQkFDL0IsU0FBUyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYTtvQkFDeEMsV0FBVyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVztvQkFDeEMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxRQUFRO29CQUM1QixPQUFPLEVBQUUsU0FBUyxDQUFDLE9BQU87aUJBQzNCO2FBQ0YsRUFDRCxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsRUFBRTtnQkFDbEIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDVixPQUFPLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7b0JBQ2hELE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ25CLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUM1QyxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztnQkFDbEQsQ0FBQztZQUNILENBQUMsQ0FDRixDQUFDO1FBQ0osQ0FBQztLQUFBO0NBQ0Y7QUFqRUQsZ0NBaUVDIn0=