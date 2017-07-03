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

import request = require('request');
import http = require('http');
import Promise = require('bluebird');

let defaultBasePath = 'http://admission-stability.osdmz.iti.es/admission';

// ===============================================
// This file is autogenerated - Please do not edit
// ===============================================

/* tslint:disable:no-unused-variable */

export class Deployment {
    'service': string;
    'roles': { [key: string]: InlineResponse2001Roles; };
}

export class DeploymentRole {
    'instances': { [key: string]: InlineResponse2001Instances; };
}

export class GeneralResponse {
    'success': boolean;
    'message': string;
    'data': any;
}

export class InlineResponse200 {
    'success': boolean;
    'message': string;
    'data': InlineResponse200Data;
}

export class InlineResponse2001 {
    'success': boolean;
    'message': string;
    'data': { [key: string]: InlineResponse2001Data; };
}

export class InlineResponse2001Arrangement {
    'cpu': number;
    'bandwidth': number;
    'failurezones': number;
    'mininstances': number;
    'maxinstances': number;
}

export class InlineResponse2001Data {
    'service': string;
    'roles': { [key: string]: InlineResponse2001Roles; };
}

export class InlineResponse2001Instances {
    'id': string;
    'privateIp': string;
    'publicIp': string;
    'arrangement': InlineResponse2001Arrangement;
}

export class InlineResponse2001Roles {
    'instances': { [key: string]: InlineResponse2001Instances; };
}

export class InlineResponse2002 {
    'success': boolean;
    'message': string;
    'data': any;
}

export class InlineResponse200Data {
    'successful': any;
    'errors': any;
    'deployments': any;
    'links': any;
    'tests': any;
    'testToken': string;
}

export class InstanceInfo {
    'id': string;
    'privateIp': string;
    'publicIp': string;
    'arrangement': InlineResponse2001Arrangement;
}


export interface Authentication {
    /**
    * Apply authentication settings to header and query params.
    */
    applyToRequest(requestOptions: request.Options): void;
}

export class HttpBasicAuth implements Authentication {
    public username: string;
    public password: string;
    applyToRequest(requestOptions: request.Options): void {
        requestOptions.auth = {
            username: this.username, password: this.password
        }
    }
}

export class ApiKeyAuth implements Authentication {
    public apiKey: string;

    constructor(private location: string, private paramName: string) {
    }

    applyToRequest(requestOptions: request.Options): void {
        if (this.location == "query") {
            (<any>requestOptions.qs)[this.paramName] = this.apiKey;
        } else if (this.location == "header" && requestOptions && requestOptions.headers) {
            requestOptions.headers[this.paramName] = this.apiKey;
        }
    }
}

export class OAuth implements Authentication {
    public accessToken: string;

    applyToRequest(requestOptions: request.Options): void {
        if (requestOptions && requestOptions.headers) {
            requestOptions.headers["Authorization"] = "Bearer " + this.accessToken;
        }
    }
}

export class VoidAuth implements Authentication {
    public username: string;
    public password: string;
    applyToRequest(_: request.Options): void {
        // Do nothing
    }
}

export enum DefaultApiApiKeys {
}

export class DefaultApi {
    protected basePath = defaultBasePath;
    protected defaultHeaders : any = {};
    protected _useQuerystring : boolean = false;

    protected authentications = {
        'default': <Authentication>new VoidAuth(),
        'apiAuthorization': new OAuth(),
    }

    constructor(basePath?: string);
    constructor(basePathOrUsername: string, password?: string, basePath?: string) {
        if (password) {
            if (basePath) {
                this.basePath = basePath;
            }
        } else {
            if (basePathOrUsername) {
                this.basePath = basePathOrUsername
            }
        }
    }

    set useQuerystring(value: boolean) {
        this._useQuerystring = value;
    }

    public setApiKey(key: DefaultApiApiKeys, value: string) {
        this.authentications[DefaultApiApiKeys[key]].apiKey = value;
    }

