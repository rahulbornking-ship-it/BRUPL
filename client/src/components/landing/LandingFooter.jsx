import { Link, useLocation } from 'react-router-dom';
import { Home, Map, User } from 'lucide-react';

export default function LandingFooter() {
    const location = useLocation();
    const isMapActive = location.pathname === '/patterns' || location.pathname === '/';

    return (
        <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
            <div className="container-babua">
                {/* Navigation icons */}
                <div className="flex items-center justify-around py-3 md:py-4">
                    <Link
                        to="/"
                        className="flex flex-col items-center gap-1 transition-colors"
                    >
                        <Home className={`w-5 h-5 md:w-6 md:h-6 ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-400'}`} />
                        <span className={`text-xs font-medium ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-400'}`}>Home</span>
                    </Link>
                    <Link
                        to="/patterns"
                        className="flex flex-col items-center gap-1 transition-colors"
                    >
                        <Map className={`w-5 h-5 md:w-6 md:h-6 ${isMapActive ? 'text-blue-600' : 'text-gray-400'}`} />
                        <span className={`text-xs font-medium ${isMapActive ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>Map</span>
                    </Link>
                    <Link
                        to="/dashboard"
                        className="flex flex-col items-center gap-1 transition-colors"
                    >
                        <User className={`w-5 h-5 md:w-6 md:h-6 ${location.pathname === '/dashboard' ? 'text-blue-600' : 'text-gray-400'}`} />
                        <span className={`text-xs font-medium ${location.pathname === '/dashboard' ? 'text-blue-600' : 'text-gray-400'}`}>Profile</span>
                    </Link>
                </div>
            </div>
        </footer>
    );
}
