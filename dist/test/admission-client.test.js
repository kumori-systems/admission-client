"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const acs_client_1 = require("acs-client");
const src_1 = require("../src");
const fs_1 = require("fs");
let admission;
let acs;
const configPath = __dirname + "/../../test/test-config.json";
let config;
let deployments = 0;
let registries = 0;
let preDeployments = 0;
let preRegistries = 0;
const counter = new Map();
jasmine.DEFAULT_TIMEOUT_INTERVAL = 150000;
describe('Check Admission-client', () => {
    beforeEach(() => {
    });
    beforeAll((done) => {
        config = JSON.parse(fs_1.readFileSync(configPath).toString());
        expect(config).toHaveProperty("acsUri");
        acs = new acs_client_1.AcsClient(config.acsUri);
        let connected = false;
        return acs.login(config.user, config.password)
            .then((token) => {
            expect(token).toBeDefined();
            const accessToken = token.accessToken;
            expect(accessToken).toBeDefined();
            // console.log("access_token", accessToken);
            admission = new src_1.AdmissionClient(config.admissionUri, accessToken);
            admission.onConnected(() => {
                connected = true;
            });
            admission.onEcloudEvent((event) => {
                const key = event.strType + "/" + event.strName;
                // console.log("=========================== Event " + key + 
                //   " ***************");
                counter.set(key, cget(key) + 1);
                if (event.type == src_1.EcloudEventType.metrics) {
                    return;
                }
                // console.log(JSON.stringify(event, null, 2));
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
            expect(connected);
            done();
        });
    });
    afterAll(() => {
        admission.close();
    });
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
            const deployment = result[Object.keys(result)[5]];
            expect(deployment.service).toBeDefined();
            expect(deployment.urn).toBeDefined();
            expect(Object.keys(deployment.roles).length > 0);
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
        return beforeAndAfter(admission, undeployService(admission, config.serviceUri))
            .then(() => {
            return beforeAndAfter(admission, removeIfRegistered(admission, config.componentUri));
        })
            .then(() => {
            preRegistries = registries;
            preDeployments = deployments;
        });
    });
    it('deploys a service', () => {
        return beforeAndAfter(admission, admission.sendBundle(fs_1.createReadStream(config.bundle)))
            .then((result) => {
            // console.log(JSON.stringify(result, null, 2));
            expect(preRegistries + 1 === registries);
            expect(preDeployments + 1 === deployments);
            expect(result).toHaveProperty('deployments.successful');
            expect(result.deployments.successful).toHaveLength(1);
            const deploymentInfo = result.deployments.successful[0];
            expect(deploymentInfo).toHaveProperty('roles.cfe.instances');
            expect(Object.keys(deploymentInfo.roles.cfe.instances))
                .toHaveLength(1);
            expect(Object.keys(deploymentInfo.roles.worker.instances))
                .toHaveLength(1);
        });
    });
    it('redeploys the service', () => {
        return beforeAndAfter(admission, admission.deploy(fs_1.createReadStream(config.deployFile)))
            .then((result) => {
            // console.log(JSON.stringify(result, null, 2));
            expect(preRegistries + 2 === registries);
            expect(preDeployments + 2 === deployments);
            expect(result).toBeDefined();
            expect(Object.keys(result)).toHaveLength(1);
            const deploymentInfo = result[Object.keys(result)[0]];
            expect(deploymentInfo).toHaveProperty('roles.cfe.instances');
            expect(Object.keys(deploymentInfo.roles.cfe.instances))
                .toHaveLength(1);
            expect(Object.keys(deploymentInfo.roles.worker.instances))
                .toHaveLength(1);
        });
    });
    it('clean stamp again', () => {
        return beforeAndAfter(admission, undeployService(admission, config.serviceUri))
            .then(() => {
            return beforeAndAfter(admission, removeIfRegistered(admission, config.componentUri));
        })
            .then(() => {
            expect(preRegistries === registries);
            expect(preDeployments === deployments);
        });
    });
    it('check events', () => {
        // counter.forEach((value, key) => {
        //   console.log(key, "=", value);
        // })
        expect(cget('service/undeploying') > 0);
        expect(cget('service/undeployed') > 0);
        expect(cget('service/deploying') > 0);
        expect(cget('service/deployed') > 0);
        expect(cget('instance/status') > 0);
        expect(cget('metrics/service') > 0);
    });
});
const undeployService = (adm, serviceUrn) => {
    return adm.findDeployments()
        .then((result) => {
        const promises = [];
        for (const k in result) {
            if (result[k].service === serviceUrn) {
                // console.log(result[k].urn);
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
        // console.log("Deployments:", deployments);
        return adm.findStorage();
    })
        .then((result) => {
        registries = result.length;
        // console.log("Registries:", registries);
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
const cget = (key) => {
    return counter.get(key) || 0;
};
//# sourceMappingURL=admission-client.test.js.map