    set accessToken(token: string) {
        this.authentications.apiAuthorization.accessToken = token;
    }
    /**
     * 
     * Registers a set of bundles in the system. At least one of the parameters must have a proper value.
     * @param bundlesZip A zip with a set of bundles, each one of them in a different folder. The structure of a bundle is documented in ECloud SDK manual, section 4.1.
     * @param bundlesJson A Json file with a list of references to bundles. The format of this file must follow the specification in the ECloud SDK manual, section 4.1.1.
     */
    public bundlesPost (bundlesZip?: FileReader, bundlesJson?: FileReader) : Promise<{ response: http.ClientResponse; body: InlineResponse200;  }> {
        const localVarPath = this.basePath + '/bundles';
        let queryParameters: any = {};
        let headerParams: any = (<any>Object).assign({}, this.defaultHeaders);
        let formParams: any = {};


        let useFormData = false;

        if (bundlesZip !== undefined) {
            formParams['bundlesZip'] = bundlesZip;
        }
        useFormData = true;

        if (bundlesJson !== undefined) {
            formParams['bundlesJson'] = bundlesJson;
        }
        useFormData = true;

        let requestOptions: request.Options = {
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
                (<any>requestOptions).formData = formParams;
            } else {
                requestOptions.form = formParams;
            }
        }
        return new Promise<{ response: http.ClientResponse; body: InlineResponse200;  }>((resolve, reject) => {
            request(requestOptions, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    if (response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    } else {
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
    public deploymentsDelete (urn: string) : Promise<{ response: http.ClientResponse; body: InlineResponse2002;  }> {
        const localVarPath = this.basePath + '/deployments';
        let queryParameters: any = {};
        let headerParams: any = (<any>Object).assign({}, this.defaultHeaders);
        let formParams: any = {};


        // verify required parameter 'urn' is not null or undefined
        if (urn === null || urn === undefined) {
            throw new Error('Required parameter urn was null or undefined when calling deploymentsDelete.');
        }

        if (urn !== undefined) {
            queryParameters['urn'] = urn;
        }

        let useFormData = false;

        let requestOptions: request.Options = {
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
                (<any>requestOptions).formData = formParams;
            } else {
                requestOptions.form = formParams;
            }
        }
        return new Promise<{ response: http.ClientResponse; body: InlineResponse2002;  }>((resolve, reject) => {
            request(requestOptions, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    if (response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    } else {
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
    public deploymentsPost (inline: Buffer) : Promise<{ response: http.ClientResponse; body: InlineResponse2001;  }> {
        const localVarPath = this.basePath + '/deployments';
        let queryParameters: any = {};
        let headerParams: any = (<any>Object).assign({}, this.defaultHeaders);
        let formParams: any = {};


        // verify required parameter 'inline' is not null or undefined
        if (inline === null || inline === undefined) {
            throw new Error('Required parameter inline was null or undefined when calling deploymentsPost.');
        }

        let useFormData = false;

        if (inline !== undefined) {
            formParams['inline'] = inline;
        }
        useFormData = true;

        let requestOptions: request.Options = {
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
                (<any>requestOptions).formData = formParams;
            } else {
                requestOptions.form = formParams;
            }
        }
        return new Promise<{ response: http.ClientResponse; body: InlineResponse2001;  }>((resolve, reject) => {
            request(requestOptions, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    if (response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    } else {
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
    public findDeployments (urn?: string, owner?: string, show?: string) : Promise<{ response: http.ClientResponse; body: InlineResponse2001;  }> {
        const localVarPath = this.basePath + '/deployments';
        let queryParameters: any = {};
        let headerParams: any = (<any>Object).assign({}, this.defaultHeaders);
        let formParams: any = {};


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

        let requestOptions: request.Options = {
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
                (<any>requestOptions).formData = formParams;
            } else {
                requestOptions.form = formParams;
            }
        }
        return new Promise<{ response: http.ClientResponse; body: InlineResponse2001;  }>((resolve, reject) => {
            request(requestOptions, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    if (response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    } else {
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
    public linksDelete (linkManifest: Buffer) : Promise<{ response: http.ClientResponse; body: InlineResponse2002;  }> {
        const localVarPath = this.basePath + '/links';
        let queryParameters: any = {};
        let headerParams: any = (<any>Object).assign({}, this.defaultHeaders);
        let formParams: any = {};


        // verify required parameter 'linkManifest' is not null or undefined
        if (linkManifest === null || linkManifest === undefined) {
            throw new Error('Required parameter linkManifest was null or undefined when calling linksDelete.');
        }

        let useFormData = false;

        if (linkManifest !== undefined) {
            formParams['linkManifest'] = linkManifest;
        }
        useFormData = true;

        let requestOptions: request.Options = {
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
                (<any>requestOptions).formData = formParams;
            } else {
                requestOptions.form = formParams;
            }
        }
        return new Promise<{ response: http.ClientResponse; body: InlineResponse2002;  }>((resolve, reject) => {
            request(requestOptions, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    if (response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    } else {
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
    public linksPost (linkManifest: Buffer) : Promise<{ response: http.ClientResponse; body: InlineResponse2002;  }> {
        const localVarPath = this.basePath + '/links';
        let queryParameters: any = {};
        let headerParams: any = (<any>Object).assign({}, this.defaultHeaders);
        let formParams: any = {};


        // verify required parameter 'linkManifest' is not null or undefined
        if (linkManifest === null || linkManifest === undefined) {
            throw new Error('Required parameter linkManifest was null or undefined when calling linksPost.');
        }

        let useFormData = false;

        if (linkManifest !== undefined) {
            formParams['linkManifest'] = linkManifest;
        }
        useFormData = true;

        let requestOptions: request.Options = {
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
                (<any>requestOptions).formData = formParams;
            } else {
                requestOptions.form = formParams;
            }
        }
        return new Promise<{ response: http.ClientResponse; body: InlineResponse2002;  }>((resolve, reject) => {
            request(requestOptions, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    if (response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    } else {
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
    public modifyDeployment (inline: Buffer) : Promise<{ response: http.ClientResponse; body: InlineResponse2002;  }> {
        const localVarPath = this.basePath + '/deployments/configuration';
        let queryParameters: any = {};
        let headerParams: any = (<any>Object).assign({}, this.defaultHeaders);
        let formParams: any = {};


        // verify required parameter 'inline' is not null or undefined
        if (inline === null || inline === undefined) {
            throw new Error('Required parameter inline was null or undefined when calling modifyDeployment.');
        }

        let useFormData = false;

        if (inline !== undefined) {
            formParams['inline'] = inline;
        }
        useFormData = true;

        let requestOptions: request.Options = {
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
                (<any>requestOptions).formData = formParams;
            } else {
                requestOptions.form = formParams;
            }
        }
        return new Promise<{ response: http.ClientResponse; body: InlineResponse2002;  }>((resolve, reject) => {
            request(requestOptions, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    if (response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    } else {
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
    public registriesGet (urn?: string) : Promise<{ response: http.ClientResponse; body: InlineResponse2002;  }> {
        const localVarPath = this.basePath + '/registries';
        let queryParameters: any = {};
        let headerParams: any = (<any>Object).assign({}, this.defaultHeaders);
        let formParams: any = {};


        if (urn !== undefined) {
            queryParameters['urn'] = urn;
        }

        let useFormData = false;

        let requestOptions: request.Options = {
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
                (<any>requestOptions).formData = formParams;
            } else {
                requestOptions.form = formParams;
            }
        }
        return new Promise<{ response: http.ClientResponse; body: InlineResponse2002;  }>((resolve, reject) => {
            request(requestOptions, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    if (response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    } else {
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
    public registriesUrnDelete (urn: string) : Promise<{ response: http.ClientResponse; body: InlineResponse2002;  }> {
        const localVarPath = this.basePath + '/registries';
        let queryParameters: any = {'urn': urn};
        let headerParams: any = (<any>Object).assign({}, this.defaultHeaders);
        let formParams: any = {};


        // verify required parameter 'urn' is not null or undefined
        if (urn === null || urn === undefined) {
            throw new Error('Required parameter urn was null or undefined when calling registriesUrnDelete.');
        }

        let useFormData = false;

        let requestOptions: request.Options = {
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
                (<any>requestOptions).formData = formParams;
            } else {
                requestOptions.form = formParams;
            }
        }
        return new Promise<{ response: http.ClientResponse; body: InlineResponse2002;  }>((resolve, reject) => {
            request(requestOptions, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    if (response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    } else {
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
    public registriesUrnGet (urn: string) : Promise<{ response: http.ClientResponse; body: InlineResponse2002;  }> {
        const localVarPath = this.basePath + '/registries/{urn}'
            .replace('{' + 'urn' + '}', String(urn));
        let queryParameters: any = {};
        let headerParams: any = (<any>Object).assign({}, this.defaultHeaders);
        let formParams: any = {};


        // verify required parameter 'urn' is not null or undefined
        if (urn === null || urn === undefined) {
            throw new Error('Required parameter urn was null or undefined when calling registriesUrnGet.');
        }

        let useFormData = false;

        let requestOptions: request.Options = {
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
                (<any>requestOptions).formData = formParams;
            } else {
                requestOptions.form = formParams;
            }
        }
        return new Promise<{ response: http.ClientResponse; body: InlineResponse2002;  }>((resolve, reject) => {
            request(requestOptions, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    if (response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    } else {
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
    public scaleInstances (inline: Buffer) : Promise<{ response: http.ClientResponse; body: InlineResponse2002;  }> {
        const localVarPath = this.basePath + '/deployments/instances';
        let queryParameters: any = {};
        let headerParams: any = (<any>Object).assign({}, this.defaultHeaders);
        let formParams: any = {};


        // verify required parameter 'inline' is not null or undefined
        if (inline === null || inline === undefined) {
            throw new Error('Required parameter inline was null or undefined when calling scaleInstances.');
        }

        let useFormData = false;

        if (inline !== undefined) {
            formParams['inline'] = inline;
        }
        useFormData = true;

        let requestOptions: request.Options = {
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
                (<any>requestOptions).formData = formParams;
            } else {
                requestOptions.form = formParams;
            }
        }
        return new Promise<{ response: http.ClientResponse; body: InlineResponse2002;  }>((resolve, reject) => {
            request(requestOptions, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    if (response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    } else {
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
    public testContextsDelete (urn: string) : Promise<{ response: http.ClientResponse; body: InlineResponse2002;  }> {
        const localVarPath = this.basePath + '/test-contexts';
        let queryParameters: any = {};
        let headerParams: any = (<any>Object).assign({}, this.defaultHeaders);
        let formParams: any = {};


        // verify required parameter 'urn' is not null or undefined
        if (urn === null || urn === undefined) {
            throw new Error('Required parameter urn was null or undefined when calling testContextsDelete.');
        }

        if (urn !== undefined) {
            queryParameters['urn'] = urn;
        }

        let useFormData = false;

        let requestOptions: request.Options = {
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
                (<any>requestOptions).formData = formParams;
            } else {
                requestOptions.form = formParams;
            }
        }
        return new Promise<{ response: http.ClientResponse; body: InlineResponse2002;  }>((resolve, reject) => {
            request(requestOptions, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    if (response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    } else {
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
    public testContextsGet () : Promise<{ response: http.ClientResponse; body: InlineResponse2002;  }> {
        const localVarPath = this.basePath + '/test-contexts';
        let queryParameters: any = {};
        let headerParams: any = (<any>Object).assign({}, this.defaultHeaders);
        let formParams: any = {};


        let useFormData = false;

        let requestOptions: request.Options = {
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
                (<any>requestOptions).formData = formParams;
            } else {
                requestOptions.form = formParams;
            }
        }
        return new Promise<{ response: http.ClientResponse; body: InlineResponse2002;  }>((resolve, reject) => {
            request(requestOptions, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    if (response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    } else {
                        reject({ response: response, body: body });
                    }
                }
            });
        });
    }
}
