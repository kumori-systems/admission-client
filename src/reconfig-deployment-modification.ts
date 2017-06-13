import {DeploymentModification} from ".";

export class ReconfigDeploymentModification extends DeploymentModification {
  public parameters: {[key: string]: any};
  public resources: {[key: string]: any};
  protected readonly action = "reconfig";

  public generate(): any {
    const result = this.generateBase();
    result.configuration = {
        parameters: this.parameters,
        resources: this.resources,
    };
    return result;
  }

}
