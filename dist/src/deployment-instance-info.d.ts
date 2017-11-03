export declare class DeploymentInstanceInfo {
    id: string;
    role: string;
    cnid: string;
    publicIp: string;
    privateIp: string;
    connected: boolean;
    configuration: {
        'resources': {
            [key: string]: {
                'type': string;
                'parameters': {
                    [key: string]: any;
                };
            };
        };
    };
    arrangement: {
        mininstances: number;
        maxinstances: number;
        resilience: number;
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
