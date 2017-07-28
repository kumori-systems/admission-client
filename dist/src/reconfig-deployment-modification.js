"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
class ReconfigDeploymentModification extends _1.DeploymentModification {
    constructor() {
        super(...arguments);
        this.action = 'reconfig';
    }
    generate() {
        const result = this.generateBase();
        result.configuration = {
            parameters: this.parameters,
            resources: this.resources
        };
        return result;
    }
}
exports.ReconfigDeploymentModification = ReconfigDeploymentModification;
//# sourceMappingURL=reconfig-deployment-modification.js.map