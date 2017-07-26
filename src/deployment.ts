import {DeploymentInstanceInfo} from '.'

export class Deployment {
  public 'urn': string
  public 'service': string
  public 'roles': {
    [key: string]: {
      'instances': {[key: string]: DeploymentInstanceInfo}
      'configuration': { [key: string]: any }
      'entrypoint': {
        sslonly: boolean
        domain: string
        secrets: {
          cert: string
          key: string
          ca: string
        }
      }
    }
  }
}
