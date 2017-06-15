export declare abstract class DeploymentModification {
    deploymentURN: string;
    protected action: string;
    abstract generate(): any;
    protected generateBase(): any;
}
