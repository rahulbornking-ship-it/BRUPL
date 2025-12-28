import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Flame, LogOut } from 'lucide-react';

export default function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Don't show navbar on landing page when not scrolled (for cleaner hero)
    const isLanding = location.pathname === '/';

    return (
        <nav
            className={`
                fixed top-0 left-0 right-0 z-50
                transition-all duration-300
                ${scrolled || !isLanding
                    ? 'bg-white shadow-sm border-b border-slate-100'
                    : 'bg-white/80 backdrop-blur-sm'
                }
            `}
        >
            <div className="max-w-desktop mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        {/* Cartoon face logo */}
                        <div className="relative w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-amber-300 to-amber-400 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform border-2 border-amber-500">
                            <span className="text-xl lg:text-2xl">😊</span>
                        </div>
                        <span className="text-xl lg:text-2xl font-bold">
                            <span className="text-slate-800">Babua</span>
                            <span className="text-babua-primary">LMS</span>
                        </span>
                    </Link>

                    {/* Right side */}
                    <div className="flex items-center gap-4 lg:gap-6">
                        {isAuthenticated ? (
                            <>
                                {/* Streak badge - Desktop only */}
                                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-full">
                                    <Flame className="w-4 h-4 text-orange-500" />
                                    <span className="text-sm font-semibold text-orange-600">
                                        {user?.streakCount || 0} day streak
                                    </span>
                                </div>

                                {/* Dashboard link */}
                                <Link
                                    to="/dashboard"
                                    className="hidden lg:block text-slate-600 hover:text-slate-900 font-medium transition-colors"
                                >
                                    Dashboard
                                </Link>

                                {/* User avatar */}
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-babua-primary to-babua-secondary flex items-center justify-center text-white font-semibold shadow-md">
                                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="hidden lg:flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="px-6 py-2.5 rounded-full font-semibold text-babua-primary border-2 border-babua-primary/30 hover:bg-babua-primary hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-babua-primary/20"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

