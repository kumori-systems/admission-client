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
  // This only is used in the context of local-stamp
  public volumes?: { [key: string]: string }
  public ports?: { [key: string]: string }
}
