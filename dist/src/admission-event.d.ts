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
    scaling = 7,
    scaled = 8,
    realocate = 9,
    restart = 10,
    status = 11,
    reconfig = 12,
    node = 13,
    service = 14,
    volume = 15,
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
