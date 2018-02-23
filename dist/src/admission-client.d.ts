/// <reference types="socket.io-client" />
import { EventEmitter, Listener } from 'typed-event-emitter';
import Swagger = require('./swagger/api');
import { AdmissionEvent, Deployment, DeploymentInstanceInfo, DeploymentList, DeploymentModification, Endpoint, FileStream, RegistrationResult } from '.';
/**
 * Stub to give access to an ECloud admission instance.
 */
export declare class AdmissionClient extends EventEmitter {
    onConnected: (handler: () => any) => Listener;
    onDisconnected: (handler: () => any) => Listener;
    onEcloudEvent: (handler: (event: AdmissionEvent) => any) => Listener;
    onError: (handler: (reason: any) => any) => Listener;
    protected basePath: string;
    protected accessToken: string | undefined;
    protected api: Swagger.DefaultApi;
    protected ws: SocketIOClient.Socket;
    protected dummy: Listener;
    /**
     *
     * @param basePath  URL where admission is waiting requests. For example:
     *  http://localhost:8090/admission
     * @param accessToken ACS token with credentials for operating in the stamp.
     */
    constructor(basePath: string, accessToken?: string);
    refreshToken(refreshedAccessToken: string): void;
    /**
     * Asynchronous initialization of the stub.
     */
    init(): Promise<void>;
    close(): void;
    /**
     * Returns data of deployed services in system.
     * @param urn urn of deployment whose data is needed.
     * If not provided, data about any accesible deployment is returned.
     * @param owner Only the deployments whose owner matches the value
     * of the parameter are listed
     */
    findDeployments(urn?: string, owner?: string): Promise<{
        [key: string]: Deployment;
    }>;
    /**
     *  Returns data of registered entities in the system.
     *  These can be component, services, runtimes and resources.
     */
    findStorage(): Promise<string[]>;
    /**
     * Remove a registered entity based on its urn.
     * @param urn  The urn of registered entity to be deleted.
     */
    removeStorage(urn: string): Promise<any>;
    /**
     *  Returns manifest of a registered entity based on its urn.
     * @param urn The urn of registered entity to get its manifest.
     */
    getStorageManifest(urn: string): Promise<any>;
    /**
     * Returns a list of volumes and information related to that volumes. If URN
     * is provided, only returns the info related to that resource.
     * @param urn The urn of the registered resource to get its manifest.
     */
    getResources(urn?: string): Promise<string[]>;
    /**
     * Registers a set of bundles in the system.
     * At least one of the parameters must have a proper value.
     * @param bundlesZip A zip with a set of bundles, each one of them in a
     * different folder.
     * The structure of a bundle is documented in ECloud SDK manual, section 4.1.
     * @param bundlesJson A Json file with a list of references to bundles.
     * The format of this file must follow the specification in the ECloud SDK
     * manual, section 4.1.1.
     */
    sendBundle(bundlesZip?: FileStream, bundlesJson?: FileStream): Promise<RegistrationResult>;
    /**
     * Performs a new deployment in the system.
     * @param buffer Deployment file following specification in ECloud Manual,
     *  section 4.
     */
    deploy(buffer: FileStream): Promise<DeploymentList>;
    /**
     * Undeploys a deployment in the system.
     * @param urn Urn of deployment to be undeployed
     */
    undeploy(urn: string): Promise<DeploymentInstanceInfo[]>;
    /**
     * Creates a new link between two deployed services.
     * @param endpoints An array of 2 elements with desired link endpoints data.
     */
    linkDeployments(endpoints: Endpoint[]): Promise<any>;
    /**
     * Removes a link between two services
     * @param endpoints  An array of 2 elements with endpoints data of the link
     *  to be removed.
     */
    unlinkDeployments(endpoints: Endpoint[]): Promise<any>;
    /**
     *  Modifies the configuration of a deployed service.
     * @param configuration Specification of the modification. Currently, two
     * classes of modifications are supported: ScalingDeploymentModification and
     * ReconfigDeploymentModification.
     */
    modifyDeployment(configuration: DeploymentModification): Promise<any>;
    /**
     * List current test contexts in the stamp.
     */
    listTestContexts(): Promise<string[]>;
    /**
     * Removes a test context
     * @param urn Identifier of the test context to be removed.
     */
    removeTestContext(urn: string): Promise<any>;
    private mapDeploymentDefault;
    private mapDeploymentLocalStamp;
    private mapInstanceInfoDefault;
    private generateLinkManifest;
}
