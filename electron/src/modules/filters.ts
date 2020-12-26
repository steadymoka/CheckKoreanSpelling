import numeral from 'numeral'
import Vue from 'vue'

Vue.filter('percent', (number: number | null | undefined) => {
  if (number === null || typeof number === 'undefined') {
    return null
  }
  return numeral(number).format('0.0%')
})
