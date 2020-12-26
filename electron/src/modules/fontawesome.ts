import { library } from '@fortawesome/fontawesome-svg-core'
import { faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { faSearch, faHome, faTimes, faQuestionCircle, faMinus, faFileExcel, faFileImage } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Vue from 'vue'

library.add(faSearch, faTimes, faQuestionCircle, faHome, faMinus, faInstagram, faYoutube, faFileExcel, faFileImage)

Vue.component('FaIcon', FontAwesomeIcon)
