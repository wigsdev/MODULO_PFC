import { User, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TopBar() {
    return (
        <div className="w-full bg-white z-50 relative border-b border-gray-200">
            <div className="container mx-auto px-4 py-2 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <img
                        src={`${import.meta.env.BASE_URL}images/midagri.jpg`}
                        alt="Minagri"
                        className="h-12 object-contain ml-[40px] px-[20px]"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <img
                        src={`${import.meta.env.BASE_URL}images/serfor-1-1.png`}
                        alt="SERFOR"
                        className="h-12 object-contain mr-[40px] px-[20px]"
                    />
                </div>
            </div>
            <div className="bg-[#689f38] h-8 flex items-center justify-end px-4 md:px-10 text-white gap-4 shadow-sm text-xs">
                <Link to="/mapa-sitio" className="hidden md:inline hover:underline cursor-pointer">Mapa del Sitio</Link>
                <span className="hidden md:inline hover:underline cursor-pointer">Contacto</span>
                <div className="h-4 border-l border-green-400 mx-2"></div>
                <User size={14} className="cursor-pointer hover:text-green-200" />
                <Globe size={14} className="cursor-pointer hover:text-green-200" />
            </div>
        </div>
    );
}
