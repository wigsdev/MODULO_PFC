const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '../data/IV. ECONOMIA/4.1.1.BD_ESPECIES_APROVECHADAS_PFC.csv');
const OUTPUT_FILE = path.join(__dirname, '../public/data/economia/especies_aprovechadas.json');

console.log('Processing Economia 4.1.1: Especies Aprovechadas...');

try {
    const workbook = XLSX.readFile(INPUT_FILE);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    const list = rawData.map(r => ({
        commonName: r['NOMBRE COMÚN'],
        scientificName: r['NOMBRE CIENTÍFICO'],
        type: r['TIPO'],
        region: r['REGIÓN PREDOMINANTE'],
        use: r['USO PRINCIPAL'],
        source: r['FUENTE DATO']
    })).filter(r => r.commonName);

    // Distribution by Type
    const typeCounts = {};
    list.forEach(i => {
        typeCounts[i.type] = (typeCounts[i.type] || 0) + 1;
    });

    const typeDistribution = Object.keys(typeCounts).map(k => ({
        name: k,
        value: typeCounts[k]
    }));

    const output = {
        metadata: {
            title: "Principales Especies Aprovechadas en PFC",
            source: "RNPF / Anuarios Forestales",
            lastUpdated: new Date().toISOString().split('T')[0]
        },
        kpi: {
            totalSpecies: list.length,
            nativeCount: typeCounts['Nativa'] || 0,
            exoticCount: typeCounts['Exótica'] || 0
        },
        typeDistribution,
        list
    };

    const outDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`Success! Data written to ${OUTPUT_FILE}`);

} catch (error) {
    console.error("Error processing 4.1.1:", error.message);
    process.exit(1);
}
