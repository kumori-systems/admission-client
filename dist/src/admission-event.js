"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventType;
(function (EventType) {
    EventType[EventType["node"] = 0] = "node";
    EventType[EventType["service"] = 1] = "service";
    EventType[EventType["instance"] = 2] = "instance";
    EventType[EventType["metric"] = 3] = "metric";
})(EventType = exports.EventType || (exports.EventType = {}));
;
class AdmissionEvent {
}
AdmissionEvent.EventType = EventType;
exports.AdmissionEvent = AdmissionEvent;
class DisconnectedAdmissionEvent extends AdmissionEvent {
    constructor() {
        super(...arguments);
        this.owner = null;
        this.type = 'node';
        this.name = 'disconnected';
    }
}
exports.DisconnectedAdmissionEvent = DisconnectedAdmissionEvent;
//# sourceMappingURL=admission-event.js.map