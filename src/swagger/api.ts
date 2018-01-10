/**
 * ECloud Admission
 * The Admission API is the entry point for ECloud users to interact with the
 * system. With this API you can perform operations such as registering
 * components, services, deploying them, checking their status, etc.
 * In order to correctly understand the terms used in descriptions of
 * API elements, it is necessary to have some knowledge about the structure
 * of the services within the ECloud PAAS. Information on this topic can be
 * found in the ECloud manual.
 *
 */
import Axios from 'axios'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import FormData = require('form-data')
import { Deferred } from '..'

const defaultBasePath = 'http://admission.argo.kumori.cloud/admission'

/* tslint:disable:no-unused-variable */
/* tslint:disable:max-classes-per-file */

export class GeneralResponse {
  public 'success': boolean
  public 'message': string
  public 'data': any
}

export class InlineResponse200 {
  public 'success': boolean
  public 'message': string
  public 'data': InlineResponse200Data
}

export class InlineResponse2001 {
  public 'success': boolean
  public 'message': string
  public 'data': { [key: string]: InlineResponse2001Data }
}

export class InlineResponse2001Arrangement {
  public 'cpu': number
  public 'bandwidth': number
  public 'failurezones': number
  public 'mininstances': number
  public 'maxinstances': number
}

export class InlineResponse2001Data {
  public 'service': string
  public 'roles': { [key: string]: InlineResponse2001Roles }
}

export class InlineResponse2003 {
  public 'success': boolean
  public 'message': string
  public 'data': {
    deploymentURN: string
    topology: InlineResponse2001Data
  }
}

export class InlineResponse2001Instances {
  public 'id': string
  public 'privateIp': string
  public 'publicIp': string
  public 'arrangement': InlineResponse2001Arrangement
}

export class InlineResponse2001Roles {
  public 'instances': { [key: string]: InlineResponse2001Instances }
}

export class InlineResponse2002 {
  public 'success': boolean
  public 'message': string
  public 'data': any
}

export class InlineResponse200Data {
  public 'successful': any
  public 'errors': any
  public 'deployments': any
  public 'links': any
  public 'tests': any
  public 'testToken': string
}

export class InstanceInfo {
  public 'id': string
  public 'privateIp': string
  public 'publicIp': string
  public 'arrangement': InlineResponse2001Arrangement
}

export interface IAuthentication {
  /**
   * Apply authentication settings to header and query params.
   */
  applyToRequest(requestOptions: any): void
}

export class HttpBasicAuth implements IAuthentication {
  public username: string
  public password: string
  public applyToRequest(requestOptions: any): void {
    requestOptions.auth = {
      password: this.password,
      username: this.username
    }
  }
}

export class OAuth implements IAuthentication {
  public accessToken: string

  public applyToRequest(requestOptions: any): void {
    if (requestOptions && requestOptions.headers) {
      requestOptions.headers.authorization =
        'Bearer ' + this.accessToken
    }
  }
}

export class VoidAuth implements IAuthentication {
  public username: string
  public password: string
  public applyToRequest(_: any): void {
    // Do nothing
  }
}

export class DefaultApi {
  protected basePath = defaultBasePath
  protected defaultHeaders: any = {}

  protected authentications = {
    apiAuthorization: new OAuth(),
    default: new VoidAuth()
  }

  constructor(basePath?: string)

  constructor(
    basePathOrUsername: string,
    password?: string,
    basePath?: string) {

    if (password) {
      if (basePath) {
        this.basePath = basePath
      }
    } else {
      if (basePathOrUsername) {
        this.basePath = basePathOrUsername
      }
    }
  }

  set accessToken(token: string) {
    this.authentications.apiAuthorization.accessToken = token
  }

