const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Input (Using 3.3.1 as primary since 3.2.1 seems identical/duplicate qualitative data)
const INPUT_FILE = path.join(__dirname, '../data/III. SECTOR/3.3.1.ESPECIES_DECOMISADAS.csv');

// Output
const OUTPUT_FILE = path.join(__dirname, '../public/data/sector/especies.json');

console.log(`Processing Sector Especies...`);

try {
    const workbook = XLSX.readFile(INPUT_FILE);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    const list = rawData.map(r => ({
        commonName: r['ESPECIE (Nombre Común)'],
        scientificName: r['NOMBRE CIENTÍFICO'],
        product: r['TIPO PRODUCTO MÁS DECOMISADO'],
        regions: r['REGIÓN CRÍTICA DE HALLAZGO'],
        risk: r['NIVEL DE RIESGO']
    })).filter(r => r.commonName);

    // Calculate Risk Distribution
    const riskCounts = {};
    list.forEach(item => {
        const riskLabel = item.risk.replace(/🔴|🟠|🟡|⚪/g, '').trim() || 'Desconocido';
        riskCounts[riskLabel] = (riskCounts[riskLabel] || 0) + 1;
    });

    const riskDistribution = Object.keys(riskCounts).map(key => ({
        name: key,
        value: riskCounts[key]
    }));

    // KPIs
    const kpi = {
        totalSpecies: list.length,
        highRisk: list.filter(i => i.risk.includes('🔴') || i.risk.includes('Muy Alto')).length,
        mediumRisk: list.filter(i => i.risk.includes('🟠') || i.risk.includes('Alto')).length
    };

    const output = {
        metadata: {
            title: "Especies de Flora Silvestre Decomisadas",
            source: "SNIFFS - Reportes de Decomisos",
            lastUpdated: new Date().toISOString().split('T')[0]
        },
        kpi,
        riskDistribution,
        list
    };

    const outDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`Success! Data written to ${OUTPUT_FILE}`);

} catch (error) {
    console.error("Error processing Sector Especies:", error.message);
    process.exit(1);
}
