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
}
