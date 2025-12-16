const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '../data/II. ESPACIAL/02_DATA_ATRIBUTOS/2.4.5.REGISTROS_INFRACCIONES_2024.csv');
const OUTPUT_FILE = path.join(__dirname, '../public/data/espacial/registros_infracciones.json');

console.log(`Processing Infracciones...`);

try {
    const workbook = XLSX.readFile(INPUT_FILE);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    const cleanNum = (val) => {
        if (typeof val === 'number') return val;
        if (!val) return 0;
        return parseFloat(val.toString().replace(/,/g, '')) || 0;
    };

    const entities = rawData.map(r => ({
        entidad: r['ÓRGANO SANCIONADOR'],
        infractores: cleanNum(r['N° INFRACTORES REGISTRADOS'])
    })).filter(r => r.entidad && r.entidad !== 'TOTAL');

    // Sort by Infractores desc
    entities.sort((a, b) => b.infractores - a.infractores);

    const kpi = {
        totalInfractores: entities.reduce((acc, r) => acc + r.infractores, 0),
        topEntidad: entities[0]?.entidad || 'N/A'
    };

    const output = {
        metadata: {
            title: "Registro de Infractores (2024)",
            source: "RNI - SERFOR (2024)",
            lastUpdated: new Date().toISOString().split('T')[0]
        },
        kpi,
        entities
    };

    const outDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`Success! Data written to ${OUTPUT_FILE}`);

} catch (error) {
    console.error("Error processing Infracciones:", error.message);
}
