import { useState } from 'react';
import { Briefcase, LayoutGrid, Users, Map, Calendar } from 'lucide-react';
import Sidebar, { SidebarItem } from '@/components/layout/Sidebar';
import LineasPrioritarias from './gestion/LineasPrioritarias';
import Organigrama from './gestion/Organigrama';
import RolesEntidades from './gestion/RolesEntidades';
import AutoridadForestal from './gestion/AutoridadForestal';
import PlanOperativo from './gestion/PlanOperativo';

const GESTION_ITEMS: SidebarItem[] = [
    {
        id: 'lineas',
        label: 'Líneas Prioritarias',
        icon: LayoutGrid,
        path: '#lineas' // Retain for consistent type, but handled via state
    },
    {
        id: 'organigrama',
        label: 'Organigrama',
        icon: Users,
        path: '#organigrama'
    },
    {
        id: 'roles',
        label: 'Roles Entidades',
        icon: Briefcase,
        path: '#roles'
    },
    {
        id: 'autoridad',
        label: 'Autoridad Forestal',
        icon: Map,
        path: '#autoridad'
    },
    {
        id: 'plan',
        label: 'Plan Operativo',
        icon: Calendar,
        path: '#plan'
    }
];

export default function GestionOrganizacional() {
    const [activeTab, setActiveTab] = useState('lineas');

    const renderContent = () => {
        switch (activeTab) {
            case 'lineas': return <LineasPrioritarias />;
            case 'organigrama': return <Organigrama />;
            case 'roles': return <RolesEntidades />;
            case 'autoridad': return <AutoridadForestal />;
            case 'plan': return <PlanOperativo />;
            default: return <LineasPrioritarias />;
        }
    };

    return (
        <div className="flex h-full bg-gray-50">
            <Sidebar
                title="GESTIÓN"
                items={GESTION_ITEMS}
                activeId={activeTab}
                onItemClick={(id) => setActiveTab(id)}
            />
            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-6xl mx-auto">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}
