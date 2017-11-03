import {DeploymentInstanceInfo} from '.'

export class Deployment {
  public urn: string
  public service: string
  public roles: {
    [key: string]: {
      instances: {[key: string]: DeploymentInstanceInfo}
      configuration: {
        parameters: {[key: string]: any}
      }
      arrangement: {
        bandwidth: number
        cpu: number
        failurezones: number
        ioperf: number
        iopsintensive: boolean
        instances: number
        maxinstances: number
        memory: number
        mininstances: number
        resilience: number
      }
      component: string
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
  public resources: {
    [key: string]: {
      type: string
      resource: {
        spec: string
        name: string,
        parameters: {
          [key: string]: any
        }
      }
    }
  }
}
