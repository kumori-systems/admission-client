"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
class ScalingDeploymentModification extends _1.DeploymentModification {
    constructor() {
        super(...arguments);
        this.action = "manualScaling";
    }
    generate() {
        const result = this.generateBase();
        result.roles = this.scaling;
        return result;
    }
}
exports.ScalingDeploymentModification = ScalingDeploymentModification;
//# sourceMappingURL=scaling-deployment-modification.js.map