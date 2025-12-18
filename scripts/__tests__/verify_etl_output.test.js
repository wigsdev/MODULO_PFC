import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('ETL Data Verification', () => {

    it('verifies autoridades_ambientales.json structure', () => {
        const filePath = path.resolve(__dirname, '../../public/data/espacial/autoridades_ambientales.json');

        // Ensure file exists
        expect(fs.existsSync(filePath), `File not found: ${filePath}`).toBe(true);

        const content = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content);

        // Check Top Level Keys
        expect(data).toHaveProperty('metadata');
        expect(data).toHaveProperty('kpi');
        expect(data).toHaveProperty('byNivel');

        // Check KPI Structure
        expect(data.kpi).toHaveProperty('totalEntidades');
        expect(data.kpi).toHaveProperty('nacionales');
        expect(data.kpi).toHaveProperty('regionales');
        expect(typeof data.kpi.totalEntidades).toBe('number');

        // Check byNivel Structure (This was the bug source)
        expect(data.byNivel).toHaveProperty('nacional');
        expect(data.byNivel).toHaveProperty('regional');
        expect(Array.isArray(data.byNivel.nacional)).toBe(true);
        expect(Array.isArray(data.byNivel.regional)).toBe(true);

        // Check Content Integrity if data exists
        if (data.byNivel.nacional.length > 0) {
            const first = data.byNivel.nacional[0];
            expect(first).toHaveProperty('entidad');
            expect(first).toHaveProperty('enlace');
        }
    });

});
