
import {AcsClient} from "acs-client";
import {AdmissionClient} from "../src";
let admission: AdmissionClient;
let acs: AcsClient;
const username: string = "josep@iti.es";
const password = "josep";

acs = new AcsClient("http://acs-master-gra.slap53.iti.es/acs");
acs.login(username, password)
.then ((token) => {
  const accessToken = token.accessToken;
  console.log("access_token", accessToken);
  admission = new AdmissionClient("http://admission-master-gra.slap53.iti.es/admission", accessToken);
  return admission.findDeployments();
})
.then((result) => {
  console.log("Deployments");
  for (const k in result) {
    console.log(result[k].service, "===========================");
    console.log(JSON.stringify(result[k], null, 2));
  }
  return admission.findStorage();
})
.then((result) => {
  console.log("Registries");
  result.forEach((element) => {
    console.log(element);
  });
  console.log("TRUE END");
})
.fail((reason) => {
  console.log("Error:", reason);
});
console.log("SYNC END");
