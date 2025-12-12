import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import Navigation from './Navigation';

export default function Layout() {
    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <TopBar />
            <Navigation />
            <main className="flex-1 overflow-hidden relative flex flex-col bg-gray-50">
                <Outlet />
            </main>
        </div>
    );
}
