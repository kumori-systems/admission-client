/// <reference types="q" />
/// <reference types="node" />
import Swagger = require("./swagger/api");
import { Deployment, DeploymentInstanceInfo, DeploymentList, Endpoint, RegistrationResult } from ".";
import q = require("q");
import Promise = q.Promise;
export declare class AdmissionClient {
    protected basePath: string;
    protected accessToken: string | undefined;
    protected api: Swagger.DefaultApi;
    constructor(basePath: string, accessToken?: string);
    init(): q.Promise<void>;
    findDeployments(urn?: string, owner?: string): Promise<{
        [key: string]: Deployment;
    }>;
    findStorage(): Promise<string[]>;
    removeStorage(urn: string): Promise<any>;
    getStorageManifest(urn: string): Promise<any>;
    sendBundle(bundlesZip?: Buffer, bundlesJson?: Buffer): Promise<RegistrationResult>;
    deploy(buffer: Buffer): Promise<DeploymentList>;
    undeploy(urn: string): Promise<DeploymentInstanceInfo[]>;
    linkDeployments(endpoints: Endpoint[]): Promise<any>;
    unlinkDeployments(endpoints: Endpoint[]): Promise<any>;
    configureDeployment(configuration: any): Promise<any>;
    listTestContexts(): Promise<string[]>;
    removeTestContext(urn: string): Promise<any>;
    scaleInstances(buffer: Buffer): Promise<any>;
}
