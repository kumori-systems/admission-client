"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EcloudEventType;
(function (EcloudEventType) {
    EcloudEventType[EcloudEventType["node"] = 0] = "node";
    EcloudEventType[EcloudEventType["service"] = 1] = "service";
    EcloudEventType[EcloudEventType["instance"] = 2] = "instance";
    EcloudEventType[EcloudEventType["metrics"] = 3] = "metrics";
})(EcloudEventType = exports.EcloudEventType || (exports.EcloudEventType = {}));
var EcloudEventName;
(function (EcloudEventName) {
    EcloudEventName[EcloudEventName["disconnected"] = 0] = "disconnected";
    EcloudEventName[EcloudEventName["deploying"] = 1] = "deploying";
    EcloudEventName[EcloudEventName["deployed"] = 2] = "deployed";
    EcloudEventName[EcloudEventName["link"] = 3] = "link";
    EcloudEventName[EcloudEventName["unlink"] = 4] = "unlink";
    EcloudEventName[EcloudEventName["undeploying"] = 5] = "undeploying";
    EcloudEventName[EcloudEventName["undeployed"] = 6] = "undeployed";
    EcloudEventName[EcloudEventName["scale"] = 7] = "scale";
    EcloudEventName[EcloudEventName["scaling"] = 8] = "scaling";
    EcloudEventName[EcloudEventName["scaled"] = 9] = "scaled";
    EcloudEventName[EcloudEventName["realocate"] = 10] = "realocate";
    EcloudEventName[EcloudEventName["restart"] = 11] = "restart";
    EcloudEventName[EcloudEventName["status"] = 12] = "status";
    EcloudEventName[EcloudEventName["reconfig"] = 13] = "reconfig";
    EcloudEventName[EcloudEventName["node"] = 14] = "node";
    EcloudEventName[EcloudEventName["service"] = 15] = "service";
    EcloudEventName[EcloudEventName["volume"] = 16] = "volume";
})(EcloudEventName = exports.EcloudEventName || (exports.EcloudEventName = {}));
class AdmissionEvent {
}
exports.AdmissionEvent = AdmissionEvent;
//# sourceMappingURL=admission-event.js.map