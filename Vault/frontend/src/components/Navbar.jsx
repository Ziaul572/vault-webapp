import React from 'react';
import { Landmark, LogOut, LayoutDashboard, CreditCard, Send, History, Briefcase, User as UserIcon } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import api from '../api';

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('logout/');
      window.location.href = '/login';
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: CreditCard, label: 'Accounts', path: '/accounts' },
    { icon: Send, label: 'Transfer', path: '/transfer' },
    { icon: History, label: 'Transactions', path: '/transactions' },
    { icon: Briefcase, label: 'Loans', path: '/loans' },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full bg-vault-primary border-b border-white/10 shadow-lg py-1">
      <div className="container mx-auto max-w-6xl px-4 flex items-center justify-between h-20">
        {/* Brand */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <Landmark className="text-vault-accent h-8 w-8 transition-transform group-hover:scale-110" />
          <span className="text-2xl font-black tracking-tight text-white">VAULT</span>
        </NavLink>
        
        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'text-vault-accent bg-white/5'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          <NavLink 
            to="/profile" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${
                isActive ? 'bg-vault-secondary text-white' : 'bg-white/5 text-white/70 hover:text-white'
              }`
            }
          >
            <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
              <UserIcon className="h-4 w-4" />
            </div>
            <div className="text-left hidden md:block">
              <span className="text-sm font-bold block leading-tight">{user?.username || 'User'}</span>
              <span className="text-[10px] text-white/50 uppercase font-black tracking-tighter">My Account</span>
            </div>
          </NavLink>
          
          <button 
            onClick={handleLogout}
            className="p-3 text-white/50 hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
