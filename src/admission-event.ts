export enum EcloudEventType {admission, node, service, instance, metrics}

export enum EcloudEventName {
  disconnected, deploying, deployed, link, unlink, undeploying, undeployed,
  scaling, scaled, realocate, restart, status, reconfig, node, service,
  volume
}

export class AdmissionEvent {
  public timestamp: string
  // private owner: string | null
  public source: string
  public entity: {node: string}|{serviceApp: string, service: string}|
    {serviceApp: string, service: string, role: string, instance: string}
  public type: EcloudEventType
  public name: EcloudEventName
  public strType: string
  public strName: string
  public data: any
}
