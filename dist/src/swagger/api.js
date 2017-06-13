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
const request = require("request");
const Promise = require("bluebird");
let defaultBasePath = 'http://admission-stability.osdmz.iti.es/admission';
// ===============================================
// This file is autogenerated - Please do not edit
// ===============================================
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
class ApiKeyAuth {
    constructor(location, paramName) {
        this.location = location;
        this.paramName = paramName;
    }
    applyToRequest(requestOptions) {
        if (this.location == "query") {
            requestOptions.qs[this.paramName] = this.apiKey;
        }
        else if (this.location == "header" && requestOptions && requestOptions.headers) {
            requestOptions.headers[this.paramName] = this.apiKey;
        }
    }
}
exports.ApiKeyAuth = ApiKeyAuth;
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
var DefaultApiApiKeys;
(function (DefaultApiApiKeys) {
})(DefaultApiApiKeys = exports.DefaultApiApiKeys || (exports.DefaultApiApiKeys = {}));
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
    setApiKey(key, value) {
        this.authentications[DefaultApiApiKeys[key]].apiKey = value;
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
        let headerParams = Object.assign({}, this.defaultHeaders);
        let formParams = {};
        let useFormData = false;
        if (bundlesZip !== undefined) {
            formParams['bundlesZip'] = bundlesZip;
        }
        useFormData = true;
        if (bundlesJson !== undefined) {
            formParams['bundlesJson'] = bundlesJson;
        }
        useFormData = true;
        let requestOptions = {
            method: 'POST',
            qs: queryParameters,
            headers: headerParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
        };
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        if (Object.keys(formParams).length) {
            if (useFormData) {
                requestOptions.formData = formParams;
            }
            else {
                requestOptions.form = formParams;
            }
        }
        return new Promise((resolve, reject) => {
            request(requestOptions, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                else {
                    if (response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    }
                    else {
                        reject({ response: response, body: body });
                    }
                }
            });
        });
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
        let formParams = {};
        // verify required parameter 'urn' is not null or undefined
        if (urn === null || urn === undefined) {
            throw new Error('Required parameter urn was null or undefined when calling deploymentsDelete.');
        }
        if (urn !== undefined) {
            queryParameters['urn'] = urn;
        }
        let useFormData = false;
        let requestOptions = {
            method: 'DELETE',
            qs: queryParameters,
            headers: headerParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
        };
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        if (Object.keys(formParams).length) {
            if (useFormData) {
                requestOptions.formData = formParams;
            }
            else {
                requestOptions.form = formParams;
            }
        }
        return new Promise((resolve, reject) => {
            request(requestOptions, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                else {
                    if (response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    }
                    else {
                        reject({ response: response, body: body });
                    }
                }
            });
        });
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
        let formParams = {};
        // verify required parameter 'inline' is not null or undefined
        if (inline === null || inline === undefined) {
            throw new Error('Required parameter inline was null or undefined when calling deploymentsPost.');
        }
        let useFormData = false;
        if (inline !== undefined) {
            formParams['inline'] = inline;
        }
        useFormData = true;
        let requestOptions = {
            method: 'POST',
            qs: queryParameters,
            headers: headerParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
        };
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        if (Object.keys(formParams).length) {
            if (useFormData) {
                requestOptions.formData = formParams;
            }
            else {
                requestOptions.form = formParams;
            }
        }
        return new Promise((resolve, reject) => {
            request(requestOptions, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                else {
                    if (response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    }
                    else {
                        reject({ response: response, body: body });
                    }
                }
            });
        });
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
        let queryParameters = {};
        let headerParams = Object.assign({}, this.defaultHeaders);
        let formParams = {};
        if (urn !== undefined) {
            queryParameters['urn'] = urn;
        }
        if (owner !== undefined) {
            queryParameters['owner'] = owner;
        }
        if (show !== undefined) {
            queryParameters['show'] = show;
        }
        let useFormData = false;
        let requestOptions = {
            method: 'GET',
            qs: queryParameters,
            headers: headerParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
        };
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        if (Object.keys(formParams).length) {
            if (useFormData) {
                requestOptions.formData = formParams;
            }
            else {
                requestOptions.form = formParams;
            }
        }
        return new Promise((resolve, reject) => {
            request(requestOptions, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                else {
                    if (response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    }
                    else {
                        reject({ response: response, body: body });
                    }
                }
            });
        });
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
            qs: queryParameters,
            headers: headerParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
        };
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        if (Object.keys(formParams).length) {
            if (useFormData) {
                requestOptions.formData = formParams;
            }
            else {
                requestOptions.form = formParams;
            }
        }
        return new Promise((resolve, reject) => {
            request(requestOptions, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                else {
                    if (response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    }
                    else {
                        reject({ response: response, body: body });
                    }
                }
            });
        });
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
        let useFormData = false;
        if (linkManifest !== undefined) {
            formParams['linkManifest'] = linkManifest;
        }
        useFormData = true;
        let requestOptions = {
            method: 'POST',
            qs: queryParameters,
            headers: headerParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
        };
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        if (Object.keys(formParams).length) {
            if (useFormData) {
                requestOptions.formData = formParams;
            }
            else {
                requestOptions.form = formParams;
            }
        }
        return new Promise((resolve, reject) => {
            request(requestOptions, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                else {
                    if (response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    }
                    else {
                        reject({ response: response, body: body });
                    }
                }
            });
        });
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
        let useFormData = false;
        if (inline !== undefined) {
            formParams['inline'] = inline;
        }
        useFormData = true;
        let requestOptions = {
            method: 'PUT',
            qs: queryParameters,
            headers: headerParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
        };
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        if (Object.keys(formParams).length) {
            if (useFormData) {
                requestOptions.formData = formParams;
            }
            else {
                requestOptions.form = formParams;
            }
        }
        return new Promise((resolve, reject) => {
            request(requestOptions, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                else {
                    if (response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    }
                    else {
                        reject({ response: response, body: body });
                    }
                }
            });
        });
    }
    /**
     *
     * Returns data of registered entities in the system. These can be component, services, runtimes and resources.
     * @param urn urn of deployment whose data is needed. If not provided, data about any accesible deployment is returned.
     */
    registriesGet(urn) {
        const localVarPath = this.basePath + '/registries';
        let queryParameters = {};
        let headerParams = Object.assign({}, this.defaultHeaders);
        let formParams = {};
        if (urn !== undefined) {
            queryParameters['urn'] = urn;
        }
        let useFormData = false;
        let requestOptions = {
            method: 'GET',
            qs: queryParameters,
            headers: headerParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
        };
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        if (Object.keys(formParams).length) {
            if (useFormData) {
                requestOptions.formData = formParams;
            }
            else {
                requestOptions.form = formParams;
            }
        }
        return new Promise((resolve, reject) => {
            request(requestOptions, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                else {
                    if (response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    }
                    else {
                        reject({ response: response, body: body });
                    }
                }
            });
        });
    }
    /**
     *
     * Remove a registered entity based on its urn.
     * @param urn The urn of registered entity to be deleted.
     */
    registriesUrnDelete(urn) {
        const localVarPath = this.basePath + '/registries/{urn}'
            .replace('{' + 'urn' + '}', String(urn));
        let queryParameters = {};
        let headerParams = Object.assign({}, this.defaultHeaders);
        let formParams = {};
        // verify required parameter 'urn' is not null or undefined
        if (urn === null || urn === undefined) {
            throw new Error('Required parameter urn was null or undefined when calling registriesUrnDelete.');
        }
        let useFormData = false;
        let requestOptions = {
            method: 'DELETE',
            qs: queryParameters,
            headers: headerParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
        };
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        if (Object.keys(formParams).length) {
            if (useFormData) {
                requestOptions.formData = formParams;
            }
            else {
                requestOptions.form = formParams;
            }
        }
        return new Promise((resolve, reject) => {
            request(requestOptions, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                else {
                    if (response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    }
                    else {
                        reject({ response: response, body: body });
                    }
                }
            });
        });
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
        let useFormData = false;
        let requestOptions = {
            method: 'GET',
            qs: queryParameters,
            headers: headerParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
        };
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        if (Object.keys(formParams).length) {
            if (useFormData) {
                requestOptions.formData = formParams;
            }
            else {
                requestOptions.form = formParams;
            }
        }
        return new Promise((resolve, reject) => {
            request(requestOptions, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                else {
                    if (response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    }
                    else {
                        reject({ response: response, body: body });
                    }
                }
            });
        });
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
        let useFormData = false;
        if (inline !== undefined) {
            formParams['inline'] = inline;
        }
        useFormData = true;
        let requestOptions = {
            method: 'PUT',
            qs: queryParameters,
            headers: headerParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
        };
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        if (Object.keys(formParams).length) {
            if (useFormData) {
                requestOptions.formData = formParams;
            }
            else {
                requestOptions.form = formParams;
            }
        }
        return new Promise((resolve, reject) => {
            request(requestOptions, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                else {
                    if (response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    }
                    else {
                        reject({ response: response, body: body });
                    }
                }
            });
        });
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
        let useFormData = false;
        let requestOptions = {
            method: 'DELETE',
            qs: queryParameters,
            headers: headerParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
        };
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        if (Object.keys(formParams).length) {
            if (useFormData) {
                requestOptions.formData = formParams;
            }
            else {
                requestOptions.form = formParams;
            }
        }
        return new Promise((resolve, reject) => {
            request(requestOptions, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                else {
                    if (response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    }
                    else {
                        reject({ response: response, body: body });
                    }
                }
            });
        });
    }
    /**
     *
     * List current test contexts in the stamp.
     */
    testContextsGet() {
        const localVarPath = this.basePath + '/test-contexts';
        let queryParameters = {};
        let headerParams = Object.assign({}, this.defaultHeaders);
        let formParams = {};
        let useFormData = false;
        let requestOptions = {
            method: 'GET',
            qs: queryParameters,
            headers: headerParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
        };
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        if (Object.keys(formParams).length) {
            if (useFormData) {
                requestOptions.formData = formParams;
            }
            else {
                requestOptions.form = formParams;
            }
        }
        return new Promise((resolve, reject) => {
            request(requestOptions, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                else {
                    if (response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    }
                    else {
                        reject({ response: response, body: body });
                    }
                }
            });
        });
    }
}
exports.DefaultApi = DefaultApi;
//# sourceMappingURL=api.js.map