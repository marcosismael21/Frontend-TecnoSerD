<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center pe-2">
            <v-icon icon="mdi-account-circle"></v-icon> &nbsp; Lista de Equipos
            <v-spacer></v-spacer>
          </v-card-title>
          <v-spacer></v-spacer>
          <v-divider></v-divider>
          <v-card-subtitle>
            <v-row align="center">
              <v-col cols="9">
                <v-btn color="primary" @click="nuevoRegistro">
                  <v-icon left>mdi-plus</v-icon>
                  Registrar Equipo
                </v-btn>
                <v-btn color="primary" @click="nuevoEquipo">
                  <v-icon left>mdi-file-find</v-icon>
                  Crear Equipo
                </v-btn>
              </v-col>

              <v-col cols="3">
                <v-text-field v-model="search" density="compact" label="Buscar" prepend-inner-icon="mdi-magnify"
                  variant="outlined" hide-details single-line>
                </v-text-field>
              </v-col>
            </v-row>
          </v-card-subtitle>

          <v-divider></v-divider>

          <v-tabs v-model="tab" align-tabs="center" class="justify-center" color="deep-purple-accent-4">
            <v-tab :key="1">Equipos en buen estado</v-tab>
            <v-tab :key="2">Equipos en mal estado</v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <v-tab-item :key="1">
              <v-container fluid>
                <v-row>
                  <v-col>
                    <v-data-table :headers="headers" :items="equipoBueno" :search="search">
                      <template v-slot:item.nro="{ index }">
                        {{ index + 1 }}
                      </template>
                      <template v-slot:item.idTipoEquipo="{ item }">
                        {{ item.idTipoEquipo }}
                      </template>
                      <template v-slot:item.estado="{ item }">
                        {{ getEstadoText(item.estado) }}
                      </template>
                      <template v-slot:item.acciones="{ item }">
                        <v-btn icon @click="detalleEquipoBueno(item.id)">
                          <v-icon>mdi-eye</v-icon>
                        </v-btn>
                        <v-btn icon @click="editarEquipoBueno(item.id)">
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon @click="cambiarEstadoBueno(item.id)">
                          <v-icon>mdi-package-down</v-icon>
                        </v-btn>
                        <v-btn icon @click="eliminarEquipoBueno(item.id)">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </template>
                    </v-data-table>
                  </v-col>
                </v-row>
              </v-container>
            </v-tab-item>

            <v-tab-item :key="2">
              <v-container fluid>
                <v-row>
                  <v-col>
                    <v-data-table :headers="headers" :items="equipoMalo" :search="search">
                      <template v-slot:top>
                        <v-toolbar flat>
                          <v-spacer></v-spacer>
                          <v-col cols="12" align="right">
                            <v-btn color="primary" @click="activarReporte">
                              <v-icon left>mdi-file-outline</v-icon>
                              Generar Reporte
                            </v-btn>
                          </v-col>
                        </v-toolbar>
                      </template>
                      <template v-slot:item.nro="{ index }">
                        {{ index + 1 }}
                      </template>
                      <template v-slot:item.idTipoEquipo="{ item }">
                        {{ item.idTipoEquipo }}
                      </template>
                      <template v-slot:item.estado="{ item }">
                        {{ getEstadoText(item.estado) }}
                      </template>
                      <template v-slot:item.acciones="{ item }">
                        <v-btn icon @click="detalleEquipoMalo(item.id)">
                          <v-icon>mdi-eye</v-icon>
                        </v-btn>
                        <v-btn icon @click="editarEquipoMalo(item.id)">
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon @click="cambiarEstadoMalo(item.id)">
                          <v-icon>mdi-package-up</v-icon>
                        </v-btn>
                        <v-btn icon @click="eliminarEquipoMalo(item.id)">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </template>
                    </v-data-table>
                  </v-col>
                </v-row>
              </v-container>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogNuevoEquipo" max-width="600px" persistent>
      <nuevo-equipo @close="dialogNuevoEquipo = false" @saved="onSuccess" @error="onError"></nuevo-equipo>
    </v-dialog>

    <v-dialog v-model="dialogDetalleEquipo" max-width="600px" persistent>
      <detalle-equipo :id="equipoSeleccionado.id" @close="dialogDetalleEquipo = false"></detalle-equipo>
    </v-dialog>

    <v-dialog v-model="dialogEditarEquipo" max-width="600px" persistent>
      <editar-equipo :id="equipoSeleccionado.id" @close="dialogEditarEquipo = false" @saved="onSuccess"
        @error="onError"></editar-equipo>
    </v-dialog>

    <v-dialog v-model="dialogEditarEquipoMalo" max-width="600px" persistent>
      <editar-equipo-malo :id="equipoSeleccionado.id" @close="dialogEditarEquipoMalo = false" @saved="onSuccess"
        @error="onError"></editar-equipo-malo>
    </v-dialog>

    <!-- Dialog para eliminar -->
    <v-dialog v-model="dialogEliminarConfirm" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6">Confirmar Eliminación</v-card-title>
        <v-card-text>¿Estás seguro de que deseas eliminar este registro de equipo?</v-card-text>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn color="red darken-1" text @click="dialogEliminarConfirm = false">Cancelar</v-btn>
          <v-btn color="green darken-1" text @click="confirmarEliminacion">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogEliminar" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6">Eliminando equipo...</v-card-title>
        <v-card-subtitle>
          <v-row align="center" class="ma-0 pa-0">
            <v-col cols="12" class="d-flex align-center">
              <span>Por favor, espere...</span>
              <v-spacer></v-spacer>
              <v-progress-circular indeterminate color="primary" size="64" width="4" class="mr-4"></v-progress-circular>
            </v-col>
          </v-row>
        </v-card-subtitle>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogEliminarConfirmMalo" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6">Confirmar Eliminación</v-card-title>
        <v-card-text>¿Estás seguro de que deseas eliminar este registro de equipo?</v-card-text>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn color="red darken-1" text @click="dialogEliminarConfirmMalo = false">Cancelar</v-btn>
          <v-btn color="green darken-1" text @click="confirmarEliminacionMalo">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogEliminarMalo" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6">Eliminando equipo...</v-card-title>
        <v-card-subtitle>
          <v-row align="center" class="ma-0 pa-0">
            <v-col cols="12" class="d-flex align-center">
              <span>Por favor, espere...</span>
              <v-spacer></v-spacer>
              <v-progress-circular indeterminate color="primary" size="64" width="4" class="mr-4"></v-progress-circular>
            </v-col>
          </v-row>
        </v-card-subtitle>
      </v-card>
    </v-dialog>

    <!-- Modales para el cambio de estado -->

    <v-dialog v-model="dialogConfimacionBueno" max-width="450" persistent>
      <v-card>
        <v-card-title class="text-h6">Confirmar cambio de estado</v-card-title>
        <v-card-text>¿Estás seguro de que deseas cambiar el estado a este equipo?</v-card-text>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn color="red darken-1" text @click="dialogConfimacionBueno = false">Cancelar</v-btn>
          <v-btn color="green darken-1" text @click="confirmarCambioBueno">Confirmar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogCambioBueno" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6">Cambiando estado...</v-card-title>
        <v-card-subtitle>
          <v-row align="center" class="ma-0 pa-0">
            <v-col cols="12" class="d-flex align-center">
              <span>Por favor, espere...</span>
              <v-spacer></v-spacer>
              <v-progress-circular indeterminate color="primary" size="64" width="4" class="mr-4"></v-progress-circular>
            </v-col>
          </v-row>
        </v-card-subtitle>
      </v-card>
    </v-dialog>

    <!-- Modales para el cambio de estado -->

    <v-dialog v-model="dialogConfimacionMalo" max-width="450" persistent>
      <v-card>
        <v-card-title class="text-h6">Confirmar cambio de estado</v-card-title>
        <v-card-text>¿Estás seguro de que deseas cambiar el estado a este equipo?</v-card-text>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn color="red darken-1" text @click="dialogConfimacionMalo = false">Cancelar</v-btn>
          <v-btn color="green darken-1" text @click="confirmarCambioMalo">Confirmar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogCambioMalo" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6">Cambiando estado...</v-card-title>
        <v-card-subtitle>
          <v-row align="center" class="ma-0 pa-0">
            <v-col cols="12" class="d-flex align-center">
              <span>Por favor, espere...</span>
              <v-spacer></v-spacer>
              <v-progress-circular indeterminate color="primary" size="64" width="4" class="mr-4"></v-progress-circular>
            </v-col>
          </v-row>
        </v-card-subtitle>
      </v-card>
    </v-dialog>

    <!-- Reporte -->

    <v-dialog v-model="dialogReporte" max-width="450" persistent>
      <v-card>
        <v-card-title class="text-h6">Generar Reporte de Equipos</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6">
              <v-menu v-model="menuFechaInicial" :close-on-content-click="false" transition="scale-transition" offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="fechaInicial" label="Fecha Inicial" prepend-icon="mdi-calendar" readonly
                    v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="fechaInicial" @input="menuFechaInicial = false"></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" sm="6">
              <v-menu v-model="menuFechaFinal" :close-on-content-click="false" transition="scale-transition" offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="fechaFinal" label="Fecha Final" prepend-icon="mdi-calendar" readonly
                    v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="fechaFinal" @input="menuFechaFinal = false"></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dialogReporte = false">Cancelar</v-btn>
          <v-btn color="green darken-1" text @click="generarReporte(fechaInicial, fechaFinal)"
            :disabled="!fechaInicial || !fechaFinal">
            Generar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" top>
      {{ snackbarMessage }}
    </v-snackbar>

  </v-container>
