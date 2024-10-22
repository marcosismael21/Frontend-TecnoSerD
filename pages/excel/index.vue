<template>
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
                <v-file-input v-model="file" accept=".csv, .xlsx, .xls" label="Archivo"
                    placeholder="Seleccione un archivo" prepend-icon="mdi-file" show-size @change="handleFileUpload">
                </v-file-input>
                <v-alert v-if="alertMessage" :type="alertType" dismissible>
                    {{ alertMessage }}
                </v-alert>
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
                <v-btn color="green darken-1" @click="uploadExcel">Cargar</v-btn>
            </v-card-actions>
        </v-col>

    </v-card>
</template>

<script>
import * as XLSX from 'xlsx';

export default {
    data: () => ({
        file: null,
        headers: [],
        items: [],
        selectedColumns: [
            "CANAL",
            "Nombre de Comercio",
            "CIUDAD",
            "DIRECCIÓN",
            "NOMBRE DE CONTACTO",
            "Tipo de Gestion",
        ],
        alertMessage: '',
        alertType: '',
    }),
    methods: {
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
        uploadExcel() {
            if (!this.file) {
                this.setAlert("No se ha seleccionado ningún archivo.", "error");
                return;
            }

            const formData = new FormData();
            formData.append('file', this.file);

            this.$axios.post('/excel/importar', formData)
                .then(response => {
                    const message = response.data.message || "Archivo cargado exitosamente.";
                    this.setAlert(message, "success");
                })
                .catch(error => {
                    if (error.response) {
                        if (error.response.status === 500) {
                            const errorMessage = error.response?.data?.message + ' ' + error.response?.data?.error || "Error al cargar el archivo.";
                            this.setAlert(errorMessage, "error")
                        } else {
                            const errorMessage = error.response.data.message || "Error al cargar el archivo.";
                            this.setAlert(errorMessage, "error");
                        }
                    } else {
                        this.setAlert("Error al cargar el archivo.", "error");
                    }
                });
        },
        setAlert(message, type) {
            this.alertMessage = message;
            this.alertType = type;
        },
        regresar() {
            this.$router.push('asignacion');
        }
    }
}
</script>

<style scoped>
.table-scroll {
    max-height: 400px;
    /* Fija la altura de la tabla */
    overflow-y: auto;
    /* Permite el scroll vertical */
}
</style>
