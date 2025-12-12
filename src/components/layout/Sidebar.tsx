import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface SidebarItem {
    id: string;
    label: string;
    icon: LucideIcon;
    path: string;
    external?: boolean;
}

interface SidebarProps {
    title: string;
    items: SidebarItem[];
}

export default function Sidebar({ title, items }: SidebarProps) {
    const location = useLocation();

    return (
        <div className="w-64 bg-serfor-dark text-white flex-shrink-0 flex flex-col h-full shadow-xl transition-all">
            <div className="p-5 bg-[#144a18] border-b border-green-800">
                <h3 className="font-bold text-sm uppercase tracking-wider text-green-100">{title}</h3>
                <p className="text-[10px] text-green-400 mt-1">Navegación Interna</p>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
                {items.map((item) => {
                    const isActive = location.pathname === item.path;
                    const commonClasses = clsx(
                        "w-full flex items-center gap-3 px-5 py-3 text-xs text-left transition-all border-l-4",
                        isActive
                            ? "bg-serfor border-yellow-400 text-white font-bold shadow-inner"
                            : "border-transparent text-green-100 hover:bg-[#206b24] hover:text-white"
                    );

                    if (item.external) {
                        return (
                            <a
                                key={item.id}
                                href={item.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={commonClasses}
                            >
                                <item.icon size={16} className="text-green-300 transform group-hover:scale-110 transition-transform" />
                                <span>{item.label}</span>
                                <ChevronRight size={14} className="ml-auto text-green-300 opacity-50" />
                            </a>
                        );
                    }

                    return (
                        <Link
                            key={item.id}
                            to={item.path}
                            className={commonClasses}
                        >
                            <item.icon size={16} className={isActive ? 'text-yellow-400' : 'text-green-300'} />
                            <span>{item.label}</span>
                            {isActive && <ChevronRight size={14} className="ml-auto text-yellow-400" />}
                        </Link>
                    );
                })}
            </div>
            <div className="p-4 bg-[#0d3310] text-[9px] text-green-500 text-center border-t border-green-900">
                <p>Fuente: Anuario 2024</p>
                <p>Actualizado: Nov 2025</p>
            </div>
        </div>
    );
}
