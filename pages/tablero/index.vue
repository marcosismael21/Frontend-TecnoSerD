<template>
  <client-only>
    <dashboard v-if="isMounted"/>
  </client-only>
</template>

<script>
export default {
  name: 'TableroPage',
  ssr: false,
  data() {
    return {
      isMounted: false
    }
  },
  mounted() {
    this.isMounted = true
  },
  components: {
    Dashboard: () => import('@/components/Dashboard.vue')
  }
}
</script>