  /**
   *
   * Registers a set of bundles in the system. At least one of the parameters
   * must have a proper value.
   * @param bundlesZip A zip with a set of bundles, each one of them in a
   *  different folder. The structure of a bundle is documented in ECloud
   *  SDK manual, section 4.1.
   * @param bundlesJson A Json file with a list of references to bundles.
   * The format of this file must follow the specification in the ECloud SDK
   *  manual, section 4.1.1.
   */
  public bundlesPost(bundlesZip?: any, bundlesJson?: any):
    Promise<InlineResponse200> {
    const localVarPath = this.basePath + '/bundles'
    const queryParameters: any = {}
    // const headerParams: any = Object.assign({}, this.defaultHeaders)
    let formParams

    const fd: FormData = new FormData()
    formParams = fd

    if (bundlesZip !== undefined) {
      fd.append('bundlesZip', bundlesZip, 'bundle.zip')
    }
    if (bundlesJson !== undefined) {
      fd.append('bundlesJson', bundlesJson, 'bundle.json')
    }
    const requestOptions: AxiosRequestConfig = {
      data: formParams,
      method: 'POST',
      params: queryParameters,
      url: localVarPath
    }
    if (this.isNode()) {
      requestOptions.headers = fd.getHeaders()
    }

    this.authentications.apiAuthorization.applyToRequest(requestOptions)

    this.authentications.default.applyToRequest(requestOptions)

    // console.log(JSON.stringify(requestOptions.headers,null,2))

    const deferred: Deferred<InlineResponse200> =
      new Deferred<InlineResponse200>()

    Axios(requestOptions)
      .then((response: AxiosResponse) => {
        if (response.status >= 200 && response.status <= 299) {
          deferred.resolve(response.data)
        } else {
          deferred.reject(response)
        }
      })
      .catch((reason) => {
        deferred.reject(reason)
      })
    return deferred.promise
  }

  /**
   *
   * Undeploys a deployment in the system.
   * @param urn Urn of deployment to be undeployed
   */
  public deploymentsDelete(urn: string): Promise<InlineResponse2002> {
    const localVarPath = this.basePath + '/deployments'
    const queryParameters: any = {}
    const headerParams: any = Object.assign({}, this.defaultHeaders)

    // verify required parameter 'urn' is not null or undefined
    // if (urn === null || urn === undefined) {
    //   throw new Error('Required parameter urn was null or undefined when \
    //       calling deploymentsDelete.')
    // }
    queryParameters.urn = urn

    const requestOptions: AxiosRequestConfig = {
      headers: headerParams,
      method: 'DELETE',
      params: queryParameters,
      url: localVarPath
    }

    this.authentications.apiAuthorization.applyToRequest(requestOptions)

    this.authentications.default.applyToRequest(requestOptions)

    const deferred: Deferred<InlineResponse2002> =
      new Deferred<InlineResponse2002>()

    Axios(requestOptions)
      .then((response: AxiosResponse) => {
        if (response.status >= 200 && response.status <= 299) {
          deferred.resolve(response.data)
        } else {
          deferred.reject(response)
        }
      })
      .catch((reason) => {
        deferred.reject(reason)
      })
    return deferred.promise
  }
  /**
   *
   * Performs a new deployment in the system.
   * @param inline The uploaded deployment file following specification
   * in ECloud Manual, section 4.
   */
  public deploymentsPost(inline: any): Promise<InlineResponse2003> {
    const localVarPath = this.basePath + '/deployments'
    const queryParameters: any = {}
    const headerParams: any = Object.assign({}, this.defaultHeaders)
    const fd: FormData = new FormData()

    // verify required parameter 'inline' is not null or undefined
    if (inline === null || inline === undefined) {
      throw new Error('Required parameter inline was null or undefined \
          when calling deploymentsPost.')
    }

    if (inline !== undefined) {
      fd.append('inline', inline, 'Manifest.json')
    }

    const requestOptions: AxiosRequestConfig = {
      data: fd,
      headers: headerParams,
      method: 'POST',
      params: queryParameters,
      url: localVarPath
    }

    if (this.isNode()) {
      requestOptions.headers = fd.getHeaders()
      // console.log('Headers', requestOptions.headers)
    }

    this.authentications.apiAuthorization.applyToRequest(requestOptions)

    this.authentications.default.applyToRequest(requestOptions)

    const deferred: Deferred<InlineResponse2003> =
      new Deferred<InlineResponse2003>()

    Axios(requestOptions)
      .then((response: AxiosResponse) => {
        if (response.status >= 200 && response.status <= 299) {
          deferred.resolve(response.data)
        } else {
          deferred.reject(response)
        }
      })
      .catch((reason) => {
        deferred.reject(reason)
      })
    return deferred.promise
  }

