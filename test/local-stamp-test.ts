
import { AdmissionClient, Deployment} from "../src";
let admission: AdmissionClient;

admission = new AdmissionClient("http://localhost:8090/admission");

admission.findDeployments()
.then((result: {[key: string]: Deployment}) => {
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
