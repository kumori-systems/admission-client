"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const acs_client_1 = require("acs-client");
const src_1 = require("../src");
const fs_1 = require("fs");
let admission;
let acs;
const userid = "josep";
const username = userid + "@iti.es";
const password = userid;
let deployments = 0;
let registries = 0;
// const ACS_URI       = "http://acs.argo.kumori.cloud/acs";
// const ADMISSION_URI = "http://admission.argo.kumori.cloud/admission";
const ACS_URI = "http://acs-dame-argo.slap53.iti.es/acs";
const ADMISSION_URI = "http://admission-dame-argo.slap53.iti.es/admission";
const BUNDLE = "/workspaces/slap/git/examples/calculator_1_0_0/deploy_bundle.zip";
const SERVICE = "eslap://sampleservicecalculator/services/sampleservicecalculator/1_0_0";
const COMPONENT = "eslap://sampleservicecalculator/components/cfe/1_0_0";
const TEST_MANIFEST = "eslap://eslap.cloud/components/acs/1_0_0";
const undeployService = (adm, serviceUrn) => {
    return adm.findDeployments()
        .then((result) => {
        const promises = [];
        for (const k in result) {
            if (result[k].service === serviceUrn) {
                console.log(result[k].urn);
                promises.push(admission.undeploy(result[k].urn));
            }
        }
        return Promise.all(promises);
    });
};
const updateState = (adm) => {
    return adm.findDeployments()
        .then((result) => {
        deployments = Object.keys(result).length;
        console.log("Deployments:", deployments);
        return adm.findStorage();
    })
        .then((result) => {
        registries = result.length;
        console.log("Registries:", registries);
    });
};
const beforeAndAfter = (adm, promise) => {
    let result;
    return promise
        .then((result0) => {
        result = result0;
        return updateState(adm);
    })
        .then(() => {
        return result;
    });
};
const removeIfRegistered = (adm, urn) => {
    return adm.findStorage()
        .then((registries) => {
        if (registries.indexOf(urn) >= 0) {
            admission.removeStorage(urn);
        }
        ;
    });
};
acs = new acs_client_1.AcsClient(ACS_URI);
acs.login(username, password)
    .then((token) => {
    const accessToken = token.accessToken;
    console.log("access_token", accessToken);
    admission = new src_1.AdmissionClient(ADMISSION_URI, accessToken);
    admission.onConnected(() => {
        console.log("===========================CONNECT***************");
    });
    admission.onEcloudEvent((event) => {
        console.log("=========================== Event " + event.strType + "/" +
            event.strName + " ***************");
        if (event.type == src_1.EcloudEventType.metrics) {
            return;
        }
        console.log(JSON.stringify(event, null, 2));
    });
    admission.onError((reason) => {
        console.log("===========================ERROR***************");
        console.log(reason);
    });
    return admission.init();
}).then(() => {
    return updateState(admission);
})
    .then(() => {
    return admission.getStorageManifest(TEST_MANIFEST);
})
    .then((manifest) => {
    console.log(JSON.stringify(manifest, null, 2));
})
    .then(() => {
    console.log("UNDEPLOYING SERVICE");
    return beforeAndAfter(admission, undeployService(admission, SERVICE));
})
    .then(() => {
    console.log("UNREGISTERING COMPONENT");
    return beforeAndAfter(admission, removeIfRegistered(admission, COMPONENT));
})
    .then(() => {
    console.log("DEPLOYING COMPONENT", BUNDLE);
    return beforeAndAfter(admission, admission.sendBundle(fs_1.createReadStream(BUNDLE)));
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
}, 3 * 60 * 1000);
//# sourceMappingURL=test.js.map