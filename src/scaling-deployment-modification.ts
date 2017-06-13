import {DeploymentModification} from ".";

export class ScalingDeploymentModification extends DeploymentModification {
  public scaling: {[key: string]: number};
  protected readonly action = "manualScaling";

  public generate(): any {
    const result = this.generateBase();
    result.roles = this.scaling;
    return result;
  }
}
