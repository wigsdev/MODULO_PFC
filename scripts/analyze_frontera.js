const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/II. ESPACIAL/02_DATA_ATRIBUTOS/BD_MNSA_FRONTERA_AGRICOLA_PI1.xlsx');

try {
    console.log(`Reading file: ${filePath}`);
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert to JSON to see headers and sample data
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    if (data.length === 0) {
        console.log("No data found in the first sheet.");
    } else {
        console.log("headers:", JSON.stringify(data[0]));
        console.log("First 3 rows of data:");
        console.log(JSON.stringify(data.slice(1, 4)));

        // Analyze columns if header exists
        if (data.length > 1) {
            const headers = data[0];
            const sample = data[1];
            console.log("\nColumn Analysis:");
            headers.forEach((header, index) => {
                const sampleValue = sample ? sample[index] : 'N/A';
                console.log(`${header}: ${typeof sampleValue} (Sample: ${sampleValue})`);
            });
        }
    }

} catch (error) {
    console.error("Error reading file:", error.message);
}
