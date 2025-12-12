import { User, Globe } from 'lucide-react';

export default function TopBar() {
    return (
        <div className="w-full bg-white z-50 relative border-b border-gray-200">
            <div className="container mx-auto px-4 py-2 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <img
                        src={`${import.meta.env.BASE_URL}images/midagri.jpg`}
                        alt="Minagri"
                        className="h-8 md:h-10 object-contain"
                    />
                    <div className="h-8 w-px bg-gray-300 hidden md:block"></div>
                    <img
                        src="https://www.gob.pe/institucion/serfor/informes-publicaciones/anuario-forestal/assets/logo_serfor.png"
                        alt="SERFOR"
                        className="h-8 md:h-10 object-contain hidden md:block"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <img
                        src={`${import.meta.env.BASE_URL}images/serfor-1-1.png`}
                        alt="SERFOR"
                        className="h-12 object-contain"
                    />
                </div>
            </div>
            <div className="bg-[#689f38] h-8 flex items-center justify-end px-4 md:px-10 text-white gap-4 shadow-sm text-xs">
                <span className="hidden md:inline hover:underline cursor-pointer">Mapa del Sitio</span>
                <span className="hidden md:inline hover:underline cursor-pointer">Contacto</span>
                <div className="h-4 border-l border-green-400 mx-2"></div>
                <User size={14} className="cursor-pointer hover:text-green-200" />
                <Globe size={14} className="cursor-pointer hover:text-green-200" />
            </div>
        </div>
    );
}
