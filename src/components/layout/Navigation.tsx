
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ExternalLink, Globe, LayoutDashboard, FileText, Info, Target } from 'lucide-react';
import clsx from 'clsx';

const MENU_ITEMS = [
    {
        id: 'inicio',
        label: 'INICIO',
        path: '/',
        type: 'dropdown',
        subItems: [
            { id: 'acerca', label: 'ACERCA DEL OBSERVATORIO', path: '/#presentacion', icon: Info },
            { id: 'mision-vision', label: 'MISIÓN Y VISIÓN', path: '/#mision-vision', icon: LayoutDashboard },
            { id: 'objetivos', label: 'OBJETIVOS', path: '/#objetivos', icon: Target },
            { id: 'gestion', label: 'GESTIÓN ORGANIZACIONAL', path: '/gestion', icon: FileText },
        ]
    },
    {
        id: 'espacial',
        label: 'ESPACIAL',
        path: '/espacial',
        type: 'dropdown',
        subItems: [
            {
                id: 'geovisor',
                label: 'GEOVISOR',
                path: 'https://wigsdev.github.io/GEOVISOR/',
                icon: Globe,
                external: true
            },
            {
                id: 'dashboard',
                label: 'DASHBOARD',
                path: '/espacial/dashboard',
                icon: LayoutDashboard
            },
            {
                id: 'docs',
                label: 'DOCUMENTACIÓN',
                path: '/espacial/docs',
                icon: FileText
            },
        ]
    },
    { id: 'sector', label: 'SECTOR', path: '/sector' },
    { id: 'economia', label: 'ECONOMÍA', path: '/economia' },
    { id: 'normativa', label: 'NORMATIVA', path: '/normativa' },
];

export default function Navigation() {
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

    const isActive = (path: string) => {
        if (path === '/' && location.pathname !== '/') return false;
        // For dropdowns, if we are in a sub-route, the parent should be active
        return location.pathname.startsWith(path);
    };

    return (
        <nav className="bg-white shadow-md z-40 relative px-4">
            <div className="container mx-auto flex justify-between h-16 items-center">
                {/* Logo Text */}
                <Link to="/#top" className="flex flex-col cursor-pointer">
                    <span className="text-xl font-extrabold text-serfor-dark leading-none">SNIFFS</span>
                    <span className="text-[10px] text-gray-500 tracking-wide font-medium">MÓDULO PFC</span>
                </Link>

                {/* Desktop Menu */}
                <ul className="hidden md:flex space-x-1 h-full">
                    {MENU_ITEMS.map((item) => (
                        <li
                            key={item.id}
                            className="h-full relative group"
                            onMouseEnter={() => setHoveredMenu(item.id)}
                            onMouseLeave={() => setHoveredMenu(null)}
                        >
                            <div
                                className={clsx(
                                    "h-full px-5 text-xs font-bold uppercase transition-colors flex items-center gap-1 border-b-4 cursor-pointer",
                                    isActive(item.path)
                                        ? "border-serfor-light text-serfor bg-green-50"
                                        : "border-transparent text-gray-500 hover:text-serfor hover:bg-gray-50"
                                )}
                            >
                                {item.type === 'dropdown' ? (
                                    <span>{item.label}</span>
                                ) : (
                                    <Link to={item.path} className="w-full h-full flex items-center">{item.label}</Link>
                                )}
                                {item.type === 'dropdown' && <ChevronDown size={14} className="ml-1" />}
                            </div>

                            {/* Dropdown Desktop */}
                            {item.type === 'dropdown' && hoveredMenu === item.id && (
                                <div className="absolute top-full left-0 w-64 bg-white shadow-xl border-t-2 border-serfor animate-fadeIn">
                                    {item.subItems?.map((sub) => (
                                        sub.external ? (
                                            <a
                                                key={sub.id}
                                                href={sub.path}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block px-6 py-4 hover:bg-gray-50 border-b border-gray-100 group/item"
                                            >
                                                <div className="flex items-center justify-between text-serfor-dark font-bold text-sm">
                                                    <div className="flex items-center gap-2">
                                                        {sub.icon && <sub.icon size={16} className="text-gray-400 group-hover/item:text-serfor" />}
                                                        {sub.label}
                                                    </div>
                                                    <ExternalLink size={12} className="text-gray-400" />
                                                </div>
                                            </a>
                                        ) : (
                                            <Link
                                                key={sub.id}
                                                to={sub.path}
                                                className="block px-6 py-4 hover:bg-gray-50 border-b border-gray-100 group/item"
                                            >
                                                <div className="flex items-center gap-2 text-gray-700 font-bold text-sm group-hover/item:text-serfor">
                                                    {sub.icon && <sub.icon size={16} className="text-gray-400 group-hover/item:text-serfor" />}
                                                    {sub.label}
                                                </div>
                                            </Link>
                                        )
                                    ))}
                                </div>
                            )}
                        </li>
                    ))}
                    <li className="h-full flex items-center px-4">
                        <a
                            href="https://sniffs.serfor.gob.pe/inicio/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-serfor hover:bg-serfor-dark text-white font-bold py-1.5 px-4 rounded text-xs transition-colors shadow-sm border border-transparent"
                        >
                            SNIFFS
                        </a>
                    </li>
                </ul>

                {/* Mobile Btn */}
                <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-gray-600">
                    {mobileOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white z-50 shadow-xl border-t max-h-[calc(100vh-64px)] overflow-y-auto">
                    {MENU_ITEMS.map((item) => (
                        <div key={item.id} className="border-b border-gray-100">
                            {item.type === 'dropdown' ? (
                                <>
                                    <div className="w-full px-6 py-4 font-bold text-sm text-gray-800 bg-gray-50 flex items-center justify-between">
                                        {item.label}
                                        <ChevronDown size={16} />
                                    </div>
                                    <div className="bg-gray-100 pl-4">
                                        {item.subItems?.map((sub) => (
                                            sub.external ? (
                                                <a
                                                    key={sub.id}
                                                    href={sub.path}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full text-left px-6 py-3 font-medium text-xs text-gray-600 hover:text-serfor flex items-center justify-between"
                                                >
                                                    {sub.label}
                                                    <ExternalLink size={12} />
                                                </a>
                                            ) : (
                                                <Link
                                                    key={sub.id}
                                                    to={sub.path}
                                                    className="block w-full text-left px-6 py-3 font-medium text-xs text-gray-600 hover:text-serfor"
                                                    onClick={() => setMobileOpen(false)}
                                                >
                                                    {sub.label}
                                                </Link>
                                            )
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <Link
                                    to={item.path}
                                    className="block w-full text-left px-6 py-4 font-bold text-sm text-gray-700 bg-gray-50"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </nav>
    );
}
