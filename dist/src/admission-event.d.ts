export declare enum EcloudEventType {
    node = 0,
    service = 1,
    instance = 2,
    metrics = 3,
}
export declare enum EcloudEventName {
    disconnected = 0,
    deploying = 1,
    deployed = 2,
    link = 3,
    unlink = 4,
    undeploying = 5,
    undeployed = 6,
    scale = 7,
    realocate = 8,
    restart = 9,
    status = 10,
    reconfig = 11,
    node = 12,
    service = 13,
}
export declare class AdmissionEvent {
    timestamp: string;
    source: string;
    entity: {
        node: string;
    } | {
        serviceApp: string;
        service: string;
    } | {
        serviceApp: string;
        service: string;
        role: string;
        instance: string;
    };
    type: EcloudEventType;
    name: EcloudEventName;
    strType: string;
    strName: string;
    data: any;
}
