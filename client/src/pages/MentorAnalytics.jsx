import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp, TrendingDown, DollarSign, Clock, Users,
    Star, Award, Zap, Activity, Calendar
} from 'lucide-react';
import api from '../services/api';

const MentorAnalytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('month'); // week, month, all

    useEffect(() => {
        fetchAnalytics();
    }, [timeRange]);

    const fetchAnalytics = async () => {
        try {
            // In a real app, passing timeRange would filter backend data
            const response = await api.get('/doubts/analytics/mentor');
            if (response.data.success) {
                setAnalytics(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <Activity className="w-16 h-16 text-orange-400 animate-pulse" />
            </div>
        );
    }

    const earnings = analytics?.earnings || { total: 0, thisMonth: 0 };
    const performance = analytics?.performance || { avgResponseTime: 0, resolutionRate: 0, avgRating: 0 };
    const topicStats = analytics?.topicStats || [];
    const recentActivity = analytics?.recentActivity || []; // Placeholder if not in backend yet

    return (
        <div className="min-h-screen bg-[#020617] relative overflow-hidden">
            {/* Background */}
            <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="fixed bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="relative z-10 container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-4xl font-black text-white mb-2">Mentor Dashboard</h1>
                        <p className="text-slate-400">Track your impact, earnings, and performance</p>
                    </motion.div>

                    <div className="flex bg-slate-900/60 rounded-xl p-1 border border-white/10">
                        {['week', 'month', 'all'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${timeRange === range
                                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                                        : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-white/10 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <DollarSign className="w-24 h-24 text-emerald-500" />
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-emerald-500/20 rounded-lg">
                                <DollarSign className="w-6 h-6 text-emerald-400" />
                            </div>
                            <span className="text-emerald-400 font-bold text-sm">+12% this month</span>
                        </div>
                        <p className="text-3xl font-black text-white mb-1">₹{earnings.total}</p>
                        <p className="text-sm text-slate-400">Total Earnings</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-amber-500/20 rounded-lg">
                                <Star className="w-6 h-6 text-amber-400" />
                            </div>
                            <span className="text-amber-400 font-bold text-sm">{performance.avgRating}/5.0</span>
                        </div>
                        <p className="text-3xl font-black text-white mb-1">High Quality</p>
                        <p className="text-sm text-slate-400">Average Rating</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-violet-500/20 rounded-lg">
                                <Clock className="w-6 h-6 text-violet-400" />
                            </div>
                            <span className="text-violet-400 font-bold text-sm">Target: &lt;30m</span>
                        </div>
                        <p className="text-3xl font-black text-white mb-1">{performance.avgResponseTime}m</p>
                        <p className="text-sm text-slate-400">Avg Response Time</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-cyan-500/20 rounded-lg">
                                <Users className="w-6 h-6 text-cyan-400" />
                            </div>
                            <span className="text-cyan-400 font-bold text-sm">{performance.resolutionRate}% Success</span>
                        </div>
                        <p className="text-3xl font-black text-white mb-1">{analytics?.totalDoubtsResolved || 0}</p>
                        <p className="text-sm text-slate-400">Doubts Resolved</p>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Topic Performance */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
                    >
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Award className="w-5 h-5 text-orange-400" />
                            Topic Performance
                        </h2>

                        <div className="space-y-6">
                            {topicStats.length === 0 ? (
                                <p className="text-slate-400 text-center py-8">No topic data available yet.</p>
                            ) : topicStats.map((topic, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-white font-medium">{topic.subTopic} ({topic.subject})</span>
                                        <span className="text-slate-400">{topic.count} doubts</span>
                                    </div>
                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(topic.count / Math.max(...topicStats.map(t => t.count))) * 100}%` }}
                                            transition={{ duration: 1, delay: 0.5 + (idx * 0.1) }}
                                            className="h-full bg-gradient-to-r from-orange-500 to-amber-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Earnings Trend (Placeholder Visualization) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
                    >
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                            Earning Potential
                        </h2>

                        <div className="flex items-end justify-between h-48 gap-2 mb-4 px-2">
                            {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                                <div key={i} className="w-full bg-slate-800 rounded-t-lg relative group overflow-hidden">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        transition={{ duration: 0.8, delay: 0.6 + (i * 0.1) }}
                                        className="absolute bottom-0 w-full bg-gradient-to-t from-emerald-500/50 to-emerald-400 rounded-t-lg group-hover:from-emerald-500 group-hover:to-emerald-300 transition-all"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between text-xs text-slate-500 px-2 uppercase font-bold tracking-wider">
                            <span>Mon</span>
                            <span>Tue</span>
                            <span>Wed</span>
                            <span>Thu</span>
                            <span>Fri</span>
                            <span>Sat</span>
                            <span>Sun</span>
                        </div>

                        <div className="mt-6 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                            <h4 className="text-emerald-400 font-bold mb-1 flex items-center gap-2">
                                <Zap className="w-4 h-4" /> Pro Tip
                            </h4>
                            <p className="text-sm text-emerald-100/70">
                                Weekends see 40% higher doubt volume. Log in on Saturdays to maximize earnings!
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default MentorAnalytics;
