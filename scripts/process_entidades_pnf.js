const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Config
const INPUT_FILE = path.join(__dirname, '../data/IV. ECONOMIA/4.1.2.ENTIDADES_EJECUTORAS_DE_PNF_2024.csv');
const OUTPUT_FILE = path.join(__dirname, '../public/data/economia/entidades_pnf.json');

console.log(`Processing Entidades PNF...`);

try {
    if (!fs.existsSync(INPUT_FILE)) {
        throw new Error(`Input file not found: ${INPUT_FILE}`);
    }

    const workbook = XLSX.readFile(INPUT_FILE);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    // Map and Clean
    const entidades = rawData.map(r => ({
        id: r['N°'],
        entidad: r['Entidad Ejecutora'],
        distrito: r['Distrito'],
        provincia: r['Provincia'],
        region: r['Región'],
        convocatoria: r['Convocatoria'],
        concurso: r['Concurso'],
        anio: r['Año']
    })).filter(r => r.entidad);

    // KPIs
    const totalEntidades = entidades.length;

    // Group by Region
    const byRegion = entidades.reduce((acc, curr) => {
        acc[curr.region] = (acc[curr.region] || 0) + 1;
        return acc;
    }, {});

    const regionChartData = Object.entries(byRegion)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

    // Group by Concurso
    const byConcurso = entidades.reduce((acc, curr) => {
        acc[curr.concurso] = (acc[curr.concurso] || 0) + 1;
        return acc;
    }, {});

    const concursoChartData = Object.entries(byConcurso)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

    const output = {
        metadata: {
            title: "Entidades Ejecutoras de Planes de Negocios Forestales",
            source: "SERFOR (2024)",
            lastUpdated: new Date().toISOString().split('T')[0]
        },
        kpi: {
            totalEntidades,
            topRegion: regionChartData[0]?.name || 'N/A',
            topRegionCount: regionChartData[0]?.value || 0,
            anio: 2024
        },
        charts: {
            byRegion: regionChartData,
            byConcurso: concursoChartData
        },
        lista: entidades
    };

    // Write
    const outDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`Success! Data written. Total records: ${totalEntidades}`);

} catch (error) {
    console.error("Error processing Entidades PNF:", error.message);
    process.exit(1);
}
