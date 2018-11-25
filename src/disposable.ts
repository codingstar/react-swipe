/*
 * @file proto for disposable
 * @author nighca <nighca@live.cn>
 */

export interface IDisposer {
  (): void
}

const DISPOSERS = Symbol('disposers')

export default class Disposable {

  constructor() {
    this[DISPOSERS] = []
  }

  addDisposer(...disposers: IDisposer[]) {
    this[DISPOSERS] = this[DISPOSERS].concat(disposers)
  }

  dispose() {
    this[DISPOSERS].forEach(
      (disposer: IDisposer) => {
        try {
          disposer()
        } catch (e) { /* do nothing */ }
      }
    )
  }
}
