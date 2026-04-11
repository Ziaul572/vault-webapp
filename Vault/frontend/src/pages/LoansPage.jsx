import React, { useState, useEffect } from 'react';
import api from '../api';
import { Briefcase, Plus, Clock, CheckCircle, XCircle, Info, TrendingUp } from 'lucide-react';

const LoansPage = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        amount: '',
        loan_type: 'PERSONAL',
        duration_months: '12'
    });
    const [message, setMessage] = useState('');

    const fetchLoans = async () => {
        try {
            const res = await api.get('loans/');
            setLoans(res.data);
        } catch (error) {
            console.error("Error fetching loans:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLoans();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleApply = async (e) => {
        e.preventDefault();
        try {
            await api.post('loans/', formData);
            setMessage('Loan application submitted successfully!');
            fetchLoans();
            setFormData({ amount: '', loan_type: 'PERSONAL', duration_months: '12' });
        } catch (error) {
            setMessage('Error submitting application. Check all fields.');
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'APPROVED': return 'bg-green-50 text-green-700 border-green-200';
            case 'REJECTED': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-blue-50 text-blue-700 border-blue-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'APPROVED': return <CheckCircle className="h-4 w-4" />;
            case 'REJECTED': return <XCircle className="h-4 w-4" />;
            default: return <Clock className="h-4 w-4 animate-pulse" />;
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-96">
          <div className="h-12 w-12 border-4 border-vault-secondary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-10 animate-in slide-in-from-right duration-500">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-extrabold text-vault-primary tracking-tight">Loans & Credit</h1>
                    <p className="text-gray-500 font-medium">Apply for a bank loan with competitive interest rates.</p>
                </div>
                <div className="bg-white border border-gray-200 px-6 py-3 rounded-2xl shadow-sm flex items-center gap-3">
                    <TrendingUp className="text-green-500 h-5 w-5" />
                    <span className="text-sm font-bold text-gray-400">Credit Score: <span className="text-vault-primary uppercase tracking-tighter">742 (Excellent)</span></span>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* Application Form */}
                <aside className="space-y-6">
                    <div className="bg-white border border-gray-200 p-8 rounded-[2.5rem] shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-vault-primary/10 rounded-lg text-vault-primary">
                                <Plus className="h-5 w-5" />
                            </div>
                            <h2 className="text-xl font-bold text-vault-primary">Apply for a Loan</h2>
                        </div>

                        <form onSubmit={handleApply} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Loan Type</label>
                                <select 
                                    name="loan_type"
                                    value={formData.loan_type}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-200 text-vault-primary font-bold rounded-2xl px-5 py-4 focus:ring-1 focus:ring-vault-secondary outline-none transition-all cursor-pointer"
                                >
                                    <option value="PERSONAL">Personal Wealth (8.5% APR)</option>
                                    <option value="CAR">Mobility Finance (5.2% APR)</option>
                                    <option value="HOME">Classic Mortgage (3.1% APR)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Loan Amount (€)</label>
                                <input 
                                    type="number"
                                    name="amount"
                                    placeholder="5000"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 text-vault-primary text-2xl font-black rounded-2xl px-5 py-4 focus:ring-1 focus:ring-vault-secondary outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Term Duration (Months)</label>
                                <input 
                                    type="number"
                                    name="duration_months"
                                    placeholder="24"
                                    value={formData.duration_months}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 text-vault-primary font-bold rounded-2xl px-5 py-4 focus:ring-1 focus:ring-vault-secondary outline-none transition-all"
                                />
                            </div>

                            <button className="w-full bg-vault-secondary hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-vault-secondary/20 flex items-center justify-center gap-2">
                                <Briefcase className="h-5 w-5" />
                                Submit Application
                            </button>
                        </form>
                        {message && (
                            <div className={`mt-6 p-4 rounded-xl text-center text-sm font-bold ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                {message}
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-50 border border-gray-100 p-6 rounded-3xl flex gap-4">
                        <Info className="h-6 w-6 text-vault-secondary shrink-0" />
                        <p className="text-xs text-gray-500 leading-relaxed font-medium">
                            Approval is instant for amounts under €10,000. Interest rates are fixed for the life of the loan.
                        </p>
                    </div>
                </aside>

                {/* Loans History */}
                <div className="xl:col-span-2">
                    <div className="bg-white border border-gray-200 rounded-[2.5rem] overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-[0.1em]">Loan Type</th>
                                    <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-[0.1em]">Amount</th>
                                    <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-[0.1em]">Term</th>
                                    <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-[0.1em]">Status</th>
                                    <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-[0.1em] text-right">Applied On</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loans.map((loan) => (
                                    <tr key={loan.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <p className="font-extrabold text-vault-primary tracking-tight">{loan.loan_type_display}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-xl font-black text-vault-primary">€{parseFloat(loan.amount).toLocaleString()}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-bold text-gray-500">{loan.duration_months} Months</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusStyles(loan.status)}`}>
                                                {getStatusIcon(loan.status)}
                                                <span>{loan.status_display}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <p className="text-xs text-gray-400 font-bold">{new Date(loan.created_at).toLocaleDateString()}</p>
                                        </td>
                                    </tr>
                                ))}
                                {loans.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-16 text-center text-gray-400 font-medium italic">
                                            No active credit lines found in the history.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoansPage;
