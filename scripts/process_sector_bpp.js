const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Input
const INPUT_FILE = path.join(__dirname, '../data/III. SECTOR/3.5.1.AREAS_DECLARADAS_SUSTRAIDAS.csv');

// Output
const OUTPUT_FILE = path.join(__dirname, '../public/data/sector/bpp.json');

console.log(`Processing Sector BPP Areas...`);

try {
    const workbook = XLSX.readFile(INPUT_FILE);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    const cleanNum = (val) => {
         if (typeof val === 'number') return val;
         if (!val) return 0;
         return parseFloat(val.toString().replace(/,/g, '')) || 0;
    };

    const list = rawData.map(r => ({
        region: r['DEPARTAMENTO'],
        name: r['NOMBRE DEL BPP'],
        legal: r['NORMA DE CREACIÓN (2002)'],
        originalArea: cleanNum(r['ÁREA ORIGINAL DECLARADA (Ha)']),
        currentArea: cleanNum(r['ÁREA VIGENTE ACTUAL (Ha)']),
        sustractedArea: cleanNum(r['ÁREA SUSTRAÍDA / REDIMENSIONADA (Ha)']),
        status: r['ESTADO DE DISPONIBILIDAD'],
        observation: r['OBSERVACIÓN TÉCNICA']
    })).filter(r => r.name && r.originalArea > 0); // Filter out "Sin BPP" or empty

    // Sort by Sustracted Area Descending
    list.sort((a, b) => b.sustractedArea - a.sustractedArea);

    const kpi = {
        totalOriginal: list.reduce((acc, r) => acc + r.originalArea, 0),
        totalCurrent: list.reduce((acc, r) => acc + r.currentArea, 0),
        totalSustracted: list.reduce((acc, r) => acc + r.sustractedArea, 0),
        mostCriticalRegion: list[0]?.region || 'N/A'
    };
    
    // Derived KPI
    kpi.percentSustracted = (kpi.totalSustracted / kpi.totalOriginal) * 100;

    const output = {
        metadata: {
            title: "Bosques de Producción Permanente (BPP): Áreas Sustraídas",
            source: "SERFOR - Autoridad Forestal",
            lastUpdated: new Date().toISOString().split('T')[0]
        },
        kpi,
        list
    };

    const outDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`Success! Data written to ${OUTPUT_FILE}`);

} catch (error) {
    console.error("Error processing Sector BPP Areas:", error.message);
    process.exit(1);
}
