const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// 1. Configuración
const INPUT_FILE = path.join(__dirname, '../data/IV. ECONOMIA/4.1.1.PROV_BIENES_SERVICIOS.csv');
const OUTPUT_FILE = path.join(__dirname, '../public/data/economia/proveedores.json');

console.log(`\nProcesando Proveedores de Bienes y Servicios...`);

// 2. Leer CSV
if (!fs.existsSync(INPUT_FILE)) {
    console.error(`❌ Archivo no encontrado: ${INPUT_FILE}`);
    process.exit(1);
}

const workbook = XLSX.readFile(INPUT_FILE);
const sheetName = workbook.SheetNames[0];
const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

console.log(`Total registros encontrados: ${data.length}`);

// 3. Procesar datos
// Campos clave: Región, Rol del actor o proveedor, Razón Social, Eslabón de la Cadena de Valor, Tipo, Bien o Servicio Específico, Contacto
const processedData = data.map((r, index) => {
    return {
        id: index + 1,
        region: r['Región'] || 'Desconocido',
        rol: r['Rol del actor o proveedor'] || '',
        razonSocial: r['Razón Social'] || 'No especificado',
        eslabon: r['Eslabón de la Cadena de Valor'] || 'No especificado',
        tipo: r['Tipo'] || 'Otro',
        servicio: r['Bien o Servicio Específico'] || '',
        contacto: r['Número de contacto'] || '',
        correo: r['Correo electrónico'] || ''
    };
});

// 4. Calcular KPIs simples
const totalProveedores = processedData.length;
const uniqueRegions = [...new Set(processedData.map(d => d.region))].length;
const byEslabon = processedData.reduce((acc, curr) => {
    acc[curr.eslabon] = (acc[curr.eslabon] || 0) + 1;
    return acc;
}, {});

// Convertir byEslabon a array para gráficas si se necesita
const eslabonSemantics = Object.entries(byEslabon).map(([name, value]) => ({ name, value }));

// 5. Estructura Final
const finalJson = {
    metadata: {
        title: "Directorio de Proveedores de Bienes y Servicios",
        source: "SERFOR",
        lastUpdated: new Date().toISOString().split('T')[0],
        count: totalProveedores
    },
    kpi: {
        total: totalProveedores,
        regionsCount: uniqueRegions
    },
    filters: {
        regions: [...new Set(processedData.map(d => d.region))].sort(),
        eslabones: [...new Set(processedData.map(d => d.eslabon))].sort(),
        tipos: [...new Set(processedData.map(d => d.tipo))].sort()
    },
    list: processedData
};

// 6. Guardar JSON
const outputDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalJson, null, 2));
console.log(`✅ Datos guardados en: ${OUTPUT_FILE}`);
