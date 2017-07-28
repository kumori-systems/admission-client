export class Deferred<T> {
  public promise: Promise<T>
  protected promise2: Promise<void>

  private fate: 'resolved' | 'unresolved'
  private state: 'pending' | 'fulfilled' | 'rejected'

  private xresolve: (v: any) => void
  private xreject: (r: any) => void

  constructor () {
    this.state = 'pending'
    this.fate = 'unresolved'
    this.promise = new Promise((resolve, reject) => {
      this.xresolve = resolve
      this.xreject = reject
    })
    this.promise2 = this.promise.then(
      () => { this.state = 'fulfilled' },
      () => { this.state = 'rejected' }
    )
  }

  public resolve (value?: any) {
    if (this.fate === 'resolved') {
      throw new Error('Deferred cannot be resolved twice')
    }
    this.fate = 'resolved'
    this.xresolve(value)
  }

  public reject (reason?: any) {
    if (this.fate === 'resolved') {
      throw new Error('Deferred cannot be resolved twice')
    }
    this.fate = 'resolved'
    this.xreject(reason)
  }

  public isResolved () {
    return this.fate === 'resolved'
  }

  public isPending () {
    return this.state === 'pending'
  }

  public isFulfilled () {
    return this.state === 'fulfilled'
  }

  public isRejected () {
    return this.state === 'rejected'
  }
}
