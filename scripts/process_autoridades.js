const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Configuration
const INPUT_FILE = path.join(__dirname, '../data/II. ESPACIAL/02_DATA_ATRIBUTOS/2.3.2.BD_AUTORIDADES_AMBIENTALES_20251121.csv');
const OUTPUT_FILE = path.join(__dirname, '../public/data/espacial/autoridades_ambientales.json');

console.log(`Processing Authorities...`);

try {
    const workbook = XLSX.readFile(INPUT_FILE);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    // Filter and Map
    const autoridades = rawData.map(r => {
        // Ensure link has protocol
        let link = r['ENLACE OFICIAL'];
        if (link && !link.startsWith('http')) {
            link = `https://${link}`;
        }

        return {
            nivel: r['NIVEL'],
            entidad: r['ENTIDAD'],
            siglas: r['SIGLAS'],
            funcion: r['FUNCIÓN PRINCIPAL EN PFC'],
            ambito: r['ÁMBITO'],
            enlace: link
        };
    }).filter(r => r.entidad);


    // Calculate KPIs and Grouping
    const nacional = autoridades.filter(a => a.nivel === 'NACIONAL');
    const regional = autoridades.filter(a => a.nivel === 'REGIONAL');

    const output = {
        metadata: {
            title: "Autoridades Ambientales",
            source: "MINAM / GORES (2025)",
            lastUpdated: new Date().toISOString().split('T')[0]
        },
        kpi: {
            totalEntidades: autoridades.length,
            nacionales: nacional.length,
            regionales: regional.length
        },
        byNivel: {
            nacional,
            regional
        }
    };

    // Write Output
    const outDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`Success! Data written to ${OUTPUT_FILE}`);

} catch (error) {
    console.error("Error processing Authorities:", error.message);
    process.exit(1);
}
