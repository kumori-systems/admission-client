
import {} from 'jest'

import {AcsClient} from "acs-client";
import {AdmissionClient, AdmissionEvent, Deployment, DeploymentList, 
  EcloudEventType, Endpoint, FileStream, RegistrationResult} 
  from "../src";
import {createReadStream, readFileSync} from 'fs';

let admission: AdmissionClient;
let acs: AcsClient;
const configPath = __dirname + "/../../test/test-config.json"
let config:any
let deployments: number = 0;
let registries: number = 0;
let preDeployments: number = 0;
let preRegistries: number = 0;
const counter: Map<string, number> = new Map<string, number>();
jasmine.DEFAULT_TIMEOUT_INTERVAL = 300000;

describe('Check Admission-client', () => {

  beforeEach(() => {
  });

  beforeAll((done) => {
    config = JSON.parse(readFileSync(configPath).toString());
    expect(config).toHaveProperty("acsUri");
    acs = new AcsClient(config.acsUri);
    let connected = false;
    return acs.login(config.user, config.password)
    .then ((token) => {
      expect(token).toBeDefined();
      const accessToken = token.accessToken;
      expect(accessToken).toBeDefined();
      console.log("access_token", accessToken);
      admission = new AdmissionClient(config.admissionUri, accessToken);
      admission.onConnected(() => {
        connected = true
      });
      admission.onEcloudEvent((event:AdmissionEvent) => {
        const key = event.strType + "/" + event.strName;
        // console.log("=========================== Event " + key + 
        //   " ***************");
        counter.set(key, cget(key) + 1);
        if (event.type == EcloudEventType.metrics){return;}
        // console.log(JSON.stringify(event, null, 2));
      });
      admission.onError((reason:any) => {
        console.log("===========================ERROR***************");
        console.log(reason);
      });
      console.log("Before init");
      return admission.init();
    }).then(() => {
      console.log("After init");
      return updateState(admission);
    })
    .then(() => {
      console.log("After updateState");
      expect(connected);
      done();
    });
  });

  afterAll(() => {
    admission.close();
  })

  it('gets registries', () => {
    return admission.findStorage()
    .then((result) => {
      registries = result.length;
      // console.log("Registries:", registries);
      expect(registries > 5);
    });
  });

  it('gets deployments', () => {
    return admission.findDeployments()
    .then((result) => {
      deployments = Object.keys(result).length;
      // console.log("Deployments:", registries);
      expect(deployments > 5);
      const deployment:Deployment = result[Object.keys(result)[5]];
      expect(deployment.service).toBeDefined();
      expect(deployment.urn).toBeDefined();
      expect(Object.keys(deployment.roles).length>0);
    });
  });

  it('gets a manifest', (done) => {
    admission.getStorageManifest(config.manifestUri)
    .then((manifest) => {
      expect(manifest).toBeDefined();
      expect(manifest.name).toBe(config.manifestUri);
      done();
    });
  });

  it('clean stamp', () => {
    return beforeAndAfter(admission, undeployService(
      admission,
      config.serviceUri
    ))
    .then(() => {
      return beforeAndAfter(
        admission,
        removeIfRegistered(admission, config.componentUri)
      );
    })
    .then(() => {
      preRegistries = registries;
      preDeployments = deployments;
    });
  });

  it('deploys a service with bundle', () => {
    return beforeAndAfter(admission, 
      admission.sendBundle(new FileStream(createReadStream(config.bundle))))
    .then((result:RegistrationResult) => {
        // console.log(JSON.stringify(result, null, 2));
        expect(preRegistries +1 === registries);
        expect(preDeployments +1 === deployments);
        expect(result).toHaveProperty('deployments.successful');
        expect(result.deployments.successful).toHaveLength(1);
        const deploymentInfo:Deployment = result.deployments.successful[0] 
        expect(deploymentInfo).toHaveProperty('roles.cfe.instances');
        expect(Object.keys(deploymentInfo.roles.cfe.instances))
        .toHaveLength(1);
        expect(Object.keys(deploymentInfo.roles.worker.instances))
        .toHaveLength(1);
      });
  });

  it('redeploys the service with manifest', () => {
    return beforeAndAfter(admission, 
      admission.deploy(new FileStream(createReadStream(config.deployFile))))
    .then((result:DeploymentList) => {
      // console.log(JSON.stringify(result, null, 2));
      expect(preRegistries +2 === registries);
      expect(preDeployments +2 === deployments);
      expect(result).toBeDefined();
      expect(Object.keys(result)).toHaveLength(1);
      const deploymentInfo:Deployment = result[Object.keys(result)[0]];
      expect(deploymentInfo).toHaveProperty('roles.cfe.instances');
      expect(Object.keys(deploymentInfo.roles.cfe.instances))
      .toHaveLength(1);
      expect(Object.keys(deploymentInfo.roles.worker.instances))
      .toHaveLength(1);
    });
  });

  it('clean stamp again', () => {
    return beforeAndAfter(admission, undeployService(
      admission,
      config.serviceUri
    ))
    .then(() => {
      return beforeAndAfter(
        admission,
        removeIfRegistered(admission, config.componentUri)
      );
    })
    .then(() => {
        expect(preRegistries === registries);
        expect(preDeployments === deployments);
    });
  });

  it('deploys two services with bundle and links/unlinks them with manifest', () => {
    let urn1:string;
    let urn2:string;
    const link:Endpoint[] = new Array<Endpoint>();
    console.log("Initialized");
    return undeployService(admission, "eslap://sampleinterservice/services/samplefrontend/1_0_0")
    .then(() => {
      return undeployService(admission, "eslap://sampleinterservice/services/samplebackend/1_0_0")
    })
    .then(() => {
      console.log("Cleaned");
      return admission.sendBundle(
        new FileStream(createReadStream(config.linkBundle1)))
    })
    .then((result:RegistrationResult) => {
      console.log("Install 1");
      const deploymentInfo = result.deployments.successful[0] 
      urn1 = deploymentInfo.urn;
      expect(urn1).toBeDefined();
      return admission.sendBundle(
        new FileStream(createReadStream(config.linkBundle2)))
    })
    .then((result:RegistrationResult) => {
      console.log("Install 2");
      const deploymentInfo = result.deployments.successful[0] 
      urn2 = deploymentInfo.urn;
      expect(urn2).toBeDefined();
      link.push(new Endpoint(urn1, config.linkEntrypoint1));
      link.push(new Endpoint(urn2, config.linkEntrypoint2));
      return admission.linkDeployments(link)
    })
    .then(() => {
      console.log("Linked!");
      console.log("Vamos a hacer unlink");
      return admission.unlinkDeployments(link)
    });      
  }); 

  it('check events', () => {
    // counter.forEach((value, key) => {
    //   console.log(key, "=", value);
    // })
    expect(cget('service/undeploying')>0);
    expect(cget('service/undeployed')>0);
    expect(cget('service/deploying')>0);
    expect(cget('service/deployed')>0);  
    expect(cget('instance/status')>0); 
    expect(cget('metrics/service')>0); 
  });
});

const undeployService = (adm:AdmissionClient,serviceUrn:string)=> {
  return adm.findDeployments()
  .then ((result:{[key: string]: Deployment}) => {
    const promises = [];
    for (const k in result) {
      if (result[k].service === serviceUrn){
        // console.log(result[k].urn);
        promises.push(admission.undeploy(result[k].urn));
      }
    }
    return Promise.all(promises);
  });
}

const updateState = (adm:AdmissionClient) => {
  return adm.findDeployments()
  .then((result) => {
    deployments = Object.keys(result).length;
    // console.log("Deployments:", deployments);
    return adm.findStorage();
  })
  .then((result) => {
    registries = result.length;
    // console.log("Registries:", registries);
  })
};

const beforeAndAfter = (adm:AdmissionClient, promise:Promise<any>) => {
  let result:any;
  return promise
  .then ((result0:any) => {
    result = result0
    return updateState(adm);
  })
  .then (() => {
    return result;  
  })
};

const removeIfRegistered = (adm:AdmissionClient, urn:string):Promise<void> => {
  return adm.findStorage()
  .then((registries) => {
    if (registries.indexOf(urn)>=0){
      admission.removeStorage(urn);
    };
  });
};

const cget = (key:string):number => {
  return counter.get(key)|| 0;
}