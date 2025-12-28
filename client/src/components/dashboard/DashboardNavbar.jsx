import { Link } from 'react-router-dom';

export default function DashboardNavbar() {
    return (
        <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3">
                        <div className="size-8 text-neon-blue animate-pulse">
                            <span className="material-symbols-outlined text-3xl">terminal</span>
                        </div>
                        <h2 className="font-bebas text-3xl tracking-wider text-white neon-text">
                            BABUA <span className="text-primary">BPL</span>
                        </h2>
                    </Link>

                    {/* Nav Links */}
                    <nav className="hidden md:flex gap-8">
                        <Link
                            to="/courses"
                            className="text-gray-300 hover:text-neon-blue text-sm font-bold tracking-widest uppercase transition-colors flex items-center gap-2 group"
                        >
                            <span className="material-symbols-outlined text-lg group-hover:animate-bounce">school</span>
                            Padhai (Courses)
                        </Link>
                        <Link
                            to="/leaderboard"
                            className="text-gray-300 hover:text-jalebi-orange text-sm font-bold tracking-widest uppercase transition-colors flex items-center gap-2 group"
                        >
                            <span className="material-symbols-outlined text-lg group-hover:rotate-12 transition-transform">leaderboard</span>
                            Bhaukaal (Leaderboard)
                        </Link>
                        <Link
                            to="#"
                            className="text-gray-300 hover:text-primary text-sm font-bold tracking-widest uppercase transition-colors flex items-center gap-2 group"
                        >
                            <span className="material-symbols-outlined text-lg">badge</span>
                            Pehchan (Profile)
                        </Link>
                    </nav>

                    {/* User Actions */}
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-gray-300 hover:text-white transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-1 right-1 size-2 bg-jalebi-orange rounded-full animate-ping"></span>
                            <span className="absolute top-1 right-1 size-2 bg-jalebi-orange rounded-full"></span>
                        </button>
                        <div className="size-9 rounded-full bg-gradient-to-tr from-primary to-neon-blue p-[2px]">
                            <div className="size-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                                <div className="h-full w-full bg-gradient-to-tr from-primary to-neon-blue flex items-center justify-center text-black font-bold">
                                    B
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
