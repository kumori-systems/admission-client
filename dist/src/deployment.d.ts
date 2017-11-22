import { DeploymentInstanceInfo } from '.';
export declare class Deployment {
    urn: string;
    service: string;
    roles: {
        [key: string]: {
            instances: {
                [key: string]: DeploymentInstanceInfo;
            };
            configuration: {
                parameters: {
                    [key: string]: any;
                };
            };
            arrangement: {
                bandwidth: number;
                cpu: number;
                failurezones: number;
                ioperf: number;
                iopsintensive: boolean;
                instances: number;
                maxinstances: number;
                memory: number;
                mininstances: number;
                resilience: number;
            };
            component: string;
            entrypoint: {
                sslonly: boolean;
                domain: string;
                secrets: {
                    cert: string;
                    key: string;
                    ca: string;
                };
            };
        };
    };
    links: {
        [key: string]: {
            [key: string]: {
                [key: string]: any;
            };
        };
    };
    resources: {
        [key: string]: any;
    };
}
