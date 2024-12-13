<template>
  <v-container>
    <v-card>
      <v-row>
        <v-col cols="12">
          <v-card-title>
            Archivo Excel
            <v-spacer></v-spacer>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-subtitle>
            Seleccione un archivo Excel (.xlsx) para cargar la información.
          </v-card-subtitle>
          <v-spacer></v-spacer>
          <v-divider></v-divider>
          <v-card-text>
            <v-file-input v-model="file" accept=".csv, .xlsx, .xls" label="Archivo" placeholder="Seleccione un archivo"
              prepend-icon="mdi-file" show-size @change="handleFileUpload">
            </v-file-input>
            <v-select v-model="selectedColumns" :items="availableColumns" label="Seleccione las columnas" multiple chips
              @change="updateTable"></v-select>
          </v-card-text>
          <v-card-title>
            Tabla de Datos
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-text>
            <v-divider></v-divider>
            <div class="table-scroll">
              <v-data-table :headers="headers" :items="items" item-key="Numero">
                <template v-slot:item.Interpretacion="{ item }">
                  <v-text-field v-model="item.Interpretacion" dense outlined hide-details
                    class="mt-1 mb-1"></v-text-field>
                </template>
              </v-data-table>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" @click="regresar">
              <v-icon left>mdi-arrow-collapse-left</v-icon>
              Regresar
            </v-btn>
            <v-btn color="green darken-1" @click="checkForDuplicates">Cargar</v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-card>

    <v-dialog v-model="dialog" max-width="800px" persistent>
      <v-card>
        <v-card-title class="headline">Advertencia</v-card-title>
        <v-card-text>
          <pre>{{ messageDuplicates }}</pre>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" @click="dialog = false">Cancelar</v-btn>
          <v-btn color="green darken-1" @click="confirmUpload">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Loading dialog -->
    <v-dialog v-model="loadingDialog" max-width="320" persistent>
      <v-card>
        <v-card-title class="text-h6">Procesando datos...</v-card-title>
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

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" top>
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script>
import * as XLSX from 'xlsx';

