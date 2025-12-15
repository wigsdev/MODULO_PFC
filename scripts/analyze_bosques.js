const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '../data/II. ESPACIAL/02_DATA_ATRIBUTOS/BD_MONITOREO_BOSQUES_20251119.xlsx');

try {
    console.log(`Processing file: ${filePath}`);
    const workbook = XLSX.readFile(filePath, { dense: true });
    console.log("Sheet Names:", workbook.SheetNames);

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Read as array of arrays to see headers clearly

    console.log(`\nSample Data from sheet '${sheetName}':`);
    if (data.length > 0) console.log("Row 0 (Header?):", data[0]);
    if (data.length > 1) console.log("Row 1:", data[1]);
    if (data.length > 2) console.log("Row 2:", data[2]);

} catch (err) {
    console.error("Error reading file:", err);
}
