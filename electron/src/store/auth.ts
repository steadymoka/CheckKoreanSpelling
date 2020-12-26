import { Module } from 'vuex'

export interface AuthUser {
  id: string
  socials: { email: string | null, avatar: string | null }[]
}

export interface AuthState {
  user: AuthUser | null
}

export const auth: Module<AuthState, any> = {
  namespaced: true,
  state: () => ({
    user: null,
  }),
  mutations: {
    login(state, { user }: { user: AuthUser | null }) {
      state.user = user
    },
  },
}
