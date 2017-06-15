export declare enum EventType {
    node = 0,
    service = 1,
    instance = 2,
    metric = 3,
}
export declare class AdmissionEvent {
    static EventType: typeof EventType;
    timestamp: string;
    owner: string | null;
    source: string;
    entity: any;
    type: string;
    name: string;
    data: any;
}
export declare class DisconnectedAdmissionEvent extends AdmissionEvent {
    readonly owner: null;
    entity: {
        node: string;
    };
    readonly type: string;
    readonly name: string;
    data: {
        flavor: string;
        publicIp: string;
        privateIp: string;
    };
}
