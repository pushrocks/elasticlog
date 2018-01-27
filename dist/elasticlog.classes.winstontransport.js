"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_transport_1 = require("winston-transport");
const elasticlog_classes_elasticlog_1 = require("./elasticlog.classes.elasticlog");
class ElasticWinstonTransport extends winston_transport_1.Transport {
    constructor(optsArg) {
        super(optsArg);
        this.client = new elasticlog_classes_elasticlog_1.ElasticLog(optsArg);
    }
    log(info, callback) {
        this.client.log({
            severity: info.level,
            message: info.message,
        });
        callback();
    }
}
exports.ElasticWinstonTransport = ElasticWinstonTransport;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxhc3RpY2xvZy5jbGFzc2VzLndpbnN0b250cmFuc3BvcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90cy9lbGFzdGljbG9nLmNsYXNzZXMud2luc3RvbnRyYW5zcG9ydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlEQUE4QztBQUM5QyxtRkFHeUM7QUFPekMsNkJBQXFDLFNBQVEsNkJBQVM7SUFHcEQsWUFBWSxPQUFzQztRQUNoRCxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksMENBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRUQsR0FBRyxDQUFDLElBQUksRUFBRSxRQUFRO1FBQ2hCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO1lBQ2QsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ3BCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztTQUN0QixDQUFDLENBQUM7UUFDSCxRQUFRLEVBQUUsQ0FBQztJQUNiLENBQUM7Q0FDRjtBQWZELDBEQWVDIn0=