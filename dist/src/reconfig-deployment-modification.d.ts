import { DeploymentModification } from ".";
export declare class ReconfigDeploymentModification extends DeploymentModification {
    parameters: {
        [key: string]: any;
    };
    resources: {
        [key: string]: any;
    };
    protected readonly action: string;
    generate(): any;
}
