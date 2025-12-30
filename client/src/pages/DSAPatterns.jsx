import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Shuffle, RotateCcw, ChevronDown, ChevronRight,
    ExternalLink, Check, Sparkles, Target, Trophy, Zap, BookOpen
} from 'lucide-react';
import { dsaPatterns, calculateProgress, getAllItems } from '../data/dsaPatterns';

export default function DSAPatterns() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [expandedPatterns, setExpandedPatterns] = useState({});
    const [completedItems, setCompletedItems] = useState(() => {
        const saved = localStorage.getItem('dsa-completed-items');
        return saved ? JSON.parse(saved) : [];
    });

    const progress = useMemo(() => calculateProgress(completedItems), [completedItems]);

    const filteredPatterns = useMemo(() => {
        let patterns = [...dsaPatterns];

        if (searchTerm) {
            patterns = patterns.map(pattern => ({
                ...pattern,
                items: pattern.items.filter(item =>
                    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    pattern.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
            })).filter(pattern => pattern.items.length > 0);
        }

        if (activeFilter === 'revision') {
            patterns = patterns.map(pattern => ({
                ...pattern,
                items: pattern.items.filter(item => completedItems.includes(item.id))
            })).filter(pattern => pattern.items.length > 0);
        }

        return patterns;
    }, [searchTerm, activeFilter, completedItems]);

    const togglePattern = (patternId) => {
        setExpandedPatterns(prev => ({
            ...prev,
            [patternId]: !prev[patternId]
        }));
    };

    const toggleItemCompletion = (itemId, e) => {
        e.stopPropagation();
        setCompletedItems(prev => {
            const newCompleted = prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId];
            localStorage.setItem('dsa-completed-items', JSON.stringify(newCompleted));
            return newCompleted;
        });
    };

    const getRandomItem = () => {
        const allItems = getAllItems().filter(item => !completedItems.includes(item.id));
        if (allItems.length === 0) return null;
        return allItems[Math.floor(Math.random() * allItems.length)];
    };

    const handleRandomPattern = () => {
        const randomItem = getRandomItem();
        if (randomItem) {
            window.location.href = `/dsa/${randomItem.patternSlug}/${randomItem.slug}`;
        }
    };

    const getDifficultyStyle = (difficulty) => {
        switch (difficulty) {
            case 'easy':
                return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
            case 'medium':
                return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
            case 'hard':
                return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'theory':
                return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
            {/* Background Glow Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px]" />
            </div>

            <main className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        <span className="text-white">DSA </span>
                        <span className="bg-gradient-to-r from-orange-500 to-cyan-400 bg-clip-text text-transparent">
                            Patterns
                        </span>
                        <span className="text-white"> Sheet</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Ek pattern seekho, sau problems solve karo! Master DSA with our curated pattern-based approach.
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
                >
                    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-5 border border-gray-800/50 relative overflow-hidden group hover:border-orange-500/30 transition-all">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                            <Target className="w-8 h-8 text-orange-500 mb-3" />
                            <p className="text-3xl font-bold text-white">{progress.solved}</p>
                            <p className="text-gray-500 text-sm">Solved</p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-5 border border-gray-800/50 relative overflow-hidden group hover:border-cyan-500/30 transition-all">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                            <BookOpen className="w-8 h-8 text-cyan-400 mb-3" />
                            <p className="text-3xl font-bold text-white">{progress.total}</p>
                            <p className="text-gray-500 text-sm">Total Problems</p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-5 border border-gray-800/50 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                            <Trophy className="w-8 h-8 text-emerald-400 mb-3" />
                            <p className="text-3xl font-bold text-white">{progress.percentage}%</p>
                            <p className="text-gray-500 text-sm">Completed</p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-5 border border-gray-800/50 relative overflow-hidden group hover:border-purple-500/30 transition-all">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                            <Zap className="w-8 h-8 text-purple-400 mb-3" />
                            <p className="text-3xl font-bold text-white">{dsaPatterns.length}</p>
                            <p className="text-gray-500 text-sm">Patterns</p>
                        </div>
                    </div>
                </motion.div>

                {/* Difficulty Progress Bars */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-6 border border-gray-800/50 mb-10"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Easy */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-emerald-400 font-medium">Easy</span>
                                <span className="text-gray-400">{progress.easy.solved} / {progress.easy.total}</span>
                            </div>
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: progress.easy.total > 0 ? `${(progress.easy.solved / progress.easy.total) * 100}%` : '0%' }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                />
                            </div>
                        </div>
                        {/* Medium */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-amber-400 font-medium">Medium</span>
                                <span className="text-gray-400">{progress.medium.solved} / {progress.medium.total}</span>
                            </div>
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: progress.medium.total > 0 ? `${(progress.medium.solved / progress.medium.total) * 100}%` : '0%' }}
                                    transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
                                />
                            </div>
                        </div>
                        {/* Hard */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-red-400 font-medium">Hard</span>
                                <span className="text-gray-400">{progress.hard.solved} / {progress.hard.total}</span>
                            </div>
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: progress.hard.total > 0 ? `${(progress.hard.solved / progress.hard.total) * 100}%` : '0%' }}
                                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Search and Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col md:flex-row gap-4 mb-8"
                >
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search patterns or problems..."
                            className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
                        />
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveFilter('all')}
                            className={`px-5 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${activeFilter === 'all'
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                                    : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#252525] border border-gray-800'
                                }`}
                        >
                            <Sparkles className="w-4 h-4" />
                            All Patterns
                        </button>
                        <button
                            onClick={() => setActiveFilter('revision')}
                            className={`px-5 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${activeFilter === 'revision'
                                    ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/25'
                                    : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#252525] border border-gray-800'
                                }`}
                        >
                            <RotateCcw className="w-4 h-4" />
                            Revision
                        </button>
                        <button
                            onClick={handleRandomPattern}
                            className="px-5 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 bg-[#1a1a1a] text-gray-400 hover:bg-[#252525] border border-gray-800 hover:text-orange-400 hover:border-orange-500/30"
                        >
                            <Shuffle className="w-4 h-4" />
                            Random
                        </button>
                    </div>
                </motion.div>

                {/* Pattern Cards */}
                <div className="space-y-4">
                    {filteredPatterns.map((pattern, idx) => {
                        const isExpanded = expandedPatterns[pattern.id];
                        const patternCompleted = pattern.items.filter(item => completedItems.includes(item.id)).length;
                        const progressPercent = pattern.items.length > 0 ? (patternCompleted / pattern.items.length) * 100 : 0;

                        return (
                            <motion.div
                                key={pattern.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 * idx }}
                                className="group"
                            >
                                <div className={`bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl border transition-all duration-300 overflow-hidden ${isExpanded
                                        ? 'border-orange-500/30 shadow-lg shadow-orange-500/10'
                                        : 'border-gray-800/50 hover:border-gray-700'
                                    }`}>
                                    {/* Accordion Header */}
                                    <button
                                        onClick={() => togglePattern(pattern.id)}
                                        className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-cyan-500/20 flex items-center justify-center text-2xl border border-orange-500/20">
                                                {pattern.icon}
                                            </div>
                                            <div className="text-left">
                                                <h3 className="text-white font-semibold text-lg group-hover:text-orange-400 transition-colors">
                                                    {pattern.name}
                                                </h3>
                                                <p className="text-gray-500 text-sm">{pattern.items.length} problems</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            {/* Progress Bar */}
                                            <div className="hidden md:flex items-center gap-3 w-48">
                                                <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-gradient-to-r from-orange-500 to-cyan-400 rounded-full"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${progressPercent}%` }}
                                                        transition={{ duration: 0.5 }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium text-gray-400 min-w-[45px]">
                                                    {patternCompleted}/{pattern.items.length}
                                                </span>
                                            </div>
                                            <motion.div
                                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="w-8 h-8 rounded-lg bg-gray-800/50 flex items-center justify-center"
                                            >
                                                <ChevronDown className="w-5 h-5 text-gray-400" />
                                            </motion.div>
                                        </div>
                                    </button>

                                    {/* Problem List */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="border-t border-gray-800/50 px-5 py-4">
                                                    <div className="space-y-1">
                                                        {pattern.items.map((item, itemIdx) => {
                                                            const isCompleted = completedItems.includes(item.id);
                                                            return (
                                                                <motion.div
                                                                    key={item.id}
                                                                    initial={{ opacity: 0, x: -10 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{ delay: 0.03 * itemIdx }}
                                                                    className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-white/[0.03] transition-all group/item"
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <button
                                                                            onClick={(e) => toggleItemCompletion(item.id, e)}
                                                                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isCompleted
                                                                                    ? 'bg-gradient-to-r from-orange-500 to-cyan-500 border-transparent'
                                                                                    : 'border-gray-600 hover:border-orange-500'
                                                                                }`}
                                                                        >
                                                                            {isCompleted && <Check className="w-3 h-3 text-white" />}
                                                                        </button>
                                                                        <Link
                                                                            to={`/dsa/${pattern.slug}/${item.slug}`}
                                                                            className={`text-sm font-medium transition-colors ${isCompleted
                                                                                    ? 'text-gray-500 line-through'
                                                                                    : 'text-white group-hover/item:text-orange-400'
                                                                                }`}
                                                                        >
                                                                            {item.title}
                                                                        </Link>
                                                                        <span className={`text-xs px-2.5 py-0.5 rounded-full border ${getDifficultyStyle(item.difficulty)}`}>
                                                                            {item.difficulty === 'theory' ? '📚 Theory' : item.difficulty}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                                                        <Link
                                                                            to={`/dsa/${pattern.slug}/${item.slug}`}
                                                                            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-orange-400 transition-colors"
                                                                        >
                                                                            <ChevronRight className="w-4 h-4" />
                                                                        </Link>
                                                                        {item.externalLink && (
                                                                            <a
                                                                                href={item.externalLink}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-cyan-400 transition-colors"
                                                                                onClick={(e) => e.stopPropagation()}
                                                                            >
                                                                                <ExternalLink className="w-4 h-4" />
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                </motion.div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {filteredPatterns.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-gray-400 text-lg">No patterns found matching your search.</p>
                        <button
                            onClick={() => setSearchTerm('')}
                            className="mt-4 text-orange-400 hover:text-orange-300 transition-colors"
                        >
                            Clear search
                        </button>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
