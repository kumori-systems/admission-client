"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const acs_client_1 = require("acs-client");
const src_1 = require("../src");
let admission;
let acs;
const username = "josep@iti.es";
const password = "josep";
acs = new acs_client_1.AcsClient("http://acs-master-gra.slap53.iti.es/acs");
acs.login(username, password)
    .then((token) => {
    const accessToken = token.accessToken;
    console.log("access_token", accessToken);
    admission = new src_1.AdmissionClient("http://admission-master-gra.slap53.iti.es/admission", accessToken);
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
//# sourceMappingURL=test.js.map