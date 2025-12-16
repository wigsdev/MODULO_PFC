const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Inputs
const SUMMARY_FILE = path.join(__dirname, '../data/II. ESPACIAL/02_DATA_ATRIBUTOS/2.4.5.REGISTROS_REGENTES_2024.csv');
const DETAIL_FILE = path.join(__dirname, '../data/II. ESPACIAL/02_DATA_ATRIBUTOS/2.4.5.REGENTES_DETALLADO.csv');

// Output
const OUTPUT_FILE = path.join(__dirname, '../public/data/espacial/registros_regentes.json');

console.log(`Processing Regentes...`);

try {
    // 1. Process Summary Data (for Charts)
    const workbookSummary = XLSX.readFile(SUMMARY_FILE);
    const sheetSummary = workbookSummary.Sheets[workbookSummary.SheetNames[0]];
    const rawSummary = XLSX.utils.sheet_to_json(sheetSummary);

    const cleanNum = (val) => {
        if (typeof val === 'number') return val;
        if (!val) return 0;
        return parseFloat(val.toString().replace(/,/g, '')) || 0;
    };

    const regions = rawSummary.map(r => ({
        region: r['DEPARTAMENTO'],
        vigente: cleanNum(r['VIGENTE']),
        noVigente: cleanNum(r['NO VIGENTE']),
        indeterminada: cleanNum(r['INDETERMINADA'])
    })).filter(r => r.region);

    regions.sort((a, b) => b.vigente - a.vigente);

    const kpi = {
        totalVigente: regions.reduce((acc, r) => acc + r.vigente, 0),
        totalNoVigente: regions.reduce((acc, r) => acc + r.noVigente, 0),
        totalIndeterminada: regions.reduce((acc, r) => acc + r.indeterminada, 0), // Added KPI
        topRegion: regions[0]?.region || 'N/A'
    };

    // 2. Process Detailed Data (for Table)
    const workbookDetail = XLSX.readFile(DETAIL_FILE);
    const sheetDetail = workbookDetail.Sheets[workbookDetail.SheetNames[0]];
    const rawDetail = XLSX.utils.sheet_to_json(sheetDetail);

    // Filter columns to reduce JSON size if needed, but keeping key info
    const list = rawDetail.map(r => ({
        licencia: r['Nº DE LICENCIA'],
        nombre: r['NOMBRE DEL REGENTE'],
        estadoReniec: r['ESTADO EN RENIEC'],
        estadoLicencia: r['ESTADO ACTUAL  DE LA LICENCIA'], // Note double space in header if present
        departamento: r['DEPARTAMENTO'],
        tipo: r['TIPO DE REGENCIA'],
        categoria: r['CATEGORIA'],
        mencion: r['MENCIÓN EN']
    })).filter(r => r.nombre);

    const output = {
        metadata: {
            title: "Registro Nacional de Regentes Forestales",
            source: "SERFOR (2024)",
            lastUpdated: new Date().toISOString().split('T')[0]
        },
        kpi,
        regions,
        list // Added detailed list
    };

    const outDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`Success! Data written to ${OUTPUT_FILE}`);

} catch (error) {
    console.error("Error processing Regentes:", error.message);
    process.exit(1);
}
