const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '../data/II. ESPACIAL/02_DATA_ATRIBUTOS/2.4.5.VIVEROS_SEMILLEROS.csv');
const OUTPUT_FILE = path.join(__dirname, '../public/data/espacial/registros_viveros.json');

console.log(`Processing Viveros...`);

try {
    const workbook = XLSX.readFile(INPUT_FILE);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    const list = rawData.map(r => ({
        id: r['ID_INTERNO'],
        nombre: r['NOMBRE_ESTABLECIMIENTO'],
        tipo: r['TIPO_INSTALACION'],
        titular: r['TITULAR_ADMINISTRADOR'],
        departamento: r['DEPARTAMENTO'],
        provincia: r['PROVINCIA'],
        distrito: r['DISTRITO'],
        especies: r['ESPECIES_PRINCIPALES'],
        capacidad: r['CAPACIDAD_ANUAL'] || 0,
        estado: r['ESTADO_OPERATIVO']
    })).filter(r => r.nombre);

    const output = {
        metadata: {
            title: "Viveros y Semilleros Forestales",
            source: "SERFOR / INIA (2024)",
            lastUpdated: new Date().toISOString().split('T')[0]
        },
        list
    };

    const outDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`Success! Data written to ${OUTPUT_FILE}`);

} catch (error) {
    console.error("Error processing Viveros:", error.message);
}
