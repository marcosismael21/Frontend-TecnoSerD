<template>
  <v-container>
    <!-- 3 Sparkline Cards -->
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

    <!-- Gráficos de Barras y Donut -->
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

    <!-- Gráficos de Área y Pie -->
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
        stroke: { curve: 'smooth', width: 2 },
        fill: { opacity: 0.3, type: 'solid' },
        xaxis: { type: 'datetime', crosshairs: { width: 1 } },
        tooltip: {
          x: { format: 'dd/MM/yyyy' }, ixed: { enabled: true, position: 'topRight' },
          y: { formatter: function (value) { return value } }
        },
        title: { text: '0', offsetX: 0, style: { fontSize: '24px', fontWeight: 'bold' } },
        subtitle: { text: 'Instalaciones', offsetX: 0, style: { fontSize: '14px' } },
        colors: ['#1976D2']
      },
      sparkSeries1: [],
      sparkOptions2: {
        chart: { type: 'area', height: 160, sparkline: { enabled: true } },
        stroke: { curve: 'smooth', width: 2 },
        fill: { opacity: 0.3, type: 'solid' },
        xaxis: { type: 'datetime', crosshairs: { width: 1 } },
        tooltip: {
          x: { format: 'dd/MM/yyyy' }, ixed: { enabled: true, position: 'topRight' },
          y: { formatter: function (value) { return value } }
        },
        title: { text: '0', offsetX: 0, style: { fontSize: '24px', fontWeight: 'bold' } },
        subtitle: { text: 'Soportes', offsetX: 0, style: { fontSize: '14px' } },
      },
      sparkSeries2: [],
      sparkOptions3: {
        chart: { type: 'area', height: 160, sparkline: { enabled: true } },
        stroke: { curve: 'smooth', width: 2 },
        fill: { opacity: 0.3, type: 'solid' },
        xaxis: { type: 'datetime', crosshairs: { width: 1 } },
        tooltip: {
          x: { format: 'dd/MM/yyyy' }, ixed: { enabled: true, position: 'topRight' },
          y: { formatter: function (value) { return value } }
        },
        title: { text: '0', offsetX: 0, style: { fontSize: '24px', fontWeight: 'bold' } },
        subtitle: { text: 'Retiros', offsetX: 0, style: { fontSize: '14px' } },
      },
      sparkSeries3: [],
      barOptions: {
        chart: {
          type: 'bar',
          height: 400,
          stacked: true
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val || ''
          }
        },
        xaxis: {
          categories: [], // Aquí irán los nombres de las ciudades
          labels: {
            rotate: -45,
            style: {
              fontSize: '12px'
            }
          }
        },
        yaxis: {
          title: {
            text: 'Cantidad de servicios'
          }
        },
        tooltip: {
          shared: true,
          intersect: false,
          y: {
            formatter: function (val, opts) {
              return `${val}`
            }
          }
        },
        legend: {
          position: 'top',
          horizontalAlign: 'center'
        },
        colors: ['#2196F3', '#4CAF50', '#FFC107'] // Azul para Instalación, Verde para Retiro, Amarillo para Soporte
      },
      barSeries: [],
      donutOptions: {
        chart: {
          type: 'donut',
          height: 350
        },
        labels: [], // Aquí irán los nombres de los estados
        tooltip: {
          y: {
            formatter: function (val) {
              return val
            }
          }
        },
        legend: {
          position: 'right',
          offsetY: 0,
          height: 230,
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val.toFixed(1) + '%'
          }
        },
        colors: ['#FF9800', '#2196F3', '#4CAF50', '#F44336'] // Colores para los estados
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
        // Instalaciones
        const resInstalaciones = await this.$axios.get('/tablero/sparkline-instalaciones')
        if (resInstalaciones.data && resInstalaciones.data.length > 0) {
          this.sparkOptions1 = {
            ...this.sparkOptions1,
            title: {
              ...this.sparkOptions1.title,
              text: resInstalaciones.data[0].cantidad.toString()
            }
          }
          this.sparkSeries1 = [{
            name: 'Instalaciones',
            data: [{
              x: new Date(resInstalaciones.data[0].fecha).getTime(),
              y: resInstalaciones.data[0].cantidad
            }]
          }]
        }

        // Soportes
        const resSoportes = await this.$axios.get('/tablero/sparkline-soportes')
        if (resSoportes.data && resSoportes.data.length > 0) {
          this.sparkOptions2 = {
            ...this.sparkOptions2,
            title: {
              ...this.sparkOptions2.title,
              text: resSoportes.data[0].cantidad.toString()
            }
          }
          this.sparkSeries2 = [{
            name: 'Soportes',
            data: [{
              x: new Date(resSoportes.data[0].fecha).getTime(),
              y: resSoportes.data[0].cantidad
            }]
          }]
        }

        // Retiros
        const resRetiros = await this.$axios.get('/tablero/sparkline-retiros')
        if (resRetiros.data && resRetiros.data.length > 0) {
          this.sparkOptions3 = {
            ...this.sparkOptions3,
            title: {
              ...this.sparkOptions3.title,
              text: resRetiros.data[0].cantidad.toString()
            }
          }
          this.sparkSeries3 = [{
            name: 'Retiros',
            data: [{
              x: new Date(resRetiros.data[0].fecha).getTime(),
              y: resRetiros.data[0].cantidad
            }]
          }]
        }
      } catch (error) {
        console.error(error)
      }
    },
    async fetchBarData() {
      try {
        const res = await this.$axios.get('/tablero/servicios-ciudad')

        // Obtener ciudades únicas manteniendo el orden original
        const ciudades = res.data.reduce((acc, item) => {
          if (!acc.includes(item.nombre)) {
            acc.push(item.nombre)
          }
          return acc
        }, [])

        // Obtener servicios únicos
        const servicios = ['Instalación', 'Retiro', 'Soporte Técnico']

        // Crear series para cada tipo de servicio
        const series = servicios.map(servicio => ({
          name: servicio,
          data: ciudades.map(ciudad => {
            const item = res.data.find(d => d.nombre === ciudad && d.servicio === servicio)
            return item ? item.cantidad : 0
          })
        }))

        this.barOptions = {
          ...this.barOptions,
          xaxis: {
            ...this.barOptions.xaxis,
            categories: ciudades
          }
        }
        this.barSeries = series

      } catch (error) {
        console.error(error)
      }
    },
    async fetchDonutData() {
      try {
        const res = await this.$axios.get('/tablero/asignaciones-estado')
        this.donutSeries = res.data.map(item => item.cantidad)
        this.donutOptions = {
          ...this.donutOptions,
          labels: res.data.map(item => item.estado)
        }
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
