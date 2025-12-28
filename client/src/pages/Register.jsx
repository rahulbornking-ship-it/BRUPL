import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await register(name, email, password);
            toast.success('Welcome to Babua LMS!');
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const benefits = [
        'Access all DSA patterns for free',
        'Built-in revision reminders',
        'Join accountability pods',
        'Track your mastery progress',
    ];

    return (
        <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10">
            <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-12 items-center">
                {/* Benefits */}
                <div className="hidden lg:block">
                    <h2 className="text-3xl font-bold text-white mb-6">
                        Start Learning Patterns Today
                    </h2>
                    <p className="text-white/60 mb-8">
                        Join thousands of engineers mastering DSA through pattern recognition,
                        not memorization.
                    </p>

                    <div className="space-y-4">
                        {benefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-babua-success/20 flex items-center justify-center">
                                    <CheckCircle className="w-4 h-4 text-babua-success" />
                                </div>
                                <span className="text-white/80">{benefit}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-xl">
                        <p className="text-white/40 text-sm uppercase tracking-wider mb-2">Philosophy</p>
                        <blockquote className="text-white/80 italic">
                            "One pattern unlocks hundreds of problems. Think in patterns,
                            not isolated solutions."
                        </blockquote>
                        <p className="text-babua-primary mt-2 text-sm">— The Babua Way</p>
                    </div>
                </div>

                {/* Register Form */}
                <div>
                    <div className="lg:hidden text-center mb-8">
                        <Link to="/" className="inline-flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-babua-primary to-babua-secondary flex items-center justify-center font-bold text-white text-lg">
                                B
                            </div>
                        </Link>
                        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                        <p className="text-white/60">Start your journey to pattern mastery</p>
                    </div>

                    <div className="card">
                        <div className="hidden lg:block mb-6">
                            <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
                            <p className="text-white/60">It's free to learn</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">
                                    Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="input pl-10"
                                        placeholder="Your name"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="input pl-10"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="input pl-10"
                                        placeholder="At least 6 characters"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary w-full py-3"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Create Account
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-[#1a1a2e] text-white/50">Or continue with</span>
                            </div>
                        </div>

                        {/* Google OAuth Button */}
                        <button
                            onClick={() => {
                                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                                window.location.href = `${apiUrl}/api/auth/google`;
                            }}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg border border-gray-300 transition-colors"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Continue with Google
                        </button>

                        <p className="text-center text-white/50 mt-6">
                            Already have an account?{' '}
                            <Link to="/login" className="text-babua-primary hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
