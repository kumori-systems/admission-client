export enum EventType {node,service, instance, metric};

export class AdmissionEvent {

  static EventType = EventType;

  public timestamp: string;
  public owner: string | null;
  public source: string;
  public entity: any;
  public type: string;
  public name: string;
  public data: any;
}

export class DisconnectedAdmissionEvent extends AdmissionEvent {
  public readonly owner = null;
  public entity: {
    node: string;
  }
  public readonly type = 'node'
  public readonly name = 'disconnected'
  public data: {
    flavor: string,
    publicIp: string,
    privateIp: string
  }
}