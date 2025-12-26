/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, ShieldCheck } from 'lucide-react';

import { API_URL } from '../config';

interface AdminLoginProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: (token: string) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ isOpen, onClose, onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                onLoginSuccess(data.token);
                // Reset form
                setUsername('');
                setPassword('');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Connection refused. Is server running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-md bg-[#1a1b3b] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-[#637ab9]/20"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full bg-black/30 text-white hover:bg-white hover:text-black transition-colors border border-white/10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-8">
                            <div className="flex flex-col items-center mb-8">
                                <div className="p-4 rounded-full bg-[#637ab9]/20 border border-[#637ab9]/30 mb-4">
                                    <ShieldCheck className="w-8 h-8 text-[#637ab9]" />
                                </div>
                                <h2 className="text-2xl font-heading font-bold text-white uppercase tracking-widest">
                                    Admin Access
                                </h2>
                                <p className="text-[#637ab9] text-xs font-mono mt-2">SECURE PORTAL</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#637ab9] focus:ring-1 focus:ring-[#637ab9] transition-all"
                                        placeholder="Enter username"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#637ab9] focus:ring-1 focus:ring-[#637ab9] transition-all"
                                        placeholder="Enter password"
                                    />
                                </div>

                                {error && (
                                    <p className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded border border-red-500/20">
                                        {error}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-[#637ab9] text-white font-bold uppercase tracking-wider rounded-lg hover:bg-white hover:text-black transition-all shadow-[0_0_20px_rgba(99,122,185,0.3)] flex items-center justify-center gap-2 group"
                                >
                                    {loading ? 'Verifying...' : 'Authenticate'}
                                    {!loading && <Lock className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AdminLogin;
