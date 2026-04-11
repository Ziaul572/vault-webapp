import React, { useState, useEffect } from 'react';
import api from '../api';
import { CreditCard, Plus, ShieldCheck, CheckCircle2 } from 'lucide-react';

const AccountsPage = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [accountType, setAccountType] = useState('STANDARD');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const fetchAccounts = async () => {
        try {
            const res = await api.get('accounts/');
            setAccounts(res.data);
        } catch (error) {
            console.error("Error fetching accounts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        setMessage('Processing request...');
        setIsError(false);
        try {
            const res = await api.post('accounts/', { account_type: accountType });
            setMessage('Account created successfully!');
            fetchAccounts();
        } catch (error) {
            setIsError(true);
            const errorDetail = error.response?.data ? JSON.stringify(error.response.data) : error.message;
            setMessage(`Failed to create account: ${errorDetail}`);
            console.error("Account Creation Error:", error.response?.data);
        }
    };

    if (loading) return (
      <div className="flex items-center justify-center h-96">
        <div className="h-12 w-12 border-4 border-vault-secondary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
            <header className="flex flex-col items-center text-center gap-1 mb-10">
                <h1 className="text-4xl font-black text-vault-primary tracking-tighter">Bank Accounts</h1>
                <p className="text-gray-500 font-medium">View and manage your different bank accounts.</p>
                <div className="w-20 h-1.5 bg-vault-secondary rounded-full mt-4"></div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Account List */}
                <div className="lg:col-span-2 space-y-6">
                    {accounts.map((acc) => (
                        <div key={acc.id} className="relative overflow-hidden bg-white border border-gray-200 p-8 rounded-[2rem] flex items-center justify-between group hover:border-vault-secondary transition-all shadow-sm hover:shadow-xl shadow-gray-200/50">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-vault-primary rounded-2xl text-white shadow-lg shadow-vault-primary/20">
                                    <CreditCard className="h-8 w-8" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xl font-black text-vault-primary">{acc.account_type_display}</p>
                                    <p className="text-sm font-mono text-gray-400 tracking-widest">
                                        Acc No: {acc.account_number}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-black text-vault-primary">€{parseFloat(acc.balance).toLocaleString()}</p>
                                <div className="flex items-center justify-end gap-1 mt-1">
                                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Verified Balance</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {accounts.length === 0 && (
                        <div className="text-center py-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem]">
                            <p className="text-gray-400 font-medium">No accounts found. Create one to get started.</p>
                        </div>
                    )}
                </div>

                {/* Sidebar Controls */}
                <aside className="space-y-6">
                    <div className="bg-white border border-gray-200 p-8 rounded-[2rem] shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-vault-secondary/10 rounded-lg text-vault-secondary">
                                <Plus className="h-5 w-5" />
                            </div>
                            <h2 className="text-xl font-bold text-vault-primary">Open New Account</h2>
                        </div>
                        
                        <form onSubmit={handleCreateAccount} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Account Type</label>
                                <select 
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl px-4 py-4 focus:ring-1 focus:ring-vault-secondary focus:border-vault-secondary outline-none transition-all font-semibold"
                                    value={accountType}
                                    onChange={(e) => setAccountType(e.target.value)}
                                >
                                    <option value="STANDARD">Standard Account</option>
                                    <option value="SAVINGS">Savings Account</option>
                                    <option value="BUSINESS">Business Account</option>
                                </select>
                            </div>
                            
                            <button className="w-full bg-vault-secondary hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-vault-secondary/20 flex items-center justify-center gap-2">
                                <Plus className="h-5 w-5" />
                                Confirm Creation
                            </button>
                        </form>
                        
                        {message && (
                            <div className={`mt-6 p-4 rounded-xl text-center text-xs font-bold ${isError ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                                {message}
                            </div>
                        )}
                    </div>

                    <div className="p-8 bg-vault-primary rounded-[2rem] text-white shadow-xl shadow-vault-primary/20 relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <ShieldCheck className="text-vault-accent h-6 w-6" />
                                <p className="text-sm font-black uppercase tracking-widest">Protected Deposits</p>
                            </div>
                            <p className="text-xs text-white/70 leading-relaxed font-medium">
                                Your funds are insured and protected across the primary institutions in the banking network.
                            </p>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default AccountsPage;
