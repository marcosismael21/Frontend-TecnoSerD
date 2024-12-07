import Vue from 'vue'

export default function() {
  if (process.client) {
    const VueApexCharts = import('vue-apexcharts')
    VueApexCharts.then(module => {
      Vue.component('apexchart', module.default)
    })
  }
}
