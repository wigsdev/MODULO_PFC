const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/II. ESPACIAL/02_DATA_ATRIBUTOS/BD_ZONIFICACION_APTITUD_20251121.xlsx');
// Output to PUBLIC folder for dynamic fetching
const outputPath = path.join(__dirname, '../public/data/espacial/zonificacion.json');

try {
    console.log(`Processing file: ${filePath}`);
    const workbook = XLSX.readFile(filePath, { dense: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    // 0. Data Cleaning & Map Fields
    // Fields: REGIÓN, INSTRUMENTO RECTOR, ESTADO ACTUAL, FUENTE DE DATOS, NIVEL DE PRECISIÓN
    const cleanData = rawData.map(row => ({
        region: row['REGIÓN'],
        instrumento: row['INSTRUMENTO RECTOR'],
        estado: row['ESTADO ACTUAL'],
        fuente: row['FUENTE DE DATOS'],
        precision: row['NIVEL DE PRECISIÓN']
    })).filter(r => r.region); // Ensure valid rows

    // Debug: Log unique states to fix filtering issues
    const uniqueStates = [...new Set(cleanData.map(r => r.estado))];
    console.log("DEBUG - Unique States Found:", uniqueStates);

    const totalRegiones = cleanData.length;

    // 1. Calculate KPIs (Specific Categories)
    // "Completa": matches "Completo" or "Aprobada"
    const completa = cleanData.filter(r =>
        r.estado && (r.estado.includes('Completo') || r.estado.includes('Aprobada') || r.estado.includes('Completa'))
    ).length;

    // "Parcial": contains 'Parcial' or 'Módulo' or 'En proceso'
    const parcial = cleanData.filter(r =>
        r.estado && (r.estado.includes('Parcial') || r.estado.includes('Módulo') || r.estado.includes('En proceso'))
    ).length;

    // "Sin Zonificación": contains 'Sin' or 'Pendiente'
    const sinZonificacion = cleanData.filter(r =>
        r.estado && (r.estado.includes('Sin') || r.estado.includes('Pendiente') || r.estado.includes('No iniciada'))
    ).length;

    // Calculate percent based on Completa vs Total
    const avancePorc = totalRegiones > 0 ? Math.round((completa / totalRegiones) * 100) : 0;

    // 2. Group by Status for Chart
    const byEstado = {};
    cleanData.forEach(row => {
        const estado = row.estado || 'Desconocido';
        // Cleanup status label (remove emoji if present, just for cleaner keys if needed, but emojis are fine for display)
        if (!byEstado[estado]) byEstado[estado] = 0;
        byEstado[estado]++;
    });

    const statusChart = Object.keys(byEstado).map(key => ({
        name: key,
        value: byEstado[key]
    }));

    // 3. Group by Instrument for Chart
    const byInstrumento = {};
    cleanData.forEach(row => {
        const inst = row.instrumento || 'Otros';
        if (!byInstrumento[inst]) byInstrumento[inst] = 0;
        byInstrumento[inst]++;
    });

    const instrumentChart = Object.keys(byInstrumento).map(key => ({
        name: key,
        value: byInstrumento[key]
    }));

    // 4. Process Aptitud Data (Sheet: RESUMEN_APTITUD)
    const aptitudSheet = workbook.Sheets['RESUMEN_APTITUD'];
    let aptitudData = [];
    if (aptitudSheet) {
        const rawAptitud = XLSX.utils.sheet_to_json(aptitudSheet);
        aptitudData = rawAptitud.map(row => ({
            name: row.DEPARTAMENTO,
            AGRICOLA: Math.round(row.AGRICOLA || 0),
            'FORESTAL PRODUCTIVO': Math.round(row['FORESTAL PRODUCTIVO'] || 0),
            'OTROS': Math.round(row['OTROS / SIN CLASIFICAR'] || 0),
            'PECUARIO': Math.round(row['PECUARIO'] || 0),
            'PROTECCION': Math.round(row.PROTECCION || 0)
        })).filter(r => r.name); // Ensure valid rows
    }

    // Prepare Final JSON
    const dashboardData = {
        metadata: {
            title: "Estado de la Zonificación Forestal y de Cultivos",
            source: "SERFOR / MIDAGRI (2025)",
            lastUpdated: new Date().toISOString().split('T')[0]
        },
        kpi: {
            totalRegiones: totalRegiones,
            completa: completa,
            parcial: parcial,
            sinZonificacion: sinZonificacion,
            avance: avancePorc
        },
        charts: {
            byStatus: statusChart,
            byInstrument: instrumentChart,
            byAptitud: aptitudData
        },
        table: cleanData // Send full list for the detailed table
    };

    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(dashboardData, null, 2));
    console.log(`Success! Data written to ${outputPath}`);
    console.log(`Regions: ${totalRegiones}, Approved: ${aprobadas} (${avancePorc}%)`);

} catch (error) {
    console.error("ETL Error:", error.message);
}
