"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Swagger = require("./swagger/api");
const _1 = require(".");
const q = require("q");
// export class GeneralResponse {
//   public "success": boolean;
//   public "message": string;
//   public "data": any;
// }
// enum FindDeploymentsShow {
//   topology,
//   urn,
//   extended
// }
/**
 * Stub to give access to an ECloud admission instance.
 */
class AdmissionClient {
    /**
     *
     * @param basePath  URL where admission is waiting requests. For example:
     *  http://localhost:8090/admission
     * @param accessToken ACS token with credentials for operating in the stamp.
     */
    constructor(basePath, accessToken) {
        this.basePath = basePath;
        this.accessToken = accessToken;
        this.api = new Swagger.DefaultApi(this.basePath);
        if (this.accessToken == null) {
            // stuff to modify protected property and fix generated api error
            const free = this.api;
            free.authentications.apiAuthorization = new Swagger.VoidAuth();
        }
        else {
            this.api.accessToken = this.accessToken || "";
        }
    }
    /**
     * Asynchronous initialization of the stub.
     */
    init() {
        return q();
    }
    /**
     * Returns data of deployed services in system.
     * @param urn urn of deployment whose data is needed.
     * If not provided, data about any accesible deployment is returned.
     * @param owner Only the deployments whose owner matches the value
     * of the parameter are listed
     */
    findDeployments(urn, owner) {
        const deferred = q.defer();
        this.api.findDeployments(urn, owner)
            .then((value) => {
            if (value.body.success) {
                const result = {};
                // console.log("=====", JSON.stringify( value.body.data, null, 2));
                for (const dname in value.body.data) {
                    // Predefined deployment in local-stamp
                    if (dname === "default") {
                        continue;
                    }
                    const d0 = value.body.data[dname];
                    const d1 = mapDeploymentDefault(dname, d0);
                    result[dname] = d1;
                }
                deferred.resolve(result);
            }
            else {
                deferred.reject(new Error(value.body.message));
            }
        })
            .catch((reason) => {
            deferred.reject(reason);
        });
        return deferred.promise;
    }
    /**
     *  Returns data of registered entities in the system.
     *  These can be component, services, runtimes and resources.
     */
    findStorage() {
        const deferred = q.defer();
        this.api.registriesGet()
            .then((value) => {
            if (value.body.success) {
                const result = value.body.data;
                deferred.resolve(result);
            }
            else {
                deferred.reject(new Error(value.body.message));
            }
        })
            .catch((reason) => {
            deferred.reject(reason);
        });
        return deferred.promise;
    }
    /**
     * Remove a registered entity based on its urn.
     * @param urn  The urn of registered entity to be deleted.
     */
    removeStorage(urn) {
        const deferred = q.defer();
        this.api.registriesUrnDelete(urn)
            .then((value) => {
            if (value.body.success) {
                const result = value.body.data;
                deferred.resolve(result);
            }
            else {
                deferred.reject(new Error(value.body.message));
            }
        })
            .catch((reason) => {
            deferred.reject(reason);
        });
        return deferred.promise;
    }
    /**
     *  Returns manifest of a registered entity based on its urn.
     * @param urn The urn of registered entity to get its manifest.
     */
    getStorageManifest(urn) {
        const deferred = q.defer();
        this.api.registriesGet(urn)
            .then((value) => {
            if (value.body.success) {
                const result = value.body.data;
                deferred.resolve(result);
            }
            else {
                deferred.reject(new Error(value.body.message));
            }
        })
            .catch((reason) => {
            deferred.reject(reason);
        });
        return deferred.promise;
    }
    /**
     * Registers a set of bundles in the system.
     * At least one of the parameters must have a proper value.
     * @param bundlesZip A zip with a set of bundles, each one of them in a different folder.
     * The structure of a bundle is documented in ECloud SDK manual, section 4.1.
     * @param bundlesJson A Json file with a list of references to bundles.
     * The format of this file must follow the specification in the ECloud SDK manual, section 4.1.1.
     */
    sendBundle(bundlesZip, bundlesJson) {
        const deferred = q.defer();
        this.api.bundlesPost(bundlesZip, bundlesJson)
            .then((value) => {
            if (value.body.success) {
                const data = value.body.data;
                const result = new _1.RegistrationResult();
                result.links = data.links;
                result.tests = data.tests;
                result.testToken = data.testToken;
                result.errors = data.errors;
                result.successful = data.successful;
                const deployments = new Array();
                result.deployments = {
                    errors: data.deployments.errors,
                    successful: deployments,
                };
                data.deployments.successful.forEach((item) => {
                    deployments.push(mapDeploymentDefault(item.deploymentURN, item.topology));
                });
                deferred.resolve(result);
            }
            else {
                deferred.reject(new Error(value.body.message));
            }
        })
            .catch((reason) => {
            deferred.reject(reason);
        });
        return deferred.promise;
    }
    /**
     * Performs a new deployment in the system.
     * @param buffer Deployment file following specification in ECloud Manual, section 4.
     */
    deploy(buffer) {
        const deferred = q.defer();
        this.api.deploymentsPost(buffer)
            .then((value) => {
            if (value.body.success) {
                const result = {};
                for (const dname in value.body.data) {
                    if (value.body.data[dname]) {
                        const d0 = value.body.data[dname];
                        const d1 = mapDeploymentDefault(dname, d0);
                        result[dname] = d1;
                    }
                }
                deferred.resolve(result);
            }
            else {
                deferred.reject(new Error(value.body.message));
            }
        })
            .catch((reason) => {
            deferred.reject(reason);
        });
        return deferred.promise;
    }
    /**
     * Undeploys a deployment in the system.
     * @param urn Urn of deployment to be undeployed
     */
    undeploy(urn) {
        const deferred = q.defer();
        this.api.deploymentsDelete(urn)
            .then((value) => {
            if (value.body.success) {
                const response = value.body.data;
                const result = new Array();
                for (const killed in response.killedInstances) {
                    if (response.killedInstances[killed]) {
                        const killedInfo = response.killedInstances[killed];
                        result.push(mapInstanceInfoDefault(killed, killedInfo.component, killedInfo));
                    }
                }
                deferred.resolve(result);
            }
            else {
                deferred.reject(new Error(value.body.message));
            }
        })
            .catch((reason) => {
            deferred.reject(reason);
        });
        return deferred.promise;
    }
    /**
     * Creates a new link between two deployed services.
     * @param endpoints An array of 2 elements with desired link endpoints data.
     */
    linkDeployments(endpoints) {
        const deferred = q.defer();
        this.api.linksPost(Buffer.from(JSON.stringify(endpoints)))
            .then((value) => {
            if (value.body.success) {
                const result = value.body.data;
                deferred.resolve(result);
            }
            else {
                deferred.reject(new Error(value.body.message));
            }
        })
            .catch((reason) => {
            deferred.reject(reason);
        });
        return deferred.promise;
    }
    /**
     * Removes a link between two services
     * @param endpoints  An array of 2 elements with endpoints data of the link to be removed.
     */
    unlinkDeployments(endpoints) {
        const deferred = q.defer();
        this.api.linksDelete(Buffer.from(JSON.stringify(endpoints)))
            .then((value) => {
            if (value.body.success) {
                const result = value.body.data;
                deferred.resolve(result);
            }
            else {
                deferred.reject(new Error(value.body.message));
            }
        })
            .catch((reason) => {
            deferred.reject(reason);
        });
        return deferred.promise;
    }
    /**
     *  Modifies the configuration of a deployed service.
     * @param configuration Specification of the modification. Currently, two classes of modifications
     *  are supported: ScalingDeploymentModification and ReconfigDeploymentModification.
     */
    modifyDeployment(configuration) {
        const deferred = q.defer();
        this.api.modifyDeployment(Buffer.from(JSON.stringify(configuration.generate())))
            .then((value) => {
            if (value.body.success) {
                const result = value.body.data;
                deferred.resolve(result);
            }
            else {
                deferred.reject(new Error(value.body.message));
            }
        })
            .catch((reason) => {
            deferred.reject(reason);
        });
        return deferred.promise;
    }
    /**
     * List current test contexts in the stamp.
     */
    listTestContexts() {
        const deferred = q.defer();
        this.api.testContextsGet()
            .then((value) => {
            if (value.body.success) {
                const result = value.body.data;
                deferred.resolve(result);
            }
            else {
                deferred.reject(new Error(value.body.message));
            }
        })
            .catch((reason) => {
            deferred.reject(reason);
        });
        return deferred.promise;
    }
    /**
     * Removes a test context
     * @param urn Identifier of the test context to be removed.
     */
    removeTestContext(urn) {
        const deferred = q.defer();
        this.api.testContextsDelete(urn)
            .then((value) => {
            if (value.body.success) {
                const result = value.body.data;
                deferred.resolve(result);
            }
            else {
                deferred.reject(new Error(value.body.message));
            }
        })
            .catch((reason) => {
            deferred.reject(reason);
        });
        return deferred.promise;
    }
}
exports.AdmissionClient = AdmissionClient;
const mapDeploymentDefault = (urn, data) => {
    if (data.serviceURN) {
        return mapDeploymentLocalStamp(urn, data);
    }
    const result = new _1.Deployment();
    result.urn = urn;
    result.service = data.service;
    result.roles = {};
    for (const roleName in data.roles) {
        if (data.roles[roleName]) {
            const roleInfo = data.roles[roleName];
            result.roles[roleName] = {
                configuration: roleInfo.configuration,
                entrypoint: roleInfo.entrypoint,
                instances: {},
            };
            for (const instanceName in data.roles[roleName].instances) {
                if (data.roles[roleName].instances[instanceName]) {
                    result.roles[roleName].instances[instanceName] = mapInstanceInfoDefault(instanceName, roleName, data.roles[roleName].instances[instanceName]);
                }
            }
        }
    }
    return result;
};
const mapDeploymentLocalStamp = (urn, data) => {
    const result = new _1.Deployment();
    result.urn = urn;
    result.service = data.serviceURN;
    result.roles = {};
    for (const roleName in data.roles) {
        if (data.roles[roleName]) {
            const roleInfo = data.roles[roleName];
            result.roles[roleName] = {
                configuration: roleInfo.configuration,
                entrypoint: roleInfo.entrypoint,
                instances: {},
            };
            roleInfo.instances.forEach((instanceName) => {
                const instance = new _1.DeploymentInstanceInfo();
                instance.id = instanceName;
                instance.role = roleName;
                instance.publicIp = "127.0.0.1";
                instance.privateIp = "127.0.0.1";
                if (data.volumes && data.volumes[instanceName]) {
                    instance.volumes = data.volumes[instanceName];
                }
                if (data.portMapping) {
                    data.portMapping.forEach((pm) => {
                        if (pm.iid === instanceName) {
                            if (!instance.ports) {
                                instance.ports = {};
                            }
                            instance.ports[pm.endpoint] = pm.port;
                        }
                    });
                }
                result.roles[roleName].instances[instanceName] = instance;
            });
        }
    }
    return result;
};
const mapInstanceInfoDefault = (name, role, i0) => {
    const instanceInfo = new _1.DeploymentInstanceInfo();
    instanceInfo.id = name;
    instanceInfo.role = role;
    instanceInfo.cnid = i0.id;
    instanceInfo.privateIp = i0.privateIp;
    instanceInfo.publicIp = i0.publicIp;
    if (i0.arrangement) {
        instanceInfo.arrangement = {
            bandwith: i0.arrangement.bandwith,
            cpu: i0.arrangement.cpu,
            failureZones: i0.arrangement.failureZones,
            maxinstances: i0.arrangement.maxinstances,
            memory: i0.arrangement.memory,
            mininstances: i0.arrangement.mininstances,
        };
    }
    return instanceInfo;
};
//# sourceMappingURL=admission-client.js.map