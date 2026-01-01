import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Home, Mic, RotateCcw, Gift, ArrowRight, Bell,
    CheckCircle2, Code2, Layers, Database, MessageCircle,
    Zap, Sparkles, Brain, Layout, Settings as SettingsIcon
} from 'lucide-react';
import RevisionSession from '../components/revision/RevisionSession';
import RevisionResults from '../components/revision/RevisionResults';
import { dsaCourseData } from '../data/dsaCourse';
import { courseData as sdCourseData } from '../data/systemDesignCourse';
import { dbmsCourseData } from '../data/dbmsCourse';
import AdaptiveRevision from './AdaptiveRevision';
import UserProfileDropdown from '../components/common/UserProfileDropdown';

function ManualRevision() {
    const { user } = useAuth();
    const [step, setStep] = useState('selection');
    const [selectedCourse, setSelectedCourse] = useState('dsa');
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [duration, setDuration] = useState(30);
    const [sessionResults, setSessionResults] = useState(null);

    const userName = user?.name?.split(' ')[0] || 'Coder';

    const courses = [
        { id: 'dsa', name: 'DSA', icon: Code2, data: dsaCourseData },
        { id: 'system-design', name: 'System Design', icon: Layers, data: sdCourseData },
        { id: 'dbms', name: 'DBMS', icon: Database, data: dbmsCourseData }
    ];

    const getTopics = () => courses.find(c => c.id === selectedCourse)?.data.sections || [];

    const handleStart = () => {
        if (!selectedTopic) return;
        setStep('session');
    };

    const handleFinish = (results) => {
        setSessionResults(results);
        setStep('results');
    };

    const handleRetry = () => {
        setStep('selection');
        setSessionResults(null);
        setSelectedTopic(null);
    };

    return (
        <div className="min-h-screen bg-[#111111] text-gray-200">

            {/* Subtle grain overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}></div>



            {/* Main Content */}
            <main className="relative z-10 container mx-auto px-4 py-10">

                {step === 'selection' && (
                    <div className="max-w-5xl mx-auto">

                        {/* Header */}
                        <div className="mb-10">
                            <h1 className="text-2xl font-semibold text-gray-100 mb-2">
                                Revision Session
                            </h1>
                            <p className="text-gray-500 text-sm">Practice a topic in interview-style format</p>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-10">

                            {/* Left Panel: Controls */}
                            <div className="space-y-8">

                                {/* Choose Domain */}
                                <div>
                                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                                        Choose a domain
                                    </h3>
                                    <div className="space-y-1">
                                        {courses.map(course => {
                                            const isSelected = selectedCourse === course.id;
                                            return (
                                                <button
                                                    key={course.id}
                                                    onClick={() => { setSelectedCourse(course.id); setSelectedTopic(null); }}
                                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all text-left ${isSelected
                                                        ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                                                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                                                        }`}
                                                >
                                                    <course.icon className="w-4 h-4" />
                                                    <span className="font-medium text-sm">{course.name}</span>
                                                    {isSelected && <CheckCircle2 className="w-4 h-4 ml-auto" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Session Length */}
                                <div>
                                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                                        Session length
                                    </h3>
                                    <div className="flex gap-2">
                                        {[20, 30].map(mins => (
                                            <button
                                                key={mins}
                                                onClick={() => setDuration(mins)}
                                                className={`flex-1 py-3 rounded-md font-medium text-sm transition-all ${duration === mins
                                                    ? 'bg-orange-500 text-white'
                                                    : 'bg-gray-800/50 text-gray-500 hover:text-gray-300 hover:bg-gray-800'
                                                    }`}
                                            >
                                                {mins} min
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Begin Button */}
                                <button
                                    onClick={handleStart}
                                    disabled={!selectedTopic}
                                    className={`w-full py-4 rounded-md flex items-center justify-center gap-2 font-medium text-sm transition-all ${!selectedTopic
                                        ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                                        : 'bg-orange-500 text-white hover:bg-orange-600 active:scale-[0.98]'
                                        }`}
                                >
                                    Begin Revision
                                    <ArrowRight className="w-4 h-4" />
                                </button>

                                {/* How it works - simplified */}
                                <div className="pt-6 border-t border-gray-800/50">
                                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                                        How this session works
                                    </h4>
                                    <ul className="text-xs text-gray-500 space-y-2">
                                        <li>• Questions generated from your selected topic</li>
                                        <li>• Mix of MCQ, code, and conceptual prompts</li>
                                        <li>• Timed session, no pauses allowed</li>
                                        <li>• Focus on syllabus-relevant content only</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Right Panel: Topic Selection */}
                            <div className="lg:col-span-2">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Select a topic
                                    </h3>
                                    <span className="text-xs text-gray-600">{getTopics().length} available</span>
                                </div>

                                <div className="max-h-[500px] overflow-y-auto pr-1">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {getTopics().map((topic, idx) => {
                                            const isSelected = selectedTopic?.id === topic.id;
                                            return (
                                                <button
                                                    key={topic.id}
                                                    onClick={() => setSelectedTopic(topic)}
                                                    className={`group p-3 rounded-md text-left transition-all ${isSelected
                                                        ? 'bg-orange-500/10 border border-orange-500/30'
                                                        : 'bg-gray-900/30 hover:bg-gray-800/50 border border-transparent'
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between mb-1">
                                                        <span className={`text-[10px] font-mono ${isSelected ? 'text-orange-400' : 'text-gray-600'
                                                            }`}>
                                                            {String(idx + 1).padStart(2, '0')}
                                                        </span>
                                                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />}
                                                    </div>
                                                    <h4 className={`font-medium text-xs leading-snug line-clamp-2 ${isSelected ? 'text-orange-300' : 'text-gray-400 group-hover:text-gray-200'
                                                        }`}>
                                                        {topic.title}
                                                    </h4>
                                                    {topic.lessons && (
                                                        <p className={`text-[10px] mt-1.5 ${isSelected ? 'text-orange-400/60' : 'text-gray-600'}`}>
                                                            {topic.lessons.length} lessons
                                                        </p>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Session Mode */}
                {(step === 'session' || step === 'results') && (
                    <div className="max-w-4xl mx-auto">
                        {step === 'session' && selectedTopic && (
                            <RevisionSession
                                course={courses.find(c => c.id === selectedCourse)?.name}
                                topic={selectedTopic}
                                topicData={selectedTopic}
                                duration={duration}
                                onFinish={handleFinish}
                                themeColor="orange"
                            />
                        )}

                        {step === 'results' && sessionResults && (
                            <RevisionResults
                                results={sessionResults}
                                onRetry={handleRetry}
                                themeColor="orange"
                            />
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

export default function RevisionPage() {
    const { user, token } = useAuth();
    const [mode, setMode] = useState(null); // 'adaptive', 'manual', or null (loading/unset)
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const checkPreference = async () => {
            if (!user) {
                setShowModal(true);
                setLoading(false);
                return;
            }

            try {
                // Fetch fresh profile to get revisionMode
                const res = await fetch(`${API_URL}/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();

                if (data.success) {
                    const pref = data.data.revisionMode;
                    if (pref && pref !== 'unset') {
                        setMode(pref);
                    } else {
                        const hasSeen = localStorage.getItem('hasSeenRevisionModeModal');
                        if (!hasSeen) setShowModal(true);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch preference:', error);
                const hasSeen = localStorage.getItem('hasSeenRevisionModeModal');
                if (!hasSeen) setShowModal(true);
            } finally {
                setLoading(false);
            }
        };

        checkPreference();
    }, [user, token]);

    const handleSelectMode = async (selectedMode) => {
        try {
            setMode(selectedMode);
            setShowModal(false);
            localStorage.setItem('hasSeenRevisionModeModal', 'true');

            // Save preference
            await fetch(`${API_URL}/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ revisionMode: selectedMode })
            });

        } catch (error) {
            console.error('Failed to save preference:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#111111]">
                <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // Wrap mode content
    return (
        <>
            {/* Preferences Alert */}
            {mode && mode !== 'unset' && !showModal && (
                <div className="max-w-7xl mx-auto px-4 mt-6 mb-4 relative z-20">
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex items-center justify-between backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-500/20 rounded-lg">
                                <Zap className="w-5 h-5 text-orange-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-orange-200">
                                    Currently in <span className="text-white font-bold uppercase">{mode} Mode</span>
                                </p>
                                <p className="text-xs text-orange-100/50">
                                    Want to switch strategy? You can change this anytime.
                                </p>
                            </div>
                        </div>
                        <Link
                            to="/settings"
                            className="px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 text-sm font-medium rounded-lg transition-colors border border-orange-500/10 flex items-center gap-2"
                        >
                            <SettingsIcon className="w-4 h-4" />
                            Settings
                        </Link>
                    </div>
                </div>
            )}
            {/* If Adaptive Mode is selected, render AdaptiveRevision */}
            {mode === 'adaptive' && <AdaptiveRevision />}

            {/* If Manual Mode is selected, render ManualRevision */}
            {mode === 'manual' && <ManualRevision />}

            {/* If no mode yet (or explicitly modal open), show Modal Overlay */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

                    <div className="relative bg-[#1a1a1a] border border-gray-800 rounded-2xl max-w-2xl w-full p-8 overflow-hidden shadow-2xl">
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                        <div className="relative z-10 text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/20">
                                <Brain className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Choose Your Revision Style</h2>
                            <p className="text-gray-400">How do you want to prepare for your interviews?</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Adaptive Option */}
                            <button
                                onClick={() => handleSelectMode('adaptive')}
                                className="group relative p-6 bg-gray-900/50 hover:bg-orange-950/30 border border-gray-800 hover:border-orange-500/50 rounded-xl text-left transition-all hover:scale-[1.02]"
                            >
                                <div className="absolute top-4 right-4 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4 text-orange-400">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Adaptive AI Mode</h3>
                                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                                    We create a personalized plan based on your weak areas using spaced repetition.
                                </p>
                                <span className="inline-block px-2 py-1 bg-orange-500/20 text-orange-400 text-[10px] font-bold uppercase tracking-wider rounded">Recommended</span>
                            </button>

                            {/* Manual Option */}
                            <button
                                onClick={() => handleSelectMode('manual')}
                                className="group relative p-6 bg-gray-900/50 hover:bg-blue-950/30 border border-gray-800 hover:border-blue-500/50 rounded-xl text-left transition-all hover:scale-[1.02]"
                            >
                                <div className="absolute top-4 right-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 text-blue-400">
                                    <Layout className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Manual Mode</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    You choose exactly what topics to revise and when. Full control over your schedule.
                                </p>
                            </button>
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-xs text-gray-600">
                                You can change this later in your <span className="text-gray-400">Profile Settings</span>.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
