"use strict";
/**
 * ECloud Admission
 * The Admission API is the entry point for ECloud users to interact with the system. With this API you can perform operations such as registering components, services, deploying them, checking their status, etc.  In order to correctly understand the terms used in descriptions of API elements, it is necessary to have some knowledge about the structure of the services within the ECloud PAAS. Information on this topic can be found in the ECloud manual.
 *
 * OpenAPI spec version: 1.0.0
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const FormData = require("form-data");
let defaultBasePath = 'http://admission.argo.kumori.cloud/admission';
/* tslint:disable:no-unused-variable */
class Deployment {
}
exports.Deployment = Deployment;
class DeploymentRole {
}
exports.DeploymentRole = DeploymentRole;
class GeneralResponse {
}
exports.GeneralResponse = GeneralResponse;
class InlineResponse200 {
}
exports.InlineResponse200 = InlineResponse200;
class InlineResponse2001 {
}
exports.InlineResponse2001 = InlineResponse2001;
class InlineResponse2001Arrangement {
}
exports.InlineResponse2001Arrangement = InlineResponse2001Arrangement;
class InlineResponse2001Data {
}
exports.InlineResponse2001Data = InlineResponse2001Data;
class InlineResponse2001Instances {
}
exports.InlineResponse2001Instances = InlineResponse2001Instances;
class InlineResponse2001Roles {
}
exports.InlineResponse2001Roles = InlineResponse2001Roles;
class InlineResponse2002 {
}
exports.InlineResponse2002 = InlineResponse2002;
class InlineResponse200Data {
}
exports.InlineResponse200Data = InlineResponse200Data;
class InstanceInfo {
}
exports.InstanceInfo = InstanceInfo;
class HttpBasicAuth {
    applyToRequest(requestOptions) {
        requestOptions.auth = {
            username: this.username, password: this.password
        };
    }
}
exports.HttpBasicAuth = HttpBasicAuth;
class OAuth {
    applyToRequest(requestOptions) {
        if (requestOptions && requestOptions.headers) {
            requestOptions.headers["Authorization"] = "Bearer " + this.accessToken;
        }
    }
}
exports.OAuth = OAuth;
class VoidAuth {
    applyToRequest(_) {
        // Do nothing
    }
}
exports.VoidAuth = VoidAuth;
class DefaultApi {
    constructor(basePathOrUsername, password, basePath) {
        this.basePath = defaultBasePath;
        this.defaultHeaders = {};
        this._useQuerystring = false;
        this.authentications = {
            'default': new VoidAuth(),
            'apiAuthorization': new OAuth(),
        };
        if (password) {
            if (basePath) {
                this.basePath = basePath;
            }
        }
        else {
            if (basePathOrUsername) {
                this.basePath = basePathOrUsername;
            }
        }
    }
    set useQuerystring(value) {
        this._useQuerystring = value;
    }
    set accessToken(token) {
        this.authentications.apiAuthorization.accessToken = token;
    }
    /**
     *
     * Registers a set of bundles in the system. At least one of the parameters must have a proper value.
     * @param bundlesZip A zip with a set of bundles, each one of them in a different folder. The structure of a bundle is documented in ECloud SDK manual, section 4.1.
     * @param bundlesJson A Json file with a list of references to bundles. The format of this file must follow the specification in the ECloud SDK manual, section 4.1.1.
     */
    bundlesPost(bundlesZip, bundlesJson) {
        const localVarPath = this.basePath + '/bundles';
        let queryParameters = {};
        //let headerParams: any = (<any>Object).assign({}, this.defaultHeaders);
        let formParams;
        const fd = new FormData();
        formParams = fd;
        if (bundlesZip !== undefined) {
            fd.append('bundlesZip', bundlesZip, 'bundle.zip');
        }
        if (bundlesJson !== undefined) {
            fd.append('bundlesJson', bundlesJson, 'bundle.json');
        }
        let requestOptions = {
            method: 'POST',
            params: queryParameters,
            headers: fd.getHeaders(),
            url: localVarPath,
            data: formParams
        };
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        // console.log(JSON.stringify(requestOptions.headers,null,2));
        const deferred = new Deferred();
        axios_1.default(requestOptions)
            .then((response) => {
            if (response.status >= 200 && response.status <= 299) {
                deferred.resolve(response.data);
            }
            else {
                deferred.reject(response);
            }
        })
            .catch((reason) => {
            deferred.reject(reason);
        });
        return deferred.promise;
    }
    /**
     *
     * Undeploys a deployment in the system.
     * @param urn Urn of deployment to be undeployed
     */
    deploymentsDelete(urn) {
        const localVarPath = this.basePath + '/deployments';
        let queryParameters = {};
        let headerParams = Object.assign({}, this.defaultHeaders);
        // verify required parameter 'urn' is not null or undefined
        if (urn === null || urn === undefined) {
            throw new Error('Required parameter urn was null or undefined when calling deploymentsDelete.');
        }
        if (urn !== undefined) {
            queryParameters['urn'] = urn;
        }
        let requestOptions = {
            method: 'DELETE',
            params: queryParameters,
            headers: headerParams,
            url: localVarPath
        };
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        const deferred = new Deferred();
        axios_1.default(requestOptions)
            .then((response) => {
            if (response.status >= 200 && response.status <= 299) {
                deferred.resolve(response.data);
            }
            else {
                deferred.reject(response);
            }
        })
            .catch((reason) => {
            deferred.reject(reason);
        });
        return deferred.promise;
    }
    /**
     *
     * Performs a new deployment in the system.
     * @param inline The uploaded deployment file following specification in ECloud Manual, section 4.
     */
    deploymentsPost(inline) {
        const localVarPath = this.basePath + '/deployments';
        let queryParameters = {};
        let headerParams = Object.assign({}, this.defaultHeaders);
        let formParams = new FormData();
        // verify required parameter 'inline' is not null or undefined
        if (inline === null || inline === undefined) {
            throw new Error('Required parameter inline was null or undefined when calling deploymentsPost.');
        }
        if (inline !== undefined) {
            formParams.append('inline', inline, inline.name);
        }
        let requestOptions = {
            method: 'POST',
            params: queryParameters,
            headers: headerParams,
            url: localVarPath,
            data: formParams
        };
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        const deferred = new Deferred();
        axios_1.default(requestOptions)
            .then((response) => {
            if (response.status >= 200 && response.status <= 299) {
                deferred.resolve(response.data);
            }
            else {
                deferred.reject(response);
            }
        })
            .catch((reason) => {
            deferred.reject(reason);
        });
        return deferred.promise;
    }
    /**
     *
     * Returns data of deployed services in system.
     * @param urn urn of deployment whose data is needed. If not provided, data about any accesible deployment is returned.
     * @param owner Only the deployments whose owner matches the value of the parameter are listed
     * @param show Desired format of the information provided for each deployment. Possible values are&amp;#58; * topology. It is the default value. * extended. * urn. Only urns are listed.
     */
    findDeployments(urn, owner, show) {
        const localVarPath = this.basePath + '/deployments';
        const queryParameters = {};
        const headerParams = Object.assign({}, this.defaultHeaders);
        if (urn !== undefined) {
            queryParameters['urn'] = urn;
        }
        if (owner !== undefined) {
            queryParameters['owner'] = owner;
        }
        if (show !== undefined) {
            queryParameters['show'] = show;
        }
        const requestOptions = {
            method: 'get',
            params: queryParameters,
            headers: headerParams,
            url: localVarPath,
        };
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        const deferred = new Deferred();
        axios_1.default(requestOptions)
            .then((response) => {
            if (response.status >= 200 && response.status <= 299) {
                deferred.resolve(response.data);
            }
            else {
                deferred.reject(response);
            }
        })
            .catch((reason) => {
            deferred.reject(reason);
        });
        return deferred.promise;
    }
    /**
     *
     * Removes a link between two services
     * @param linkManifest The manifest of the link to be removed.
     */
    linksDelete(linkManifest) {
        const localVarPath = this.basePath + '/links';
        let queryParameters = {};
        let headerParams = Object.assign({}, this.defaultHeaders);
        let formParams = {};
        // verify required parameter 'linkManifest' is not null or undefined
        if (linkManifest === null || linkManifest === undefined) {
            throw new Error('Required parameter linkManifest was null or undefined when calling linksDelete.');
        }
        let useFormData = false;
        if (linkManifest !== undefined) {
            formParams['linkManifest'] = linkManifest;
        }
        useFormData = true;
        let requestOptions = {
            method: 'DELETE',
            params: queryParameters,
            headers: headerParams,
            url: localVarPath,
            data: formParams
        };
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        const deferred = new Deferred();
        axios_1.default(requestOptions)
            .then((response) => {
            if (response.status >= 200 && response.status <= 299) {
                deferred.resolve(response.data);
            }
            else {
                deferred.reject(response);
            }
        })
            .catch((reason) => {
            deferred.reject(reason);
        });
        return deferred.promise;
    }
    /**
     *
     * Creates a new link between two deployed services.
     * @param linkManifest The manifest of the desired link.
     */
    linksPost(linkManifest) {
        const localVarPath = this.basePath + '/links';
        let queryParameters = {};
        let headerParams = Object.assign({}, this.defaultHeaders);
        let formParams = {};
        // verify required parameter 'linkManifest' is not null or undefined
        if (linkManifest === null || linkManifest === undefined) {
            throw new Error('Required parameter linkManifest was null or undefined when calling linksPost.');
        }
        if (linkManifest !== undefined) {
            formParams['linkManifest'] = linkManifest;
        }
        let requestOptions = {
            method: 'POST',
            params: queryParameters,
            headers: headerParams,
            url: localVarPath,
            data: formParams
        };
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        const deferred = new Deferred();
        axios_1.default(requestOptions)
            .then((response) => {
            if (response.status >= 200 && response.status <= 299) {
                deferred.resolve(response.data);
            }
            else {
                deferred.reject(response);
            }
        })
            .catch((reason) => {
            deferred.reject(reason);
        });
        return deferred.promise;
    }
    /**
     *
     * Modification of some parameter of the deployment.      There are two possible actions&amp;#58; * Reconfiguration of parameters or deployment and * Manual scaling.
     * @param inline The uploaded deployment file with the new configuration. The file must be a JSON with this keys&amp;#58; * deploymentURN. URN of the deployment to be reconfigured. * action. manualScaling/reconfig * entryPoints (only when reconfig action) * configuration (only when reconfig action) * roles (only when manualScaling action)
     */
    modifyDeployment(inline) {
        const localVarPath = this.basePath + '/deployments/configuration';
        let queryParameters = {};
        let headerParams = Object.assign({}, this.defaultHeaders);
        let formParams = {};
        // verify required parameter 'inline' is not null or undefined
        if (inline === null || inline === undefined) {
            throw new Error('Required parameter inline was null or undefined when calling modifyDeployment.');
        }
        if (inline !== undefined) {
            formParams['inline'] = inline;
        }
        let requestOptions = {
            method: 'PUT',
            params: queryParameters,
            headers: headerParams,
            url: localVarPath,
            data: formParams
        };
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        const deferred = new Deferred();
        axios_1.default(requestOptions)
            .then((response) => {
            if (response.status >= 200 && response.status <= 299) {
                deferred.resolve(response.data);
            }
            else {
                deferred.reject(response);
            }
        })
            .catch((reason) => {
            deferred.reject(reason);
        });
        return deferred.promise;
    }
    /**
     *
     * Returns data of registered entities in the system. These can be component, services, runtimes and resources.
     * @param urn urn of deployment whose data is needed. If not provided, data about any accesible deployment is returned.
     */
    registriesGet(urn) {
        const localVarPath = this.basePath + '/registries';
        const queryParameters = {};
        const headerParams = Object.assign({}, this.defaultHeaders);
        if (urn !== undefined) {
            queryParameters['urn'] = urn;
        }
        const requestOptions = {
            method: 'GET',
            params: queryParameters,
            headers: headerParams,
            url: localVarPath
        };
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        const deferred = new Deferred();
        axios_1.default(requestOptions)
            .then((response) => {
            if (response.status >= 200 && response.status <= 299) {
                deferred.resolve(response.data);
            }
            else {
                deferred.reject(response);
            }
        })
            .catch((reason) => {
            deferred.reject(reason);
        });
        return deferred.promise;
    }
    /**
     *
     * Remove a registered entity based on its urn.
     * @param urn The urn of registered entity to be deleted.
     */
    registriesUrnDelete(urn) {
        const localVarPath = this.basePath + '/registries';
        let queryParameters = { 'urn': urn };
        let headerParams = Object.assign({}, this.defaultHeaders);
        // verify required parameter 'urn' is not null or undefined
        if (urn === null || urn === undefined) {
            throw new Error('Required parameter urn was null or undefined when calling registriesUrnDelete.');
        }
        let requestOptions = {
            method: 'DELETE',
            params: queryParameters,
            headers: headerParams,
            url: localVarPath,
        };
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        const deferred = new Deferred();
        axios_1.default(requestOptions)
            .then((response) => {
            if (response.status >= 200 && response.status <= 299) {
                deferred.resolve(response.data);
            }
            else {
                deferred.reject(response);
            }
        })
            .catch((reason) => {
            deferred.reject(reason);
        });
        return deferred.promise;
    }
    /**
     *
     * Returns manifest of a registered entity based on its urn.
     * @param urn The urn of registered entity to get its manifest .
     */
    registriesUrnGet(urn) {
        const localVarPath = this.basePath + '/registries/{urn}'
            .replace('{' + 'urn' + '}', String(urn));
        let queryParameters = {};
        let headerParams = Object.assign({}, this.defaultHeaders);
        let formParams = {};
        // verify required parameter 'urn' is not null or undefined
        if (urn === null || urn === undefined) {
            throw new Error('Required parameter urn was null or undefined when calling registriesUrnGet.');
        }
        let requestOptions = {
            method: 'GET',
            params: queryParameters,
            headers: headerParams,
            url: localVarPath,
            data: formParams
        };
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        const deferred = new Deferred();
        axios_1.default(requestOptions)
            .then((response) => {
            if (response.status >= 200 && response.status <= 299) {
                deferred.resolve(response.data);
            }
            else {
                deferred.reject(response);
            }
        })
            .catch((reason) => {
            deferred.reject(reason);
        });
        return deferred.promise;
    }
    /**
     *
     * Modifies the number of instances of some role of a deployment
     * @param inline
     */
    scaleInstances(inline) {
        const localVarPath = this.basePath + '/deployments/instances';
        let queryParameters = {};
        let headerParams = Object.assign({}, this.defaultHeaders);
        let formParams = {};
        // verify required parameter 'inline' is not null or undefined
        if (inline === null || inline === undefined) {
            throw new Error('Required parameter inline was null or undefined when calling scaleInstances.');
        }
        if (inline !== undefined) {
            formParams['inline'] = inline;
        }
        let requestOptions = {
            method: 'PUT',
            params: queryParameters,
            headers: headerParams,
            url: localVarPath,
            data: formParams
        };
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        const deferred = new Deferred();
        axios_1.default(requestOptions)
            .then((response) => {
            if (response.status >= 200 && response.status <= 299) {
                deferred.resolve(response.data);
            }
            else {
                deferred.reject(response);
            }
        })
            .catch((reason) => {
            deferred.reject(reason);
        });
        return deferred.promise;
    }
    /**
     *
     * Removes a test context
     * @param urn Identifier of the test context to be removed.
     */
    testContextsDelete(urn) {
        const localVarPath = this.basePath + '/test-contexts';
        let queryParameters = {};
        let headerParams = Object.assign({}, this.defaultHeaders);
        let formParams = {};
        // verify required parameter 'urn' is not null or undefined
        if (urn === null || urn === undefined) {
            throw new Error('Required parameter urn was null or undefined when calling testContextsDelete.');
        }
        if (urn !== undefined) {
            queryParameters['urn'] = urn;
        }
        let requestOptions = {
            method: 'DELETE',
            params: queryParameters,
            headers: headerParams,
            url: localVarPath,
            data: formParams
        };
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        const deferred = new Deferred();
        axios_1.default(requestOptions)
            .then((response) => {
            if (response.status >= 200 && response.status <= 299) {
                deferred.resolve(response.data);
            }
            else {
                deferred.reject(response);
            }
        })
            .catch((reason) => {
            deferred.reject(reason);
        });
        return deferred.promise;
    }
    /**
     *
     * List current test contexts in the stamp.
     */
    testContextsGet() {
        const localVarPath = this.basePath + '/test-contexts';
        let queryParameters = {};
        let headerParams = Object.assign({}, this.defaultHeaders);
        let requestOptions = {
            method: 'GET',
            params: queryParameters,
            headers: headerParams,
            url: localVarPath
        };
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        const deferred = new Deferred();
        axios_1.default(requestOptions)
            .then((response) => {
            if (response.status >= 200 && response.status <= 299) {
                deferred.resolve(response.data);
            }
            else {
                deferred.reject(response);
            }
        })
            .catch((reason) => {
            deferred.reject(reason);
        });
        return deferred.promise;
    }
}
exports.DefaultApi = DefaultApi;
// function isFile(val:any) {
//   return toString.call(val) === '[object File]';
// }
// function isStream(val:any) {
//   return isObject(val) && isFunction(val.pipe);
// }
// function isFunction(val:any) {
//   return toString.call(val) === '[object Function]';
// }
// function isObject(val:any) {
//   return val !== null && typeof val === 'object';
// }
class Deferred {
    constructor() {
        this.state = "pending";
        this.fate = "unresolved";
        this.promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
        this.promise.then(() => this.state = "fulfilled", () => this.state = "rejected");
    }
    resolve(value) {
        if (this.fate === "resolved") {
            throw "Deferred cannot be resolved twice";
        }
        this.fate = "resolved";
        this._resolve(value);
    }
    reject(reason) {
        if (this.fate === "resolved") {
            throw "Deferred cannot be resolved twice";
        }
        this.fate = "resolved";
        this._reject(reason);
    }
    isResolved() {
        return this.fate === "resolved";
    }
    isPending() {
        return this.state === "pending";
    }
    isFulfilled() {
        return this.state === "fulfilled";
    }
    isRejected() {
        return this.state === "rejected";
    }
}
exports.Deferred = Deferred;
//# sourceMappingURL=api.js.map