import { Briefcase, LayoutGrid, Users, Map, Calendar, Settings } from 'lucide-react';
import Sidebar, { SidebarItem } from '@/components/layout/Sidebar';
import GestionContent from './GestionContent';
import { useLocation, useEffect } from 'react';

const GESTION_ITEMS: SidebarItem[] = [
    {
        id: 'lineas',
        label: 'Líneas Prioritarias',
        icon: LayoutGrid,
        path: '#lineas'
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
    const location = useLocation();

    // Handle hash scrolling for internal page navigation
    useEffect(() => {
        if (location.hash) {
            const element = document.getElementById(location.hash.slice(1));
            if (element) {
                // Small timeout to allow render
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, [location]);

    return (
        <div className="flex h-full">
            <Sidebar
                title="GESTIÓN"
                items={GESTION_ITEMS}
            />
            <main className="flex-1 overflow-y-auto bg-gray-50 h-full relative">
                <GestionContent />
            </main>
        </div>
    );
}
