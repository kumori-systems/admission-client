import sio = require('socket.io-client')
import {EventEmitter, Listener} from 'typed-event-emitter'
import Swagger = require('./swagger/api')
import {AdmissionEvent, Deferred, Deployment, DeploymentInstanceInfo,
  DeploymentList, DeploymentModification, EcloudEventName, EcloudEventType,
  Endpoint, FileStream, RegistrationResult } from '.'

/**
 * Stub to give access to an ECloud admission instance.
 */
export class AdmissionClient extends EventEmitter {

  public onConnected = this.registerEvent<() => any>()
  public onDisconnected = this.registerEvent<() => any>()
  public onEcloudEvent =
    this.registerEvent<(event: AdmissionEvent) => any>()
  public onError = this.registerEvent<(reason: any) => any>()

  protected basePath: string
  protected accessToken: string|undefined
  protected api: Swagger.DefaultApi
  protected ws: SocketIOClient.Socket
  protected dummy: Listener

  /**
   *
   * @param basePath  URL where admission is waiting requests. For example:
   *  http://localhost:8090/admission
   * @param accessToken ACS token with credentials for operating in the stamp.
   */
  constructor (basePath: string, accessToken?: string) {
    super()
    this.basePath = basePath
    this.accessToken = accessToken

    this.api = new Swagger.DefaultApi(this.basePath)
    if (this.accessToken === undefined) {
      // stuff to modify protected property and fix generated api error
      const free: any = this.api
      free.authentications.apiAuthorization = new Swagger.VoidAuth()
    } else {
      this.api.accessToken = this.accessToken || ''
    }
  }

  /**
   * Asynchronous initialization of the stub.
   */
  public init (): Promise<void> {
    const deferred = new Deferred<void>()
    const wsConfig: any = {
      reconnection: true
    }

    // if (this.accessToken) {
    //   wsConfig.extraHeaders = {
    //     Authorization: 'Basic ' +
    //       new Buffer(this.accessToken).toString('base64')
    //   }
    // }

    const aux = this.basePath.split('/')
    let wsUri = aux[0] + '//' + aux[2]

    if (this.accessToken !== undefined) {
      wsUri = aux[0] + '//' + aux[2] + '?token=' + this.accessToken
    }

    this.ws = sio(wsUri, wsConfig)

    this.ws.on('connect', () => {
      this.emit(this.onConnected)

      this.ws.on('disconnect', () => {
        this.emit(this.onDisconnected)
      })

      this.ws.on('ecloud-event', (data: any) => {
        const event = new AdmissionEvent()
        event.timestamp = data.timestamp
        event.entity = data.entity
        event.strType = data.type
        event.strName = data.name
        event.type =
          EcloudEventType[data.type as keyof typeof EcloudEventType]
        event.name =
          EcloudEventName[data.name as keyof typeof EcloudEventName]
        event.data = data.data
        this.emit(this.onEcloudEvent, event)
      })
      this.ws.on('error', (reason: any) => {
        this.emit(this.onError, reason)
      })
      deferred.resolve()
    })

    this.ws.on('unauthorized', (err: any) => {
      if (deferred.isPending()) {
        deferred.reject(new Error(err.message))
      }
    })

    this.ws.on('connect_error', () => {
      if (deferred.isPending()) {
        deferred.reject(new Error('Connection error!'))
      }
    })

    return deferred.promise
  }

  public close (): void {
    this.ws.close()
  }

  /**
   * Returns data of deployed services in system.
   * @param urn urn of deployment whose data is needed.
   * If not provided, data about any accesible deployment is returned.
   * @param owner Only the deployments whose owner matches the value
   * of the parameter are listed
   */
  public findDeployments (urn?: string, owner?: string): Promise<{[key: string]:
      Deployment}> {
    const deferred = new Deferred<{[key: string]: Deployment}>()
    this.api.findDeployments(urn, owner)
    .then( (value) => {
      if (value.success) {
        const result: {[key: string]: Deployment} = {}
        // console.log('=====', JSON.stringify( value.data, null, 2))
        for (const dname in value.data) {
          // Predefined deployment in local-stamp
          if (dname === 'default') { continue }
          const d0 = value.data[dname]
          const d1 = this.mapDeploymentDefault(dname, d0)
          result[dname] = d1
        }
        deferred.resolve(result)
      } else {
        deferred.reject(new Error(value.message))
      }
    })
    .catch((reason) => {
      deferred.reject(reason)
    })
    return deferred.promise
  }

