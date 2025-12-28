export default function Stats({ userData }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {/* Streak Card */}
            <div className="glass-panel p-5 rounded-lg border-l-4 border-l-jalebi-orange relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 text-white/5 transition-transform group-hover:scale-110 group-hover:rotate-12">
                    <span className="material-symbols-outlined text-9xl">local_fire_department</span>
                </div>
                <div className="relative z-10">
                    <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Streak Ki Aag</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-white">{userData?.streakCount || 12} Days</h3>
                        <span className="text-jalebi-orange text-sm font-bold animate-pulse">FIRE!</span>
                    </div>
                    <p className="text-green-400 text-xs mt-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">trending_up</span> +1 Day today
                    </p>
                </div>
            </div>

            {/* Points Card */}
            <div className="glass-panel p-5 rounded-lg border-l-4 border-l-neon-blue relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 text-white/5 transition-transform group-hover:scale-110 group-hover:rotate-12">
                    <span className="material-symbols-outlined text-9xl">change_history</span>
                </div>
                <div className="relative z-10">
                    <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Samosa Points</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-white">{userData?.babuaCoins || 420}</h3>
                        <span className="text-neon-blue text-sm font-bold">XP</span>
                    </div>
                    <p className="text-green-400 text-xs mt-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">add_circle</span> 50 earned recently
                    </p>
                </div>
            </div>

            {/* Rank Card */}
            <div className="glass-panel p-5 rounded-lg border-l-4 border-l-primary relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 text-white/5 transition-transform group-hover:scale-110 group-hover:rotate-12">
                    <span className="material-symbols-outlined text-9xl">military_tech</span>
                </div>
                <div className="relative z-10">
                    <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Global Rank</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-white">Babua Pro</h3>
                        <span className="text-primary text-sm font-bold">#{userData?.globalRank || 892}</span>
                    </div>
                    <p className="text-green-400 text-xs mt-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">arrow_upward</span> Top 15%
                    </p>
                </div>
            </div>
        </div>
    );
}
