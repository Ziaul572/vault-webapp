import React, { useState, useEffect } from 'react';
import api from '../api';
import { Wallet, ArrowUpRight, ArrowDownLeft, TrendingUp, CreditCard } from 'lucide-react';

const DashboardPage = () => {
  const [data, setData] = useState({
    accounts: [],
    transactions: [],
    loans: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [accountsRes, transRes, loansRes] = await Promise.all([
          api.get('accounts/'),
          api.get('transactions/'),
          api.get('loans/')
        ]);
        setData({
          accounts: accountsRes.data,
          transactions: transRes.data.slice(0, 5),
          loans: loansRes.data
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const totalBalance = data.accounts.reduce((sum, acc) => sum + parseFloat(acc.balance), 0);

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="h-12 w-12 border-4 border-vault-secondary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col items-center text-center gap-1 mb-10">
        <h1 className="text-4xl font-black text-vault-primary tracking-tighter">Dashboard</h1>
        <p className="text-gray-500 font-medium">Welcome back to your secure banking portal.</p>
        <div className="w-20 h-1.5 bg-vault-secondary rounded-full mt-4"></div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Balance" value={`€${totalBalance.toLocaleString()}`} icon={Wallet} color="bg-vault-secondary" />
        <StatCard title="Active Accounts" value={data.accounts.length} icon={CreditCard} color="bg-vault-primary" />
        <StatCard title="Total Loans" value={data.loans.length} icon={TrendingUp} color="bg-vault-accent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <section className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-vault-primary">Recent Activity</h2>
            <button className="text-sm font-bold text-vault-secondary hover:underline">See Statement</button>
          </div>
          <div className="space-y-2">
            {data.transactions.map((tx) => (
              <TransactionItem key={tx.id} tx={tx} accounts={data.accounts} />
            ))}
            {data.transactions.length === 0 && <p className="text-gray-400 text-center py-10 italic">No transactions found.</p>}
          </div>
        </section>

        {/* Account Quick List */}
        <section className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-vault-primary">My Bank Accounts</h2>
          </div>
          <div className="space-y-4">
            {data.accounts.map((acc) => (
              <AccountItem key={acc.id} acc={acc} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow group">
    <div className="flex items-center gap-4">
      <div className={`p-4 ${color} rounded-2xl text-white group-hover:scale-105 transition-transform`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{title}</p>
        <p className="text-2xl font-black text-vault-primary mt-1">{value}</p>
      </div>
    </div>
  </div>
);

const TransactionItem = ({ tx, accounts }) => {
  const isOutgoing = tx.transaction_type === 'withdrawal' || (tx.transaction_type === 'transfer' && accounts.some(a => a.id === tx.from_account));
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${isOutgoing ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          {isOutgoing ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
        </div>
        <div>
          <p className="font-bold text-vault-primary capitalize">{tx.transaction_type}</p>
          <p className="text-xs text-gray-500 font-medium">{new Date(tx.created_at).toLocaleDateString()}</p>
        </div>
      </div>
      <p className={`text-lg font-black ${isOutgoing ? 'text-red-600' : 'text-green-600'}`}>
        {isOutgoing ? '-' : '+'}€{parseFloat(tx.amount).toLocaleString()}
      </p>
    </div>
  );
};

const AccountItem = ({ acc }) => (
  <div className="p-5 rounded-2xl border border-gray-100 bg-vault-background/50 hover:border-vault-secondary transition-colors cursor-pointer group">
    <div className="flex justify-between items-start mb-4">
      <CreditCard className="h-8 w-8 text-vault-primary opacity-20 group-hover:opacity-100 transition-opacity" />
      <span className="text-[10px] font-black text-vault-secondary uppercase tracking-tighter">{acc.account_type}</span>
    </div>
    <p className="text-sm font-bold text-gray-400 mb-1">•••• •••• •••• {acc.account_number.slice(-4)}</p>
    <p className="text-xl font-black text-vault-primary">€{parseFloat(acc.balance).toLocaleString()}</p>
  </div>
);

export default DashboardPage;
