import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Landmark, ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';
import api from '../api';

const LoginPage = ({ onLoginSuccess }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.get('csrf/');
            const res = await api.post('login/', formData);
            if (res.data.success) {
                onLoginSuccess(res.data.user);
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Authorization failed. Check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-vault-background flex items-center justify-center p-6 selection:bg-vault-secondary/20">
            <div className="max-w-md w-full relative">
                {/* Brand Branding */}
                <div className="text-center mb-10">
                    <div className="inline-flex p-4 bg-vault-primary rounded-3xl text-white mb-6 shadow-2xl shadow-vault-primary/20">
                        <Landmark className="h-10 w-10" />
                    </div>
                    <h1 className="text-5xl font-black text-vault-primary tracking-tighter mb-2">VAULT</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Online Banking System</p>
                </div>

                <div className="bg-white border border-gray-100 p-10 md:p-12 rounded-[3.5rem] shadow-2xl shadow-gray-200/60 relative">
                    <header className="mb-10">
                        <h2 className="text-2xl font-black text-vault-primary tracking-tight">Login</h2>
                        <p className="text-gray-400 font-medium text-sm mt-1">Sign in to manage your bank accounts.</p>
                    </header>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Identity</label>
                            <div className="relative">
                                <input 
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-50 border border-transparent focus:border-vault-secondary focus:bg-white text-vault-primary font-bold rounded-2xl px-6 py-5 pl-14 outline-none transition-all placeholder:text-gray-300"
                                    placeholder="Username or Email"
                                />
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 h-5 w-5" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Authorization Code</label>
                            <div className="relative">
                                <input 
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-50 border border-transparent focus:border-vault-secondary focus:bg-white text-vault-primary font-bold rounded-2xl px-6 py-5 pl-14 outline-none transition-all placeholder:text-gray-300"
                                    placeholder="••••••••"
                                />
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 h-5 w-5" />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold animate-in fade-in zoom-in">
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-vault-primary hover:bg-slate-800 disabled:opacity-50 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-vault-primary/20 text-lg flex items-center justify-center gap-2 group"
                        >
                            {loading ? 'Logging in...' : 'Sign In'}
                            {!loading && <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <footer className="mt-12 pt-8 border-t border-gray-50 text-center">
                        <p className="text-sm text-gray-400 font-medium">
                            New user?{' '}
                            <Link to="/register" className="text-vault-secondary font-black hover:underline underline-offset-4">Register an Account</Link>
                        </p>
                    </footer>
                </div>

                <div className="flex items-center justify-center gap-2 mt-10">
                    <ShieldCheck className="h-4 w-4 text-green-500 opacity-50" />
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.25em]">256-bit AES SSL Infrastructure</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
