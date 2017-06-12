export abstract class DeploymentModification {
  public deploymentURN: string;
  protected action: string;
  public abstract generate(): any;

  protected generateBase():any {
    return {
      deploymentURN: this.deploymentURN,
      action: this.action,
    };    
  }
}

export class ScalingDeploymentModification extends DeploymentModification {
  readonly action = 'manualScaling';
  public scaling: {[key: string]: number};
  
  public generate(): any {
    const result = this.generateBase();
    result.roles = this.scaling;
    return result;
  }
}

export class ReconfigDeploymentModification extends DeploymentModification {
  readonly action = 'reconfig';
  public parameters: {[key: string]: any};
  public resources: {[key: string]: any};
  
  public generate(): any {
    const result = this.generateBase();
    result.configuration = {
        parameters: this.parameters,
        resources: this.resources,
    };
    return result;
  }

}