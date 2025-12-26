/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LayoutDashboard, Database, RefreshCw, LogOut, ChevronDown, ChevronUp } from 'lucide-react';

interface Registration {
    id: string;
    timestamp: string;
    packageName: string;
    parentFirstName: string;
    parentLastName: string;
    playerName: string;
    playerBirthYear: string;
    playerCurrentLeague: string;
    team: string;
    level: string;
    levelOther?: string;
}

interface AdminDashboardProps {
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => void;
    token: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose, onLogout, token }) => {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const fetchRegistrations = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3001/api/registrations');
            if (response.ok) {
                const data = await response.json();
                // Sort by timestamp desc
                setRegistrations(data.sort((a: Registration, b: Registration) =>
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                ));
            } else {
                console.error('Failed to fetch registrations');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchRegistrations();
        }
    }, [isOpen]);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[90] bg-[#1a1b3b] overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 bg-black/30 border-b border-white/10 backdrop-blur-md">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-[#637ab9]/20 border border-[#637ab9]/30">
                                <LayoutDashboard className="w-6 h-6 text-[#637ab9]" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-heading font-bold text-white uppercase tracking-widest">
                                    Admin Dashboard
                                </h2>
                                <p className="text-gray-400 text-xs font-mono">
                                    {registrations.length} Total Registrations
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={fetchRegistrations}
                                className="p-3 rounded-full bg-black/30 text-white hover:bg-white/10 transition-colors border border-white/10 group"
                                title="Refresh Data"
                            >
                                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                            </button>
                            <button
                                onClick={onLogout}
                                className="px-6 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 font-bold uppercase tracking-wider rounded-lg hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                            <button
                                onClick={onClose}
                                className="p-3 rounded-full bg-black/30 text-white hover:bg-white hover:text-black transition-colors border border-white/10"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                        <div className="max-w-7xl mx-auto">
                            <div className="bg-black/20 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">

                                {/* Table Header - Desktop */}
                                <div className="hidden md:grid grid-cols-12 gap-4 p-5 bg-white/5 border-b border-white/10 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    <div className="col-span-2">Date</div>
                                    <div className="col-span-2">Package</div>
                                    <div className="col-span-3">Player</div>
                                    <div className="col-span-2">Team</div>
                                    <div className="col-span-2">Level</div>
                                    <div className="col-span-1 text-center">Actions</div>
                                </div>

                                {/* Table Body */}
                                <div className="divide-y divide-white/5">
                                    {loading && registrations.length === 0 ? (
                                        <div className="p-20 text-center text-gray-500">Loading data...</div>
                                    ) : registrations.length === 0 ? (
                                        <div className="p-20 flex flex-col items-center gap-4 text-gray-500">
                                            <Database className="w-12 h-12 opacity-20" />
                                            <p>No registrations found yet.</p>
                                        </div>
                                    ) : (
                                        registrations.map((reg) => (
                                            <div key={reg.id} className="hover:bg-white/5 transition-colors">
                                                {/* Desktop Row */}
                                                <div className="hidden md:grid grid-cols-12 gap-4 p-5 items-center text-sm">
                                                    <div className="col-span-2 text-gray-400 font-mono text-xs">
                                                        {new Date(reg.timestamp).toLocaleDateString()} <br />
                                                        {new Date(reg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                    <div className="col-span-2">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${reg.packageName === 'Free Agent' ? 'bg-white/10 text-white border-white/20' :
                                                                reg.packageName === 'Team Entry' ? 'bg-[#4fb7b3]/20 text-[#4fb7b3] border-[#4fb7b3]/30' :
                                                                    'bg-[#637ab9]/20 text-[#637ab9] border-[#637ab9]/30'
                                                            }`}>
                                                            {reg.packageName}
                                                        </span>
                                                    </div>
                                                    <div className="col-span-3 font-bold text-white">
                                                        {reg.playerName} <span className="text-gray-500 font-normal text-xs">({reg.playerBirthYear})</span>
                                                    </div>
                                                    <div className="col-span-2 text-gray-300">{reg.team}</div>
                                                    <div className="col-span-2 text-gray-300">
                                                        {reg.level} {reg.level === 'Other' && <span className="text-xs text-gray-500">({reg.levelOther})</span>}
                                                    </div>
                                                    <div className="col-span-1 flex justify-center">
                                                        <button
                                                            onClick={() => toggleExpand(reg.id)}
                                                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                                        >
                                                            {expandedId === reg.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Mobile Row Summary */}
                                                <div
                                                    className="md:hidden p-5 flex items-center justify-between cursor-pointer"
                                                    onClick={() => toggleExpand(reg.id)}
                                                >
                                                    <div>
                                                        <div className="font-bold text-white mb-1">{reg.playerName}</div>
                                                        <div className="text-xs text-gray-400">{reg.team} • {reg.level}</div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${reg.packageName === 'Free Agent' ? 'bg-white/10 text-white' :
                                                                reg.packageName === 'Team Entry' ? 'bg-[#4fb7b3]/20 text-[#4fb7b3]' :
                                                                    'bg-[#637ab9]/20 text-[#637ab9]'
                                                            }`}>
                                                            {reg.packageName}
                                                        </span>
                                                        {expandedId === reg.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                    </div>
                                                </div>

                                                {/* Expanded Details */}
                                                <AnimatePresence>
                                                    {expandedId === reg.id && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden bg-black/20"
                                                        >
                                                            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/5">
                                                                <div>
                                                                    <h4 className="text-[#4fb7b3] text-xs font-bold uppercase tracking-widest mb-4">Player Details</h4>
                                                                    <div className="space-y-2 text-sm">
                                                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                                                            <span className="text-gray-500">Full Name</span>
                                                                            <span className="text-white">{reg.playerName}</span>
                                                                        </div>
                                                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                                                            <span className="text-gray-500">Birth Year</span>
                                                                            <span className="text-white">{reg.playerBirthYear}</span>
                                                                        </div>
                                                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                                                            <span className="text-gray-500">Team</span>
                                                                            <span className="text-white">{reg.team}</span>
                                                                        </div>
                                                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                                                            <span className="text-gray-500">League</span>
                                                                            <span className="text-white">{reg.playerCurrentLeague}</span>
                                                                        </div>
                                                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                                                            <span className="text-gray-500">Level</span>
                                                                            <span className="text-white">{reg.level} {reg.levelOther && `(${reg.levelOther})`}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <h4 className="text-[#637ab9] text-xs font-bold uppercase tracking-widest mb-4">Parent / Guardian</h4>
                                                                    <div className="space-y-2 text-sm">
                                                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                                                            <span className="text-gray-500">Name</span>
                                                                            <span className="text-white">{reg.parentFirstName} {reg.parentLastName}</span>
                                                                        </div>
                                                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                                                            <span className="text-gray-500">Contact</span>
                                                                            <span className="text-gray-500 italic">Not collected in this version</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AdminDashboard;
