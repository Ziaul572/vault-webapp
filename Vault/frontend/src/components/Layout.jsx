import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children, user }) => {
  return (
    <div className="min-h-screen bg-vault-background text-gray-900 font-sans flex flex-col">
      <Navbar user={user} />
      {/* Centered container using max-w and mx-auto */}
      <main className="flex-grow pt-28 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          {children}
        </div>
      </main>
      
      {/* Simple footer - like original design */}
      <footer className="bg-vault-primary text-white py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h5 className="text-xl font-black text-vault-accent mb-4 tracking-tighter">VAULT</h5>
              <p className="text-sm text-white/60 leading-relaxed font-medium">
                VAULT is a secure digital banking platform designed to simplify
                account management, money transfers, and financial tracking.
              </p>
            </div>
            <div>
              <h5 className="text-xl font-bold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-sm text-white/50">
                <li><a href="/" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="/accounts" className="hover:text-white transition-colors">Accounts</a></li>
                <li><a href="/transfer" className="hover:text-white transition-colors">Transfers</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-xl font-bold mb-4">Contact Support</h5>
              <div className="space-y-2 text-sm text-white/50">
                <p>Email: <span className="text-white font-medium">support@vaultbank.ie</span></p>
                <p>Phone: <span className="text-white font-medium">+353 1 234 5678</span></p>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-[10px] text-white/30 font-bold uppercase tracking-[0.3em]">
            © 2026 VAULT. Educational Demo Platform.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
