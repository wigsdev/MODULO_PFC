const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '../data/IV. ECONOMIA/4.2.2.APP_CONCESIONES_FORESTALES_SIR.csv');
const outputFile = path.join(__dirname, '../public/data/economia/concesiones.json');

try {
    console.log(`Processing file: ${inputFile}`);
    if (!fs.existsSync(inputFile)) {
        console.warn(`⚠️ Input file not found, skipping: ${inputFile}`);
        process.exit(0);
    }

    const content = fs.readFileSync(inputFile, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());

    // Skip empty lines and find header (line with AÑO)
    let dataStartIndex = 0;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('AÑO') && lines[i].includes('CONTRATO')) {
            dataStartIndex = i + 1;
            break;
        }
    }

    const records = [];

    for (let i = dataStartIndex; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        // Parse CSV with quotes handling
        const parts = [];
        let current = '';
        let inQuotes = false;

        for (const char of line) {
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                parts.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        parts.push(current.trim());

        // Extract fields (accounting for empty columns)
        const year = parseInt(parts[0]) || null;
        const contrato = parts[1] || '';
        const titular = parts[2] || '';
        const arffs = parts[5] || '';
        const departamento = parts[6] || '';
        const provincia = parts[7] || '';
        const distrito = parts[8] || '';
        const superficieRaw = parts[9] || '0';
        const tipo = parts[14] || '';

        // Parse superficie (handle thousands separator)
        const superficie = parseFloat(superficieRaw.replace(/,/g, '')) || 0;

        if (year && tipo && superficie > 0) {
            records.push({
                year,
                contrato,
                titular: titular.substring(0, 50), // Truncate for display
                arffs,
                departamento,
                provincia,
                distrito,
                superficie,
                tipo
            });
        }
    }

    console.log(`Parsed ${records.length} valid records`);

    // Calculate KPIs
    const totalConcesiones = records.length;
    const superficieTotal = records.reduce((sum, r) => sum + r.superficie, 0);

    // Group by departamento
    const byDepartamento = {};
    records.forEach(r => {
        if (!byDepartamento[r.departamento]) {
            byDepartamento[r.departamento] = { count: 0, superficie: 0 };
        }
        byDepartamento[r.departamento].count++;
        byDepartamento[r.departamento].superficie += r.superficie;
    });

    const topDepartamento = Object.entries(byDepartamento)
        .sort((a, b) => b[1].count - a[1].count)[0]?.[0] || 'N/A';

    // Group by tipo
    const byTipo = {};
    records.forEach(r => {
        if (!byTipo[r.tipo]) {
            byTipo[r.tipo] = { count: 0, superficie: 0 };
        }
        byTipo[r.tipo].count++;
        byTipo[r.tipo].superficie += r.superficie;
    });

    const tiposData = Object.entries(byTipo)
        .map(([tipo, data]) => ({
            tipo: tipo.length > 35 ? tipo.substring(0, 32) + '...' : tipo,
            tipoFull: tipo,
            count: data.count,
            superficie: Math.round(data.superficie)
        }))
        .sort((a, b) => b.superficie - a.superficie);

    // Department summary for filters
    const departamentos = Object.entries(byDepartamento)
        .map(([name, data]) => ({
            nombre: name,
            count: data.count,
            superficie: Math.round(data.superficie)
        }))
        .sort((a, b) => b.count - a.count);

    // Include ALL records for the table (sorted by superficie descending)
    const allRecords = records
        .sort((a, b) => b.superficie - a.superficie)
        .map(r => ({
            contrato: r.contrato,
            titular: r.titular,
            departamento: r.departamento,
            distrito: r.distrito,
            superficie: r.superficie,
            tipo: r.tipo,
            year: r.year
        }));

    const dashboardData = {
        metadata: {
            title: "Concesiones Forestales",
            source: "SERFOR - SIR",
            lastUpdated: new Date().toISOString().split('T')[0],
            totalRecords: records.length
        },
        kpi: {
            totalConcesiones,
            superficieTotal: Math.round(superficieTotal),
            topDepartamento
        },
        tiposData,
        departamentos,
        records: allRecords
    };

    // Ensure directory exists
    const outDir = path.dirname(outputFile);
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    fs.writeFileSync(outputFile, JSON.stringify(dashboardData, null, 2));
    console.log(`✅ Success! Data written to ${outputFile}`);
    console.log(`   Total: ${totalConcesiones} concesiones, ${(superficieTotal / 1000000).toFixed(2)}M ha`);

} catch (error) {
    console.error("Error processing Concesiones data:", error);
    process.exit(1);
}
