import { FileQuestion } from 'lucide-react';

export default function OtrosDocs() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Otros Documentos</h1>

            <div className="bg-white p-12 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
                <div className="p-4 bg-gray-50 rounded-full mb-4">
                    <FileQuestion size={48} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No hay documentos adicionales</h3>
                <p className="text-gray-500 max-w-md">
                    Por el momento no se han cargado otros documentos en esta sección.
                    Los nuevos documentos técnicos se listarán aquí automáticamente.
                </p>
            </div>
        </div>
    );
}
