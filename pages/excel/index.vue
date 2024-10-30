<template>
  <v-container>
    <v-card>
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
          <v-divider></v-divider>
          <div class="table-scroll">
            <v-data-table :headers="headers" :items="items"></v-data-table>
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

      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-card-title class="headline">Advertencia</v-card-title>
          <v-card-text>
            {{ messageDuplicates }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" @click="confirmUpload">OK</v-btn>
            <v-btn color="red darken-1" @click="dialog = false">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>


    </v-card>
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
    selectedColumns: [
      "Tipo de Comercio",
      "CANAL",
      "USUARIO",
      "Nombre de Comercio",
      "TELÉFONO",
      "CIUDAD",
      "NOMBRE DE CONTACTO",
      "Tipo de Gestion",
    ],
    dialog: false,
    duplicates: false,
    // Añadimos estos campos para el snackbar
    snackbar: false,
    snackbarMessage: '',
    snackbarColor: '',  // 'success' o 'error' para diferenciar el tipo de mensaje
  }),
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
      const selectedHeaders = this.selectedColumns.filter(col => allHeaders.includes(col));
      this.headers = [
        { text: 'N°', value: 'N°' },
        ...selectedHeaders.map(header => ({ text: header, value: header })),
        { text: 'Equipos', value: 'Equipos' }
      ];

      this.items = data.slice(1).map((row, rowIndex) => {
        const item = { 'N°': rowIndex + 1 };
        const equipos = [];

        row.forEach((cell, index) => {
          const header = allHeaders[index];
          if (this.selectedColumns.includes(header)) {
            item[header] = cell;
          }

          // Agregar equipos basados en las condiciones
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

        item['Equipos'] = equipos.join(', ');
        return item;
      });
    },
    checkForDuplicates() {
      const uniqueItems = new Set();
      this.duplicates = false; // Reiniciar el estado de duplicados
      const equi = []

      this.items.forEach(item => {
        const identifier = (item['Tipo de Comercio'] || '')
          + (item['CANAL'] || '')
          + (item['USUARIO'] || '')
          + (item['Nombre de Comercio'] || '')
          + (item['TELÉFONO'] || '')
          + (item['CIUDAD'] || '')
          + (item['NOMBRE DE CONTACTO'] || '')
          + (item['Tipo de Gestion'] || '');

        // Omitir identificadores vacíos
        if (identifier.trim() === '') {
          console.log('Identificador vacío encontrado, se omite.');
          return;
        }

        if (uniqueItems.has(identifier)) {
          this.duplicates = true; // Se detecta un duplicado real
          const lis = 'Comercio: ' + item['Nombre de Comercio'] + ' Ciudad: ' + item['CIUDAD'] + ' Servicio: ' + item['Tipo de Gestion'] + ' Equipos: '
          console.log('Duplicado encontrado:', identifier);
          equi.push(lis)
        } else {
          uniqueItems.add(identifier); // Añadir identificador único al Set
        }

      });

      this.messageDuplicates = `En este documento hay servicios duplicados,
                                se procederá a guardar los equipos duplicados como
                                equipos de tipo comodín.
                                Lista de servicios:${equi}
                                ¿Está seguro? Estos cambios no pueden ser reversibles
                                desde esta pantalla.`

      if (this.duplicates) {
        this.dialog = true; // Solo abrir el diálogo si hay duplicados significativos
        console.log('Hay duplicados, se abre el diálogo: ' + equi);
      } else {
        this.dialog = false; // Asegurar que el diálogo esté cerrado si no hay duplicados
        this.uploadExcel();
        console.log('No hay duplicados, se carga el archivo');
      }
    },
    confirmUpload() {
      this.dialog = false;
      this.uploadExcel();
    },
    uploadExcel() {
      if (!this.file) {
        this.showSnackbar("No se ha seleccionado ningún archivo.", "error");
        return;
      }

      const formData = new FormData();
      formData.append('file', this.file);

      this.$axios.post('/excel/importar', formData)
        .then((response) => {
          const message = response.data.message || "Archivo cargado exitosamente.";
          // Mostrar el mensaje que viene del backend en el snackbar
          this.showSnackbar(message, "success");
          this.clearFileInput(); // Limpia tanto el file-input como la tabla
        })
        .catch(error => {
          if (error.response) {
            if (error.response.status === 500) {
              const errorMessage = error.response?.data?.message + ' ' + error.response?.data?.error || "Error al cargar el archivo.";
              this.showSnackbar(errorMessage, "error");
            } else {
              const errorMessage = error.response.data.message || "Error al cargar el archivo.";
              this.showSnackbar(errorMessage, "error");
            }
          } else {
            this.showSnackbar("Error al cargar el archivo.", "error");
          }

          // Mostrar el mensaje de error del backend o un mensaje genérico si no está disponible
          const errorMessage = error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Error al cargar el archivo.";
          this.showSnackbar(errorMessage, "error");
        });
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
</style>
