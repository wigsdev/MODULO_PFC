const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '../data/II. ESPACIAL/02_DATA_ATRIBUTOS/2.4.5.BD_REGISTROS_PF_2024.csv');
const OUTPUT_FILE = path.join(__dirname, '../public/data/espacial/registros_plantaciones.json');

console.log(`Processing Registros Plantaciones...`);

try {
    const workbook = XLSX.readFile(INPUT_FILE);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    const cleanNum = (val) => {
        if (typeof val === 'number') return val;
        if (!val) return 0;
        return parseFloat(val.toString().replace(/,/g, '')) || 0;
    };

    const regions = rawData.map(r => ({
        region: r['REGIÓN'],
        certificados: cleanNum(r['N° CERTIFICADOS']),
        area: cleanNum(r['ÁREA TOTAL (Ha)']),
        dinamica: r['PERFIL PREDOMINANTE (Dinámica)']
    })).filter(r => r.region && r.area > 0);

    // Sort by Total Area desc
    regions.sort((a, b) => b.area - a.area);

    const kpi = {
        totalArea: regions.reduce((acc, r) => acc + r.area, 0),
        totalCertificados: regions.reduce((acc, r) => acc + r.certificados, 0),
        topRegion: regions[0]?.region || 'N/A'
    };

    const output = {
        metadata: {
            title: "Registro Nacional de Plantaciones (2024)",
            source: "RNPF - SERFOR (2024)",
            lastUpdated: new Date().toISOString().split('T')[0]
        },
        kpi,
        regions
    };

    const outDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`Success! Data written to ${OUTPUT_FILE}`);

} catch (error) {
    console.error("Error processing Registros Plantaciones:", error.message);
}
