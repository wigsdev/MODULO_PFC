const { execSync } = require('child_process');
const path = require('path');

console.log("🚀 INICIANDO ACTUALIZACIÓN INTEGRAL DE DATOS...");

const scripts = [
    'process_zonificacion.js',
    'process_frontera.js',
    'process_bosques.js',
    'process_cambio.js',
    'process_indicadores.js',
    'process_inventario.js',
    'process_m_superficie.js',
    'process_autoridades.js',
    'process_m_historico.js',
    'process_aprovechamientos.js',
    'process_movilizaciones.js',
    'process_decomisos.js',
    'process_plantaciones.js',
    'process_viveros.js',
    'process_plantaciones_pf.js',
    'process_regentes.js',
    'process_infracciones.js',
    'process_sector_deforestacion.js',
    'process_sector_volumen.js',
    'process_sector_especies.js',
    'process_sector_reservas.js',
    'process_sector_bpp.js',
    'process_sector_sitios.js',
    'process_sector_carbono.js',
    'process_economia_especies.js',
    'process_economia_precios.js',
    'process_economia_industria.js',
    'process_economia_proveedores.js'
];

let hasError = false;

scripts.forEach(scriptName => {
    try {
        console.log(`\n---------------------------------------------`);
        console.log(`▶️ Ejecutando: ${scriptName}`);
        const scriptPath = path.join(__dirname, scriptName);
        execSync(`node "${scriptPath}"`, { stdio: 'inherit' });
        console.log(`✅ ${scriptName} completado.`);
    } catch (error) {
        console.error(`❌ ERROR en ${scriptName}:`, error.message);
        hasError = true;
    }
});

console.log(`\n---------------------------------------------`);
if (hasError) {
    console.error("⚠️ PROCESO TERMINADO CON ERRORES. Revisa los logs anteriores.");
    process.exit(1);
} else {
    console.log("✨ TODO ACTUALIZADO CORRECTAMENTE. Listo para build.");
    process.exit(0);
}
