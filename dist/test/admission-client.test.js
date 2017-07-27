"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const acs_client_1 = require("acs-client");
const src_1 = require("../src");
const fs_1 = require("fs");
let admission;
let acs;
const configPath = __dirname + '/../../test/test-config.json';
let config;
let deployments = 0;
let registries = 0;
let preDeployments = 0;
let preRegistries = 0;
const counter = new Map();
jasmine.DEFAULT_TIMEOUT_INTERVAL = 300000;
const undeployService = (adm, serviceUrn) => {
    return adm.findDeployments()
        .then((result) => {
        const promises = [];
        for (const k in result) {
            if (result[k].service === serviceUrn) {
                // console.log(result[k].urn)
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
        // console.log('Current deployments')
        // Object.keys(result).forEach((value) => {
        //    console.log(value)
        //  })
        // console.log('Deployments:', deployments)
        return adm.findStorage();
    })
        .then((result) => {
        registries = result.length;
        // console.log('Registries:', registries)
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
            return admission.removeStorage(urn);
        }
        else {
            return Promise.resolve(true);
        }
    });
};
const cget = (key) => {
    return counter.get(key) || 0;
};
describe('Check Admission-client', () => {
    beforeAll((done) => {
        config = JSON.parse(fs_1.readFileSync(configPath).toString());
        expect(config).toHaveProperty('acsUri');
        acs = new acs_client_1.AcsClient(config.acsUri);
        let connected = false;
        return acs.login(config.user, config.password)
            .then((token) => {
            expect(token).toBeDefined();
            const accessToken = token.accessToken;
            expect(accessToken).toBeDefined();
            // console.log('access_token', accessToken)
            admission = new src_1.AdmissionClient(config.admissionUri, accessToken);
            admission.onConnected(() => {
                connected = true;
            });
            admission.onEcloudEvent((event) => {
                const key = event.strType + '/' + event.strName;
                // console.log('=========================== Event ' + key +
                //   ' ***************')
                counter.set(key, cget(key) + 1);
                if (event.type === src_1.EcloudEventType.metrics) {
                    return;
                }
                // console.log(JSON.stringify(event, null, 2))
            });
            admission.onError((reason) => {
                console.log('===========================ERROR***************');
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
    afterAll((done) => {
        return undeployService(admission, config.linkService1)
            .then(() => {
            return undeployService(admission, config.linkService2);
        })
            .then(() => {
            return undeployService(admission, config.serviceUri);
        })
            .then(() => {
            admission.close();
            done();
        });
    });
    it('gets registries', () => {
        return admission.findStorage()
            .then((result) => {
            registries = result.length;
            // console.log('Registries:', registries)
            expect(registries).toBeGreaterThan(5);
        });
    });
    it('gets deployments', () => {
        return admission.findDeployments()
            .then((result) => {
            deployments = Object.keys(result).length;
            // console.log('Deployments:', registries)
            expect(deployments).toBeGreaterThan(5);
            const deployment = result[Object.keys(result)[5]];
            expect(deployment.service).toBeDefined();
            expect(deployment.urn).toBeDefined();
            expect(Object.keys(deployment.roles).length).toBeGreaterThan(0);
        });
    });
    it('gets a manifest', () => {
        return admission.getStorageManifest(config.manifestUri)
            .then((manifest) => {
            expect(manifest).toBeDefined();
            expect(manifest.name).toBe(config.manifestUri);
        });
    });
    it('clean stamp', () => {
        return beforeAndAfter(admission, undeployService(admission, config.serviceUri))
            .then(() => {
            return beforeAndAfter(admission, removeIfRegistered(admission, config.serviceUri));
        })
            .then(() => {
            preRegistries = registries;
            preDeployments = deployments;
        });
    });
    it('deploys a service with bundle', () => {
        return beforeAndAfter(admission, admission.sendBundle(new src_1.FileStream(fs_1.createReadStream(config.bundle))))
            .then((result) => {
            // console.log(JSON.stringify(result, null, 2))
            expect(preRegistries).toBeLessThan(registries);
            expect(result).toHaveProperty('deployments.successful');
            // console.log(JSON.stringify(result.deployments.successful))
            expect(result.deployments.successful.length).toBeGreaterThan(0);
            expect(preDeployments).toBeLessThan(deployments);
            const promises = new Array();
            result.deployments.successful.forEach((deploymentInfo) => {
                if (deploymentInfo.service === config.serviceUri) {
                    expect(deploymentInfo).toHaveProperty('roles.cfe.instances');
                    expect(Object.keys(deploymentInfo.roles.cfe.instances))
                        .toHaveLength(1);
                    expect(Object.keys(deploymentInfo.roles.worker.instances))
                        .toHaveLength(1);
                }
                promises.push(admission.undeploy(deploymentInfo.urn));
            });
            return beforeAndAfter(admission, Promise.all(promises))
                .then(() => {
                expect(preDeployments).toBe(deployments);
            });
        });
    });
    let calculatorURN;
    it('redeploys service with manifest', () => {
        return beforeAndAfter(admission, admission.deploy(new src_1.FileStream(fs_1.createReadStream(config.deployFile))))
            .then((result) => {
            // console.log(JSON.stringify(result, null, 2))
            expect(result).toBeDefined();
            expect(Object.keys(result)).toHaveLength(1);
            expect(preDeployments).toBe(deployments - 1);
            const deploymentInfo = result[Object.keys(result)[0]];
            calculatorURN = deploymentInfo.urn;
            expect(deploymentInfo).toHaveProperty('roles.cfe.instances');
            expect(Object.keys(deploymentInfo.roles.cfe.instances))
                .toHaveLength(1);
            expect(Object.keys(deploymentInfo.roles.worker.instances))
                .toHaveLength(1);
        });
    });
    it('add more instances to deployment', () => {
        const scale = new src_1.ScalingDeploymentModification();
        scale.deploymentURN = calculatorURN;
        const scaleTarget = 2;
        scale.scaling = { 'cfe': scaleTarget };
        return admission.modifyDeployment(scale)
            .then(() => {
            return admission.findDeployments(calculatorURN);
        })
            .then((result) => {
            const info = result[calculatorURN];
            expect(Object.keys(info.roles.cfe.instances))
                .toHaveLength(scaleTarget);
        });
    });
    it('clean stamp again', () => {
        return beforeAndAfter(admission, admission.undeploy(calculatorURN))
            .then(() => {
            return beforeAndAfter(admission, removeIfRegistered(admission, config.serviceUri));
        })
            .then(() => {
            expect(preRegistries).toBe(registries);
            expect(preDeployments).toBe(deployments);
        });
    });
    it('deploys two services with bundle and links/unlinks them with manifest', () => {
        let urn1;
        let urn2;
        const link = new Array();
        return undeployService(admission, config.linkService1)
            .then(() => {
            return undeployService(admission, config.linkService2);
        })
            .then(() => {
            return admission.sendBundle(new src_1.FileStream(fs_1.createReadStream(config.linkBundle1)));
        })
            .then((result) => {
            const deploymentInfo = result.deployments.successful[0];
            urn1 = deploymentInfo.urn;
            expect(urn1).toBeDefined();
            return admission.sendBundle(new src_1.FileStream(fs_1.createReadStream(config.linkBundle2)));
        })
            .then((result) => {
            const deploymentInfo = result.deployments.successful[0];
            urn2 = deploymentInfo.urn;
            expect(urn2).toBeDefined();
            link.push(new src_1.Endpoint(urn1, config.linkEntrypoint1));
            link.push(new src_1.Endpoint(urn2, config.linkEntrypoint2));
            return admission.linkDeployments(link);
        })
            .then(() => {
            return admission.unlinkDeployments(link);
        })
            .then(() => {
            return Promise.all([
                admission.undeploy(urn1),
                admission.undeploy(urn2)
            ]);
        });
    });
    it('check received events', () => {
        // counter.forEach((value, key) => {
        //   console.log(key, '=', value)
        // })
        expect(cget('service/undeploying')).toBeGreaterThan(0);
        expect(cget('service/undeployed')).toBeGreaterThan(0);
        expect(cget('service/deploying')).toBeGreaterThan(0);
        expect(cget('service/deployed')).toBeGreaterThan(0);
        expect(cget('service/link')).toBeGreaterThan(0);
        expect(cget('service/unlink')).toBeGreaterThan(0);
        expect(cget('instance/status')).toBeGreaterThan(0);
        expect(cget('metrics/service')).toBeGreaterThan(0);
    });
});
//# sourceMappingURL=admission-client.test.js.map