</template>

<script>

import NuevoEquipo from "~/pages/equipos/crearEquipo.vue"
import DetalleEquipo from "~/pages/equipos/detalleEquipo.vue"
import EditarEquipo from '~/pages/equipos/editarEquipo.vue'
import EditarEquipoMalo from '~/pages/equipos/editarEquipoMalo.vue'

import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default {
  async asyncData({ $axios }) {
    try {
      const b = await $axios.get("/equipo/es/1")
      const m = await $axios.get("/equipo/es/0")

      return { equipoBueno: b.data, equipoMalo: m.data }
    } catch (error) {
      console.error("Error fetching equipos:", error)
      return { equipoBueno: [], equipoMalo: [] }
    }
  },
  watch: {
    $route(to, from) {
      if (to.fullPath !== from.fullPath) {
        this.loadEquipoBueno()
        this.loadEquipoMalo()
      }
    },
  },
  data() {
    return {
      tab: 0, // inicializamos el tab en 0
      search: "",
      equipoBueno: [],
      equipoMalo: [],
      headers: [
        { text: 'N°', value: 'nro' },
        { text: "Nombre", value: "idTipoEquipo" },
        { text: "N° Serie", value: "noserie" },
        { text: "Estado", value: "estado" },
        { text: "Acciones", value: "acciones" },
      ],
      estadoOptions: [
        { text: "Equipo Bueno", value: 1 },
        { text: "Equipo Dañado", value: 0 },
      ],
      comodinOptions: [
        { text: "Sí", value: 1 },
        { text: "No", value: 0 },
      ],
      //variables para activar los modales
      dialogNuevoEquipo: false,
      dialogEditarEquipo: false,
      dialogEditarEquipoMalo: false,
      dialogDetalleEquipo: false,
      dialogEliminar: false,
      dialogEliminarConfirm: false, // Nuevo estado para la confirmación de eliminación
      dialogEliminarConfirmMalo: false,
      dialogEliminarMalo: false,
      equipoSeleccionado: false,
      dialogCambioBueno: false,
      dialogCambioMalo: false,
      dialogConfimacionBueno: false,
      dialogConfimacionMalo: false,
      //dialog de reportes
      dialogReporte: false,
      fechaInicial: '',
      fechaFinal: '',
      menuFechaInicial: false,
      menuFechaFinal: false,
      // Añadimos estos campos para el snackbar
      snackbar: false,
      snackbarMessage: '',
      snackbarColor: '',  // 'success' o 'error' para diferenciar el tipo de mensaje
    };
  },
  methods: {
    async loadEquipoBueno() {
      try {
        const { data } = await this.$axios.get("/equipo/es/1");
        this.equipoBueno = data;
      } catch (error) {
        console.error("Error fetching equipo:", error);
        this.equipoBueno = []
      }
    },
    async loadEquipoMalo() {
      try {
        const { data } = await this.$axios.get("/equipo/es/0")
        this.equipoMalo = data
      } catch (error) {
        console.error("Error fetching equipo:", error);
        this.equipoMalo = []
      }
    },
    getEstadoText(estado) {
      const estadoOption = this.estadoOptions.find((option) => option.value === estado)
      return estadoOption ? estadoOption.text : ""
    },
    getComodinText(comodin) {
      const comodinOptions = this.comodinOptions.find((option) => option.value === comodin)
      return comodinOptions ? comodinOptions.text : ""
    },
    nuevoRegistro() {
      this.dialogNuevoEquipo = true
    },
    detalleEquipoBueno(id) {
      this.equipoSeleccionado = this.equipoBueno.find((e) => e.id === id) || {}
      this.dialogDetalleEquipo = true
    },
    detalleEquipoMalo(id) {
      this.equipoSeleccionado = this.equipoMalo.find((e) => e.id === id) || {}
      this.dialogDetalleEquipo = true
    },
    editarEquipoBueno(id) {
      this.equipoSeleccionado = this.equipoBueno.find((e) => e.id === id) || {}
      this.dialogEditarEquipo = true
    },
    editarEquipoMalo(id) {
      this.equipoSeleccionado = this.equipoMalo.find((e) => e.id === id) || {}
      this.dialogEditarEquipoMalo = true
    },
    cambiarEstadoBueno(id) {
      this.equipoSeleccionado = this.equipoBueno.find((e) => e.id === id) || {}
      this.dialogConfimacionBueno = true
    },
    confirmarCambioBueno() {
      this.dialogConfimacionBueno = false;
      this.dialogCambioBueno = true;  // Mostrar el modal de carga
      this.$axios
        .patch(`/equipo/cs/${this.equipoSeleccionado.id}`, { estado: false })
        .then((response) => {
          const equipo = this.equipoBueno.find(equipo => equipo.id === this.equipoSeleccionado.id);
          if (equipo) {
            equipo.estado = 0;
            this.equipoBueno = this.equipoBueno.filter(equipos => equipos.id !== this.equipoSeleccionado.id);
            this.equipoMalo.push(equipo);
          }
          // Mostrar el mensaje que viene del backend en el snackbar
          this.showSnackbar(response.data.message, "success");
        })
        .catch((error) => {
          // Mostrar el mensaje de error del backend o un mensaje genérico si no está disponible
          const errorMessage = error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Error cambiando el equipo";
          this.showSnackbar(errorMessage, "error");
        })
        .finally(() => {
          setTimeout(() => {
            this.dialogCambioBueno = false;  // Cerrar el modal de carga después de 2 segundos
          }, 2000);
        });
    },
    activarReporte() {
      this.dialogReporte = true
    },
    async generarReporte(fechaInicial, fechaFinal) {
      try {
        const { data } = await this.$axios.get(`reporte/equipo-mal-estado/${fechaInicial}/${fechaFinal}`)

        this.showSnackbar("Generando reporte completo.", 'success');

        const doc = new jsPDF({ orientation: 'landscape' })

        // Añadir el logo en tamaño grande
        const logo = new Image()
        logo.src = '/Logo.jpg'
        const logoWidth = 100 // Ancho ajustado del logo
        const logoHeight = 40 // Alto ajustado del logo
        const logoX = 14 // Posición X del logo
        const logoY = 10 // Posición Y del logo
        doc.addImage(logo, 'JPEG', logoX, logoY, logoWidth, logoHeight)

        // Posicionar la información de la empresa a la derecha del logo
        const textStartX = logoX + logoWidth + 20 // Posición X de los textos después del logo
        const textStartY = logoY + 12 // Posición Y inicial de los textos

        doc.setFontSize(13)
        doc.setFont('helvetica', 'bold')
        doc.text('TECNOLOGÍA Y SERVICIOS DIVERSOS - TECNOSERD', textStartX, textStartY)

        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text('Oficina:', textStartX, textStartY + 8)
        doc.setFont('helvetica', 'normal')
        doc.text('OFICINA PRINCIPAL', textStartX + 25, textStartY + 8)

        doc.setFont('helvetica', 'bold')
        doc.text('Teléfono:', textStartX, textStartY + 16)
        doc.setFont('helvetica', 'normal')
        doc.text('+504 9976-3205', textStartX + 25, textStartY + 16)

        doc.setFont('helvetica', 'bold')
        doc.text('Email:', textStartX, textStartY + 24)
        doc.setFont('helvetica', 'normal')
        doc.text('jorcer27@gmail.com', textStartX + 25, textStartY + 24)

        doc.setFont('helvetica', 'bold')
        doc.text('Dirección:', textStartX, textStartY + 32)
        doc.setFont('helvetica', 'normal')
        doc.text('COL. PALMIRA 3RA AVE ENTRE 4TA Y 5TA CALLE CASA #415', textStartX + 25, textStartY + 32,)

        // Añadir el título del reporte debajo del logo y la información
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text('Reporte sobre Equipos en Mal Estado', 14, textStartY + 38)

        let startY = textStartY + 50

        // Headers
        const comercioHeaders = [
          'N°', 'Nombre de Comercio', 'Nombre de Contacto', 'N° Tienda',
          'N° Usuario', 'Dirección', 'Ciudad', 'Tipo Comercio', 'Fecha'
        ]
        const equipoHeaders = ['Estado', 'Equipos']

        // Iterar sobre cada comercio
        data.forEach((item, index) => {
          // Verificar si necesitamos una nueva página
          if (startY > doc.internal.pageSize.height - 60) {
            doc.addPage()
            startY = 20
          }

          // Información del comercio
          doc.autoTable({
            head: [comercioHeaders],
            body: [[
              index + 1,
              item.nombreComercio,
              item.nombreContacto,
              item.numTienda || 'N/A',
              item.numUsuario || 'N/A',
              item.direccion,
              item.ciudad,
              item.tipoComercio,
              item.fecha_actualizacion
            ]],
            startY: startY,
            styles: {
              fontSize: 10,
              cellPadding: 2
            },
            headStyles: {
              fillColor: [240, 240, 240],
              fontSize: 10
            },
            theme: 'plain'
          })

          startY = doc.autoTable.previous.finalY + 5

          // Tabla de equipos
          const equiposRows = []
          if (item.equipos_buen_estado) {
            equiposRows.push(['Buen Estado', item.equipos_buen_estado])
          }
          if (item.equipos_danados) {
            equiposRows.push(['Dañado', item.equipos_danados])
          }

          if (equiposRows.length > 0) {
            doc.autoTable({
              head: [equipoHeaders],
              body: equiposRows,
              startY: startY,
              styles: {
                fontSize: 10,
                cellPadding: 2
              },
              headStyles: {
                fillColor: [220, 220, 220],
                fontSize: 10
              },
              theme: 'plain'
            })

            startY = doc.autoTable.previous.finalY + 15
          }
        })

        // Numeración de páginas
        const pageCount = doc.internal.getNumberOfPages()
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i)
          doc.setFontSize(10)
          doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' })
        }

        // Guardar el PDF con fecha y hora
        const fechaActual = new Date().toLocaleDateString().replace(/\//g, '-')
        const now = new Date()
        let horas = now.getHours() % 12 || 12
        const minutos = now.getMinutes().toString().padStart(2, '0')
        const ampm = now.getHours() >= 12 ? 'PM' : 'AM'
        const horaActual = `${horas}.${minutos}${ampm}`

        doc.save(`reporte_equipos_estado-${fechaActual}-${horaActual}.pdf`)

        this.dialogReporte = false
        this.menuFechaInicial = false
        this.menuFechaFinal = false

      } catch (error) {
        console.error('Error generating report:', error)
        this.showSnackbar('Error generando el reporte', 'error')
      }
    },
    showSnackbar(message, color) {
      this.snackbarMessage = message;
      this.snackbarColor = color;
      this.snackbar = true;
    },
    onSuccess(message) {
      // Mostrar el snackbar con un mensaje de éxito
      this.showSnackbar(message, 'success');
      this.fetchEquiposBueno()
      this.fetchEquiposMalo()
    },
    onError(message) {
      // Mostrar el snackbar con un mensaje de error
      this.showSnackbar(message, 'error');
    },
    cambiarEstadoMalo(id) {
      this.equipoSeleccionado = this.equipoMalo.find((e) => e.id === id) || {}
      this.dialogConfimacionMalo = true
    },
    confirmarCambioMalo() {
      this.dialogConfimacionMalo = false;
      this.dialogCambioMalo = true;  // Mostrar el modal de carga
      this.$axios
        .patch(`/equipo/cs/${this.equipoSeleccionado.id}`, { estado: true })
        .then((response) => {
          const equipo = this.equipoMalo.find(equipo => equipo.id === this.equipoSeleccionado.id);
          if (equipo) {
            equipo.estado = 1;
            this.equipoMalo = this.equipoMalo.filter(equipos => equipos.id !== this.equipoSeleccionado.id);
            this.equipoBueno.push(equipo);
          }
          // Mostrar el mensaje que viene del backend en el snackbar
          this.showSnackbar(response.data.message, "success");
        })
        .catch((error) => {
          // Mostrar el mensaje de error del backend o un mensaje genérico si no está disponible
          const errorMessage = error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Error cambiando el equipo";
          this.showSnackbar(errorMessage, "error");
        })
        .finally(() => {
          setTimeout(() => {
            this.dialogCambioMalo = false;  // Cerrar el modal de carga después de 2 segundos
          }, 2000);
        });
    },
    eliminarEquipoBueno(id) {
      this.equipoSeleccionado = this.equipoBueno.find((e) => e.id === id) || {};
      this.dialogEliminarConfirm = true;  // Mostrar el modal de confirmación
    },
    confirmarEliminacion() {
      this.dialogEliminarConfirm = false;
      this.dialogEliminar = true;  // Mostrar el modal de carga

      this.$axios
        .delete(`/equipo/${this.equipoSeleccionado.id}`)
        .then((response) => {
          this.equipoBueno = this.equipoBueno.filter((equipoBueno) => equipoBueno.id !== this.equipoSeleccionado.id);

          // Mostrar el mensaje que viene del backend en el snackbar
          this.showSnackbar(response.data.message, "success");
        })
        .catch((error) => {
          // Mostrar el mensaje de error del backend o un mensaje genérico si no está disponible
          const errorMessage = error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Error eliminando el equipo";
          this.showSnackbar(errorMessage, "error");
        })
        .finally(() => {
          setTimeout(() => {
            this.dialogEliminar = false;  // Cerrar el modal de carga después de 3 segundos
          }, 2000);
        });
    },
    eliminarEquipoMalo(id) {
      this.equipoSeleccionado = this.equipoMalo.find((e) => e.id === id) || {};
      this.dialogEliminarConfirmMalo = true;  // Mostrar el modal de confirmación
    },
    confirmarEliminacionMalo() {
      this.dialogEliminarConfirmMalo = false;
      this.dialogEliminarMalo = true;  // Mostrar el modal de carga

      this.$axios
        .delete(`/equipo/${this.equipoSeleccionado.id}`)
        .then(() => {
          this.equipoMalo = this.equipoMalo.filter((equipo) => equipo.id !== this.equipoSeleccionado.id);

          // Mostrar el mensaje que viene del backend en el snackbar
          this.showSnackbar(response.data.message, "success");
        })
        .catch((error) => {
          // Mostrar el mensaje de error del backend o un mensaje genérico si no está disponible
          const errorMessage = error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Error eliminando el equipo";
          this.showSnackbar(errorMessage, "error");
        })
        .finally(() => {
          setTimeout(() => {
            this.dialogEliminarMalo = false;  // Cerrar el modal de carga después de 3 segundos
          }, 2000);
        });
    },
    fetchEquiposBueno() {
      this.$axios
        .get("/equipo/es/1")
        .then((response) => {
          this.equipoBueno = response.data;
        })
        .catch((error) => {
          console.error("Error fetching equipo:", error);
        });
    },
    fetchEquiposMalo() {
      this.$axios
        .get("/equipo/es/0")
        .then((response) => {
          this.equipoMalo = response.data;
        })
        .catch((error) => {
          console.error("Error fetching equipo:", error);
        });
    },
    nuevoEquipo() {
      this.$router.push('tipoEquipo')
    }
  },
  components: {
    NuevoEquipo,
    DetalleEquipo,
    EditarEquipo,
    EditarEquipoMalo
  },
};
</script>

<style scoped>
.justify-center {
  display: flex;
  justify-content: center;
}
</style>
