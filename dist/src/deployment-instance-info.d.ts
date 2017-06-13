export declare class DeploymentInstanceInfo {
    id: string;
    role: string;
    cnid: string;
    publicIp: string;
    privateIp: string;
    arrangement: {
        mininstances: number;
        maxinstances: number;
        cpu: number;
        memory: number;
        bandwith: number;
        failureZones: number;
    };
    volumes?: {
        [key: string]: string;
    };
    ports?: {
        [key: string]: string;
    };
}
