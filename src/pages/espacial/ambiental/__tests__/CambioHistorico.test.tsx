import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CambioHistorico from '../CambioHistorico';

// Mock fetch
global.fetch = vi.fn();

// Mock Recharts ResponsiveContainer to avoid width/height issues in JSDOM
vi.mock('recharts', async () => {
    const OriginalModule = await vi.importActual('recharts');
    return {
        ...OriginalModule,
        ResponsiveContainer: ({ children }: any) => <div style={{ width: 500, height: 500 }}>{children}</div>,
    };
});

describe('CambioHistorico Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('handles 404 error gracefully', async () => {
        // Simulate 404
        (global.fetch as any).mockResolvedValue({
            ok: false,
            status: 404,
            json: async () => ({}) // Should not be called if ok is checked
        });

        render(<CambioHistorico />);

        await waitFor(() => {
            // Should show error message
            expect(screen.getByText(/Error al cargar datos/i)).toBeInTheDocument();
            // Should NOT verify filter crash because component returned early
        });
    });

    it('renders robustly when array properties are missing', async () => {
        // Mock data missing serieHistorica and totalesPorRegion
        const partialData = {
            metadata: { source: 'Test', lastUpdated: '2024', nota: 'Nota' },
            kpi: {
                totalAcumulado: 1000000,
                añoPico: 2020,
                deforestacionPico: 500,
                ultimoAño: 2024,
                deforestacionUltimoAño: 100,
                tendencia: "10.0"
            },
            regiones: ['REGION1']
            // Missing arrays should be handled by default []
        };

        (global.fetch as any).mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => partialData
        });

        render(<CambioHistorico />);

        await waitFor(() => {
            // Should render dashboard structure
            expect(screen.getByText(/Cambio Histórico/i)).toBeInTheDocument();
            // Should NOT crash
            expect(screen.getByText(/Deforestación Acumulada/i)).toBeInTheDocument();
        });
    });

    it('renders correctly with valid data', async () => {
        const mockData = {
            metadata: { source: 'Test', lastUpdated: '2024', nota: 'Nota' },
            kpi: {
                totalAcumulado: 1000000,
                añoPico: 2020,
                deforestacionPico: 500,
                ultimoAño: 2024,
                deforestacionUltimoAño: 100,
                tendencia: "10.0"
            },
            regiones: ['REGION1', 'REGION2'],
            serieHistorica: [{ year: 2024, total: 100, REGION1: 50, REGION2: 50 }],
            totalesPorRegion: [{ region: 'REGION1', total: 500 }]
        };

        (global.fetch as any).mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => mockData
        });

        render(<CambioHistorico />);

        await waitFor(() => {
            expect(screen.getByText(/Cambio Histórico/i)).toBeInTheDocument();
            expect(screen.getByText(/Año Pico/i)).toBeInTheDocument();
        });
    });
});
