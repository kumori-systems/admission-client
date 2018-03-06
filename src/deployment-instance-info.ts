export class DeploymentInstanceInfo {
  public id: string
  public role: string
  public cnid: string
  public publicIp: string
  public privateIp: string
  public connected: boolean
  public configuration: {
    'resources': {
      [key: string]: {
        'name': string,
        'type': string,
        'parameters': {
          [key: string]: any
        }
      }
    }
  }
  public arrangement: {
    // __instances:number
    // __cpu: number
    // __memory: number
    // __ioperf: number
    // __iopsintensive: boolean
    // __bandwith: number
    // __resilience: number
    mininstances: number
    maxinstances: number
    resilience: number
    cpu: number
    memory: number
    bandwith: number
    failureZones: number
  }
  // This is only used in the local-stamp context
  public volumes?: { [key: string]: string | { id: string, urn?: string } }
  public ports?: { [key: string]: string }
}
