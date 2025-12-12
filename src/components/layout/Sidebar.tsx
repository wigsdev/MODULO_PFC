import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, ChevronDown, LucideIcon } from 'lucide-react';
import clsx from 'clsx';

export interface SidebarItem {
    id: string;
    label: string;
    icon: LucideIcon;
    path?: string;
    external?: boolean;
    subItems?: SidebarItem[];
}

interface SidebarProps {
    title: string;
    items: SidebarItem[];
}

export default function Sidebar({ title, items }: SidebarProps) {
    const location = useLocation();
    // State to keep track of open menus. 
    // We can auto-expand based on current path on initial load if needed, 
    // but for now let's keep it simple or auto-expand if child is active.
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    const toggleMenu = (id: string) => {
        setOpenMenus(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Helper to check if a specific item or any of its children is active
    const isItemActive = (item: SidebarItem): boolean => {
        if (item.path && location.pathname === item.path) return true;
        if (item.subItems) {
            return item.subItems.some(sub => isItemActive(sub));
        }
        return false;
    };

    const renderItem = (item: SidebarItem, depth = 0) => {
        const isActive = isItemActive(item);
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const isOpen = openMenus[item.id] || (isActive && !openMenus.hasOwnProperty(item.id) && hasSubItems); // Auto-open if active

        const paddingLeft = depth * 12 + 20; // Indent based on depth

        const commonClasses = clsx(
            "w-full flex items-center gap-3 py-3 text-xs text-left transition-all border-l-4 cursor-pointer",
            isActive && !hasSubItems
                ? "bg-serfor border-yellow-400 text-white font-bold shadow-inner"
                : "border-transparent text-green-100 hover:bg-[#206b24] hover:text-white"
        );

        if (hasSubItems) {
            return (
                <div key={item.id}>
                    <div
                        onClick={() => toggleMenu(item.id)}
                        className={clsx(commonClasses, "justify-between pr-4")}
                        style={{ paddingLeft: `${paddingLeft}px` }}
                    >
                        <div className="flex items-center gap-3">
                            <item.icon size={16} className={isActive ? 'text-yellow-400' : 'text-green-300'} />
                            <span>{item.label}</span>
                        </div>
                        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </div>
                    {isOpen && (
                        <div className="bg-[#0f4015]">
                            {item.subItems!.map(sub => renderItem(sub, depth + 1))}
                        </div>
                    )}
                </div>
            );
        }

        if (item.external) {
            return (
                <a
                    key={item.id}
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={commonClasses}
                    style={{ paddingLeft: `${paddingLeft}px` }}
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
                to={item.path!}
                className={commonClasses}
                style={{ paddingLeft: `${paddingLeft}px` }}
            >
                <item.icon size={16} className={isActive ? 'text-yellow-400' : 'text-green-300'} />
                <span>{item.label}</span>
                {!hasSubItems && isActive && <ChevronRight size={14} className="ml-auto text-yellow-400" />}
            </Link>
        );
    };

    return (
        <div className="w-64 bg-serfor-dark text-white flex-shrink-0 flex flex-col h-full shadow-xl transition-all">
            <div className="p-5 bg-[#144a18] border-b border-green-800">
                <h3 className="font-bold text-sm uppercase tracking-wider text-green-100">{title}</h3>
                <p className="text-[10px] text-green-400 mt-1">Navegación Interna</p>
            </div>
            <div className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-green-700 scrollbar-track-transparent">
                {items.map(item => renderItem(item))}
            </div>
            <div className="p-4 bg-[#0d3310] text-[9px] text-green-500 text-center border-t border-green-900">
                <p>Fuente: Anuario 2024</p>
                <p>Actualizado: Nov 2025</p>
            </div>
        </div>
    );
}
