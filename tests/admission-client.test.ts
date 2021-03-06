import {} from 'jest'
import { AcsClient } from '@kumori/acs-client'
import {AdmissionClient, AdmissionEvent, Deployment, DeploymentList,
  EcloudEventType, Endpoint, FileStream, RegistrationResult,
  ScalingDeploymentModification}
  from '../src'
import {createReadStream, readFileSync} from 'fs'

let admission: AdmissionClient
let acs: AcsClient
const configPath = __dirname + '/../tests/test-config.json'
let config: any
let deployments: number = 0
let registries: number = 0
let preDeployments: number = 0
let preRegistries: number = 0
const counter: Map<string, number> = new Map<string, number>()
jasmine.DEFAULT_TIMEOUT_INTERVAL = 300000


// TODO: Unlink and undeploy http-inbound linked if present
const undeployService = (adm: AdmissionClient, serviceUrn: string) => {
  return adm.findDeployments()
  .then ((result: {[key: string]: Deployment}) => {
    const promises = []
    for (const k in result) {
      if (result[k].service === serviceUrn) {
        // console.log(result[k].urn)
        promises.push(admission.undeploy(result[k].urn))
      }
    }
    return Promise.all(promises)
  })
}

const updateState = (adm: AdmissionClient) => {
  return adm.findDeployments()
  .then((result) => {
    deployments = Object.keys(result).length
    // console.log('Current deployments')
    // Object.keys(result).forEach((value) => {
    //    console.log(value)
    //  })
    // console.log('Deployments:', deployments)
    return adm.findStorage()
  })
  .then((result) => {
    registries = result.length
    // console.log('Registries:', registries)
  })
}

const beforeAndAfter = (adm: AdmissionClient, promise: Promise<any>) => {
  let result: any
  return promise
  .then ((result0: any) => {
    result = result0
    return updateState(adm)
  })
  .then (() => {
    return result
  })
}

const removeIfRegistered = (adm: AdmissionClient, urn: string): Promise<void> => {
  return adm.findStorage()
  .then((registries) => {
    if (registries.indexOf(urn) >= 0) {
      return admission.removeStorage(urn)
    } else {
      return Promise.resolve(true)
    }
  })
}

const cget = (key: string): number => {
  return counter.get(key) || 0
}

