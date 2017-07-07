
import {AcsClient} from "acs-client";
import {AdmissionClient, AdmissionEvent, Deployment, EcloudEventType} 
  from "../src";
import {createReadStream} from 'fs';

let admission: AdmissionClient;
let acs: AcsClient;
const userid = "josep"
const username: string = userid + "@iti.es";
const password = userid;
let deployments:number = 0;
let registries:number = 0;

const ACS_URI       = "http://acs.argo.kumori.cloud/acs";
const ADMISSION_URI = "http://admission.argo.kumori.cloud/admission";
const BUNDLE = "/workspaces/slap/git/examples/calculator_1_0_0/deploy_bundle.zip";
const SERVICE = "eslap://sampleservicecalculator/services/sampleservicecalculator/1_0_0";
const COMPONENT = "eslap://sampleservicecalculator/components/cfe/1_0_0"

const undeployService = (adm:AdmissionClient,serviceUrn:string)=> {
  return adm.findDeployments()
  .then ((result:{[key: string]: Deployment}) => {
    const promises = [];
    for (const k in result) {
      if (result[k].service === serviceUrn){
        console.log(result[k].urn);
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
    console.log("Deployments:", deployments);
    return adm.findStorage();
  })
  .then((result) => {
    registries = result.length;
    console.log("Registries:", registries);
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

acs = new AcsClient(ACS_URI);
acs.login(username, password)
.then ((token) => {
  const accessToken = token.accessToken;
  console.log("access_token", accessToken);
  admission = new AdmissionClient(ADMISSION_URI, accessToken);
  admission.onConnected(() => {
    console.log("===========================CONNECT***************");
  });
  admission.onEcloudEvent((event:AdmissionEvent) => {
   console.log("=========================== Event " + event.strType + "/" + 
     event.strName + " ***************");
    if (event.type == EcloudEventType.metrics){return;}
    console.log(JSON.stringify(event, null, 2));
  });
  admission.onError((reason:any) => {
    console.log("===========================ERROR***************");
    console.log(reason);
  });
  return admission.init();
}).then(() => {
  return updateState(admission);
})
.then(() => {
  console.log("UNDEPLOYING SERVICE");
  return beforeAndAfter(admission, undeployService(
    admission,
   SERVICE
  ));
})
.then(() => {
  console.log("UNREGISTERING COMPONENT");
  return beforeAndAfter(
    admission,
   removeIfRegistered(admission, COMPONENT)
  );
})
.then(() => {
  console.log("DEPLOYING COMPONENT", BUNDLE);
  return beforeAndAfter(admission, 
    admission.sendBundle(createReadStream(BUNDLE)));
})
.then((result) => {
  console.log(JSON.stringify(result, null, 2));
})
.then(() => {
})
.then(() => {
})
.then(() => {
})
.then(() => {
  console.log("Final deployments:", deployments);
  console.log("Final registries:", registries);
  console.log("ASYNC END");
})
.catch((reason) => {
  console.log("Error en Test:", reason);
});
console.log("SYNC END");
setTimeout(() => {
  console.log("REAL END");
  admission.close();
},3 * 60 * 1000);