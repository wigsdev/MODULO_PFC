const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/II. ESPACIAL/02_DATA_ATRIBUTOS/BD_MNSA_FRONTERA_AGRICOLA_PI1.xlsx');
const outputPath = path.join(__dirname, '../public/data/espacial/frontera.json');

try {
    console.log(`Processing file: ${filePath}`);
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    // 0. Data Cleaning & Filter (Remove Totals and Undefined)
    const cleanData = rawData.filter(row => {
        const dept = row.DEPARTAMENTO;
        const prov = row.PROVINCIA;

        // Filter out if Department/Province is missing or is "TOTAL"
        if (!dept || !prov) return false;
        if (dept.toString().toUpperCase().includes('TOTAL')) return false;
        if (prov.toString().toUpperCase().includes('TOTAL')) return false;

        return true;
    });

    // 1. Calculate KPIs (National)
    const totalArea = cleanData.reduce((sum, row) => sum + (Number(row.AREA_HA) || 0), 0);

    // Unique Districts Count
    const distritosSet = new Set();
    cleanData.forEach(row => {
        if (row.UBIGEO) distritosSet.add(row.UBIGEO);
        else if (row.DISTRITO) distritosSet.add(`${row.DEPARTAMENTO}-${row.PROVINCIA}-${row.DISTRITO}`);
    });

    // 2. Group by Department
    const byDepartment = {};
    cleanData.forEach(row => {
        const dept = row.DEPARTAMENTO;
        const area = Number(row.AREA_HA) || 0;
        if (!byDepartment[dept]) byDepartment[dept] = 0;
        byDepartment[dept] += area;
    });

    // Sort Departments by Area (Desc)
    const departmentData = Object.keys(byDepartment)
        .map(dept => ({ name: dept, value: Math.round(byDepartment[dept] * 100) / 100 }))
        .sort((a, b) => b.value - a.value);

    // 4. Top 10 Provinces
    const byProvince = {};
    cleanData.forEach(row => {
        // Use just the Province name for the chart key (user request)
        const prov = row.PROVINCIA;
        const area = Number(row.AREA_HA) || 0;
        if (!byProvince[prov]) byProvince[prov] = 0;
        byProvince[prov] += area;
    });

    const topProvinces = Object.keys(byProvince)
        .map(prov => ({ name: prov, value: Math.round(byProvince[prov] * 100) / 100 }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);

    // Prepare Final JSON
    const dashboardData = {
        metadata: {
            title: "Frontera Agrícola Nacional",
            source: "Interpretación de imágenes Planet y Google Earth. DGESEP - MIDAGRI (2024)",
            lastUpdated: new Date().toISOString().split('T')[0]
        },
        kpi: {
            totalAreaHa: Math.round(totalArea * 100) / 100,
            departmentCount: departmentData.length,
            provinceCount: Object.keys(byProvince).length,
            districtCount: distritosSet.size
        },
        charts: {
            byDepartment: departmentData,
            topProvinces: topProvinces
        }
    };

    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(dashboardData, null, 2));
    console.log(`Success! Data written to ${outputPath}`);
    console.log(`Total Area: ${dashboardData.kpi.totalAreaHa} ha`);
    console.log(`Departamentos: ${dashboardData.kpi.departmentCount}`);
    console.log(`Distritos: ${dashboardData.kpi.districtCount}`);

} catch (error) {
    console.error("ETL Error:", error.message);
}
