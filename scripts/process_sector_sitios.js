const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Input
const INPUT_FILE = path.join(__dirname, '../data/III. SECTOR/3.6.1.SITIOS_DECLARADOS.csv');

// Output
const OUTPUT_FILE = path.join(__dirname, '../public/data/sector/sitios.json');

console.log(`Processing Sector Sitios Declarados...`);

try {
    const workbook = XLSX.readFile(INPUT_FILE);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    const cleanNum = (val) => {
        if (typeof val === 'number') return val;
        if (!val || val === 'N/A' || val === 'Variable') return 0;
        return parseFloat(val.toString().replace(/,/g, '').replace(/~/g, '').trim()) || 0;
    };

    const list = rawData.map(r => ({
        region: r['REGIÓN'],
        name: r['NOMBRE DEL SITIO DECLARADO'],
        category: r['CATEGORÍA / TIPO'],
        legal: r['BASE LEGAL (Resolución)'],
        surface: cleanNum(r['SUPERFICIE (Ha)']),
        surfaceRaw: r['SUPERFICIE (Ha)'],
        restriction: r['RESTRICCIÓN PARA INVERSIÓN']
    })).filter(r => r.name);

    // Calculate Distribution by Category
    const categoryCounts = {};
    list.forEach(item => {
        // Normalize complex categories
        let cat = item.category.split('/')[0].trim();
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const categoryDistribution = Object.keys(categoryCounts).map(key => ({
        name: key,
        value: categoryCounts[key]
    }));

    const kpi = {
        totalSites: list.length,
        totalArea: list.reduce((acc, r) => acc + r.surface, 0),
        highRestriction: list.filter(i => i.restriction && (i.restriction.includes('Alta') || i.restriction.includes('Absoluta'))).length
    };

    const output = {
        metadata: {
            title: "Sitios Declarados y Ecosistemas Frágiles",
            source: "SERFOR / Gob. Regionales",
            lastUpdated: new Date().toISOString().split('T')[0]
        },
        kpi,
        categoryDistribution,
        list
    };

    const outDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`Success! Data written to ${OUTPUT_FILE}`);

} catch (error) {
    console.error("Error processing Sector Sitios:", error.message);
    process.exit(1);
}
