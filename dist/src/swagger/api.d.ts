/// <reference types="node" />
export declare class GeneralResponse {
    "success": boolean;
    "message": string;
    "data": any;
}
export declare class InlineResponse200 {
    "success": boolean;
    "message": string;
    "data": InlineResponse200Data;
}
export declare class InlineResponse2001 {
    "success": boolean;
    "message": string;
    "data": {
        [key: string]: InlineResponse2001Data;
    };
}
export declare class InlineResponse2001Arrangement {
    "cpu": number;
    "bandwidth": number;
    "failurezones": number;
    "mininstances": number;
    "maxinstances": number;
}
export declare class InlineResponse2001Data {
    "service": string;
    "roles": {
        [key: string]: InlineResponse2001Roles;
    };
}
export declare class InlineResponse2003 {
    "success": boolean;
    "message": string;
    "data": {
        deploymentURN: string;
        topology: InlineResponse2001Data;
    };
}
export declare class InlineResponse2001Instances {
    "id": string;
    "privateIp": string;
    "publicIp": string;
    "arrangement": InlineResponse2001Arrangement;
}
export declare class InlineResponse2001Roles {
    "instances": {
        [key: string]: InlineResponse2001Instances;
    };
}
export declare class InlineResponse2002 {
    "success": boolean;
    "message": string;
    "data": any;
}
export declare class InlineResponse200Data {
    "successful": any;
    "errors": any;
    "deployments": any;
    "links": any;
    "tests": any;
    "testToken": string;
}
export declare class InstanceInfo {
    "id": string;
    "privateIp": string;
    "publicIp": string;
    "arrangement": InlineResponse2001Arrangement;
}
export interface IAuthentication {
    /**
     * Apply authentication settings to header and query params.
     */
    applyToRequest(requestOptions: any): void;
}
export declare class HttpBasicAuth implements IAuthentication {
    username: string;
    password: string;
    applyToRequest(requestOptions: any): void;
}
export declare class OAuth implements IAuthentication {
    accessToken: string;
    applyToRequest(requestOptions: any): void;
}
export declare class VoidAuth implements IAuthentication {
    username: string;
    password: string;
    applyToRequest(_: any): void;
}
export declare class DefaultApi {
    protected basePath: string;
    protected defaultHeaders: any;
    protected authentications: {
        apiAuthorization: OAuth;
        default: VoidAuth;
    };
    constructor(basePath?: string);
    accessToken: string;
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
    bundlesPost(bundlesZip?: any, bundlesJson?: any): Promise<InlineResponse200>;
    /**
     *
     * Undeploys a deployment in the system.
     * @param urn Urn of deployment to be undeployed
     */
    deploymentsDelete(urn: string): Promise<InlineResponse2002>;
    /**
     *
     * Performs a new deployment in the system.
     * @param inline The uploaded deployment file following specification
     * in ECloud Manual, section 4.
     */
    deploymentsPost(inline: any): Promise<InlineResponse2003>;
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
    findDeployments(urn?: string, owner?: string, show?: string): Promise<InlineResponse2001>;
    /**
     *
     * Removes a link between two services
     * @param linkManifest The manifest of the link to be removed.
     */
    linksDelete(linkManifest: any): Promise<InlineResponse2002>;
    /**
     *
     * Creates a new link between two deployed services.
     * @param linkManifest The manifest of the desired link.
     */
    linksPost(linkManifest: any): Promise<InlineResponse2002>;
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
    modifyDeployment(inline: any): Promise<InlineResponse2002>;
    /**
     *
     * Returns data of registered entities in the system. These can be
     * component, services, runtimes and resources.
     * @param urn urn of deployment whose data is needed. If not provided,
     * data about any accesible deployment is returned.
     */
    registriesGet(urn?: string): Promise<InlineResponse2002>;
    /**
     *
     * Remove a registered entity based on its urn.
     * @param urn The urn of registered entity to be deleted.
     */
    registriesUrnDelete(urn: string): Promise<InlineResponse2002>;
    /**
     *
     * Returns manifest of a registered entity based on its urn.
     * @param urn The urn of registered entity to get its manifest .
     */
    registriesUrnGet(urn: string): Promise<InlineResponse2002>;
    /**
     *
     * Modifies the number of instances of some role of a deployment
     * @param inline
     */
    scaleInstances(inline: Buffer): Promise<InlineResponse2002>;
    /**
     *
     * Removes a test context
     * @param urn Identifier of the test context to be removed.
     */
    testContextsDelete(urn: string): Promise<InlineResponse2002>;
    /**
     *
     * List current test contexts in the stamp.
     */
    testContextsGet(): Promise<InlineResponse2002>;
}
