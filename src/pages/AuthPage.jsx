import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, CheckCircle2, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import logoImg from '../assets/logo.png';
import hotelLobbyImg from '../assets/hotelLobbyImg.webp';

export default function AuthPage() {
    const navigate = useNavigate();

    // View state: 'login' | 'register' | 'forgot'
    const [currentView, setCurrentView] = useState('login');
    const [showPassword, setShowPassword] = useState(false);

    // Form inputs state management
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        rememberMe: false
    });

    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);

    // SEO Optimization and Auto Scroll to Top on View Change
    useEffect(() => {
        // Automatically scroll to the top of the page smoothly when switching views
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Update document title and meta description dynamically based on the active view
        if (currentView === 'login') {
            document.title = 'Sign In | Serenity Bay Hotel & Resort';
            updateMetaDescription('Sign in to your Serenity Bay account to manage reservations, view exclusive luxury offers, and access VIP benefits.');
        } else if (currentView === 'register') {
            document.title = 'Create Account | Serenity Bay Hotel & Resort';
            updateMetaDescription('Join Serenity Bay Resort to unlock exclusive member rates, seamless booking management, and 24/7 concierge services.');
        } else if (currentView === 'forgot') {
            document.title = 'Reset Password | Serenity Bay Hotel & Resort';
            updateMetaDescription('Recover your Serenity Bay account password securely.');
        }
    }, [currentView]);

    // Helper function to update meta description for SEO
    const updateMetaDescription = (content) => {
        let metaTag = document.querySelector("meta[name='description']");
        if (!metaTag) {
            metaTag = document.createElement('meta');
            metaTag.name = 'description';
            document.head.appendChild(metaTag);
        }
        metaTag.content = content;
    };

    // Handle input field changes and clear messages
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
        setError('');
        setSuccessMsg('');
    };

    // Comprehensive Form Validation and Backend Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        // Frontend Validation: Check valid email format
        if (!formData.email || !formData.email.includes('@')) {
            setError('Please enter a valid email address.');
            return;
        }

        // Frontend Validation: Check password presence for login/register
        if (currentView !== 'forgot') {
            if (!formData.password) {
                setError('Password is required.');
                return;
            }
        }

        // Frontend Validation: Specific rules for registration
        if (currentView === 'register') {
            if (!formData.full_name.trim()) {
                setError('Full name is required.');
                return;
            }
            if (formData.password.length < 8) {
                setError('Password must be at least 8 characters long.');
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match.');
                return;
            }
            // Optional phone number format validation
            if (formData.phone && !/^\+?[0-9\s-]{10,15}$/.test(formData.phone)) {
                setError('Please enter a valid phone number.');
                return;
            }
        }

        setLoading(true);

        try {
            let endpoint = 'http://localhost:5000/api/auth/login';
            let payload = { email: formData.email, password: formData.password };

            if (currentView === 'register') {
                endpoint = 'http://localhost:5000/api/auth/register';
                payload = {
                    full_name: formData.full_name,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password
                };
            } else if (currentView === 'forgot') {
                endpoint = 'http://localhost:5000/api/auth/forgot-password';
                payload = { email: formData.email };
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Operation failed. Please try again.');
            }

            if (currentView === 'login') {
                setSuccessMsg('Login successful! Redirecting...');
                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                }
                setTimeout(() => { navigate('/'); }, 1000);
            } else if (currentView === 'register') {
                setSuccessMsg('Account created successfully! Please sign in.');
                setCurrentView('login');
                setFormData({ full_name: '', email: '', phone: '', password: '', confirmPassword: '', rememberMe: false });
            } else if (currentView === 'forgot') {
                setSuccessMsg('Password reset link has been sent to your email.');
            }

        } catch (err) {
            setError(err.message || 'An error occurred. Please check your backend connection.');
        } finally {
            setLoading(false);
        }
    };

    // Handle Google OAuth Authentication Redirect
    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/google';
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 pt-28 lg:pt-32 font-sans relative"
            style={{
                backgroundImage: `linear-gradient(120deg, rgba(6, 59, 50, 0.85), rgba(6, 59, 50, 0.6)), url(${hotelLobbyImg})`
            }}
        >
            {/* CONDITIONAL LAYOUT: Forgot Password gets a clean single centered card, Login/Register gets the two-column luxury banner */}
            {currentView === 'forgot' ? (
                /* Forgot Password Single Centered Card */
                <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#C9A24B]/30 overflow-hidden p-8 sm:p-12 text-[#063B32] relative z-10 my-auto">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-3">
                            <img src={logoImg} alt="Serenity Bay Logo" className="h-12 w-auto object-contain" />
                        </div>
                        <h4 className="font-serif text-[10px] tracking-[0.3em] text-[#C9A24B] font-bold uppercase mb-1">
                            Serenity Bay Hotel &amp; Resort
                        </h4>
                        <p className="text-[10px] tracking-widest uppercase text-gray-400 font-semibold mb-2">
                            Account Assistance
                        </p>
                        <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#063B32] mb-3">
                            Forgot Your Password?
                        </h2>
                        <p className="text-xs text-gray-500 font-light max-w-md mx-auto">
                            Enter the email address associated with your account and we'll help you reset your password.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}
                    {successMsg && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700 text-xs">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>{successMsg}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-[#FAF8F5] border border-gray-200 rounded-xl px-4 py-3 pl-10 text-xs text-[#063B32] focus:outline-none focus:border-[#C9A24B] transition"
                                />
                            </div>
                        </div>

                        {/* Button text casing fixed (Normal sentence/title case instead of all-caps lock) */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#C9A24B] via-[#D4AF37] to-[#C9A24B] text-[#063B32] py-3.5 rounded-xl text-xs font-bold tracking-wider hover:opacity-95 transition shadow-lg cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                        >
                            <span>{loading ? 'Sending link...' : 'Send Reset Link'}</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <button
                            type="button"
                            onClick={() => { setCurrentView('login'); setError(''); setSuccessMsg(''); }}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#063B32] hover:text-[#C9A24B] transition cursor-pointer bg-transparent border-none"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 text-[#C9A24B]" />
                            <span>Back to sign in</span>
                        </button>
                    </div>
                </div>
            ) : (
                /* Login & Register Two-Column Luxury Card Container */
                <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-[#C9A24B]/30 overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10 my-auto">

                    {/* Left Side: Brand Banner (Hidden on small screens for mobile responsiveness) */}
                    <div className="hidden lg:flex lg:col-span-5 bg-[#063B32] text-white p-8 sm:p-12 flex-col justify-between relative overflow-hidden">
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#C9A24B]/10 rounded-full blur-3xl pointer-events-none"></div>

                        <div>
                            <div className="flex items-center gap-3 mb-8">
                                <img src={logoImg} alt="Serenity Bay Logo" className="h-10 w-auto object-contain" />
                                <div className="font-serif text-lg tracking-[0.25em] text-[#C9A24B] font-bold uppercase">
                                    Serenity Bay
                                </div>
                            </div>

                            <h2 className="font-serif text-3xl sm:text-4xl font-normal leading-tight mb-4 text-white">
                                Discover the Luxury of <span className="text-[#C9A24B]">Serenity</span>
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed mb-8">
                                Access your account to manage reservations, view exclusive resort offers, and unlock VIP member benefits.
                            </p>

                            <div className="space-y-4 text-xs">
                                <div className="flex items-center gap-3 text-gray-200">
                                    <div className="w-6 h-6 rounded-lg bg-[#C9A24B]/20 flex items-center justify-center text-[#C9A24B] shrink-0">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                    </div>
                                    <span>Exclusive Member Rates &amp; Discounts</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-200">
                                    <div className="w-6 h-6 rounded-lg bg-[#C9A24B]/20 flex items-center justify-center text-[#C9A24B] shrink-0">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                    </div>
                                    <span>Seamless &amp; Secure Booking Management</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-200">
                                    <div className="w-6 h-6 rounded-lg bg-[#C9A24B]/20 flex items-center justify-center text-[#C9A24B] shrink-0">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                    </div>
                                    <span>24/7 Dedicated Concierge Service</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-[#C9A24B]/20 text-[10px] text-gray-400 font-light mt-8">
                            © 2026 Serenity Bay Resort. All rights reserved.
                        </div>
                    </div>

                    {/* Right Side: Form Section (Fully Responsive for Mobiles & Tablets) */}
                    <div className="col-span-1 lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white text-[#063B32]">

                        {/* Header Section */}
                        <div className="text-center mb-6">
                            <div className="flex justify-center mb-2 lg:hidden">
                                <img src={logoImg} alt="Serenity Bay Logo" className="h-8 w-auto object-contain" />
                            </div>
                            <h4 className="font-serif text-[10px] tracking-[0.3em] text-[#C9A24B] font-bold uppercase mb-1">
                                Serenity Bay Hotel &amp; Resort
                            </h4>
                            <h3 className="font-serif text-2xl sm:text-3xl font-semibold mb-1">
                                {currentView === 'login' && 'Welcome Back'}
                                {currentView === 'register' && 'Create Account'}
                            </h3>
                            <p className="text-xs text-gray-500 font-light">
                                {currentView === 'login' && 'Sign in to access your account & bookings'}
                                {currentView === 'register' && 'Join our community of luxury travelers'}
                            </p>
                        </div>

                        {/* Error and Success Notifications */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}
                        {successMsg && (
                            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700 text-xs">
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                <span>{successMsg}</span>
                            </div>
                        )}

                        {/* Google Sign In Button */}
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-2 cursor-pointer mb-4"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.19v3.15C3.17 21.3 7.22 24 12 24z" />
                                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.19C.43 8.11 0 9.82 0 12s.43 3.89 1.19 5.42l4.09-3.15z" />
                                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.22 0 3.17 2.7 1.19 6.58l4.09 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                            </svg>
                            <span>Continue with Google</span>
                        </button>

                        <div className="flex items-center my-3">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="px-3 text-[10px] text-gray-400 uppercase tracking-widest font-bold">OR</span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </div>

                        {/* Main Input Form */}
                        <form onSubmit={handleSubmit} className="space-y-3">
                            {currentView === 'register' && (
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            name="full_name"
                                            placeholder="Enter your full name"
                                            value={formData.full_name}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-[#FAF8F5] border border-gray-200 rounded-xl px-4 py-3 pl-10 text-xs text-[#063B32] focus:outline-none focus:border-[#C9A24B] transition"
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-[#FAF8F5] border border-gray-200 rounded-xl px-4 py-3 pl-10 text-xs text-[#063B32] focus:outline-none focus:border-[#C9A24B] transition"
                                    />
                                </div>
                            </div>

                            {currentView === 'register' && (
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Phone Number (Optional)</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            name="phone"
                                            placeholder="+94 XX XXX XXXX"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full bg-[#FAF8F5] border border-gray-200 rounded-xl px-4 py-3 pl-10 text-xs text-[#063B32] focus:outline-none focus:border-[#C9A24B] transition"
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Password (Min 8 characters)</label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-[#FAF8F5] border border-gray-200 rounded-xl px-4 py-3 pl-10 pr-14 text-xs text-[#063B32] focus:outline-none focus:border-[#C9A24B] transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-[#C9A24B] focus:outline-none cursor-pointer"
                                    >
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                            </div>

                            {currentView === 'register' && (
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            placeholder="Confirm your password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-[#FAF8F5] border border-gray-200 rounded-xl px-4 py-3 pl-10 text-xs text-[#063B32] focus:outline-none focus:border-[#C9A24B] transition"
                                        />
                                    </div>
                                </div>
                            )}

                            {currentView === 'login' && (
                                <div className="flex items-center justify-between pt-1">
                                    <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            name="rememberMe"
                                            checked={formData.rememberMe}
                                            onChange={handleChange}
                                            className="rounded border-gray-300 text-[#063B32] focus:ring-0 w-3.5 h-3.5 cursor-pointer"
                                        />
                                        <span>Remember me</span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => { setCurrentView('forgot'); setError(''); setSuccessMsg(''); }}
                                        className="text-xs text-[#C9A24B] font-semibold hover:underline cursor-pointer bg-transparent border-none"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                            )}

                            {/* Form Submit Action Button (Fixed all-caps lock to clean sentence/title case) */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-[#C9A24B] via-[#D4AF37] to-[#C9A24B] text-[#063B32] py-3.5 rounded-xl text-xs font-bold tracking-wider hover:opacity-95 transition shadow-lg mt-2 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <span>
                                    {loading ? 'Please wait...' :
                                        (currentView === 'login' ? 'Sign In' : 'Create Account')
                                    }
                                </span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>

                        {/* Footer Toggle Links & Navigation */}
                        <div className="text-center mt-5 text-xs text-gray-500 font-light">
                            {currentView === 'login' ? "Don't have an account? " : "Already have an account? "}
                            <button
                                type="button"
                                onClick={() => {
                                    setCurrentView(currentView === 'login' ? 'register' : 'login');
                                    setError('');
                                    setSuccessMsg('');
                                }}
                                className="font-bold text-[#C9A24B] hover:underline cursor-pointer ml-1 bg-transparent border-none"
                            >
                                {currentView === 'login' ? 'Create Account' : 'Sign In'}
                            </button>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}