  /**
   *  Returns data of registered entities in the system.
   *  These can be component, services, runtimes and resources.
   */
  public findStorage (): Promise<string[]> {
    const deferred = new Deferred<string[]>()
    this.api.registriesGet()
    .then((value) => {
      if (value.success) {
        const result: string[] = value.data
        deferred.resolve(result)
      } else {
        deferred.reject(new Error(value.message))
      }
    })
    .catch( (reason) => {
      deferred.reject(reason)
    })
    return deferred.promise
  }

  /**
   * Remove a registered entity based on its urn.
   * @param urn  The urn of registered entity to be deleted.
   */
  public removeStorage (urn: string): Promise<any> {
    const deferred = new Deferred<any>()
    this.api.registriesUrnDelete(urn)
    .then((value) => {
      if (value.success) {
        const result: any = value.data
        deferred.resolve(result)
      } else {
        deferred.reject(new Error(value.message))
      }
    })
    .catch((reason) => {
      deferred.reject(reason)
    })
    return deferred.promise
  }

  /**
   *  Returns manifest of a registered entity based on its urn.
   * @param urn The urn of registered entity to get its manifest.
   */
  public getStorageManifest (urn: string): Promise<any> {
    const deferred = new Deferred<any>()
    this.api.registriesGet(urn)
    .then((value) => {
      if (value.success) {
        const result: any = value.data
        deferred.resolve(result)
      } else {
        deferred.reject(new Error(value.message))
      }
    })
    .catch((reason) => {
      deferred.reject(reason)
    })
    return deferred.promise
  }

  /**
   * Registers a set of bundles in the system.
   * At least one of the parameters must have a proper value.
   * @param bundlesZip A zip with a set of bundles, each one of them in a
   * different folder.
   * The structure of a bundle is documented in ECloud SDK manual, section 4.1.
   * @param bundlesJson A Json file with a list of references to bundles.
   * The format of this file must follow the specification in the ECloud SDK
   * manual, section 4.1.1.
   */
  public sendBundle (bundlesZip?: FileStream, bundlesJson?: FileStream):
      Promise<RegistrationResult> {
    const deferred = new Deferred<RegistrationResult>()
    const zipStream = bundlesZip ? bundlesZip.getStream() : undefined
    const zipJson = bundlesJson ? bundlesJson.getStream() : undefined
    this.api.bundlesPost(zipStream, zipJson)
    .then( (value) => {
      // console.log("== bundlePost ", JSON.stringify(value, null, 2))
      if (value.success) {
        const data: Swagger.InlineResponse200Data = value.data
        const result = new RegistrationResult()

        result.links = data.links
        result.tests = data.tests
        result.testToken = data.testToken
        result.errors = data.errors
        result.successful = data.successful
        if (data.deployments !== undefined) {
          const deployments = new Array<Deployment>()
          result.deployments = {
            errors: data.deployments.errors,
            successful: deployments
          }
          if (data.deployments.successful !== undefined) {
            data.deployments.successful.forEach((item: any) => {
              deployments.push(this.mapDeploymentDefault(
                item.deploymentURN, item.topology))
            })
          }
        }
        deferred.resolve(result)
      } else {
        deferred.reject(new Error(JSON.stringify(value)))
      }
    })
    .catch( (reason) => {
      deferred.reject(reason)
    })
    return deferred.promise
  }

  /**
   * Performs a new deployment in the system.
   * @param buffer Deployment file following specification in ECloud Manual,
   *  section 4.
   */
  public deploy (buffer: FileStream): Promise<DeploymentList> {
    const deferred = new Deferred<DeploymentList>()
    this.api.deploymentsPost(buffer.getStream())
    .then( (value) => {
      if (value.success) {
        const result: {[key: string]: Deployment} = {}
        const data: any = {}
        const urn: string = value.data.deploymentURN
        data[urn] = value.data.topology
        // console.log('Deployment:',JSON.stringify(value.data, null, 2))
        for (const dname in data) {
          if (data[dname]) {
            const d0 = data[dname]
            const d1 = this.mapDeploymentDefault(dname, d0)
            result[dname] = d1
          }
        }
        deferred.resolve(result)
      } else {
        deferred.reject(new Error(value.message))
      }
    })
    .catch((reason) => {
      deferred.reject(reason)
    })
    return deferred.promise
  }

  /**
   * Undeploys a deployment in the system.
   * @param urn Urn of deployment to be undeployed
   */
  public undeploy (urn: string): Promise<DeploymentInstanceInfo[]> {
    const deferred = new Deferred<DeploymentInstanceInfo[]>()
    this.api.deploymentsDelete(urn)
    .then( (value) => {
      if (value.success) {
        const response: any = value.data
        const result = new Array<DeploymentInstanceInfo>()
        for (const killed in response.killedInstances) {
          if (response.killedInstances[killed]) {
            const killedInfo: any = response.killedInstances[killed]
            result.push(
              this.mapInstanceInfoDefault(
                killed, killedInfo.component, killedInfo))
          }
        }
        deferred.resolve(result)
      } else {
        deferred.reject(new Error(value.message))
      }
    })
    .catch( (reason) => {
      deferred.reject(reason)
    })
    return deferred.promise
  }

