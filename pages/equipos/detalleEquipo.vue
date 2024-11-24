<template>
  <v-card v-if="!isLoading && equipo">
    <v-card-title>
      <span class="headline">Detalles del Registro</span>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-select v-model="equipo.idTipoEquipo" :items="tipoEquipo" item-text="displayName" item-value="id" label="Equipos"
            readonly></v-select>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="equipo.noserie" label="N° de SERIE" readonly></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="equipo.noimei" label="N° de IMEI" readonly></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="equipo.pin" label="N° de PIN" readonly></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="equipo.puk" label="N° de PUK" readonly></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-select v-model="equipo.comodin" :items="comodinOptions" item-text="text" item-value="value" label="Comodín"
            readonly></v-select>
        </v-col>
        <v-col cols="6">
          <v-select v-model="equipo.estado" :items="estadoOptions" item-text="text" item-value="value" label="Estado"
            readonly></v-select>
        </v-col>
        <v-col cols="12">
          <v-text-field v-model="equipo.fechaLlegada" label="Fecha de Llegada" prepend-icon="mdi-calendar"
            readonly></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red darken-1" text @click="closeDialog">Volver</v-btn>
    </v-card-actions>
  </v-card>
  <v-alert v-else-if="!isLoading && !equipo" type="error">No se pudo cargar la información del equipo.</v-alert>
</template>

<script>
export default {
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      equipo: null,
      isLoading: true, // Nuevo estado para controlar la carga
      tipoEquipo: [],
      estadoOptions: [
        { text: "Equipo Bueno", value: true },
        { text: "Equipo Dañado", value: false },
      ],
      comodinOptions: [
        { text: "Sí", value: true },
        { text: "No", value: false },
      ],
    };
  },
  async mounted() {
    try {
      await Promise.all([this.fetchEquipo(), this.fetchTipoEquipo()]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      this.isLoading = false; // Fin de la carga
    }
  },
  methods: {
    async fetchEquipo() {
      try {
        const { data } = await this.$axios.get(`/equipo/${this.id}`);
        this.equipo = {
          ...data,
          fechaLlegada: data.fechaLlegada ? new Date(data.fechaLlegada).toISOString().slice(0, 10) : '',
        }
      } catch (error) {
        console.error('Error fetching equipo by ID:', error);
        this.equipo = null;
      }
    },
    fetchTipoEquipo() {
      this.$axios.get('/tipoequipo')
        .then(response => {
          this.tipoEquipo = response.data.map(item => ({
            ...item,
            displayName: `${item.nombre} - ${item.idProveedor}`  // Concatenamos nombre y proveedor
          }));
        })
        .catch(error => {
          console.error('Error fetching tipo de equipos:', error);
        });
    },
    closeDialog() {
      this.$emit('close');
    },
  },
  watch: {
    id(newId) {
      if (newId) {
        this.isLoading = true;
        this.fetchEquipo().finally(() => {
          this.isLoading = false;
        });
      }
    }
  }
};
</script>
