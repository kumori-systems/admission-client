import Swagger = require("./swagger/api");
import {Deployment, DeploymentInstanceInfo, DeploymentList, Endpoint, RegistrationResult } from ".";
import q = require("q");
import Promise = q.Promise;

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

export class AdmissionClient {

  protected basePath: string;
  protected accessToken: string|undefined;
  protected api: Swagger.DefaultApi;

  constructor(basePath: string, accessToken?: string) {
      this.basePath = basePath;
      this.accessToken = accessToken;

      this.api = new Swagger.DefaultApi(this.basePath);
      if (this.accessToken == null) {
        // stuff to modify protected property and fix api error
        const free: any = this.api;
        free.authentications.apiAuthorization = new Swagger.VoidAuth();
      } else {
        this.api.accessToken = this.accessToken || "";
      }
  }

  public init(): q.Promise<void> {
    return q();
  }

  public findDeployments(urn?: string, owner?: string): Promise<{[key: string]: Deployment}> {
    const deferred = q.defer<{[key: string]: Deployment}>();
    this.api.findDeployments(urn, owner)
    .then( (value) => {
      if (value.body.success) {
        const result: {[key: string]: Deployment} = {};
        // console.log("=====", JSON.stringify( value.body.data, null, 2));
        for (const dname in value.body.data) {
          // Predefined deployment in local-stamp
          if (dname === "default") {continue; }
          const d0 = value.body.data[dname];
          const d1 = mapDeploymentDefault(dname, d0);
          result[dname] = d1;
        }
        deferred.resolve(result);
      } else {
        deferred.reject(new Error(value.body.message));
      }
    })
    .catch((reason) => {
      deferred.reject(reason);
    });
    return deferred.promise;
  }

  public findStorage(): Promise<string[]> {
    const deferred = q.defer<string[]>();
    this.api.registriesGet()
    .then((value) => {
      if (value.body.success) {
        const result: string[] = value.body.data;
        deferred.resolve(result);
      } else {
        deferred.reject(new Error(value.body.message));
      }
    })
    .catch( (reason) => {
      deferred.reject(reason);
    });
    return deferred.promise;
  }

  public removeStorage(urn: string): Promise<any> {
    const deferred = q.defer<any>();
    this.api.registriesUrnDelete(urn)
    .then((value) => {
      if (value.body.success) {
        const result: any = value.body.data;
        deferred.resolve(result);
      } else {
        deferred.reject(new Error(value.body.message));
      }
    })
    .catch((reason) => {
      deferred.reject(reason);
    });
    return deferred.promise;
  }

  public getStorageManifest(urn: string): Promise<any> {
    const deferred = q.defer<any>();
    this.api.registriesGet(urn)
    .then((value) => {
      if (value.body.success) {
        const result: any = value.body.data;
        deferred.resolve(result);
      } else {
        deferred.reject(new Error(value.body.message));
      }
    })
    .catch((reason) => {
      deferred.reject(reason);
    });
    return deferred.promise;
  }

  public sendBundle(bundlesZip?: Buffer, bundlesJson?: Buffer): Promise<RegistrationResult> {
    const deferred = q.defer<RegistrationResult>();
    this.api.bundlesPost(bundlesZip, bundlesJson)
    .then( (value) => {
      if (value.body.success) {
        const data: Swagger.InlineResponse200Data = value.body.data;
        const result = new RegistrationResult();

        result.links = data.links;
        result.tests = data.tests;
        result.testToken = data.testToken;
        result.errors = data.errors;
        result.successful = data.successful;
        const deployments = new Array<Deployment>();
        result.deployments = {
          errors: data.deployments.errors,
          successful: deployments,
        };
        data.deployments.successful.forEach((item: any) => {
          deployments.push(mapDeploymentDefault(item.deploymentURN, item.topology));
        });
        deferred.resolve(result);
      } else {
        deferred.reject(new Error(value.body.message));
      }
    })
    .catch( (reason) => {
      deferred.reject(reason);
    });
    return deferred.promise;
  }

  public deploy(buffer: Buffer): Promise<DeploymentList> {
    const deferred = q.defer<DeploymentList>();
    this.api.deploymentsPost(buffer)
    .then( (value) => {
       if (value.body.success) {
        const result: {[key: string]: Deployment} = {};
        for (const dname in value.body.data) {
          if (value.body.data[dname]) {
            const d0 = value.body.data[dname];
            const d1 = mapDeploymentDefault(dname, d0);
            result[dname] = d1;
          }
        }
        deferred.resolve(result);
      } else {
        deferred.reject(new Error(value.body.message));
      }
    })
    .catch((reason) => {
      deferred.reject(reason);
    });
    return deferred.promise;
  }

  public undeploy(urn: string): Promise<DeploymentInstanceInfo[]> {
    const deferred = q.defer<DeploymentInstanceInfo[]>();
    this.api.deploymentsDelete(urn)
    .then( (value) => {
      if (value.body.success) {
        const response: any = value.body.data;
        const result = new Array<DeploymentInstanceInfo>();
        for (const killed in response.killedInstances) {
          if (response.killedInstances[killed]) {
          const killedInfo: any = response.killedInstances[killed];
          result.push(mapInstanceInfoDefault(killed, killedInfo.component, killedInfo));
          }
        }
        deferred.resolve(result);
      } else {
        deferred.reject(new Error(value.body.message));
      }
    })
    .catch( (reason) => {
      deferred.reject(reason);
    });
    return deferred.promise;
  }

