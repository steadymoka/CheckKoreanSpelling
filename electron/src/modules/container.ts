import Vue from 'vue'

export type ConstructType<T> = new (...args: any[]) => T
export type Identifier<T> = ConstructType<T> | string | symbol

export interface Container {
  get<T>(identifier: Identifier<T>): T
}

const container = new Map<any, any>()

Vue.prototype.$container = {
  get(identifier: any) {
    return container.get(identifier)
  },
}
