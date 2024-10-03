<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-col cols="12">
                        <v-card-title class="d-flex align-center pe-2">
                            Archivo Excel
                            <v-spacer></v-spacer>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-subtitle>
                            Seleccione un archivo Excel (.xlsx) para cargar la información.
                        </v-card-subtitle>
                        <v-spacer></v-spacer>
                        <v-card-text>
                            <v-file-input v-model="file" accept=".csv, .xlsx, .xls" label="Archivo"
                                placeholder="Seleccione un archivo" prepend-icon="mdi-file" show-size
                                @change="handleFileUpload"></v-file-input>

                            <v-data-table :headers="headers" :items="items"></v-data-table>
                        </v-card-text>
                    </v-col>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="uploadExcel">Cargar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import * as XLSX from 'xlsx';
import axios from 'axios';

export default {
    data: () => ({
        file: null,
        headers: [],
        items: [],
        selectedColumns: [
            "CANAL",
            "Nombre de Comercio",
            "DIRECCIÓN",
            "CIUDAD",
            "DEPARTAMENTO",
            "TELÉFONO",
            "Tipo de Gestion",
            "Tipo de Problema",
            "EQUIPOS"
        ],
        rules: [
            value => {
                return !value
                    || !value.length
                    || value.size < 2000000
                    || 'El archivo debe ser menor a 2 MB!'
            },
        ],
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
            this.headers = [{ text: 'N°', value: 'N°' }, ...selectedHeaders.map(header => ({ text: header, value: header })), { text: 'Equipos', value: 'Equipos' }];

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

                    // Condición para "Tipo de Problema"
                    if (header === 'Tipo de Problema' && !cell) {
                        item[header] = 'sin descripcion';
                    }
                });

                item['Equipos'] = equipos.join(', ');
                return item;
            });
        },
        uploadExcel() {
            if (!this.file) {
                console.error("No se ha seleccionado ningún archivo.");
                return;
            }

            const formData = new FormData();
            formData.append('file', this.file);

            this.$axios.post('/excel/importar', formData)
                .then(response => {
                    console.log("Archivo cargado exitosamente:", response.data);
                    // Aquí puedes manejar la respuesta después de cargar el archivo
                })
                .catch(error => {
                    console.error("Error al cargar el archivo:", error);
                });
        }
    }
}
</script>
