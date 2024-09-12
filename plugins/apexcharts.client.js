import Vue from 'vue';
import VueApexCharts from 'vue-apexcharts';

if (process.client) {
  Vue.use(VueApexCharts);
  Vue.component('apexchart', VueApexCharts);
}

export default {
  components: {
    apexchart: VueApexCharts,
  },
};
