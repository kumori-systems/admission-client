import { DeploymentModification } from ".";
export declare class ScalingDeploymentModification extends DeploymentModification {
    scaling: {
        [key: string]: number;
    };
    protected readonly action: string;
    generate(): any;
}
