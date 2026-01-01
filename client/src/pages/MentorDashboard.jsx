import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, MessageSquare, Clock, Wallet,
    Star, Users, CheckCircle, ArrowRight, Brain,
    TrendingUp, Calendar, Zap, AlertCircle
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import PendingCallsManager from '../components/mentorship/PendingCallsManager';
import UpcomingCallsSchedule from '../components/mentorship/UpcomingCallsSchedule';

const MentorDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview'); // overview, doubts, schedule, wallet

    // Data States
    const [stats, setStats] = useState({
        earnings: 0,
        rating: 0,
        totalSessions: 0,
        activeDoubts: 0
    });
    const [assignedDoubts, setAssignedDoubts] = useState([]);
    const [availableDoubts, setAvailableDoubts] = useState([]);
    const [wallet, setWallet] = useState(null);
    const [mentorProfile, setMentorProfile] = useState(null);
    const [upcomingCalls, setUpcomingCalls] = useState([]); // Mock for now

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);

            // Parallel fetching
            const [
                assignedRes,
                availableRes,
                walletRes,
                mentorProfileRes
            ] = await Promise.allSettled([
                api.get('/doubts/mentor/assigned'),
                api.get('/doubts/mentor/available'),
                api.get('/wallet'),
                api.get('/mentors/me')
            ]);

            // Handle Assigned Doubts
            if (assignedRes.status === 'fulfilled' && assignedRes.value.data.success) {
                setAssignedDoubts(assignedRes.value.data.data?.doubts || []);
            }

            // Handle Available Doubts
            if (availableRes.status === 'fulfilled' && availableRes.value.data.success) {
                // API returns { success: true, data: { doubts: [], ... } }
                setAvailableDoubts(availableRes.value.data.data?.doubts || []);
            }

            // Handle Wallet
            if (walletRes.status === 'fulfilled' && walletRes.value.data.success) {
                setWallet(walletRes.value.data.data);
            }

            // Handle Mentor Profile
            if (mentorProfileRes.status === 'fulfilled' && mentorProfileRes.value.data.success) {
                setMentorProfile(mentorProfileRes.value.data.data);
            }

            // Handle Stats (Using wallet or profile data)
            // For now, deriving from other data

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClaimDoubt = async (doubtId) => {
        try {
            const response = await api.post(`/doubts/mentor/claim/${doubtId}`);
            if (response.data.success) {
                // Refresh data
                fetchAllData();
                setActiveTab('doubts'); // Switch to My Doubts
            }
        } catch (error) {
            console.error('Error claiming doubt:', error);
            alert('Failed to claim doubt');
        }
    };

    const toggleAvailability = async () => {
        try {
            const newStatus = !mentorProfile?.isOnline;
            const response = await api.patch('/mentors/availability', { isOnline: newStatus });
            if (response.data.success) {
                setMentorProfile(prev => ({ ...prev, isOnline: newStatus }));
            }
        } catch (error) {
            console.error('Error toggling availability:', error);
        }
    };

    if (loading) return <Loader />;

    const renderOverview = () => (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Wallet className="w-16 h-16 text-emerald-500" />
                    </div>
                    <p className="text-slate-400 text-sm mb-1">Total Earnings</p>
                    <h3 className="text-3xl font-black text-white">₹{wallet?.balance || 0}</h3>
                    <div className="mt-4 text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        +12% this week
                    </div>
                </div>

                <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Star className="w-16 h-16 text-amber-500" />
                    </div>
                    <p className="text-slate-400 text-sm mb-1">Mentor Rating</p>
                    <h3 className="text-3xl font-black text-white">{mentorProfile?.rating || 'New'}</h3>
                    <div className="mt-4 text-xs font-bold text-amber-400 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400" />
                        Top Rated
                    </div>
                </div>

                <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <MessageSquare className="w-16 h-16 text-cyan-500" />
                    </div>
                    <p className="text-slate-400 text-sm mb-1">Active Doubts</p>
                    <h3 className="text-3xl font-black text-white">{assignedDoubts.length}</h3>
                    <Link to="#" onClick={() => setActiveTab('doubts')} className="mt-4 text-xs font-bold text-cyan-400 hover:text-cyan-300 block">
                        View Active Chats &rarr;
                    </Link>
                </div>

                <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Clock className="w-16 h-16 text-violet-500" />
                    </div>
                    <p className="text-slate-400 text-sm mb-1">Avg Response</p>
                    <h3 className="text-3xl font-black text-white">2m</h3>
                    <div className="mt-4 text-xs font-bold text-violet-400">
                        Keep it under 5m
                    </div>
                </div>
            </div>

            {/* Quick Actions & Feed */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* Available Doubts Feed */}
                <div className="md:col-span-2 bg-slate-900/60 rounded-2xl border border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Zap className="w-5 h-5 text-amber-400" />
                            Doubts Pool
                        </h3>
                        <span className="text-xs font-bold bg-amber-500/20 text-amber-400 px-2 py-1 rounded-lg">
                            {availableDoubts.length} New
                        </span>
                    </div>
                    <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto">
                        {(!availableDoubts || availableDoubts.length === 0) ? (
                            <div className="p-8 text-center text-slate-500">
                                No new doubts available at the moment.
                            </div>
                        ) : (Array.isArray(availableDoubts) ? availableDoubts : []).map(doubt => (
                            <div key={doubt._id} className="p-4 hover:bg-white/5 transition-colors group">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="px-2 py-1 rounded bg-slate-800 text-cyan-400 text-xs font-bold uppercase">
                                        {doubt.subject}
                                    </span>
                                    <span className="text-emerald-400 font-bold text-sm">
                                        ₹{doubt.price || 49}
                                    </span>
                                </div>
                                <h4 className="text-white font-bold mb-1 truncate">{doubt.title}</h4>
                                <p className="text-slate-400 text-sm line-clamp-2 mb-3">
                                    {doubt.description}
                                </p>
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => handleClaimDoubt(doubt._id)}
                                        className="px-4 py-2 bg-white text-slate-900 font-bold rounded-lg text-sm hover:bg-cyan-400 transition-colors"
                                    >
                                        Claim Doubt
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-slate-800/50 text-center border-t border-white/5">
                        <button onClick={() => setActiveTab('doubts')} className="text-sm text-cyan-400 hover:text-cyan-300 font-bold">
                            View All Available &rarr;
                        </button>
                    </div>
                </div>

                {/* Right Column: Calls & Tips */}
                <div className="space-y-6">
                    {/* Pending Call Requests */}
                    <PendingCallsManager />

                    {/* Pro Tip */}
                    <div className="bg-gradient-to-br from-indigo-900 to-violet-900 rounded-2xl p-6 border border-white/10">
                        <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            Ambassador Program
                        </h4>
                        <p className="text-indigo-200 text-sm mb-4">
                            Refer other mentors and earn 5% of their lifetime earnings!
                        </p>
                        <button className="w-full py-2 bg-white text-indigo-900 font-bold rounded-lg text-sm hover:bg-indigo-50 transition-colors">
                            Copy Referral Link
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderDoubtsTab = () => (
        <div className="grid md:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
            {/* Available Column */}
            <div className="bg-slate-900/60 rounded-2xl border border-white/10 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-white/10 bg-slate-800/50 flex justify-between items-center">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <ActivityIcon className="w-4 h-4 text-emerald-400" />
                        Available for Claiming
                    </h3>
                    <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-300 text-xs font-bold">
                        {availableDoubts.length}
                    </span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {availableDoubts.map(doubt => (
                        <div key={doubt._id} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 transition-all">
                            <div className="flex justify-between mb-2">
                                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{doubt.subject}</span>
                                <span className="text-emerald-400 font-bold">₹{doubt.price || 49}</span>
                            </div>
                            <h4 className="text-white font-bold mb-2">{doubt.title}</h4>
                            <p className="text-slate-400 text-sm mb-4 line-clamp-2">{doubt.description}</p>
                            <button
                                onClick={() => handleClaimDoubt(doubt._id)}
                                className="w-full py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 rounded-lg hover:bg-cyan-500 hover:text-white transition-all text-sm font-bold"
                            >
                                Claim & Answer
                            </button>
                        </div>
                    ))}
                    {availableDoubts.length === 0 && (
                        <div className="text-center py-10 text-slate-500">
                            No new doubts available currently.
                        </div>
                    )}
                </div>
            </div>

            {/* My Active Column */}
            <div className="bg-slate-900/60 rounded-2xl border border-white/10 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-white/10 bg-slate-800/50 flex justify-between items-center">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-violet-400" />
                        My Active Chats
                    </h3>
                    <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-300 text-xs font-bold">
                        {assignedDoubts.length}
                    </span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {(Array.isArray(assignedDoubts) ? assignedDoubts : []).map(doubt => (
                        <Link
                            to={`/doubts/${doubt._id}`}
                            key={doubt._id}
                            className="block p-4 rounded-xl bg-violet-500/5 border border-violet-500/20 hover:bg-violet-500/10 transition-all"
                        >
                            <div className="flex justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span className="text-xs text-violet-300 font-bold">Active Now</span>
                                </div>
                                <span className="text-slate-500 text-xs">{new Date(doubt.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <h4 className="text-white font-bold mb-1">{doubt.title}</h4>
                            <p className="text-slate-400 text-sm line-clamp-1 mb-2">Student: {doubt.student?.name || 'Anonymous'}</p>
                        </Link>
                    ))}
                    {assignedDoubts.length === 0 && (
                        <div className="text-center py-10 text-slate-500">
                            You have no active doubts. Claim one to start!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderWalletTab = () => (
        <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-emerald-900 to-slate-900 rounded-2xl p-8 border border-emerald-500/30 relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-emerald-300 font-medium mb-1">Available Balance</p>
                    <h2 className="text-5xl font-black text-white mb-6">₹{wallet?.balance || 0}</h2>
                    <div className="flex gap-3">
                        <button className="px-6 py-2 bg-white text-emerald-900 font-bold rounded-lg hover:scale-105 transition-transform">
                            Withdraw
                        </button>
                        <button className="px-6 py-2 bg-emerald-500/20 text-emerald-300 font-bold rounded-lg border border-emerald-500/50 hover:bg-emerald-500/30 transition-colors">
                            Transaction History
                        </button>
                    </div>
                </div>
                <div className="absolute right-[-20%] bottom-[-20%] w-[60%] h-[60%] bg-emerald-500/20 rounded-full blur-[80px]" />
            </div>

            <div className="md:col-span-2 bg-slate-900/60 rounded-2xl border border-white/10 p-6">
                <h3 className="text-xl font-bold text-white mb-6">Recent Transactions</h3>
                <div className="space-y-4">
                    {/* Mock Data */}
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold">Doubt Resolution Payment</h4>
                                    <p className="text-slate-400 text-sm">Ref #TXT-88392{i}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-emerald-400 font-black text-lg">+ ₹49.00</p>
                                <p className="text-slate-500 text-xs">Today, 2:30 PM</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const ActivityIcon = Activity || Brain; // Fallback

    return (
        <div className="min-h-screen bg-[#020617] relative">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-white flex items-center gap-3">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-400">
                                Mentor Dashboard
                            </span>
                            <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-bold text-slate-400 border border-slate-700">
                                BETA
                            </span>
                        </h1>
                        <p className="text-slate-400 mt-1">
                            Welcome back, {user?.name?.split(' ')[0]}. You're doing great!
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            to="/doubts/mentor-analytics"
                            className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-lg hover:text-white transition-colors flex items-center gap-2"
                        >
                            <TrendingUp className="w-4 h-4" />
                            Detailed Analytics
                        </Link>
                        <button
                            onClick={toggleAvailability}
                            className={`px-4 py-2 font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg ${mentorProfile?.isOnline
                                ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/20'
                                : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                                }`}
                        >
                            <Zap className={`w-4 h-4 ${mentorProfile?.isOnline ? 'fill-current' : ''}`} />
                            {mentorProfile?.isOnline ? 'Online' : 'Go Online'}
                        </button>
                    </div>
                </header>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2 border-b border-slate-800">
                    {[
                        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                        { id: 'doubts', label: 'My Doubts', icon: MessageSquare },
                        { id: 'schedule', label: 'Schedule', icon: Calendar },
                        { id: 'wallet', label: 'Wallet', icon: Wallet },
                    ].map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 rounded-t-xl font-bold flex items-center gap-2 transition-all relative ${activeTab === tab.id
                                    ? 'text-cyan-400 bg-slate-800/50 border-b-2 border-cyan-400'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                                {tab.id === 'doubts' && assignedDoubts.length > 0 && (
                                    <span className="ml-2 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                                        {assignedDoubts.length}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Content Area */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'overview' && renderOverview()}
                        {activeTab === 'doubts' && renderDoubtsTab()}
                        {activeTab === 'wallet' && renderWalletTab()}
                        {activeTab === 'schedule' && (
                            <div className="space-y-6">
                                <UpcomingCallsSchedule />
                                <PendingCallsManager />
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

// Activity Icon Component (Lucide might not export Activity by active name sometimes)
const Activity = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
);

export default MentorDashboard;