  /**
   * Creates a new link between two deployed services.
   * @param endpoints An array of 2 elements with desired link endpoints data.
   */
  public linkDeployments (endpoints: Endpoint[]): Promise<any> {
    const deferred = new Deferred<any>()
    this.api.linksPost(this.generateLinkManifest(endpoints))
    .then( (value) => {
      if (value.success) {
        const result: any = value.data
        deferred.resolve(result)
      } else {
        deferred.reject(new Error(value.message))
      }
    })
    .catch( (reason) => {
      deferred.reject(reason)
    })
    return deferred.promise
  }

  /**
   * Removes a link between two services
   * @param endpoints  An array of 2 elements with endpoints data of the link
   *  to be removed.
   */
  public unlinkDeployments (endpoints: Endpoint[]): Promise<any> {
    const deferred = new Deferred<any>()
    this.api.linksDelete(this.generateLinkManifest(endpoints))
    .then( (value) => {
      if (value.success) {
        const result: any = value.data
        deferred.resolve(result)
      } else {
        deferred.reject(new Error(value.message))
      }
    })
    .catch( (reason) => {
      deferred.reject(reason)
    })
    return deferred.promise
  }

  /**
   *  Modifies the configuration of a deployed service.
   * @param configuration Specification of the modification. Currently, two
   * classes of modifications are supported: ScalingDeploymentModification and
   * ReconfigDeploymentModification.
   */
  public modifyDeployment (configuration: DeploymentModification): Promise<any> {
    const deferred = new Deferred<any>()
    const msg: string = JSON.stringify(configuration.generate())
    this.api.modifyDeployment(msg)
    .then((value) => {
      if (value.success) {
        const result: any = value.data
        deferred.resolve(result)
      } else {
        deferred.reject(new Error(value.message))
      }
    })
    .catch((reason) => {
      deferred.reject(reason)
    })
    return deferred.promise
  }

  /**
   * List current test contexts in the stamp.
   */
  public listTestContexts (): Promise<string[]> {
    const deferred = new Deferred<any>()
    this.api.testContextsGet()
    .then((value) => {
      if (value.success) {
        const result: any = value.data
        deferred.resolve(result)
      } else {
        deferred.reject(new Error(value.message))
      }
    })
    .catch((reason) => {
      deferred.reject(reason)
    })
    return deferred.promise
  }

  /**
   * Removes a test context
   * @param urn Identifier of the test context to be removed.
   */
  public removeTestContext (urn: string): Promise<any> {
    const deferred = new Deferred<any>()
    this.api.testContextsDelete(urn)
    .then((value) => {
      if (value.success) {
        const result: any = value.data
        deferred.resolve(result)
      } else {
        deferred.reject(new Error(value.message))
      }
    })
    .catch((reason) => {
      deferred.reject(reason)
    })
    return deferred.promise
  }

  private mapDeploymentDefault = (urn: string, data: any): Deployment => {
    if (data.serviceURN) {
      return this.mapDeploymentLocalStamp(urn, data)
    }
    // console.log("== data", JSON.stringify(data,null,2));
    const result = new Deployment()
    result.urn = urn
    result.service = data.service
    result.links = data.links
    result.roles = {}
    for (const roleName in data.roles) {
      if (data.roles[roleName]) {
        const roleInfo = data.roles[roleName]
        result.roles[roleName] = {
          configuration: {
            parameters: roleInfo.configuration
          },
          entrypoint: roleInfo.entrypoint,
          instances: { },
          arrangement: {
            cpu: roleInfo.arrangement.cpu,
            bandwidth: roleInfo.arrangement.bandwidth,
            failurezones: roleInfo.arrangement.failurezones,
            instances: roleInfo.arrangement.__instances,
            ioperf: roleInfo.arrangement.__ioperf,
            iopsintensive: roleInfo.arrangement.__iopsintensive,
            maxinstances: roleInfo.arrangement.maxinstances,
            memory: roleInfo.arrangement.memory,
            mininstances: roleInfo.arrangement.mininstances,
            resilience: roleInfo.arrangement.__resilience
          },
          component: roleInfo.component
        }
        for (const instanceName in data.roles[roleName].instances) {
          if (data.roles[roleName].instances[instanceName]) {
            result.roles[roleName].instances[instanceName] =
              this.mapInstanceInfoDefault(
                instanceName,
                roleName,
                data.roles[roleName].instances[instanceName]
            )
          }
        }
      }
    }
    // console.log("== generated", JSON.stringify(result,null,2));
    return result
  }

