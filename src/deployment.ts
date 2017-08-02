import {DeploymentInstanceInfo} from '.'

export class Deployment {
  public urn: string
  public service: string
  public roles: {
    [key: string]: {
      instances: {[key: string]: DeploymentInstanceInfo}
      configuration:{
        parameters: {[key: string]: any}
      } 
      entrypoint: {
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
  public links: {
    [key: string]: 
      {[key: string]: 
        {[key: string]: any} 
      }
  }
}
