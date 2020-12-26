<style lang="postcss" scoped>
</style>
<template>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class PageIndex extends Vue {
  mounted() {
    this.$router.replace('/star')
  }
}
</script>
