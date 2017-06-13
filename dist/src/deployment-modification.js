"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DeploymentModification {
    generateBase() {
        return {
            deploymentURN: this.deploymentURN,
            action: this.action,
        };
    }
}
exports.DeploymentModification = DeploymentModification;
class ScalingDeploymentModification extends DeploymentModification {
    constructor() {
        super(...arguments);
        this.action = 'manualScaling';
    }
    generate() {
        const result = this.generateBase();
        result.roles = this.scaling;
        return result;
    }
}
exports.ScalingDeploymentModification = ScalingDeploymentModification;
class ReconfigDeploymentModification extends DeploymentModification {
    constructor() {
        super(...arguments);
        this.action = 'reconfig';
    }
    generate() {
        const result = this.generateBase();
        result.configuration = {
            parameters: this.parameters,
            resources: this.resources,
        };
        return result;
    }
}
exports.ReconfigDeploymentModification = ReconfigDeploymentModification;
//# sourceMappingURL=deployment-modification.js.map