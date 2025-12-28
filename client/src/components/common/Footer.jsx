import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-babua-dark border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-babua-primary to-babua-secondary flex items-center justify-center font-bold text-white">
                                B
                            </div>
                            <span className="text-xl font-bold text-white">
                                Babua<span className="text-babua-primary">LMS</span>
                            </span>
                        </Link>
                        <p className="text-white/60 max-w-md">
                            Learn Patterns. Build Systems. Get Hired. A pattern-centric, free-to-learn
                            engineering platform inspired by the CTO Bhaiya mindset.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Learn</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/patterns" className="text-white/60 hover:text-white transition-colors">
                                    DSA Patterns
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="text-white/60 hover:text-white transition-colors">
                                    System Design
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-white/60 hover:text-white transition-colors">
                                    Low Level Design
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-4">Community</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/pods" className="text-white/60 hover:text-white transition-colors">
                                    Accountability Pods
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="text-white/60 hover:text-white transition-colors">
                                    Discord
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-white/60 hover:text-white transition-colors">
                                    Contribute
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-white/40 text-sm flex items-center gap-1">
                        Built with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for the Babua community
                    </p>

                    <div className="flex items-center gap-4">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-white/40 hover:text-white transition-colors"
                        >
                            <Github size={20} />
                        </a>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-white/40 hover:text-white transition-colors"
                        >
                            <Twitter size={20} />
                        </a>
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-white/40 hover:text-white transition-colors"
                        >
                            <Linkedin size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
