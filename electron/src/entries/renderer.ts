import '~/assets/css/home.css'
import '~/modules/filters'
import '~/modules/fontawesome'
import '~/modules/container'

import { ipcRenderer } from 'electron'
import Vue from 'vue'

import { PersistStore } from '~/interfaces/store'
import { router } from '~/modules/vue-router'
import { store } from '~/modules/vuex'

// Logger to console.log
ipcRenderer.invoke('resolveLogs')

ipcRenderer.invoke('getStoreAll').then((persistStore: PersistStore) => {
  new Vue({
    el: '#app',
    router,
    store,
    render: h => h('div', {
      attrs: {
        id: 'app',
      },
    }, [
      h('router-view'),
    ]),
  })
})