  /**
   *
   * Returns data of deployed services in system.
   * @param urn urn of deployment whose data is needed. If not provided,
   * data about any accesible deployment is returned.
   * @param owner Only the deployments whose owner matches the value of the
   *  parameter are listed
   * @param show Desired format of the information provided for each
   * deployment. Possible values are&amp#58
   *  * topology. It is the default value.
   *  * extended.
   *  * urn. Only urns are listed.
   */
  public findDeployments(urn?: string, owner?: string, show?: string):
    Promise<InlineResponse2001> {
    const localVarPath = this.basePath + '/deployments'
    const queryParameters: any = {}
    const headerParams: any = Object.assign({}, this.defaultHeaders)

    if (urn !== undefined) {
      queryParameters.urn = urn
    }

    if (owner !== undefined) {
      queryParameters.owner = owner
    }

    if (show !== undefined) {
      queryParameters.show = show
    }

    const requestOptions: AxiosRequestConfig = {
      headers: headerParams,
      method: 'get',
      params: queryParameters,
      url: localVarPath
    }

    this.authentications.apiAuthorization.applyToRequest(requestOptions)

    this.authentications.default.applyToRequest(requestOptions)

    const deferred: Deferred<InlineResponse2001> =
      new Deferred<InlineResponse2001>()

    Axios(requestOptions)
      .then((response: AxiosResponse) => {
        if (response.status >= 200 && response.status <= 299) {
          deferred.resolve(response.data)
        } else {
          deferred.reject(response)
        }
      })
      .catch((reason) => {
        deferred.reject(reason)
      })
    return deferred.promise
  }

  /**
   *
   * Removes a link between two services
   * @param linkManifest The manifest of the link to be removed.
   */
  public linksDelete(linkManifest: any): Promise<InlineResponse2002> {
    const localVarPath = this.basePath + '/links'
    const queryParameters: any = {}
    const headerParams: any = Object.assign({}, this.defaultHeaders)
    const fd: FormData = new FormData()

    // verify required parameter 'linkManifest' is not null or undefined
    if (linkManifest === null || linkManifest === undefined) {
      throw new Error('Required parameter linkManifest was null or \
            undefined when calling linksDelete.')
    }

    queryParameters['linkManifest'] = linkManifest
    const requestOptions: AxiosRequestConfig = {
      data: fd,
      headers: headerParams,
      method: 'DELETE',
      params: queryParameters,
      url: localVarPath
    }

    if (this.isNode()) {
      requestOptions.headers = fd.getHeaders()
    }
    this.authentications.apiAuthorization.applyToRequest(requestOptions)

    this.authentications.default.applyToRequest(requestOptions)

    const deferred: Deferred<InlineResponse2002> =
      new Deferred<InlineResponse2002>()

    Axios(requestOptions)
      .then((response: AxiosResponse) => {
        if (response.status >= 200 && response.status <= 299) {
          deferred.resolve(response.data)
        } else {
          deferred.reject(response)
        }
      })
      .catch((reason) => {
        deferred.reject(reason)
      })
    return deferred.promise

  }

