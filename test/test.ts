
import {AcsClient} from "acs-client";
import {AdmissionClient, AdmissionEvent, Deployment} from "../src";
import {all,Promise} from "q";
let admission: AdmissionClient;
let acs: AcsClient;
const userid = "josep"
const username: string = userid + "@iti.es";
const password = userid;
let deployments:number = 0;
import {createReadStream, ReadStream} from 'fs';
let registries:number = 0;

const ACS_URI       = "http://acs-master-sbg.slap53.iti.es/acs";
const ADMISSION_URI = "http://admission-master-sbg.slap53.iti.es/admission";
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
    return all(promises);
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
    console.log("===========================DATA***************");
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
    admission.removeStorage(COMPONENT)
  );
})
.then(() => {
  console.log("DEPLOYING COMPONENT");
  const bundle:ReadStream = createReadStream(BUNDLE);
  return beforeAndAfter(admission, admission.sendBundle(bundle));
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
.fail((reason) => {
  console.log("Error en Test:", reason);
});
console.log("SYNC END");
setTimeout(() => {
  console.log("REAL END");
  admission.close();
},3 * 60 * 1000);