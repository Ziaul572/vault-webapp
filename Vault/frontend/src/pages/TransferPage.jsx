import React, { useState, useEffect } from 'react';
import api from '../api';
import { Send, Search, ArrowRightLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

const TransferPage = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        from_account: '',
        to_account: '',
        amount: '',
        description: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const res = await api.get('accounts/');
                setAccounts(res.data);
                if (res.data.length > 0) {
                    setFormData(prev => ({ ...prev, from_account: res.data[0].id }));
                }
            } catch (error) {
                console.error("Error fetching accounts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAccounts();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        setStatus({ type: 'loading', message: 'Authorizing secure transfer...' });
        
        try {
            const res = await api.post('transfer/', formData);
            setStatus({ type: 'success', message: res.data.message });
            setFormData({ ...formData, amount: '', description: '', to_account: '' });
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Transfer failed. Check recipient details.';
            setStatus({ type: 'error', message: errorMsg });
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-96">
          <div className="h-12 w-12 border-4 border-vault-secondary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in zoom-in duration-500">
            <header className="text-center space-y-3">
                <div className="inline-block p-4 bg-vault-secondary/10 rounded-3xl text-vault-secondary mb-4 shadow-sm">
                    <ArrowRightLeft className="h-10 w-10" />
                </div>
                <h1 className="text-4xl font-extrabold text-vault-primary tracking-tight">Make a Transfer</h1>
                <p className="text-gray-500 font-medium max-w-lg mx-auto">Transfer money between bank accounts securely.</p>
            </header>

            <div className="bg-white border border-gray-200 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-gray-200/50 relative overflow-hidden">
                {/* Visual Header Accent */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-vault-primary via-vault-secondary to-vault-accent"></div>

                <form onSubmit={handleTransfer} className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                    <div className="space-y-8">
                        <section>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-1">From Account</label>
                            <select 
                                name="from_account"
                                value={formData.from_account}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 text-vault-primary font-bold rounded-2xl px-6 py-5 focus:ring-1 focus:ring-vault-secondary focus:border-vault-secondary outline-none transition-all appearance-none cursor-pointer"
                            >
                                {accounts.map(acc => (
                                    <option key={acc.id} value={acc.id}>
                                        {acc.account_type_display} (•• {acc.account_number.slice(-4)}) - €{parseFloat(acc.balance).toLocaleString()}
                                    </option>
                                ))}
                            </select>
                        </section>

                        <section>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-1">To Account (10-digit number)</label>
                            <div className="relative">
                                <input 
                                    type="text"
                                    name="to_account"
                                    placeholder="Enter 10-digit account number"
                                    value={formData.to_account}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 text-vault-primary font-bold rounded-2xl px-6 py-5 pl-14 focus:ring-1 focus:ring-vault-secondary outline-none transition-all"
                                />
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                            </div>
                        </section>
                    </div>

                    <div className="space-y-8">
                        <section>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-1">Amount (€)</label>
                            <input 
                                type="number"
                                name="amount"
                                placeholder="0.00"
                                step="0.01"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-50 border border-gray-200 text-vault-primary text-4xl font-black rounded-2xl px-6 py-5 focus:ring-1 focus:ring-vault-secondary outline-none transition-all"
                            />
                        </section>

                        <section>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-1">Payment Reference</label>
                            <textarea 
                                name="description"
                                placeholder="Add a note (optional)"
                                rows="2"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 text-vault-primary font-medium rounded-2xl px-6 py-5 focus:ring-1 focus:ring-vault-secondary outline-none transition-all resize-none"
                            ></textarea>
                        </section>
                    </div>

                    <div className="md:col-span-2 pt-6">
                        <button 
                            type="submit"
                            disabled={status.type === 'loading'}
                            className="w-full bg-vault-primary hover:bg-slate-800 disabled:opacity-50 text-white font-black py-6 rounded-2xl flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-95 text-lg shadow-xl shadow-vault-primary/20"
                        >
                            <Send className="h-6 w-6" />
                            {status.type === 'loading' ? 'Verifying Transaction...' : 'Confirm and Send Funds'}
                        </button>
                    </div>
                </form>

                {status.message && (
                    <div className={`mt-10 p-5 rounded-2xl flex items-center gap-4 animate-in slide-in-from-bottom-4 shadow-lg ${
                        status.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 
                        status.type === 'error' ? 'bg-red-50 border border-red-200 text-red-700' :
                        'bg-blue-50 border border-blue-200 text-blue-700'
                    }`}>
                        {status.type === 'success' ? <CheckCircle2 className="h-6 w-6 shrink-0" /> : <AlertCircle className="h-6 w-6 shrink-0" />}
                        <p className="font-bold">{status.message}</p>
                    </div>
                )}
            </div>

            <footer className="text-center px-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    <ShieldCheck className="h-3 w-3" /> Secure Transaction Port
                </div>
                <p className="mt-4 text-xs text-gray-400 max-w-md mx-auto italic">Please ensure the recipient details are correct before confirming.</p>
            </footer>
        </div>
    );
};

export default TransferPage;
