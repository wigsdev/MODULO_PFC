const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '../data/II. ESPACIAL/02_DATA_ATRIBUTOS/BD_ZONIFICACION_APTITUD_20251121.xlsx');

try {
    console.log("Attempting to read file...");
    const workbook = XLSX.readFile(filePath, { dense: true });
    console.log("File read successfully.");
    console.log("Sheet Names:", workbook.SheetNames);
} catch (err) {
    console.error("Error reading file:", err);
}
