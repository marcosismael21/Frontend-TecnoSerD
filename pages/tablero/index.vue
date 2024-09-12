<template>
  <v-container>
    <v-row>
      <!-- Primer gráfico: Equipos por tipo -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Gráfica de Equipos por Tipo</v-card-title>
          <v-card-subtitle>
            <apexchart type="bar" :options="chartOptionsType" :series="chartSeriesType" />
          </v-card-subtitle>
        </v-card>
      </v-col>

      <!-- Segundo gráfico: Equipos por estado -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Gráfica de Equipos por Estado</v-card-title>
          <v-card-subtitle>
            <apexchart type="pie" :options="chartOptionsState" :series="chartSeriesState" />
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
      // Opciones y datos para el gráfico de tipos de equipos
      chartOptionsType: {
        chart: {
          type: 'bar',
          height: 350
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
          }
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: []
        },
        yaxis: {
          title: {
            text: 'Cantidad'
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val
            }
          }
        }
      },
      chartSeriesType: [],

      // Opciones y datos para el gráfico de estados de equipos
      chartOptionsState: {
        chart: {
          type: 'pie',
          height: 350
        },
        labels: ['En buen estado', 'En mal estado'],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      },
      chartSeriesState: []
    }
  },
  async mounted() {
    try {
      // Cargar datos para el gráfico de tipos de equipos
      const responseType = await this.$axios.get('/equipo/cantidad')
      this.updateChartType(responseType.data)

      // Cargar datos para el gráfico de estados de equipos
      const responseState = await this.$axios.get('/equipo/cantidad-estado')
      this.updateChartState(responseState.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  },
  methods: {
    updateChartType(data) {
      const categories = data.map(item => item.idTipoEquipo)
      const seriesData = data.map(item => item.cantidad)

      this.chartOptionsType.xaxis.categories = categories
      this.chartSeriesType = [{
        name: 'Cantidad',
        data: seriesData
      }]
    },
    updateChartState(data) {
      const seriesData = data.map(item => item.cantidad)

      this.chartSeriesState = seriesData
    }
  }
}
</script>

<style scoped>
/* Ajusta el tamaño de los gráficos si es necesario */
v-card {
  min-height: 400px;
}
</style>
