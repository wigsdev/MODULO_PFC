const { execSync } = require('child_process');
const path = require('path');

console.log("🚀 INICIANDO ACTUALIZACIÓN INTEGRAL DE DATOS...");

const scripts = [
    'process_zonificacion.js',
    'process_frontera.js',
    'process_bosques.js',
    'process_cambio.js',
    'process_indicadores.js',
    'process_inventario.js'
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