  /**
   *
   * Creates a new link between two deployed services.
   * @param linkManifest The manifest of the desired link.
   */
  public linksPost(linkManifest: any): Promise<InlineResponse2002> {
    const localVarPath = this.basePath + '/links'
    const queryParameters: any = {}
    const headerParams: any = Object.assign({}, this.defaultHeaders)
    const fd: FormData = new FormData()

    // verify required parameter 'linkManifest' is not null or undefined
    if (linkManifest === null || linkManifest === undefined) {
      throw new Error('Required parameter linkManifest was null or \
            undefined when calling linksPost.')
    }

    if (!this.isNode()) {
      // Browsers need to transform the content from a string to a Blob
      linkManifest = new Blob([linkManifest])
    }

    fd.append('linkManifest', linkManifest, 'Manifest.json')

    const requestOptions: AxiosRequestConfig = {
      data: fd,
      headers: headerParams,
      method: 'POST',
      params: queryParameters,
      url: localVarPath
    }

    if (this.isNode()) {
      requestOptions.headers = fd.getHeaders()
    }
    this.authentications.apiAuthorization.applyToRequest(requestOptions)

    this.authentications.default.applyToRequest(requestOptions)

    const deferred: Deferred<InlineResponse2002> =
      new Deferred<InlineResponse2002>()

    Axios(requestOptions)
      .then((response: AxiosResponse) => {
        if (response.status >= 200 && response.status <= 299) {
          deferred.resolve(response.data)
        } else {
          deferred.reject(response)
        }
      })
      .catch((reason) => {
        deferred.reject(reason)
      })
    return deferred.promise

  }
  /**
   *
   * Modification of some parameter of the deployment.
   * There are two possible actions&amp#58
   * * Reconfiguration of parameters or deployment and
   * * Manual scaling.
   * @param inline The uploaded deployment file with the new configuration.
   * The file must be a JSON with this keys&amp#58
   * * deploymentURN. URN of the deployment to be reconfigured.
   * * action. manualScaling/reconfig
   * * entryPoints (only when reconfig action)
   * * configuration (only when reconfig action)
   * * roles (only when manualScaling action)
   */
  public modifyDeployment(inline: any): Promise<InlineResponse2002> {
    const localVarPath = this.basePath + '/deployments/configuration'
    const queryParameters: any = {}
    const headerParams: any = Object.assign({}, this.defaultHeaders)
    const fd: FormData = new FormData()

    // verify required parameter 'inline' is not null or undefined
    if (inline === null || inline === undefined) {
      throw new Error('Required parameter inline was null or undefined \
          when calling modifyDeployment.')
    }

    if (!this.isNode()) {
      // Browsers need to transform the content from a string to a Blob
      inline = new Blob([inline])
    }

    fd.append('inline', inline, 'Manifest.json')

    const requestOptions: AxiosRequestConfig = {
      data: fd,
      headers: headerParams,
      method: 'PUT',
      params: queryParameters,
      url: localVarPath
    }

    if (this.isNode()) {
      requestOptions.headers = fd.getHeaders()
    }

    this.authentications.apiAuthorization.applyToRequest(requestOptions)

    this.authentications.default.applyToRequest(requestOptions)

    const deferred: Deferred<InlineResponse2002> =
      new Deferred<InlineResponse2002>()

    Axios(requestOptions)
      .then((response: AxiosResponse) => {
        if (response.status >= 200 && response.status <= 299) {
          deferred.resolve(response.data || true)
        } else {
          deferred.reject(response)
        }
      })
      .catch((reason) => {
        deferred.reject(reason)
      })
    return deferred.promise
  }
  /**
   *
   * Returns data of registered entities in the system. These can be
   * component, services, runtimes and resources.
   * @param urn urn of deployment whose data is needed. If not provided,
   * data about any accesible deployment is returned.
   */
  public registriesGet(urn?: string): Promise<InlineResponse2002> {
    let localVarPath = this.basePath + '/registries'
    const queryParameters: any = {}
    const headerParams: any = Object.assign({}, this.defaultHeaders)

    if (urn !== undefined) {
      localVarPath = localVarPath + '/' + encodeURIComponent(urn)
    }

    const requestOptions: AxiosRequestConfig = {
      headers: headerParams,
      method: 'GET',
      params: queryParameters,
      url: localVarPath
    }

    this.authentications.apiAuthorization.applyToRequest(requestOptions)

    this.authentications.default.applyToRequest(requestOptions)

    const deferred: Deferred<InlineResponse2001> =
      new Deferred<InlineResponse2001>()

    Axios(requestOptions)
      .then((response: AxiosResponse) => {
        if (response.status >= 200 && response.status <= 299) {
          deferred.resolve(response.data)
        } else {
          deferred.reject(response)
        }
      })
      .catch((reason) => {
        deferred.reject(reason)
      })
    return deferred.promise
  }

  /**
   *
   * Remove a registered entity based on its urn.
   * @param urn The urn of registered entity to be deleted.
   */
  public registriesUrnDelete(urn: string): Promise<InlineResponse2002> {
    const localVarPath = this.basePath + '/registries'
    const queryParameters: any = { urn }
    const headerParams: any = Object.assign({}, this.defaultHeaders)

    // verify required parameter 'urn' is not null or undefined
    // if (urn === null || urn === undefined) {
    //   throw new Error('Required parameter urn was null or undefined when \
    //       calling registriesUrnDelete.')
    // }

    const requestOptions: AxiosRequestConfig = {
      headers: headerParams,
      method: 'DELETE',
      params: queryParameters,
      url: localVarPath
    }

    this.authentications.apiAuthorization.applyToRequest(requestOptions)

    this.authentications.default.applyToRequest(requestOptions)

    const deferred: Deferred<InlineResponse2002> =
      new Deferred<InlineResponse2002>()

    Axios(requestOptions)
      .then((response: AxiosResponse) => {
        if (response.status >= 200 && response.status <= 299) {
          deferred.resolve(response.data)
        } else {
          deferred.reject(response)
        }
      })
      .catch((reason) => {
        deferred.reject(reason)
      })
    return deferred.promise
  }

