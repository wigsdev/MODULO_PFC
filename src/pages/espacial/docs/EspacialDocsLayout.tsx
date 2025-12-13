import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import {
    Home,
    FileText,
    ShieldCheck,
    Globe
} from 'lucide-react';

const DOCS_ITEMS = [
    { id: 'docs-inicio', label: 'Inicio', path: '/espacial/docs/inicio', icon: Home },
    { id: 'docs-manuales', label: 'Manuales Técnicos', path: '/espacial/docs/manuales', icon: FileText },
    { id: 'docs-protocolos', label: 'Protocolos Interoperabilidad', path: '/espacial/docs/protocolos', icon: ShieldCheck },
    { id: 'docs-otros', label: 'Otros Documentos', path: '/espacial/docs/otros', icon: Globe },
];

export default function EspacialDocsLayout() {
    return (
        <div className="flex h-full bg-gray-100 overflow-hidden">
            <Sidebar title="DOCUMENTACIÓN" items={DOCS_ITEMS} />
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <Outlet />
            </div>
        </div>
    );
}
