import { Outlet } from 'react-router-dom';

export default function EspacialLayout() {
    return (
        <div className="flex flex-col h-full bg-gray-100 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <Outlet />
            </div>
        </div>
    );
}
