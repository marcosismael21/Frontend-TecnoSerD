<template>
  <v-container>
    <!-- Sparkline Boxes -->
    <v-row class="mt-4 mb-4">
      <v-col cols="12" md="4">
        <v-card class="box box1">
          <v-card-subtitle>
            <apexchart type="area" :options="sparkOptions1" :series="sparkSeries1" />
          </v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="box box2">
          <v-card-subtitle>
            <apexchart type="area" :options="sparkOptions2" :series="sparkSeries2" />
          </v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="box box3">
          <v-card-subtitle>
            <apexchart type="area" :options="sparkOptions3" :series="sparkSeries3" />
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <!-- Bar and Donut Charts -->
    <v-row class="mt-5 mb-4">
      <v-col cols="12" md="6">
        <v-card class="box">
          <v-card-title>Servicios Prestados por Ciudad</v-card-title>
          <v-card-subtitle>
            <apexchart type="bar" :options="barOptions" :series="barSeries" />
          </v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="box">
          <v-card-title>Asignaciones por Estado</v-card-title>
          <v-card-subtitle>
            <apexchart type="donut" :options="donutOptions" :series="donutSeries" />
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <!-- Area and Pie Charts -->
    <v-row class="mt-4 mb-4">
      <v-col cols="12" md="6">
        <v-card class="box">
          <v-card-title>Crecimiento de Equipos por Estado</v-card-title>
          <v-card-subtitle>
            <apexchart type="area" :options="areaOptions" :series="areaSeries" />
          </v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="box">
          <v-card-title>Equipos en Buen y Mal Estado</v-card-title>
          <v-card-subtitle>
            <apexchart type="pie" :options="pieOptions" :series="pieSeries" />
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'

export default {
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      sparkOptions1: {
        chart: { type: 'area', height: 160, sparkline: { enabled: true } },
        stroke: { curve: 'smooth' },
        fill: { opacity: 0.3 },
        xaxis: { type: 'datetime', crosshairs: { width: 1 } },
        tooltip: { x: { format: 'MMM dd' }, y: { formatter: (value) => `${value}` } },
        title: { text: '40', offsetX: 0, style: { fontSize: '24px' } },
        subtitle: { text: 'Instalaciones', offsetX: 0, style: { fontSize: '14px' } },
      },
      sparkSeries1: [],
      sparkOptions2: {
        chart: { type: 'area', height: 160, sparkline: { enabled: true } },
        stroke: { curve: 'smooth' },
        fill: { opacity: 0.3 },
        xaxis: { type: 'datetime', crosshairs: { width: 1 } },
        tooltip: { x: { format: 'MMM dd' }, y: { formatter: (value) => `${value}` } },
        title: { text: '80', offsetX: 0, style: { fontSize: '24px' } },
        subtitle: { text: 'Soportes', offsetX: 0, style: { fontSize: '14px' } },
      },
      sparkSeries2: [],
      sparkOptions3: {
        chart: { type: 'area', height: 160, sparkline: { enabled: true } },
        stroke: { curve: 'smooth' },
        fill: { opacity: 0.3 },
        xaxis: { type: 'datetime', crosshairs: { width: 1 } },
        tooltip: { x: { format: 'MMM dd' }, y: { formatter: (value) => `${value}` } },
        title: { text: '60', offsetX: 0, style: { fontSize: '24px' } },
        subtitle: { text: 'Retiros', offsetX: 0, style: { fontSize: '14px' } },
      },
      sparkSeries3: [],
      barOptions: {
        chart: { type: 'bar', height: 350 },
        plotOptions: { bar: { horizontal: false, columnWidth: '55%' } },
        xaxis: { categories: [] },
        yaxis: { title: { text: 'Cantidad de servicios' } },
        fill: { opacity: 1 },
      },
      barSeries: [],
      donutOptions: {
        chart: { type: 'donut', height: 350 },
        labels: [],
      },
      donutSeries: [],
      areaOptions: {
        chart: { type: 'area', height: 350 },
        stroke: { curve: 'smooth' },
        xaxis: { categories: [] },
        yaxis: { title: { text: 'Cantidad de equipos' } },
      },
      areaSeries: [],
      pieOptions: {
        chart: { type: 'pie', height: 350 },
        labels: [],
      },
      pieSeries: [],
    }
  },
  mounted() {
    this.fetchSparklineData()
    this.fetchBarData()
    this.fetchDonutData()
    this.fetchAreaData()
    this.fetchPieData()
  },
  methods: {
    async fetchSparklineData() {
      try {
        const resInstalaciones = await this.$axios.get('/tablero/sparkline-instalaciones')
        this.sparkSeries1 = [{ name: 'Instalaciones', data: resInstalaciones.data.map(item => ({ x: new Date(item.fecha).getTime(), y: item.cantidad })) }]
        this.sparkOptions1.title.text = resInstalaciones.data.reduce((sum, item) => sum + item.cantidad, 0).toString()

        const resSoportes = await this.$axios.get('/tablero/sparkline-soportes')
        this.sparkSeries2 = [{ name: 'Soportes', data: resSoportes.data.map(item => ({ x: new Date(item.fecha).getTime(), y: item.cantidad })) }]
        this.sparkOptions2.title.text = resSoportes.data.reduce((sum, item) => sum + item.cantidad, 0).toString()

        const resRetiros = await this.$axios.get('/tablero/sparkline-retiros')
        this.sparkSeries3 = [{ name: 'Retiros', data: resRetiros.data.map(item => ({ x: new Date(item.fecha).getTime(), y: item.cantidad })) }]
        this.sparkOptions3.title.text = resRetiros.data.reduce((sum, item) => sum + item.cantidad, 0).toString()
      } catch (error) {
        console.error(error)
      }
    },
    async fetchBarData() {
      try {
        const res = await this.$axios.get('/tablero/servicios-ciudad')
        this.barSeries = [{ name: 'Servicios', data: res.data.map(item => item.cantidad) }]
        this.barOptions.xaxis.categories = res.data.map(item => item.nombre)
      } catch (error) {
        console.error(error)
      }
    },
    async fetchDonutData() {
      try {
        const res = await this.$axios.get('/tablero/asignaciones-estado')
        this.donutSeries = res.data.map(item => item.cantidad)
      } catch (error) {
        console.error(error)
      }
    },
    async fetchAreaData() {
      try {
        const res = await this.$axios.get('/tablero/crecimiento-equipos-estado')
        this.areaSeries = [
          {
            name: 'Crecimiento',
            data: res.data.map(item => ({ x: item.fecha, y: item.cantidad })),
          },
        ]
        this.areaOptions.xaxis.categories = res.data.map(item => item.fecha)
      } catch (error) {
        console.error(error)
      }
    },
    async fetchPieData() {
      try {
        const res = await this.$axios.get('/tablero/cantidad-estado')
        this.pieSeries = res.data.map(item => item.cantidad)
        this.pieOptions.labels = res.data.map(item => item.estado)
      } catch (error) {
        console.error(error)
      }
    },
  },
}
</script>

<style scoped>
.box {
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.box1 {
  background-color: #e3f2fd;
}

.box2 {
  background-color: #f1f8e9;
}

.box3 {
  background-color: #fce4ec;
}
</style>