  public linkDeployments(endpoints: Endpoint[]): Promise<any> {
    const deferred = q.defer<any>();
    this.api.linksPost(Buffer.from(JSON.stringify(endpoints)))
    .then( (value) => {
      if (value.body.success) {
        const result: any = value.body.data;
        deferred.resolve(result);
      } else {
        deferred.reject(new Error(value.body.message));
      }
    })
    .catch( (reason) => {
      deferred.reject(reason);
    });
    return deferred.promise;
  }

  public unlinkDeployments(endpoints: Endpoint[]): Promise<any> {
    const deferred = q.defer<any>();
    this.api.linksDelete(Buffer.from(JSON.stringify(endpoints)))
    .then((value) => {
      if (value.body.success) {
        const result: any = value.body.data;
        deferred.resolve(result);
      } else {
        deferred.reject(new Error(value.body.message));
      }
    })
    .catch((reason) => {
      deferred.reject(reason);
    });
    return deferred.promise;
  }

  public configureDeployment(configuration: any): Promise<any> {
    const deferred = q.defer<any>();
    this.api.modifyDeployment(Buffer.from(JSON.stringify(configuration)))
    .then((value) => {
      if (value.body.success) {
        const result: any = value.body.data;
        deferred.resolve(result);
      } else {
        deferred.reject(new Error(value.body.message));
      }
    })
    .catch((reason) => {
      deferred.reject(reason);
    });
    return deferred.promise;
  }

  public listTestContexts(): Promise<string[]> {
    const deferred = q.defer<any>();
    this.api.testContextsGet()
    .then((value) => {
      if (value.body.success) {
        const result: any = value.body.data;
        deferred.resolve(result);
      } else {
        deferred.reject(new Error(value.body.message));
      }
    })
    .catch((reason) => {
      deferred.reject(reason);
    });
    return deferred.promise;
  }

  public removeTestContext(urn: string): Promise<any> {
    const deferred = q.defer<any>();
    this.api.testContextsDelete(urn)
    .then((value) => {
      if (value.body.success) {
        const result: any = value.body.data;
        deferred.resolve(result);
      } else {
        deferred.reject(new Error(value.body.message));
      }
    })
    .catch((reason) => {
      deferred.reject(reason);
    });
    return deferred.promise;
  }

  public scaleInstances(buffer: Buffer): Promise<any> {
    const deferred = q.defer<any>();
    this.api.scaleInstances(buffer)
    .then((value) => {
      if (value.body.success) {
        const result: any = value.body.data;
        deferred.resolve(result);
      } else {
        deferred.reject(new Error(value.body.message));
      }
    })
    .catch((reason) => {
      deferred.reject(reason);
    });
    return deferred.promise;
    }
}

const mapDeploymentDefault = (urn: string, data: any): Deployment => {
  if (data.serviceURN) {
    return mapDeploymentLocalStamp(urn, data);
  }
  const result = new Deployment();
  result.urn = urn;
  result.service = data.service;
  result.roles = {};
  for (const roleName in data.roles) {
    if (data.roles[roleName]) {
      const roleInfo = data.roles[roleName];
      result.roles[roleName] = {
        configuration: roleInfo.configuration,
        entrypoint: roleInfo.entrypoint,
        instances: { },
      };
      for (const instanceName in data.roles[roleName].instances) {
        if (data.roles[roleName].instances[instanceName]) {
          result.roles[roleName].instances[instanceName] = mapInstanceInfoDefault(
            instanceName,
            roleName,
            data.roles[roleName].instances[instanceName],
          );
        }
      }
    }
  }
  return result;
};

const mapDeploymentLocalStamp = (urn: string, data: any): Deployment => {
  const result = new Deployment();
  result.urn = urn;
  result.service = data.serviceURN;
  result.roles = {};
  for (const roleName in data.roles) {
    if (data.roles[roleName]) {
      const roleInfo = data.roles[roleName];
      result.roles[roleName] = {
        configuration: roleInfo.configuration,
        entrypoint: roleInfo.entrypoint,
        instances: { },
      };
      roleInfo.instances.forEach((instanceName: string) => {
        const instance = new DeploymentInstanceInfo();
        instance.id = instanceName;
        instance.role = roleName;
        instance.publicIp = "127.0.0.1";
        instance.privateIp = "127.0.0.1";
        if (data.volumes && data.volumes[instanceName]) {
          instance.volumes = data.volumes[instanceName];
        }
        if (data.portMapping) {
          data.portMapping.forEach((pm: any) => {
            if (pm.iid === instanceName) {
              if (!instance.ports) {instance.ports = { }; }
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

const mapInstanceInfoDefault = (name: string, role: string, i0: any) => {
  const instanceInfo = new DeploymentInstanceInfo();
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
