import { Deployment } from ".";
export declare class RegistrationResult {
    "successful": any;
    "errors": any;
    "deployments": {
        "successful": Deployment[];
        "errors": any;
    };
    "links": any;
    "tests": any;
    "testToken": string;
}
