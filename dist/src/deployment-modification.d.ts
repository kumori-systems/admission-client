export declare abstract class DeploymentModification {
    deploymentURN: string;
    protected action: string;
    abstract generate(): any;
    protected generateBase(): any;
}
export declare class ScalingDeploymentModification extends DeploymentModification {
    readonly action: string;
    scaling: {
        [key: string]: number;
    };
    generate(): any;
}
export declare class ReconfigDeploymentModification extends DeploymentModification {
    readonly action: string;
    parameters: {
        [key: string]: any;
    };
    resources: {
        [key: string]: any;
    };
    generate(): any;
}
