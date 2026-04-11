import React, { useState, useEffect } from 'react';
import api from '../api';
import { Camera, Save, ShieldCheck } from 'lucide-react';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('profile/');
                setProfile(res.data);
                setFormData({
                    first_name: res.data.user.first_name,
                    last_name: res.data.user.last_name,
                    email: res.data.user.email,
                    phone: res.data.phone || '',
                    address: res.data.address || ''
                });
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await api.put('profile/', {
                user: {
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email
                },
                phone: formData.phone,
                address: formData.address
            });
            setProfile(res.data);
            setIsEditing(false);
            setMessage('Profile updated successfully!');
        } catch (error) {
            setMessage('Error updating profile.');
        }
    };

    if (loading) return (
      <div className="flex items-center justify-center h-96">
        <div className="h-12 w-12 border-4 border-vault-secondary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500">
            <header className="flex items-end justify-between">
                <div>
                    <h1 className="text-4xl font-black text-vault-primary tracking-tighter">User Profile</h1>
                    <p className="text-gray-500 font-medium">Manage your personal information and contact details.</p>
                </div>
                <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-8 py-3 rounded-2xl border-2 transition-all font-black text-sm uppercase tracking-widest ${
                        isEditing ? 'border-red-200 text-red-600 bg-red-50 hover:bg-red-100' : 'border-vault-secondary text-vault-secondary bg-white hover:bg-vault-secondary hover:text-white shadow-lg shadow-vault-secondary/10'
                    }`}
                >
                    {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Profile Brief */}
                <aside className="space-y-6">
                    <div className="bg-white border border-gray-200 p-10 rounded-[3rem] text-center relative overflow-hidden shadow-xl shadow-gray-200/50 group">
                        <div className="relative inline-block mb-8">
                            <div className="h-40 w-40 rounded-[2.5rem] overflow-hidden mx-auto transition-theme group-hover:scale-105" style={{ transition: 'transform 0.3s ease' }}>
                                {profile?.profile_picture ? (
                                    <img src={profile.profile_picture} alt="Profile" className="h-full w-full object-cover" />
                                ) : (
                                    <div
                                        className="h-full w-full flex items-center justify-center"
                                        style={{
                                            background: 'linear-gradient(135deg, var(--color-vault-primary, #1a1a2e) 0%, var(--color-vault-secondary, #4f8ef7) 100%)'
                                        }}
                                    >
                                        <span className="text-white font-black select-none" style={{ fontSize: '3.5rem', letterSpacing: '-0.02em', lineHeight: 1 }}>
                                            {(() => {
                                                const first = profile?.user?.first_name?.trim();
                                                const last = profile?.user?.last_name?.trim();
                                                if (first && last) return `${first[0]}${last[0]}`.toUpperCase();
                                                if (first) return first[0].toUpperCase();
                                                return (profile?.user?.username?.[0] ?? '?').toUpperCase();
                                            })()}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <button className="absolute -bottom-2 -right-2 p-3 bg-vault-primary text-white rounded-2xl hover:scale-110 transition-transform shadow-xl">
                                <Camera className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <h2 className="text-2xl font-black text-vault-primary mb-2 tracking-tight">
                            {profile?.user.first_name} {profile?.user.last_name}
                        </h2>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-vault-primary/5 rounded-full border border-vault-primary/10">
                            <ShieldCheck className="h-3 w-3 text-vault-secondary" />
                            <p className="text-[10px] text-vault-primary font-black uppercase tracking-widest">{profile?.user.username}</p>
                        </div>
                        
                        <div className="mt-10 pt-10 border-t border-gray-100 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-2xl font-black text-vault-primary">VIP</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Standing</p>
                            </div>
                            <div>
                                <p className="text-2xl font-black text-vault-primary">AES</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Security</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-vault-primary p-8 rounded-[2.5rem] text-white flex items-start gap-4 shadow-xl shadow-vault-primary/20">
                        <ShieldCheck className="text-vault-accent h-6 w-6 shrink-0 mt-1" />
                        <div>
                            <p className="text-sm font-black uppercase tracking-widest mb-1">Privacy & Security</p>
                            <p className="text-xs text-white/60 leading-relaxed font-medium">Your personal information is stored securely following data protection regulations.</p>
                        </div>
                    </div>
                </aside>

                {/* Profile Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-200 rounded-[3rem] p-10 shadow-sm h-full">
                        <form onSubmit={handleUpdate} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                        First Name
                                    </label>
                                    <input 
                                        type="text" 
                                        name="first_name"
                                        disabled={!isEditing}
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-5 text-vault-primary font-bold disabled:opacity-50 focus:border-vault-secondary outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                        Last Name
                                    </label>
                                    <input 
                                        type="text" 
                                        name="last_name"
                                        disabled={!isEditing}
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-5 text-vault-primary font-bold disabled:opacity-50 focus:border-vault-secondary outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                    Email Address
                                </label>
                                <input 
                                    type="email" 
                                    name="email"
                                    disabled={!isEditing}
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-5 text-vault-primary font-bold disabled:opacity-50 focus:border-vault-secondary outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                        Phone Number
                                    </label>
                                    <input 
                                        type="text" 
                                        name="phone"
                                        disabled={!isEditing}
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-5 text-vault-primary font-bold disabled:opacity-50 focus:border-vault-secondary outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                        Member Since
                                    </label>
                                    <div className="px-6 py-5 text-gray-400 bg-gray-50 rounded-2xl border border-gray-100 font-bold">
                                        {new Date(profile?.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                    Home Address
                                </label>
                                <textarea 
                                    name="address"
                                    disabled={!isEditing}
                                    rows="3"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-5 text-vault-primary font-bold disabled:opacity-50 focus:border-vault-secondary outline-none transition-all resize-none"
                                ></textarea>
                            </div>

                            {isEditing && (
                                <button className="w-full bg-vault-secondary hover:bg-blue-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-vault-secondary/20 flex items-center justify-center gap-3">
                                    <Save className="h-6 w-6" />
                                    Save Profile Changes
                                </button>
                            )}
                            {message && <p className={`text-center text-sm font-bold ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
