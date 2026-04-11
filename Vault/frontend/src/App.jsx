import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import AccountsPage from './pages/AccountsPage';
import TransferPage from './pages/TransferPage';
import LoansPage from './pages/LoansPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import api from './api';

const App = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await api.get('profile/');
                setUser(res.data.user);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const handleLoginSuccess = (userData) => {
        setUser(userData);
    };

    const PrivateRoute = ({ children }) => {
        return user ? children : <Navigate to="/login" />;
    };

    if (loading) return (
        <div className="bg-vault-dark min-h-screen flex flex-col items-center justify-center gap-4 text-vault-gold font-black text-2xl">
            <div className="h-16 w-16 border-4 border-vault-gold border-t-transparent rounded-full animate-spin"></div>
            <span className="animate-pulse tracking-widest">SYNCHRONIZING VAULT...</span>
        </div>
    );

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage onLoginSuccess={handleLoginSuccess} />} />
                <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage onLoginSuccess={handleLoginSuccess} />} />

                {/* Protected Routes inside Layout */}
                <Route path="/*" element={
                    <PrivateRoute>
                        <Layout user={user}>
                            <Routes>
                                <Route path="/" element={<DashboardPage />} />
                                <Route path="/accounts" element={<AccountsPage />} />
                                <Route path="/transfer" element={<TransferPage />} />
                                <Route path="/loans" element={<LoansPage />} />
                                <Route path="/profile" element={<ProfilePage />} />
                                <Route path="*" element={<Navigate to="/" />} />
                            </Routes>
                        </Layout>
                    </PrivateRoute>
                } />
            </Routes>
        </Router>
    );
};

export default App;


