"use strict";
/**
 * ECloud Admission
 * The Admission API is the entry point for ECloud users to interact with the
 * system. With this API you can perform operations such as registering
 * components, services, deploying them, checking their status, etc.
 * In order to correctly understand the terms used in descriptions of
 * API elements, it is necessary to have some knowledge about the structure
 * of the services within the ECloud PAAS. Information on this topic can be
 * found in the ECloud manual.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const FormData = require("form-data");
const __1 = require("..");
const defaultBasePath = "http://admission.argo.kumori.cloud/admission";
/* tslint:disable:no-unused-variable */
/* tslint:disable:max-classes-per-file */
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
            password: this.password,
            username: this.username,
        };
    }
}
exports.HttpBasicAuth = HttpBasicAuth;
class OAuth {
    applyToRequest(requestOptions) {
        if (requestOptions && requestOptions.headers) {
            requestOptions.headers.authorization =
                "Bearer " + this.accessToken;
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
        this.authentications = {
            apiAuthorization: new OAuth(),
            default: new VoidAuth(),
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
    set accessToken(token) {
        this.authentications.apiAuthorization.accessToken = token;
    }
    /**
     *
     * Registers a set of bundles in the system. At least one of the parameters
     * must have a proper value.
     * @param bundlesZip A zip with a set of bundles, each one of them in a
     *  different folder. The structure of a bundle is documented in ECloud
     *  SDK manual, section 4.1.
     * @param bundlesJson A Json file with a list of references to bundles.
     * The format of this file must follow the specification in the ECloud SDK
     *  manual, section 4.1.1.
     */
    bundlesPost(bundlesZip, bundlesJson) {
        const localVarPath = this.basePath + "/bundles";
        const queryParameters = {};
        // const headerParams: any =  Object.assign({}, this.defaultHeaders);
        let formParams;
        const fd = new FormData();
        formParams = fd;
        if (bundlesZip !== undefined) {
            fd.append("bundlesZip", bundlesZip, "bundle.zip");
        }
        if (bundlesJson !== undefined) {
            fd.append("bundlesJson", bundlesJson, "bundle.json");
        }
        const requestOptions = {
            data: formParams,
            method: "POST",
            params: queryParameters,
            url: localVarPath,
        };
        if (fd.getHeaders !== undefined) {
            requestOptions.headers = fd.getHeaders();
        }
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        // console.log(JSON.stringify(requestOptions.headers,null,2));
        const deferred = new __1.Deferred();
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
        const localVarPath = this.basePath + "/deployments";
        const queryParameters = {};
        const headerParams = Object.assign({}, this.defaultHeaders);
        // verify required parameter "urn" is not null or undefined
        if (urn === null || urn === undefined) {
            throw new Error("Required parameter urn was null or undefined when \
          calling deploymentsDelete.");
        }
        if (urn !== undefined) {
            queryParameters.urn = urn;
        }
        const requestOptions = {
            headers: headerParams,
            method: "DELETE",
            params: queryParameters,
            url: localVarPath,
        };
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        const deferred = new __1.Deferred();
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
     * @param inline The uploaded deployment file following specification
     * in ECloud Manual, section 4.
     */
    deploymentsPost(inline) {
        const localVarPath = this.basePath + "/deployments";
        const queryParameters = {};
        const headerParams = Object.assign({}, this.defaultHeaders);
        const formParams = new FormData();
        // verify required parameter "inline" is not null or undefined
        if (inline === null || inline === undefined) {
            throw new Error("Required parameter inline was null or undefined \
          when calling deploymentsPost.");
        }
        if (inline !== undefined) {
            formParams.append("inline", inline, inline.name);
        }
        const requestOptions = {
            data: formParams,
            headers: headerParams,
            method: "POST",
            params: queryParameters,
            url: localVarPath,
        };
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        const deferred = new __1.Deferred();
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
     * @param urn urn of deployment whose data is needed. If not provided,
     * data about any accesible deployment is returned.
     * @param owner Only the deployments whose owner matches the value of the
     *  parameter are listed
     * @param show Desired format of the information provided for each
     * deployment. Possible values are&amp;#58;
     *  * topology. It is the default value.
     *  * extended.
     *  * urn. Only urns are listed.
     */
    findDeployments(urn, owner, show) {
        const localVarPath = this.basePath + "/deployments";
        const queryParameters = {};
        const headerParams = Object.assign({}, this.defaultHeaders);
        if (urn !== undefined) {
            queryParameters.urn = urn;
        }
        if (owner !== undefined) {
            queryParameters.owner = owner;
        }
        if (show !== undefined) {
            queryParameters.show = show;
        }
        const requestOptions = {
            headers: headerParams,
            method: "get",
            params: queryParameters,
            url: localVarPath,
        };
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        const deferred = new __1.Deferred();
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
        const localVarPath = this.basePath + "/links";
        const queryParameters = {};
        const headerParams = Object.assign({}, this.defaultHeaders);
        const formParams = {};
        // verify required parameter "linkManifest" is not null or undefined
        if (linkManifest === null || linkManifest === undefined) {
            throw new Error("Required parameter linkManifest was null or \
          undefined when calling linksDelete.");
        }
        let useFormData = false;
        if (linkManifest !== undefined) {
            formParams.linkManifest = linkManifest;
        }
        useFormData = true;
        const requestOptions = {
            data: formParams,
            headers: headerParams,
            method: "DELETE",
            params: queryParameters,
            url: localVarPath,
        };
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        const deferred = new __1.Deferred();
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
        const localVarPath = this.basePath + "/links";
        const queryParameters = {};
        const headerParams = Object.assign({}, this.defaultHeaders);
        const formParams = {};
        // verify required parameter "linkManifest" is not null or undefined
        if (linkManifest === null || linkManifest === undefined) {
            throw new Error("Required parameter linkManifest was null or \
            undefined when calling linksPost.");
        }
        if (linkManifest !== undefined) {
            formParams.linkManifest = linkManifest;
        }
        const requestOptions = {
            data: formParams,
            headers: headerParams,
            method: "POST",
            params: queryParameters,
            url: localVarPath,
        };
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        const deferred = new __1.Deferred();
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
     * Modification of some parameter of the deployment.
     * There are two possible actions&amp;#58;
     * * Reconfiguration of parameters or deployment and
     * * Manual scaling.
     * @param inline The uploaded deployment file with the new configuration.
     * The file must be a JSON with this keys&amp;#58;
     * * deploymentURN. URN of the deployment to be reconfigured.
     * * action. manualScaling/reconfig
     * * entryPoints (only when reconfig action)
     * * configuration (only when reconfig action)
     * * roles (only when manualScaling action)
     */
    modifyDeployment(inline) {
        const localVarPath = this.basePath + "/deployments/configuration";
        const queryParameters = {};
        const headerParams = Object.assign({}, this.defaultHeaders);
        const formParams = {};
        // verify required parameter "inline" is not null or undefined
        if (inline === null || inline === undefined) {
            throw new Error("Required parameter inline was null or undefined \
          when calling modifyDeployment.");
        }
        if (inline !== undefined) {
            formParams.inline = inline;
        }
        const requestOptions = {
            data: formParams,
            headers: headerParams,
            method: "PUT",
            params: queryParameters,
            url: localVarPath,
        };
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        const deferred = new __1.Deferred();
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
     * Returns data of registered entities in the system. These can be
     * component, services, runtimes and resources.
     * @param urn urn of deployment whose data is needed. If not provided,
     * data about any accesible deployment is returned.
     */
    registriesGet(urn) {
        let localVarPath = this.basePath + "/registries";
        const queryParameters = {};
        const headerParams = Object.assign({}, this.defaultHeaders);
        if (urn !== undefined) {
            localVarPath = localVarPath + "/" + encodeURIComponent(urn);
        }
        const requestOptions = {
            headers: headerParams,
            method: "GET",
            params: queryParameters,
            url: localVarPath,
        };
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        const deferred = new __1.Deferred();
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
        const localVarPath = this.basePath + "/registries";
        const queryParameters = { urn };
        const headerParams = Object.assign({}, this.defaultHeaders);
        // verify required parameter "urn" is not null or undefined
        if (urn === null || urn === undefined) {
            throw new Error("Required parameter urn was null or undefined when \
          calling registriesUrnDelete.");
        }
        const requestOptions = {
            headers: headerParams,
            method: "DELETE",
            params: queryParameters,
            url: localVarPath,
        };
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        const deferred = new __1.Deferred();
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
        const localVarPath = this.basePath + "/registries/{urn}"
            .replace("{" + "urn" + "}", String(urn));
        const queryParameters = {};
        const headerParams = Object.assign({}, this.defaultHeaders);
        const formParams = {};
        // verify required parameter "urn" is not null or undefined
        if (urn === null || urn === undefined) {
            throw new Error("Required parameter urn was null or undefined when \
          calling registriesUrnGet.");
        }
        const requestOptions = {
            data: formParams,
            headers: headerParams,
            method: "GET",
            params: queryParameters,
            url: localVarPath,
        };
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        const deferred = new __1.Deferred();
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
        const localVarPath = this.basePath + "/deployments/instances";
        const queryParameters = {};
        const headerParams = Object.assign({}, this.defaultHeaders);
        const formParams = {};
        // verify required parameter "inline" is not null or undefined
        if (inline === null || inline === undefined) {
            throw new Error("Required parameter inline was null or undefined \
          when calling scaleInstances.");
        }
        if (inline !== undefined) {
            formParams.inline = inline;
        }
        const requestOptions = {
            data: formParams,
            headers: headerParams,
            method: "PUT",
            params: queryParameters,
            url: localVarPath,
        };
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        const deferred = new __1.Deferred();
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
        const localVarPath = this.basePath + "/test-contexts";
        const queryParameters = {};
        const headerParams = Object.assign({}, this.defaultHeaders);
        const formParams = {};
        // verify required parameter "urn" is not null or undefined
        if (urn === null || urn === undefined) {
            throw new Error("Required parameter urn was null or undefined \
            when calling testContextsDelete.");
        }
        if (urn !== undefined) {
            queryParameters.urn = urn;
        }
        const requestOptions = {
            data: formParams,
            headers: headerParams,
            method: "DELETE",
            params: queryParameters,
            url: localVarPath,
        };
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        const deferred = new __1.Deferred();
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
        const localVarPath = this.basePath + "/test-contexts";
        const queryParameters = {};
        const headerParams = Object.assign({}, this.defaultHeaders);
        const requestOptions = {
            headers: headerParams,
            method: "GET",
            params: queryParameters,
            url: localVarPath,
        };
        this.authentications.apiAuthorization.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        const deferred = new __1.Deferred();
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
//   return toString.call(val) === "[object File]";
// }
// function isStream(val:any) {
//   return isObject(val) && isFunction(val.pipe);
// }
// function isFunction(val:any) {
//   return toString.call(val) === "[object Function]";
// }
// function isObject(val:any) {
//   return val !== null && typeof val === "object";
// }
//# sourceMappingURL=api.js.map