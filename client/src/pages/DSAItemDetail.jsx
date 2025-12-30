import { useState, useEffect, useRef, useCallback } from 'react';

function LectureNoteViewer({ url, noteOptions }) {
    const [scale, setScale] = useState(1);
    const [selectedNoteIndex, setSelectedNoteIndex] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [isDownloading, setIsDownloading] = useState(false);
    const containerRef = useRef(null);

    // Determine the actual URL to display
    const displayUrl = noteOptions && noteOptions.length > 0
        ? noteOptions[selectedNoteIndex].url
        : url;

    const zoomIn = () => setScale(s => Math.min(10, +(s + 0.5).toFixed(2)));
    const zoomOut = () => setScale(s => Math.max(0.25, +(s - 0.5).toFixed(2)));
    const reset = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    // Mouse wheel zoom
    const handleWheel = useCallback((e) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const delta = -e.deltaY * 0.001;
            setScale(s => Math.min(10, Math.max(0.25, +(s + delta * s).toFixed(2))));
        }
    }, []);

    // Drag to pan
    const handleMouseDown = (e) => {
        if (e.button !== 0) return; // Only left click
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        e.currentTarget.style.cursor = 'grabbing';
    };

    const handleMouseMove = useCallback((e) => {
        if (!isDragging) return;
        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    }, [isDragging, dragStart]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    // Proper download function for cross-origin files
    const handleDownload = async () => {
        try {
            setIsDownloading(true);
            const response = await fetch(displayUrl);
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            // Extract filename from URL
            const filename = displayUrl.split('/').pop() || 'lecture-notes.svg';
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('Download failed:', error);
            // Fallback: open in new tab
            window.open(displayUrl, '_blank');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                    <button
                        onClick={zoomOut}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1f1f1f] border border-gray-700 text-gray-300 hover:bg-[#272727] transition-colors text-lg font-bold"
                        title="Zoom out"
                    >
                        −
                    </button>
                    <span className="px-3 py-2 rounded-lg bg-[#1f1f1f] border border-gray-700 text-cyan-400 min-w-[60px] text-center text-sm">
                        {Math.round(scale * 100)}%
                    </span>
                    <button
                        onClick={zoomIn}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1f1f1f] border border-gray-700 text-gray-300 hover:bg-[#272727] transition-colors text-lg font-bold"
                        title="Zoom in"
                    >
                        +
                    </button>
                    <button
                        onClick={reset}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1f1f1f] border border-gray-700 text-gray-300 hover:bg-[#272727] transition-colors text-sm"
                        title="Reset zoom & position"
                    >
                        Reset
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    {/* Notes selector dropdown when multiple options exist */}
                    {noteOptions && noteOptions.length > 1 && (
                        <select
                            value={selectedNoteIndex}
                            onChange={(e) => {
                                setSelectedNoteIndex(Number(e.target.value));
                                setPosition({ x: 0, y: 0 }); // Reset position on note change
                            }}
                            className="px-3 py-2 rounded-lg bg-[#1f1f1f] border border-gray-700 text-orange-400 hover:bg-[#272727] transition-colors cursor-pointer"
                        >
                            {noteOptions.map((option, idx) => (
                                <option key={idx} value={idx} className="bg-[#1f1f1f]">
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    )}

                    <a
                        href={displayUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1f1f1f] border border-gray-700 text-orange-400 hover:bg-[#272727] transition-colors"
                        title="Open in new tab"
                    >
                        🔗 Open
                    </a>
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1f1f1f] border border-gray-700 text-cyan-400 hover:bg-[#272727] transition-colors disabled:opacity-50"
                    >
                        {isDownloading ? '⏳ Downloading...' : '⬇️ Download'}
                    </button>
                </div>
            </div>

            <div className="text-xs text-gray-500 text-center">
                💡 Drag to pan • Ctrl+Scroll to zoom • Click Reset to restore
            </div>

            <div
                ref={containerRef}
                className="relative h-[520px] w-full bg-[#0f0f0f] border border-gray-800 rounded-2xl overflow-hidden"
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                onMouseDown={handleMouseDown}
                onWheel={handleWheel}
            >
                <img
                    src={displayUrl}
                    alt="Lecture Notes"
                    draggable={false}
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        transformOrigin: 'center center',
                        userSelect: 'none'
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-none"
                />
            </div>
        </div>
    );
}


import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft, ArrowRight, Check, BookOpen, Code2, MessageSquare, FileText,
    Copy, CheckCircle, ExternalLink, ThumbsUp, Clock,
    ChevronDown, ChevronUp, Send, User
} from 'lucide-react';
import { getPatternBySlug, getItemBySlug, dsaPatterns } from '../data/dsaPatterns';
// import CtoBhaiyaClipPlayer from '../components/CtoBhaiyaClipPlayer';
// import LockedCodeViewer from '../components/LockedCodeViewer';
// import { getCtoBhaiyaClip } from '../services/ctoBhaiyaClipsService';

// Mock discussion data
const mockDiscussions = [
    {
        id: '1',
        author: 'Rahul Bhaiya',
        avatar: 'R',
        content: `## My Intuition\n\nThe key insight here is that we can use a sliding window approach. Instead of recalculating the sum for each window, we just slide the window by:\n\n1. Adding the new element on the right\n2. Removing the old element from the left\n\nThis gives us O(n) time complexity!`,
        likes: 42,
        timestamp: '2 hours ago',
        replies: [
            {
                id: '1-1',
                author: 'Priya',
                avatar: 'P',
                content: 'Bhai ekdum sahi samjhaya! 🔥',
                likes: 12,
                timestamp: '1 hour ago'
            }
        ]
    },
    {
        id: '2',
        author: 'Amit',
        avatar: 'A',
        content: `### Alternative Approach\n\nYou can also think of this as a two-pointer problem where both pointers move in the same direction, maintaining a fixed window size.\n\n\`\`\`python\nfor i in range(k, n):\n    sum += arr[i] - arr[i-k]\n\`\`\``,
        likes: 28,
        timestamp: '5 hours ago',
        replies: []
    }
];

export default function DSAItemDetail() {
    const { patternSlug, itemSlug } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('theory');
    const [isCompleted, setIsCompleted] = useState(false);
    const [activeCodeLang, setActiveCodeLang] = useState('cpp');
    const [copiedCode, setCopiedCode] = useState(false);
    const [discussions, setDiscussions] = useState(mockDiscussions);
    const [newComment, setNewComment] = useState('');
    const [sortBy, setSortBy] = useState('likes');
    const [expandedApproaches, setExpandedApproaches] = useState({ 0: true });
    const [ctoClip, setCtoClip] = useState(null);
    const [ctoClipLoaded, setCtoClipLoaded] = useState(false);

    const pattern = getPatternBySlug(patternSlug);
    const item = getItemBySlug(patternSlug, itemSlug);

    // Get current item index and adjacent items for navigation
    const currentIndex = pattern?.items?.findIndex(i => i.slug === itemSlug) ?? -1;
    const prevItem = currentIndex > 0 ? pattern?.items[currentIndex - 1] : null;
    const nextItem = currentIndex >= 0 && currentIndex < (pattern?.items?.length ?? 0) - 1
        ? pattern?.items[currentIndex + 1]
        : null;

    const goToPrevious = () => {
        if (prevItem) navigate(`/dsa/${patternSlug}/${prevItem.slug}`);
    };

    const goToNext = () => {
        if (nextItem) navigate(`/dsa/${patternSlug}/${nextItem.slug}`);
    };

    useEffect(() => {
        // Check if completed from localStorage
        const saved = localStorage.getItem('dsa-completed-items');
        const completed = saved ? JSON.parse(saved) : [];
        setIsCompleted(completed.includes(item?.id));
    }, [item?.id]);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            if (!pattern?.name || !item?.title) return;

            setCtoClipLoaded(false);
            // const clip = await getCtoBhaiyaClip({
            //     pattern: pattern.name,
            //     question: item.title
            // });

            // if (cancelled) return;
            // setCtoClip(clip);
            setCtoClip(null);
            setCtoClipLoaded(true);
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [pattern?.name, item?.title]);

    const toggleComplete = () => {
        const saved = localStorage.getItem('dsa-completed-items');
        let completed = saved ? JSON.parse(saved) : [];

        if (isCompleted) {
            completed = completed.filter(id => id !== item.id);
        } else {
            completed.push(item.id);
        }

        localStorage.setItem('dsa-completed-items', JSON.stringify(completed));
        setIsCompleted(!isCompleted);
    };

    const copyCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
    };

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        const newDiscussion = {
            id: String(Date.now()),
            author: 'You',
            avatar: 'Y',
            content: newComment,
            likes: 0,
            timestamp: 'Just now',
            replies: []
        };

        setDiscussions([newDiscussion, ...discussions]);
        setNewComment('');
    };

    const sortedDiscussions = [...discussions].sort((a, b) => {
        if (sortBy === 'likes') return b.likes - a.likes;
        if (sortBy === 'newest') return 0; // Already in order
        return 0;
    });

    if (!pattern || !item) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Item not found</h2>
                    <Link to="/dsa" className="text-orange-500 hover:underline">
                        ← Back to DSA Patterns
                    </Link>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'theory', label: 'Theory', icon: BookOpen },
        { id: 'solution', label: 'Solution', icon: Code2 },
        { id: 'notes', label: 'Lecture Notes', icon: FileText },
        { id: 'discussion', label: 'Discussion', icon: MessageSquare }
    ];

    return (
        <div key={itemSlug} className="min-h-screen bg-[#0f0f0f]">
            {/* Top Navigation Bar - NeetCode Style */}
            <header className="bg-[#1a1a1a] border-b border-gray-800 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        {/* Left Section - Pattern Info */}
                        <div className="flex items-center gap-4">
                            <Link
                                to="/dsa"
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
                            >
                                <span className="text-xl">{pattern.icon}</span>
                                <span className="font-medium">{pattern.name}</span>
                            </Link>
                            {item.externalLink && (
                                <a
                                    href={item.externalLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-500 hover:text-orange-400 transition-colors"
                                    title="Open on LeetCode"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            )}

                            {/* Navigation Arrows */}
                            <div className="flex items-center gap-1 ml-2">
                                <button
                                    onClick={goToPrevious}
                                    disabled={!prevItem}
                                    className={`p-2 rounded-lg transition-colors ${prevItem
                                        ? 'text-gray-400 hover:text-white hover:bg-white/5'
                                        : 'text-gray-700 cursor-not-allowed'}`}
                                    title={prevItem ? `← ${prevItem.title}` : 'No previous'}
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={goToNext}
                                    disabled={!nextItem}
                                    className={`p-2 rounded-lg transition-colors ${nextItem
                                        ? 'text-gray-400 hover:text-white hover:bg-white/5'
                                        : 'text-gray-700 cursor-not-allowed'}`}
                                    title={nextItem ? `→ ${nextItem.title}` : 'No next'}
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Right Section - Problem Info & Actions */}
                        <div className="flex items-center gap-4">
                            {/* Problem Counter */}
                            <span className="text-sm text-gray-500">
                                {currentIndex + 1} / {pattern.items.length}
                            </span>

                            {/* Difficulty Badge */}
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.difficulty === 'easy'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : item.difficulty === 'medium'
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                    : item.difficulty === 'theory'
                                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                }`}>
                                {item.difficulty === 'theory' ? '📚 Theory' : item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
                            </span>

                            {/* Completion Toggle */}
                            <button
                                onClick={toggleComplete}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${isCompleted
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-[#252525] text-gray-400 border border-gray-700 hover:border-orange-500/50 hover:text-orange-400'
                                    }`}
                            >
                                {isCompleted ? (
                                    <>
                                        <CheckCircle className="w-4 h-4" />
                                        Done
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-4 h-4" />
                                        Mark Done
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Problem Title Section */}
            <div className="bg-[#0f0f0f] border-b border-gray-800/50">
                <div className="container mx-auto px-4 py-4">
                    <h1 className="text-xl md:text-2xl font-bold text-white">{item.title}</h1>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-[#0a0a0a] border-b border-gray-800">
                <div className="container mx-auto px-4">
                    <div className="flex gap-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative ${activeTab === tab.id
                                    ? 'text-orange-400'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Theory Tab */}
                {activeTab === 'theory' && item.theory && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-4xl"
                    >
                        {/* Video Explanation (CTO Bhaiya) */}
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-white mb-4">Video Explanation (CTO Bhaiya)</h2>
                            {/* {ctoClip?.videoId ? (
                                <CtoBhaiyaClipPlayer
                                    videoId={ctoClip.videoId}
                                    startTime={ctoClip.startTime}
                                    endTime={ctoClip.endTime}
                                    title={ctoClip.question || item.title}
                                    fallbackSummary="If the video doesn’t load, use the written explanation below."
                                />
                            ) : ctoClipLoaded ? ( */}
                            {ctoClipLoaded ? (
                                <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800 flex items-center justify-center min-h-[200px]">
                                    <div className="text-center text-gray-500">
                                        <p>Video explanation coming soon</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800 flex items-center justify-center min-h-[200px]">
                                    <div className="text-center text-gray-500">
                                        <p>Loading video…</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Main Explanation */}
                        {/* Problem Description */}
                        <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800 mb-6">
                            <h2 className="text-xl font-bold text-white mb-4">Problem Description</h2>
                            <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                                {item.description ? (
                                    <div dangerouslySetInnerHTML={{ __html: item.description }} />
                                ) : (
                                    item.theory.explanation
                                )}
                            </div>
                        </div>
                    </motion.div>
                )
                }

                {/* Solution Tab */}
                {
                    activeTab === 'solution' && item.solutions && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-4xl"
                        >
                            {/* Locked Code Viewer (CTO Bhaiya) */}
                            {/* {ctoClip?.videoId && (ctoClip.javaCode || ctoClip.cppCode || ctoClip.intuition) && (
                                <div className="mb-6">
                                    <LockedCodeViewer
                                        javaCode={ctoClip.javaCode}
                                        cppCode={ctoClip.cppCode}
                                        intuition={ctoClip.intuition}
                                        videoId={ctoClip.videoId}
                                        startTime={ctoClip.startTime}
                                        endTime={ctoClip.endTime}
                                    />
                                </div>
                            )} */}


                            {/* Code Viewer - Primary Solution */}
                            {item.solutions.code && (
                                <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden">
                                    {/* Language Tabs */}
                                    <div className="flex items-center justify-between border-b border-gray-800 px-4">
                                        <div className="flex">
                                            {Object.keys(item.solutions.code).map((lang) => (
                                                <button
                                                    key={lang}
                                                    onClick={() => setActiveCodeLang(lang)}
                                                    className={`px-4 py-3 text-sm font-medium transition-colors relative ${activeCodeLang === lang
                                                        ? 'text-orange-400'
                                                        : 'text-gray-400 hover:text-white'
                                                        }`}
                                                >
                                                    {lang === 'cpp' ? 'C++' : lang === 'java' ? 'Java' : 'Python'}
                                                    {activeCodeLang === lang && (
                                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => copyCode(item.solutions.code[activeCodeLang])}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${copiedCode
                                                ? 'bg-emerald-500/20 text-emerald-400'
                                                : 'bg-gray-800 text-gray-400 hover:text-white'
                                                }`}
                                        >
                                            {copiedCode ? (
                                                <>
                                                    <CheckCircle className="w-4 h-4" />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-4 h-4" />
                                                    Copy
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Code Block */}
                                    <pre className="p-4 overflow-x-auto">
                                        <code className="text-sm font-mono text-emerald-400 whitespace-pre">
                                            {item.solutions.code[activeCodeLang]}
                                        </code>
                                    </pre>
                                </div>
                            )}
                        </motion.div>
                    )
                }

                {/* Lecture Notes Tab */}
                {
                    activeTab === 'notes' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-4xl"
                        >
                            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800 mb-6">
                                <h2 className="text-xl font-bold text-white mb-3">Lecture Notes</h2>
                                {!ctoClipLoaded ? (
                                    <p className="text-gray-500">Loading notes…</p>
                                ) : (
                                    (() => {
                                        // Check if there are multiple note options
                                        const noteOptions = ctoClip?.lectureNotesSvgOptions ||
                                            item?.lectureNotesSvgOptions ||
                                            pattern?.lectureNotesSvgOptions ||
                                            null;

                                        const lectureNotes = (() => {
                                            // Priority order: ctoClip > item > pattern
                                            // Priority type: SVG > PDF (lectureNotes)
                                            // Only show ONE note to avoid duplicates

                                            const extractSingleNote = (source) => {
                                                if (!source) return null;
                                                // If it's an array, only take the first element
                                                if (Array.isArray(source)) {
                                                    return source[0]?.trim() || null;
                                                }
                                                return source.trim() || null;
                                            };

                                            // Check SVG notes first (higher priority)
                                            let note = extractSingleNote(ctoClip?.lectureNotesSvg);
                                            if (note) return [note];

                                            note = extractSingleNote(item?.lectureNotesSvg);
                                            if (note) return [note];

                                            note = extractSingleNote(pattern?.lectureNotesSvg);
                                            if (note) return [note];

                                            // Fallback to PDF/regular notes
                                            note = extractSingleNote(ctoClip?.lectureNotes);
                                            if (note) return [note];

                                            note = extractSingleNote(item?.lectureNotes);
                                            if (note) return [note];

                                            note = extractSingleNote(pattern?.lectureNotes);
                                            if (note) return [note];

                                            return [];
                                        })();

                                        const toEmbedUrl = (url) => {
                                            const trimmed = url.trim();
                                            if (!trimmed) return null;
                                            if (trimmed.includes('github.com') && trimmed.includes('/blob/')) {
                                                return trimmed
                                                    .replace('github.com', 'raw.githubusercontent.com')
                                                    .replace('/blob/', '/');
                                            }
                                            return trimmed;
                                        };

                                        const toViewerUrl = (url) => {
                                            const embedUrl = toEmbedUrl(url);
                                            if (!embedUrl) return null;
                                            return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(embedUrl)}`;
                                        };

                                        const renderNote = (note, key) => {
                                            if (typeof note === 'string' && note.trim().startsWith('http')) {
                                                const embedUrl = toEmbedUrl(note);
                                                const isPdf = embedUrl?.toLowerCase().includes('.pdf');

                                                const isSvg = embedUrl?.toLowerCase().includes('.svg');

                                                if (isSvg) {
                                                    return (
                                                        <LectureNoteViewer key={key} url={embedUrl} noteOptions={noteOptions} />
                                                    );
                                                }

                                                if (isPdf) {
                                                    const viewerUrl = toViewerUrl(note);
                                                    return (
                                                        <div key={key} className="space-y-3">
                                                            <div className="relative h-[520px] w-full bg-[#0f0f0f] border border-gray-800 rounded-2xl overflow-hidden">
                                                                <iframe
                                                                    src={viewerUrl || embedUrl}
                                                                    title="Lecture Notes"
                                                                    className="absolute inset-0 w-full h-full border-0"
                                                                />
                                                            </div>
                                                            <div className="flex gap-3 text-sm">
                                                                <a
                                                                    href={embedUrl}
                                                                    download
                                                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1f1f1f] border border-gray-700 text-cyan-400 hover:bg-[#272727] transition-colors"
                                                                >
                                                                    Download notes
                                                                </a>
                                                            </div>
                                                        </div>
                                                    );
                                                }

                                                return (
                                                    <a
                                                        key={key}
                                                        href={embedUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-orange-400 hover:text-orange-300 underline"
                                                    >
                                                        View lecture notes
                                                    </a>
                                                );
                                            }
                                            return (
                                                <span key={key} className="text-gray-300 whitespace-pre-wrap leading-relaxed">{note}</span>
                                            );
                                        };

                                        if (Array.isArray(lectureNotes) && lectureNotes.length > 0) {
                                            return (
                                                <div className="space-y-4 text-gray-300">
                                                    {lectureNotes.map((note, idx) => renderNote(note, idx))}
                                                </div>
                                            );
                                        }
                                        if (typeof lectureNotes === 'string' && lectureNotes.trim().length > 0) {
                                            return renderNote(lectureNotes, 'single-note');
                                        }
                                        return <p className="text-gray-500">Lecture notes coming soon.</p>;
                                    })()
                                )}
                            </div>
                        </motion.div>
                    )
                }

                {/* Discussion Tab */}
                {
                    activeTab === 'discussion' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-4xl"
                        >
                            {/* New Comment */}
                            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800 mb-6">
                                <h2 className="text-lg font-bold text-white mb-4">Share Your Solution</h2>
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Share your intuition, alternate approach, or optimization... (Markdown supported)"
                                    className="w-full bg-[#252525] border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-orange-500/50 transition-colors min-h-[120px]"
                                />
                                <div className="flex justify-between items-center mt-4">
                                    <p className="text-gray-500 text-sm">Markdown is supported</p>
                                    <button
                                        onClick={handleAddComment}
                                        disabled={!newComment.trim()}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${newComment.trim()
                                            ? 'bg-orange-500 text-white hover:bg-orange-600'
                                            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                            }`}
                                    >
                                        <Send className="w-4 h-4" />
                                        Post
                                    </button>
                                </div>
                            </div>

                            {/* Sort Options */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-white">{discussions.length} Discussions</h2>
                                <div className="flex gap-2">
                                    {['likes', 'newest', 'oldest'].map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => setSortBy(option)}
                                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${sortBy === option
                                                ? 'bg-orange-500/20 text-orange-400'
                                                : 'bg-[#1a1a1a] text-gray-400 hover:text-white'
                                                }`}
                                        >
                                            {option === 'likes' ? 'Most Liked' : option === 'newest' ? 'Newest' : 'Oldest'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Discussion Posts */}
                            <div className="space-y-4">
                                {sortedDiscussions.map((post) => (
                                    <div key={post.id} className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800">
                                        {/* Post Header */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
                                                {post.avatar}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{post.author}</p>
                                                <p className="text-gray-500 text-sm flex items-center gap-2">
                                                    <Clock className="w-3 h-3" />
                                                    {post.timestamp}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Post Content */}
                                        <div className="text-gray-300 mb-4 whitespace-pre-wrap">
                                            {post.content}
                                        </div>

                                        {/* Post Actions */}
                                        <div className="flex items-center gap-4 pt-4 border-t border-gray-800">
                                            <button className="flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors">
                                                <ThumbsUp className="w-4 h-4" />
                                                <span>{post.likes}</span>
                                            </button>
                                            <button className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors">
                                                <MessageSquare className="w-4 h-4" />
                                                <span>{post.replies.length} replies</span>
                                            </button>
                                        </div>

                                        {/* Replies */}
                                        {post.replies.length > 0 && (
                                            <div className="mt-4 pl-6 border-l-2 border-gray-800 space-y-4">
                                                {post.replies.map((reply) => (
                                                    <div key={reply.id} className="pt-4">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                                                                {reply.avatar}
                                                            </div>
                                                            <div>
                                                                <p className="text-white font-medium text-sm">{reply.author}</p>
                                                                <p className="text-gray-500 text-xs">{reply.timestamp}</p>
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-300 text-sm">{reply.content}</p>
                                                        <button className="flex items-center gap-1 text-gray-500 hover:text-orange-400 transition-colors mt-2 text-sm">
                                                            <ThumbsUp className="w-3 h-3" />
                                                            <span>{reply.likes}</span>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )
                }
            </main >
        </div >
    );
}