export default {
  data: () => ({
    file: null,
    headers: [],
    items: [],
    messageDuplicates: '',
    selectedColumns: ["Tipo de Comercio", "Nombre de Comercio", "Tipo de Gestion", "Interpretacion"], // Valores por defecto
    availableColumns: [
      "CANAL", "Tipo de Comercio", "Nombre de Comercio", "ID TIENDA", "DIRECCIÓN", "CIUDAD", "DEPARTAMENTO",
      "NOMBRE DE CONTACTO", "TELÉFONO", "USUARIO", "TOKEN", "RTN", "TIPO DE TERMINAL", "Tipo de Gestion",
      "IMEI", "SN", "Latitud", "Lonjitud", "Compañía", "PIN", "PUK", "Power Bank SN", "Lectora S/N",
      "SCANNER", "QPOS", "Tipo de Problema", "Interpretacion"
    ],
    dialog: false,
    duplicates: false,
    // Añadimos estos campos para el snackbar
    snackbar: false,
    snackbarMessage: '',
    snackbarColor: '',  // 'success' o 'error' para diferenciar el tipo de mensaje
    loadingDialog: false,
  }),
  computed: {
    filteredItems() {
      // Filtra las columnas seleccionadas para mostrarlas en la tabla
      return this.items.map((item, index) => {
        const filteredItem = { Numero: index + 1 };
        this.selectedColumns.forEach(column => {
          filteredItem[column] = item[column] || '';
        });
        filteredItem.Equipos = item.Equipos; // Agregar "Equipos" al final
        return filteredItem;
      });
    }
  },
  methods: {
    clearFileInput() {
      this.file = null;       // Limpia el archivo seleccionado en el file-input
      this.items = [];        // Limpia los datos de la tabla
      this.headers = [];      // Limpia los encabezados de la tabla
    },
    handleFileUpload(file) {
      if (!file) {
        this.headers = [];
        this.items = [];
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        this.generateTable(jsonData);
      };

      reader.readAsArrayBuffer(file);
    },
    generateTable(data) {
      const allHeaders = data[0];
      this.headers = [
        { text: 'N°', value: 'Numero' },
        ...this.selectedColumns.map(header => {
          if (header === 'Interpretacion') {
            return {
              text: header,
              value: header,
              editable: true // Hace esta columna editable
            }
          }
          return { text: header, value: header }
        }),
        { text: 'Equipos', value: 'Equipos' }
      ];

      this.items = data.slice(1).filter(row => row.some(cell => cell)).map((row, index) => {
        const item = {
          Numero: index + 1,
          Interpretacion: '' // Inicializar campo editable
        };
        const equipos = [];

        row.forEach((cell, index) => {
          const header = allHeaders[index];
          if (this.availableColumns.includes(header)) {
            item[header] = cell;
          }

          // Condiciones para agregar equipos específicos
          if (header === 'TIPO DE TERMINAL' && cell) {
            equipos.push('D2 MINI');
          }
          if (header === 'TOKEN' && cell) {
            equipos.push('TOKEN');
          }
          if (header === 'Power Bank SN' && cell) {
            equipos.push('Power Bank');
          }
          if (header === 'Lectora S/N' && cell) {
            equipos.push('Lectora');
          }
          if (header === 'SCANNER' && cell) {
            equipos.push('SCANNER');
          }
          if (header === 'QPOS' && cell) {
            equipos.push('QPOS');
          }
        });

        item.Equipos = equipos.join(', ');
        return item;
      });
      this.updateTable();
    },
    updateTable() {
      this.headers = [
        { text: 'N°', value: 'Numero' },
        ...this.selectedColumns.map(column => {
          if (column === 'Interpretacion') {
            return {
              text: column,
              value: column,
              editable: true
            }
          }
          return { text: column, value: column }
        }),
        { text: 'Equipos', value: 'Equipos' }
      ];
    },
    checkForDuplicates() {
      const uniqueItems = new Set();
      this.duplicates = false; // Reset duplicates state
      const equi = [];
      let duplicateCount = 0;

      this.items.forEach((item, index) => {
        const identifier = (item['Tipo de Comercio'] || '')
          + (item['CANAL'] || '')
          + (item['USUARIO'] || '')
          + (item['Nombre de Comercio'] || '')
          + (item['TELÉFONO'] || '')
          + (item['CIUDAD'] || '')
          + (item['NOMBRE DE CONTACTO'] || '')
          + (item['Tipo de Gestion'] || '');

        // Skip empty identifiers
        if (identifier.trim() === '') {
          console.log('Empty identifier found, skipping.');
          return;
        }

        if (uniqueItems.has(identifier)) {
          this.duplicates = true; // Detect a real duplicate
          duplicateCount++;
          const equiposList = item['Equipos'] ? item['Equipos'] : "Sin equipos"; // Access the item's equipment
          const lis = `${duplicateCount}. Comercio: ${item['Nombre de Comercio']}, Servicio: ${item['Tipo de Gestion']}, Equipos: ${equiposList}`;
          equi.push(lis);
        } else {
          uniqueItems.add(identifier); // Add unique identifier to the Set
        }
      });

      // Warning message with the list of duplicates and their equipment
      this.messageDuplicates = `En este documento hay servicios duplicados.\nSe procederá a guardar los equipos duplicados como equipos de tipo comodín.\nLista de servicios duplicados:\n${equi.join('\n')}\n¿Está seguro? Estos cambios no pueden ser reversibles desde esta pantalla.`;

      if (this.duplicates) {
        this.dialog = true; // Only open the dialog if there are significant duplicates
      } else {
        this.dialog = false; // Ensure the dialog is closed if there are no duplicates
        this.uploadExcel();
      }
    },
    confirmUpload() {
      this.dialog = false;
      this.uploadExcel();
    },
    async uploadExcel() {
      if (!this.file) {
        this.showSnackbar("No se ha seleccionado ningún archivo.", "error");
        return;
      }

      this.loadingDialog = true;  // Show loading dialog
      const formData = new FormData();
      formData.append('file', this.file);

      // Añadir las interpretaciones al FormData
      const interpretaciones = this.items.map(item => ({
        rowIndex: item.Numero,
        interpretacion: item.Interpretacion
      }));
      formData.append('interpretaciones', JSON.stringify(interpretaciones));

      try {
        const response = await this.$axios.post('/excel/importar', formData);
        const message = response.data.message || "Archivo cargado exitosamente.";
        this.showSnackbar(message, "success");
        this.clearFileInput();
      } catch (error) {
        let errorMessage = "Error al cargar el archivo.";
        if (error.response) {
          if (error.response.status === 500) {
            errorMessage = error.response?.data?.message + ' ' + error.response?.data?.error || errorMessage;
          } else {
            errorMessage = error.response.data.message || errorMessage;
          }
        }
        this.showSnackbar(errorMessage, "error");
      } finally {
        this.loadingDialog = false;  // Hide loading dialog
      }
    },
    regresar() {
      this.$router.push('asignacion');
    },
    showSnackbar(message, color) {
      this.snackbarMessage = message;
      this.snackbarColor = color;
      this.snackbar = true;
    },
    onSuccess(message) {
      // Mostrar el snackbar con un mensaje de éxito
      this.showSnackbar(message, 'success');
    },
    onError(message) {
      // Mostrar el snackbar con un mensaje de error
      this.showSnackbar(message, 'error');
    },
  }
}
</script>

<style scoped>
.table-scroll {
  max-height: 400px;
  overflow-y: auto;
}

.checkbox-label .v-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
