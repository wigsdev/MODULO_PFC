
import { Target, FileText, Settings, Award, Home } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import { Outlet } from 'react-router-dom';

const NORMATIVA_ITEMS = [
    { id: 'normativa-inicio', icon: Home, label: 'Inicio', path: '/normativa/inicio' },
    { id: 'normativa-planificacion', icon: Target, label: 'Planificación', path: '/normativa/planificacion' },
    { id: 'normativa-lineamientos', icon: FileText, label: 'Lineamientos', path: '/normativa/lineamientos' },
    { id: 'normativa-manejo', icon: Settings, label: 'Manejo y Aprov.', path: '/normativa/manejo' },
    { id: 'normativa-incentivos', icon: Award, label: 'Incentivos', path: '/normativa/incentivos' },
];

export default function NormativaLayout() {
    return (
        <div className="flex h-full">
            <Sidebar
                items={NORMATIVA_ITEMS}
                title="NORMATIVA"
            />
            <div className="flex-1 overflow-auto bg-gray-50 p-6">
                <Outlet />
            </div>
        </div>
    );
}
