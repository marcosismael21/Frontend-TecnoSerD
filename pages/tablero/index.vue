<template>
  <div>
    <apexchart type="bar" :options="basicOptions" :series="basicSeries" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      basicOptions: {
        chart: {
          type: 'bar'
        },
        xaxis: {
          categories: ['A', 'B', 'C', 'D', 'E']
        }
      },
      basicSeries: [
        {
          name: 'Series 1',
          data: [10, 20, 30, 40, 50]
        }
      ]
    }
  }
}
</script>
