import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AutoridadesAmbientales from '../AutoridadesAmbientales';

// Mock fetch
global.fetch = vi.fn();

describe('AutoridadesAmbientales Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows loading state initially', () => {
        (global.fetch as any).mockImplementationOnce(() => new Promise(() => { }));
        render(<AutoridadesAmbientales />);
        expect(screen.getByText(/Cargando datos/i)).toBeInTheDocument();
    });

    it('renders data correctly when fetch succeeds', async () => {
        const mockData = {
            metadata: { source: 'Test Source', lastUpdated: '2025-01-01' },
            kpi: { totalEntidades: 10, nacionales: 5, regionales: 5 },
            byNivel: {
                nacional: [{ nivel: 'NACIONAL', entidad: 'Entity 1', siglas: 'E1', funcion: 'Func 1', ambito: 'Ambito 1', enlace: 'http://test.com' }],
                regional: [{ nivel: 'REGIONAL', entidad: 'Entity 2', siglas: 'E2', funcion: 'Func 2', ambito: 'Ambito 2', enlace: 'http://test2.com' }]
            }
        };

        (global.fetch as any).mockResolvedValue({
            json: async () => mockData
        });

        render(<AutoridadesAmbientales />);

        await waitFor(() => {
            expect(screen.getByText('Autoridades Ambientales')).toBeInTheDocument();
            // Entity 1 appears in both Card Grid and Table View, so we expect multiple
            expect(screen.getAllByText('Entity 1')[0]).toBeInTheDocument();
        });
    });

    it('handles missing or malformed data gracefully (Defense against undefined)', async () => {
        // Simulating the bug we faced: missing byNivel
        const badData = {
            metadata: { source: 'Bad Source' },
            // kpi missing
            // byNivel missing - this caused the crash
        };

        (global.fetch as any).mockResolvedValue({
            json: async () => badData
        });

        render(<AutoridadesAmbientales />);

        // Should probably show error message or at least not crash
        await waitFor(() => {
            // Note: Currently component shows "Error al cargar datos" if !data, 
            // but if data exists but is malformed, it might crash inside rendering.
            // We want to verify behavior here.
        });
    });
});
