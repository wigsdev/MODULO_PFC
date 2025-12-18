const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '../data/IV. ECONOMIA/4.1.5.BD_CTP_REGISTRO_SNIFFS.csv');
const OUTPUT_FILE = path.join(__dirname, '../public/data/economia/industria.json');

console.log('Processing Economia 4.1.3: Industria CTP...');

try {
    const workbook = XLSX.readFile(INPUT_FILE);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    // 1. By Department
    const deptCounts = {};
    rawData.forEach(r => {
        const d = r.Departamento || 'Desconocido';
        deptCounts[d] = (deptCounts[d] || 0) + 1;
    });

    const byDept = Object.keys(deptCounts).map(k => ({
        name: k,
        value: deptCounts[k]
    })).sort((a, b) => b.value - a.value);

    // 2. By Giro (Activity Type)
    const giroCounts = {};
    rawData.forEach(r => {
        let g = r.Giro || 'Otros';
        // Normalize common terms
        if (g.includes('ASERRADERO')) g = 'Aserradero';
        if (g.includes('CARBON')) g = 'Carbón Vegetal';
        if (g.includes('DEPOSITO')) g = 'Depósito';

        giroCounts[g] = (giroCounts[g] || 0) + 1;
    });

    const byGiro = Object.keys(giroCounts).map(k => ({
        name: k,
        value: giroCounts[k]
    })).sort((a, b) => b.value - a.value);

    // 3. Trend by Year
    const yearCounts = {};
    rawData.forEach(r => {
        const y = r['Año'] || 'S/D';
        if (y !== 'S/D') {
            yearCounts[y] = (yearCounts[y] || 0) + 1;
        }
    });

    const byYear = Object.keys(yearCounts).sort().map(k => ({
        year: k,
        count: yearCounts[k]
    }));

    // List for table (all records)
    const list = rawData.map((r, i) => ({
        id: i,
        year: r['Año'],
        auth: r['Número Autorizacion'],
        department: r.Departamento,
        province: r.Provincia,
        district: r.Distrito,
        giro: r.Giro,
        holder: r['Nombre Titular'],
        state: r.Estado
    }));

    const output = {
        metadata: {
            title: "Registro de Centros de Transformación Primaria (CTP)",
            source: "SNIFFS - Registro CTP (4.1.3)",
            count: rawData.length
        },
        kpi: {
            totalCTP: rawData.length,
            activeCount: rawData.filter(r => r.Estado === 'VIGENTE').length,
            // Note: Many are "INDETERMINADO" or empty in sample, checking explicit 'VIGENTE'
            topRegion: byDept[0]?.name || 'N/A'
        },
        byDept,
        byGiro,
        byYear,
        list
    };

    const outDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`Success! Data written to ${OUTPUT_FILE}`);

} catch (error) {
    console.error("Error processing 4.1.3:", error.message);
    process.exit(1);
}
