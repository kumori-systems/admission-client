import { DeploymentInstanceInfo } from '.';
export declare class Deployment {
    'urn': string;
    'service': string;
    'roles': {
        [key: string]: {
            'instances': {
                [key: string]: DeploymentInstanceInfo;
            };
            'configuration': {
                [key: string]: any;
            };
            'entrypoint': {
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
}
