"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// interfaces
const elasticsearch_1 = require("elasticsearch");
class ElasticLog {
    /**
     * sets up an instance of Elastic log
     * @param optionsArg
     */
    constructor(optionsArg) {
        this.logScheduler = new LogScheduler();
        this.logContext = optionsArg.logContext;
        this.client = new elasticsearch_1.Client({
            host: this.computeHostString(optionsArg),
            log: 'trace'
        });
    }
    ;
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
    log(logObject) {
        const now = new Date();
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
            if (error) {
                console.log(error);
                this.logScheduler.addFailedLog(logObject);
            }
        });
    }
}
exports.ElasticLog = ElasticLog;
;
class LogScheduler {
    addFailedLog(objectArg) {
    }
}
exports.LogScheduler = LogScheduler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxhc3RpY2xvZy5jbGFzc2VzLmVsYXN0aWNsb2cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90cy9lbGFzdGljbG9nLmNsYXNzZXMuZWxhc3RpY2xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLGFBQWE7QUFDYixpREFBdUQ7QUF3QnZEO0lBS0U7OztPQUdHO0lBQ0gsWUFBYSxVQUF5QztRQU50RCxpQkFBWSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUE7UUFPL0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFBO1FBQ3ZDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxzQkFBYSxDQUFDO1lBQzlCLElBQUksRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDO1lBQ3hDLEdBQUcsRUFBRSxPQUFPO1NBQ2IsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUFBLENBQUM7SUFFRjs7O09BR0c7SUFDSyxpQkFBaUIsQ0FBQyxVQUF5QztRQUNqRSxJQUFJLFVBQVUsR0FBRyxHQUFHLFVBQVUsQ0FBQyxNQUFNLElBQUksVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzNELEVBQUUsQ0FBQSxDQUFDLFVBQVUsQ0FBQyxJQUFJLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDdEMsVUFBVSxHQUFHLEdBQUcsVUFBVSxDQUFDLElBQUksSUFBSSxVQUFVLENBQUMsSUFBSSxJQUFJLFVBQVUsRUFBRSxDQUFBO1FBQ3BFLENBQUM7UUFDRCxFQUFFLENBQUEsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNsQixVQUFVLEdBQUcsV0FBVyxVQUFVLEVBQUUsQ0FBQTtRQUN0QyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixVQUFVLEdBQUcsVUFBVSxVQUFVLEVBQUUsQ0FBQTtRQUNyQyxDQUFDO1FBQ0QsTUFBTSxDQUFDLFVBQVUsQ0FBQztJQUNwQixDQUFDO0lBRUQsR0FBRyxDQUFDLFNBQTZCO1FBQy9CLE1BQU0sR0FBRyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUE7UUFDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDaEIsS0FBSyxFQUFFLFFBQVEsR0FBRyxDQUFDLFdBQVcsRUFBRSxJQUFJLEdBQUcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQ3pFLElBQUksRUFBRSxLQUFLO1lBQ1gsSUFBSSxFQUFFO2dCQUNKLFlBQVksRUFBRSxHQUFHLENBQUMsV0FBVyxFQUFFO2dCQUMvQixTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhO2dCQUN4QyxXQUFXLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXO2dCQUN4QyxRQUFRLEVBQUUsU0FBUyxDQUFDLFFBQVE7Z0JBQzVCLE9BQU8sRUFBRSxTQUFTLENBQUMsT0FBTzthQUMzQjtTQUNGLEVBQUUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLEVBQUU7WUFDckIsRUFBRSxDQUFBLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDVCxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO2dCQUNsQixJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQTtZQUMzQyxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0NBRUY7QUF0REQsZ0NBc0RDO0FBQUEsQ0FBQztBQUVGO0lBRUUsWUFBWSxDQUFDLFNBQW1DO0lBRWhELENBQUM7Q0FDRjtBQUxELG9DQUtDIn0=