  private mapDeploymentLocalStamp = (urn: string, data: any): Deployment => {
    const result = new Deployment()
    result.urn = urn
    result.service = data.serviceURN
    result.roles = {}
    for (const roleName in data.roles) {
      if (data.roles[roleName]) {
        const roleInfo = data.roles[roleName]
        result.roles[roleName] = {
          instances: { },
          configuration: roleInfo.configuration,
          arrangement: {
            cpu: roleInfo.arrangement.cpu,
            bandwidth: roleInfo.arrangement.bandwidth,
            failurezones: roleInfo.arrangement.failurezones,
            instances: roleInfo.arrangement.__instances,
            ioperf: roleInfo.arrangement.__ioperf,
            iopsintensive: roleInfo.arrangement.__iopsintensive,
            maxinstances: roleInfo.arrangement.maxinstances,
            memory: roleInfo.arrangement.memory,
            mininstances: roleInfo.arrangement.mininstances,
            resilience: roleInfo.arrangement.__resilience
          },
          component: roleInfo.component,
          entrypoint: roleInfo.entrypoint
        }
        roleInfo.instances.forEach((instanceName: string) => {
          const instance = new DeploymentInstanceInfo()
          instance.id = instanceName
          instance.role = roleName
          instance.publicIp = '127.0.0.1'
          instance.privateIp = '127.0.0.1'

          if (roleInfo.instances[instanceName].configuration) {
            const configuration: {'resources': {[key: string]:
              {'type': string,'parameters': {[key: string]: any}}}} = {
                'resources': {}
              }
            for (let resourceName in roleInfo.instances[instanceName]
              .configuration.resources) {
              configuration['resources'][resourceName] = {
                'type': roleInfo.instances[instanceName]
                .configuration['resources'][resourceName].type,
                'parameters': roleInfo.instances[instanceName].configuration
                .resources[resourceName].parameters
              }
            }
            instance.configuration = configuration
          }

          if (roleInfo.instances[instanceName].connected !== undefined) {
            instance.connected = roleInfo.instances[instanceName].connected
          }

          if (data.volumes && data.volumes[instanceName]) {
            instance.volumes = data.volumes[instanceName]
          }
          if (data.portMapping) {
            data.portMapping.forEach((pm: any) => {
              if (pm.iid === instanceName) {
                if (!instance.ports) { instance.ports = { } }
                instance.ports[pm.endpoint] = pm.port
              }
            })
          }
          result.roles[roleName].instances[instanceName] = instance
        })
      }
    }
    return result
  }

  private mapInstanceInfoDefault = (name: string, role: string, i0: any) => {
    const instanceInfo = new DeploymentInstanceInfo()
    instanceInfo.id = name
    instanceInfo.role = role
    instanceInfo.cnid = i0.id
    instanceInfo.privateIp = i0.privateIp
    instanceInfo.publicIp = i0.publicIp
    if (i0.configuration) {
      const configuration: {'resources': {[key: string]:
        {'type': string,'parameters': {[key: string]: any}}}} = {
          'resources': {}
        }
      for (let resourceName in i0.configuration.resources) {
        configuration['resources'][resourceName] = {
          'type': i0.configuration.resources[resourceName].type,
          'parameters': i0.configuration.resources[resourceName].parameters
        }
      }
      instanceInfo.configuration = configuration
    }
    if (i0.arrangement) {
      instanceInfo.arrangement = {
        bandwith: i0.arrangement.bandwith,
        cpu: i0.arrangement.cpu,
        failureZones: i0.arrangement.failureZones,
        maxinstances: i0.arrangement.maxinstances,
        memory: i0.arrangement.memory,
        mininstances: i0.arrangement.mininstances,
        resilience: i0.arrangement.__resilience
      }
    }
    if (i0.connected !== undefined) {
      instanceInfo.connected = i0.connected
    }
    return instanceInfo
  }

  private generateLinkManifest = (entrypoints: Endpoint[]): string => {
    const manifest = {
      spec: 'http://eslap.cloud/manifest/link/1_0_0',
      endpoints: [
        {
          'deployment': entrypoints[0].deployment,
          'channel': entrypoints[0].channel
        },{
          'deployment': entrypoints[1].deployment,
          'channel': entrypoints[1].channel
        }
      ]
    }
    return JSON.stringify(manifest)
  }

}
