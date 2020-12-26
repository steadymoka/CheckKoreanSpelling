import Vue from 'vue'
import VueRouter from 'vue-router'

import PageIndex from '~/pages/index.vue'

Vue.use(VueRouter)

export const router = new VueRouter({
  routes: [
    { path: '/', component: PageIndex },
    { path: '/star', component: () => import('~/pages/star.vue') },
  ],
})
