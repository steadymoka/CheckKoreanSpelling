import Vue from 'vue'
import Vuex from 'vuex'

import { AuthState, auth } from '~/store/auth'


Vue.use(Vuex)

export interface RootState {
  auth: AuthState
}

export const store = new Vuex.Store<RootState>({
  modules: {
    auth,
  },
})