  /**
   *
   * Returns manifest of a registered entity based on its urn.
   * @param urn The urn of registered entity to get its manifest .
   */
  public registriesUrnGet(urn: string): Promise<InlineResponse2002> {
    const localVarPath = this.basePath + '/registries/{urn}'
      .replace('{' + 'urn' + '}', String(urn))
    const queryParameters: any = {}
    const headerParams: any = Object.assign({}, this.defaultHeaders)
    const formParams: any = {}

    // verify required parameter 'urn' is not null or undefined
    // if (urn === null || urn === undefined) {
    //   throw new Error('Required parameter urn was null or undefined when \
    //       calling registriesUrnGet.')
    // }

    const requestOptions: AxiosRequestConfig = {
      data: formParams,
      headers: headerParams,
      method: 'GET',
      params: queryParameters,
      url: localVarPath
    }

    this.authentications.apiAuthorization.applyToRequest(requestOptions)
    this.authentications.default.applyToRequest(requestOptions)

    const deferred: Deferred<InlineResponse2002> =
      new Deferred<InlineResponse2002>()

    Axios(requestOptions)
      .then((response: AxiosResponse) => {
        if (response.status >= 200 && response.status <= 299) {
          deferred.resolve(response.data)
        } else {
          deferred.reject(response)
        }
      })
      .catch((reason) => {
        deferred.reject(reason)
      })
    return deferred.promise
  }
  /**
   *
   * Removes a test context
   * @param urn Identifier of the test context to be removed.
   */
  public testContextsDelete(urn: string): Promise<InlineResponse2002> {
    const localVarPath = this.basePath + '/test-contexts'
    const queryParameters: any = {}
    const headerParams: any = Object.assign({}, this.defaultHeaders)
    const formParams: any = {}

    // verify required parameter 'urn' is not null or undefined
    // if (urn === null || urn === undefined) {
    //   throw new Error('Required parameter urn was null or undefined \
    //         when calling testContextsDelete.')
    // }
    queryParameters.urn = urn

    const requestOptions: AxiosRequestConfig = {
      data: formParams,
      headers: headerParams,
      method: 'DELETE',
      params: queryParameters,
      url: localVarPath
    }

    this.authentications.apiAuthorization.applyToRequest(requestOptions)
    this.authentications.default.applyToRequest(requestOptions)

    const deferred: Deferred<InlineResponse2002> =
      new Deferred<InlineResponse2002>()

    Axios(requestOptions)
      .then((response: AxiosResponse) => {
        if (response.status >= 200 && response.status <= 299) {
          deferred.resolve(response.data)
        } else {
          deferred.reject(response)
        }
      })
      .catch((reason) => {
        deferred.reject(reason)
      })
    return deferred.promise
  }
  /**
   *
   * List current test contexts in the stamp.
   */
  public testContextsGet(): Promise<InlineResponse2002> {
    const localVarPath = this.basePath + '/test-contexts'
    const queryParameters: any = {}
    const headerParams: any = Object.assign({}, this.defaultHeaders)

    const requestOptions: AxiosRequestConfig = {
      headers: headerParams,
      method: 'GET',
      params: queryParameters,
      url: localVarPath
    }

    this.authentications.apiAuthorization.applyToRequest(requestOptions)
    this.authentications.default.applyToRequest(requestOptions)

    const deferred: Deferred<InlineResponse2002> =
      new Deferred<InlineResponse2002>()

    Axios(requestOptions)
      .then((response: AxiosResponse) => {
        if (response.status >= 200 && response.status <= 299) {
          deferred.resolve(response.data)
        } else {
          deferred.reject(response)
        }
      })
      .catch((reason) => {
        deferred.reject(reason)
      })
    return deferred.promise
  }

  public isNode(): boolean {
    // tslint:disable-next-line
    return (typeof process === 'object' && process + '' === '[object process]')
  }

}

// function isFile(val:any) {
//   return toString.call(val) === '[object File]'
// }

// function isStream(val:any) {
//   return isObject(val) && isFunction(val.pipe)
// }

// function isFunction(val:any) {
//   return toString.call(val) === '[object Function]'
// }

// function isObject(val:any) {
//   return val !== null && typeof val === 'object'
// }
