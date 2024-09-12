// plugins/apexcharts.js
import Vue from 'vue';

if (process.browser) {
  import('vue-apexcharts').then((VueApexCharts) => {
    Vue.use(VueApexCharts.default);
    Vue.component('apexchart', VueApexCharts.default);
  });
}
