"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
let admission;
admission = new src_1.AdmissionClient("http://localhost:8090/admission");
admission.init().
    then(() => {
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
    .catch((reason) => {
    console.log("Error:", reason);
});
console.log("SYNC END");
//# sourceMappingURL=local-stamp-test.js.map