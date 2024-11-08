<template>
  <v-card v-if="!isLoading && asignacion">
    <v-card-title>
      <span class="headline">Actualizar Asignación</span>
    </v-card-title>
    <v-card-text>
      <v-form ref="form" lazy-validation>
        <v-row>
          <v-col cols="6">
            <v-autocomplete v-model="asignacion.idComercio" :items="comercio" item-text="nombreComercio" item-value="id"
              label="Comercio" :rules="[rules.required]" required>
            </v-autocomplete>
          </v-col>
          <v-col cols="6">
            <v-select v-model="asignacion.idServicio" :items="servicio" item-text="nombre" item-value="id"
              label="Tipo Servicio" :rules="[rules.required]" required></v-select>
          </v-col>
          <v-col cols="12">
            <v-autocomplete v-model="asignacion.listEquiposIDs" :items="equiposCombinados" item-text="descripcionEquipo"
              item-value="id" label="Añadir/Quitar Equipos" multiple chips closable-chips :key="asignacion.idComercio"
              :rules="[rules.required]"></v-autocomplete>
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="asignacion.tipoProblema" label="Tipo de Problema"
              placeholder="Ej.  Cambio de D2 Mini"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="asignacion.interpretacion" label="Interpretación"
              placeholder="Ej.  Cambio de D2 Mini"></v-text-field>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red darken-1" text @click="closeDialog">Volver</v-btn>
      <v-btn color="green darken-1" text @click="actualizarAsignacion">Guardar</v-btn>
    </v-card-actions>
  </v-card>
  <v-alert v-else-if="!isLoading && !asignacion" type="error">No se pudo cargar la información del comercio.</v-alert>
</template>

<script>
export default {
  props: {
    idComercio: {
      type: Number,
      required: true
    },
    idEstado: {
      type: Number,
      required: true
    },
    idServicio: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      asignacion: null,
      isLoading: true, // Nuevo estado para controlar la carga
      comercio: [],
      servicio: [],
      equipo: [],
      estado: [],
      equiposCombinados: [],
      rules: {
        required: value => !!value || 'Requerido.',
      }
    }
  },
  async mounted() {
    try {
      await Promise.all([this.fetchAsignacion(), this.fetchComercio(), this.fetchServicio(), this.fetchEquipo(), this.fetchEstado()])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      this.isLoading = false; // Fin de la carga
    }
  },
  methods: {
    async fetchAsignacion() {
      try {
        const { data } = await this.$axios.get(
          `/asignacion/ces/${this.idComercio}/${this.idEstado}/${this.idServicio}`
        );
        if (data && data.length > 0) {
          this.asignacion = data[0];
          this.asignacion.listEquiposIDs = this.asignacion.listEquiposIDs.split(',').map(id => parseInt(id));
          if (!this.asignacion.listEquipos) {
            this.asignacion.listEquipos = '';
          }
          // Actualizar equipos combinados
          await this.fetchEquipo();
        } else {
          console.error('No se encontró la asignación');
        }
      } catch (error) {
        console.error('Error fetching asignacion:', error);
      }
    },
    fetchComercio() {
      this.$axios.get('/comercio')
        .then(response => { this.comercio = response.data; }).catch(error => { console.error('Error fetching comercio:', error); })
    },
    fetchServicio() {
      this.$axios.get('/servicio/sc').then(response => { this.servicio = response.data; }).catch(error => { console.error('Error fetching servicio:', error); })
    },
    async fetchEquipo() {
      try {
        const response = await this.$axios.get('/equipo/ea');
        const equiposDisponibles = response.data;
        if (this.asignacion && this.asignacion.listEquiposIDs) {
          const equiposAsignados = this.asignacion.listEquipos.split(',').map((descripcion, index) => {
            const id = this.asignacion.listEquiposIDs[index];
            return { id, descripcionEquipo: descripcion.trim() };
          });
          this.equiposCombinados = [
            ...equiposDisponibles.filter(equipo => !this.asignacion.listEquiposIDs.includes(equipo.id)).map(equipo => ({ id: equipo.id, descripcionEquipo: `${equipo.idTipoEquipo}: NS:${equipo.noSerie || equipo.noimei}` })),
            ...equiposAsignados
          ];
        } else {
          this.equiposCombinados = equiposDisponibles.map(equipo => ({
            id: equipo.id,
            descripcionEquipo: `${equipo.idTipoEquipo}: NS:${equipo.noSerie || equipo.noimei}`
          }));
        }
      } catch (error) {
        console.error('Error fetching equipo:', error);
      }
    },
    fetchEstado() {
      this.$axios.get('/estado').then(response => { this.estado = response.data; }).catch(error => { console.error('Error fetching estado:', error); })
    },
    closeDialog() {
      this.$emit('close');
    },
    async actualizarAsignacion() {
      if (this.$refs.form.validate()) {
        if (!this.asignacion.tipoProblema) {
          this.asignacion.tipoProblema = ' ';
        }
        if (!this.asignacion.interpretacion) {
          this.asignacion.interpretacion = ' ';
        }

        try {
          // Desestructuramos la asignación para crear el objeto con el campo 'nuevosEquipos'
          const { listEquiposIDs, idComercio, idServicio, ...restoAsignacion } = this.asignacion;

          // Creamos el nuevo objeto con el arreglo de nuevos equipos, idComercioAnterior e idServicioAnterior
          const asignacionActualizada = {
            ...restoAsignacion,
            nuevosEquipos: listEquiposIDs, // Enviamos los equipos seleccionados como 'nuevosEquipos'
            idComercioAnterior: this.idComercio, // Enviamos el idComercio anterior
            idServicioAnterior: this.idServicio, // Enviamos el idServicio anterior
            idComercio, // Enviamos el nuevo idComercio
            idServicio // Enviamos el nuevo idServicio
          };

          // Realizamos la petición PUT con el nuevo objeto
          const response = await this.$axios.put('/asignacion/t', asignacionActualizada);

          // Emitimos el evento de guardado con el mensaje del backend y cerramos el diálogo
          this.$emit('saved', response.data.message);
          this.closeDialog();

          // Actualizamos la lista de equipos si es necesario
          await this.fetchEquipo();
        } catch (error) {
          console.error('Error guardando la asignacion:', error.response ? error.response.data : error);
          const errorMessage = error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : 'Error guardando la asignación';
          // Emitimos el evento de error
          this.$emit('error', errorMessage);
        }
      }
    },
  },
  watch: {
    idComercio(newIdComercio) {
      if (newIdComercio) {
        this.isLoading = true;
        this.fetchAsignacion().finally(() => {
          this.isLoading = false;
        });
      }
    },
    idEstado(newIdEstado) {
      if (newIdEstado) {
        this.isLoading = true;
        this.fetchAsignacion().finally(() => {
          this.isLoading = false;
        });
      }
    },
    idServicio(newIdServicio) {
      if (newIdServicio) {
        this.isLoading = true;
        this.fetchAsignacion().finally(() => {
          this.isLoading = false;
        });
      }
    }
  }
};
</script>