describe('Check Admission-client', () => {

  beforeAll(() => {
    config = JSON.parse(readFileSync(configPath).toString())
    expect(config).toHaveProperty('acsUri')
    acs = new AcsClient(config.acsUri)
    let connected = false
    return acs.login(config.user, config.password)
    .then ((token) => {
      // console.log("token", JSON.stringify(token));
      expect(token).toBeDefined()
      const accessToken = token.accessToken
      expect(accessToken).toBeDefined()
      // console.log('access_token', accessToken)
      admission = new AdmissionClient(config.admissionUri, accessToken)
      admission.onConnected(() => {
        connected = true
      })
      admission.onEcloudEvent((event: AdmissionEvent) => {
        const key = event.strType + '/' + event.strName
        // console.log('=========================== Event ' + key +
        //   ' ***************')
        counter.set(key, cget(key) + 1)
        if (event.type === EcloudEventType.metrics) { return }
        // if (cget(key) > 0) {
        //   console.log(key + ": " + JSON.stringify(event))
        // }
        // console.log(JSON.stringify(event, null, 2))
      })
      admission.onError((reason: any) => {
        console.log('===========================ERROR***************')
        console.log(reason)
      })
      return admission.init()
    }).then(() => {
      return updateState(admission)
    })
    .then(() => {
      expect(connected)
      // done()
    })
  })

  afterAll((done) => {
    return undeployService(admission, config.linkService1)
    .then(() => {
      return undeployService(admission, config.linkService2)
    })
    .then(() => {
      return undeployService(admission, config.serviceUri)
    })
    .then(() => {
      admission.close()
      done()
    })
  })

  it('gets registries', () => {
    return admission.findStorage()
    .then((result) => {
      registries = result.length
      // console.log('Registries:', registries)
      expect(registries).toBeGreaterThan(-1)
    })
  })

  it('gets deployments', () => {
    return admission.findDeployments()
    .then((result) => {
      deployments = Object.keys(result).length
      // console.log('Deployments:', registries)
      expect(deployments).toBeGreaterThan(-1)
      // const deployment: Deployment = result[Object.keys(result)[5]]
      // expect(deployment.service).toBeDefined()
      // expect(deployment.urn).toBeDefined()
      // expect(Object.keys(deployment.roles).length).toBeGreaterThan(0)
    })
  })

  it('clean stamp', () => {
    return beforeAndAfter(admission, undeployService(
      admission,
      config.serviceUri
    ))
    .then(() => {
      return beforeAndAfter(
        admission,
        removeIfRegistered(admission, config.serviceUri)
      )
    })
    .then(() => {
      preRegistries = registries
      preDeployments = deployments
    })
  })

  it('deploys a service with bundle', () => {
    return beforeAndAfter(admission,
      admission.sendBundle(new FileStream(createReadStream(config.bundle))))
    .then((result: RegistrationResult) => {
      // console.log(JSON.stringify(result, null, 2))
      expect(preRegistries).toBeLessThan(registries)
      expect(result).toHaveProperty('deployments.successful')
      // console.log(JSON.stringify(result.deployments.successful))
      expect(result.deployments.successful.length).toBeGreaterThan(0)
      expect(preDeployments).toBe(deployments-1)
      const promises: Array<Promise<any>> = new Array<Promise<any>>()
      result.deployments.successful.forEach((deploymentInfo: Deployment) => {
        if (deploymentInfo.service === config.serviceUri) {
          expect(deploymentInfo).toHaveProperty('roles.cfe.instances')
          expect(Object.keys(deploymentInfo.roles.cfe.instances))
          .toHaveLength(1)
          expect(Object.keys(deploymentInfo.roles.worker.instances))
          .toHaveLength(1)
        }
        promises.push(admission.undeploy(deploymentInfo.urn))
      })
      return beforeAndAfter(admission, Promise.all(promises))
      .then(() => {
        expect(preDeployments).toBe(deployments)
      })
    })
  })


  it('gets a manifest', () => {
    return admission.getStorageManifest(config.serviceUri)
    .then((manifest) => {
      expect(manifest).toBeDefined()
      expect(manifest.name).toBe(config.serviceUri)
    })
  })

  let calculatorURN: string
  it('redeploys service with manifest', () => {
    return beforeAndAfter(admission,
      admission.deploy(new FileStream(createReadStream(config.deployFile))))
    .then((result: DeploymentList) => {
      // console.log(JSON.stringify(result, null, 2))
      expect(result).toBeDefined()
      expect(Object.keys(result)).toHaveLength(1)
      expect(preDeployments).toBe(deployments - 1)
      const deploymentInfo: Deployment = result[Object.keys(result)[0]]
      calculatorURN = deploymentInfo.urn
      expect(deploymentInfo).toHaveProperty('roles.cfe.instances')
      expect(Object.keys(deploymentInfo.roles.cfe.instances))
      .toHaveLength(1)
      expect(Object.keys(deploymentInfo.roles.worker.instances))
      .toHaveLength(1)
    })
  })

  it('add more instances to deployment', () => {
    const scale = new ScalingDeploymentModification()
    scale.deploymentURN = calculatorURN
    const scaleTarget = 2
    scale.scaling = {'cfe': scaleTarget}
    return admission.modifyDeployment(scale)
    .then(() => {
      return admission.findDeployments(calculatorURN)
    })
    .then((result: DeploymentList) => {
      const info: Deployment = result[calculatorURN]
      expect(Object.keys(info.roles.cfe.instances))
      .toHaveLength(scaleTarget)
    })
  })

  it('remove instances to deployment', () => {
    const scale = new ScalingDeploymentModification()
    scale.deploymentURN = calculatorURN
    const scaleTarget = 1
    scale.scaling = {'cfe': scaleTarget}
    return admission.modifyDeployment(scale)
    .then(() => {
      return admission.findDeployments(calculatorURN)
    })
    .then((result: DeploymentList) => {
      const info: Deployment = result[calculatorURN]
      expect(Object.keys(info.roles.cfe.instances))
      .toHaveLength(scaleTarget)
    })
  })

  it.skip('let some time pass... meanwhile metrics should arrive', () => {
    return new Promise(resolve => setTimeout(resolve, 70 * 1000))
  })

  it('clean stamp again', () => {
    return beforeAndAfter(admission, admission.undeploy(calculatorURN))
    .then(() => {
      return beforeAndAfter(
        admission,
        removeIfRegistered(admission, config.serviceUri)
      )
    })
    .then(() => {
      // console.log("preRegistries", preRegistries, "registries", registries);
      // console.log("preDeployments", preDeployments, "deployments", deployments);
      expect([preRegistries, preRegistries + 2]).toContain(registries)
      expect(preDeployments).toBe(deployments)
    })
  })

  it('deploys two services and links/unlinks them with manifest', () => {
    let urn1: string
    let urn2: string
    const link: Endpoint[] = new Array<Endpoint>()
    return undeployService(admission, config.linkService1)
    .then(() => {
      return undeployService(admission, config.linkService2)
    })
    .then(() => {
      return admission.sendBundle(
        new FileStream(createReadStream(config.linkBundle1)))
    })
    .then((result: RegistrationResult) => {
      const deploymentInfo = result.deployments.successful[0]
      urn1 = deploymentInfo.urn
      expect(urn1).toBeDefined()
      // console.log('Parameters de', urn1,
      // JSON.stringify(deploymentInfo.roles['cfe'].configuration.parameters))
      const expected = {
        'json': {'a': 1},
        'number': 5,
        'zero': 0,
        'hello': 'hello',
        'true': true,
        'false': false
      }
      expect(deploymentInfo.roles['cfe'].configuration.parameters)
      .toEqual(expected)
      return admission.sendBundle(
        new FileStream(createReadStream(config.linkBundle2)))
    })
    .then((result: RegistrationResult) => {
      const deploymentInfo = result.deployments.successful[0]
      urn2 = deploymentInfo.urn
      expect(urn2).toBeDefined()
      link.push(new Endpoint(urn1, config.linkEntrypoint1))
      link.push(new Endpoint(urn2, config.linkEntrypoint2))
      return admission.linkDeployments(link)
    })
    .then(( ) => {
      return admission.findDeployments(urn1)
    })
    .then((result: DeploymentList) => {
      const info: Deployment = result[urn1]
      expect(info).toBeDefined()
      const expected: any = {}
      expected[config.linkEntrypoint1] = {}
      expected[config.linkEntrypoint1][urn2] = {}
      expected[config.linkEntrypoint1][urn2][config.linkEntrypoint2] = {}
      expect(info.links).toEqual(expected)
    })
    .then(( ) => {
      return admission.findDeployments(urn2)
    })
    .then((result: DeploymentList) => {
      const info: Deployment = result[urn2]
      // console.log('Links de', urn2, JSON.stringify(info.links))
      expect(info).toBeDefined()
      const expected: any = {}
      expected[config.linkEntrypoint2] = {}
      expected[config.linkEntrypoint2][urn1] = {}
      expected[config.linkEntrypoint2][urn1][config.linkEntrypoint1] = {}
      expect(info.links).toEqual(expected)
    })
    .then(() => {
      return admission.unlinkDeployments(link)
    })
    .then(() => {
      return Promise.all([
        admission.undeploy(urn1),
        admission.undeploy(urn2)
      ])
    })
  })

  it.skip('check received events', done => {
    setTimeout(() => {
      try {
        console.log('Checking events...')
        expect(cget('service/undeploying')).toBeGreaterThan(0)
        console.log('Checked service/undeploying OK')
        expect(cget('service/undeployed')).toBeGreaterThan(0)
        console.log('Checked service/undeployed OK')
        expect(cget('service/deploying')).toBeGreaterThan(0)
        console.log('Checked service/deploying OK')
        expect(cget('service/deployed')).toBeGreaterThan(0)
        console.log('Checked service/deployed OK')
        expect(cget('service/scale')).toBeGreaterThan(0)
        console.log('Checked service/scale OK')
        expect(cget('service/link')).toBeGreaterThan(0)
        console.log('Checked service/link OK')
        expect(cget('service/unlink')).toBeGreaterThan(0)
        console.log('Checked service/unlink OK')
        expect(cget('instance/status')).toBeGreaterThan(0)
        console.log('Checked instance/status OK')
        // expect(cget('metrics/service')).toBeGreaterThan(0)
        done()
      } catch(err) {
        done(err)
      }
    }, 120*1000)
  })
})
