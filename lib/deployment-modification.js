"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DeploymentModification {
    generateBase() {
        return {
            action: this.action,
            deploymentUrn: this.deploymentURN
        };
    }
}
exports.DeploymentModification = DeploymentModification;
//# sourceMappingURL=deployment-modification.js.map