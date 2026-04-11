import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, ShieldCheck, Mail, Lock, User, ArrowRight } from 'lucide-react';
import api from '../api';

const RegisterPage = ({ onLoginSuccess }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.get('csrf/');
            const res = await api.post('register/', formData);
            if (res.data.success) {
                onLoginSuccess(res.data.user);
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Check details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-vault-background flex items-center justify-center p-6 py-16 selection:bg-vault-secondary/20">
            <div className="max-w-2xl w-full relative">
                <div className="text-center mb-10">
                    <div className="inline-flex p-4 bg-vault-primary rounded-3xl text-white mb-6 shadow-2xl shadow-vault-primary/20">
                        <UserPlus className="h-10 w-10" />
                    </div>
                    <h1 className="text-5xl font-black text-vault-primary tracking-tighter mb-2">SIGN UP</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Create your banking profile</p>
                </div>

                <div className="bg-white border border-gray-100 p-8 md:p-12 rounded-[3.5rem] shadow-2xl shadow-gray-200/60 transition-all">
                    <header className="mb-10 text-center md:text-left">
                        <h2 className="text-2xl font-black text-vault-primary tracking-tight">Register</h2>
                        <p className="text-gray-400 font-medium text-sm mt-1">Join our secure online banking network.</p>
                    </header>

                    <form onSubmit={handleRegister} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">First Name</label>
                                <input 
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-50 border border-transparent focus:border-vault-secondary focus:bg-white text-vault-primary font-bold rounded-2xl px-6 py-4 outline-none transition-all"
                                    placeholder="Jane"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Last Name</label>
                                <input 
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-50 border border-transparent focus:border-vault-secondary focus:bg-white text-vault-primary font-bold rounded-2xl px-6 py-4 outline-none transition-all"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Registered Email</label>
                            <div className="relative">
                                <input 
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-50 border border-transparent focus:border-vault-secondary focus:bg-white text-vault-primary font-bold rounded-2xl px-6 py-4 pl-14 outline-none transition-all"
                                    placeholder="jane.doe@vault.com"
                                />
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 h-5 w-5" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Choose Username</label>
                                <div className="relative">
                                    <input 
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-gray-50 border border-transparent focus:border-vault-secondary focus:bg-white text-vault-primary font-bold rounded-2xl px-6 py-4 pl-14 outline-none transition-all"
                                        placeholder="Sovereign01"
                                    />
                                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 h-5 w-5" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Set Password</label>
                                <div className="relative">
                                    <input 
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-gray-50 border border-transparent focus:border-vault-secondary focus:bg-white text-vault-primary font-bold rounded-2xl px-6 py-4 pl-14 outline-none transition-all"
                                        placeholder="••••••••"
                                    />
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 h-5 w-5" />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold">
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-vault-primary hover:bg-slate-800 disabled:opacity-50 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-vault-primary/20 text-lg flex items-center justify-center gap-2 group mt-4"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                            {!loading && <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <footer className="mt-12 pt-8 border-t border-gray-50 text-center">
                        <p className="text-sm text-gray-400 font-medium">
                            Already have an account?{' '}
                            <Link to="/login" className="text-vault-secondary font-black hover:underline">Sign In</Link>
                        </p>
                    </footer>
                </div>
                
                <div className="flex items-center justify-center gap-2 mt-10 opacity-40">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">End-to-End Encrypted Data Infrastructure</p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
