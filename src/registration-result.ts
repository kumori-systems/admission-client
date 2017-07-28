import {Deployment} from '.'

export class RegistrationResult {
  public 'successful': any
  public 'errors': any
  public 'deployments': {
    'successful': Deployment[]
    'errors': any
  }
  public 'links': any
  public 'tests': any
  public 'testToken': string
}
