/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserCircle, Calendar, Trophy, Users, HelpCircle } from 'lucide-react';

import { API_URL } from '../config';

interface CommitmentFormProps {
    isOpen?: boolean;
    onClose?: () => void;
    onSubmit: (data: CommitmentFormData) => void;
    packageName?: string;
    isInline?: boolean;
    onQuestionClick?: () => void;
}

export interface CommitmentFormData {
    parentFirstName: string;
    parentLastName: string;
    email: string;
    playerName: string;
    playerCurrentLeague: string;
    team: string;
    level: string;
    levelOther?: string;
    position: string;
    packageName?: string;
    packageOther?: string;
}

const CommitmentForm: React.FC<CommitmentFormProps> = ({ isOpen, onClose, onSubmit, packageName, isInline = false, onQuestionClick }) => {
    const [formData, setFormData] = useState<CommitmentFormData>({
        parentFirstName: '',
        parentLastName: '',
        email: '',
        playerName: '',
        playerCurrentLeague: '',
        team: '',
        level: 'A',
        levelOther: '',
        position: 'F',
        packageName: '1 Player + 1 Parent',
        packageOther: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    packageName: packageName || formData.packageName
                }),
            });

            if (response.ok) {
                onSubmit(formData);
                // Reset form
                setFormData({
                    parentFirstName: '',
                    parentLastName: '',
                    email: '',
                    playerName: '',
                    playerCurrentLeague: '',
                    team: '',
                    level: 'A',
                    levelOther: '',
                    position: 'F',
                    packageName: '1 Player + 1 Parent',
                    packageOther: '',
                });
            } else {
                alert('Failed to register. Please ensure the server is running on port 3001.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error connecting to server. Please ensure the backend is running.');
        }
    };

    const formContent = (
        <motion.div
            initial={isInline ? { opacity: 0, y: 20 } : { scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={isInline ? { opacity: 0, y: 20 } : { scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full ${isInline ? 'max-w-4xl mx-auto' : 'max-w-2xl'} bg-[#1a1b3b] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-[#4fb7b3]/20`}
        >
            {!isInline && onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/30 text-white hover:bg-white hover:text-black transition-colors border border-white/10 z-10"
                    data-hover="true"
                >
                    <X className="w-5 h-5" />
                </button>
            )}

            {isInline && onQuestionClick && (
                <button
                    onClick={onQuestionClick}
                    className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-[#4fb7b3]/10 border border-[#4fb7b3]/30 text-[#4fb7b3] text-[10px] font-bold uppercase tracking-widest hover:bg-[#4fb7b3] hover:text-black transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(79,183,179,0.1)] group z-10"
                    data-hover="true"
                    title="Submit Question"
                >
                    <HelpCircle className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                    <span className="hidden sm:inline">Submit Question</span>
                </button>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className={`p-4 md:p-6 space-y-4 ${!isInline ? 'max-h-[60vh] overflow-y-auto custom-scrollbar' : ''}`}>
                {/* Package Selection - Only if inline */}
                {isInline && (
                    <div>
                        <label htmlFor="packageName" className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                            Select Package *
                        </label>
                        <select
                            id="packageName"
                            name="packageName"
                            value={formData.packageName || '1 Player + 1 Parent'}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#4fb7b3] focus:ring-1 focus:ring-[#4fb7b3] transition-all cursor-pointer"
                        >
                            <option className="bg-[#1a1b3b] text-white" value="1 Player + 1 Parent">1 Player + 1 Parent ($3,400)</option>
                            <option className="bg-[#1a1b3b] text-white" value="1 Player + 2 Guests">1 Player + 2 Guests ($4,600)</option>
                            <option className="bg-[#1a1b3b] text-white" value="1 Player + 3 Guests">1 Player + 3 Guests ($5,900)</option>
                            <option className="bg-[#1a1b3b] text-white" value="Other">Other / Custom Package</option>
                        </select>
                    </div>
                )}

                {/* Package Other Description - Only if Other is selected */}
                {isInline && formData.packageName === 'Other' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <label htmlFor="packageOther" className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                            Please Describe Your Package Needs *
                        </label>
                        <textarea
                            id="packageOther"
                            name="packageOther"
                            value={formData.packageOther}
                            onChange={handleChange}
                            required
                            rows={3}
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#4fb7b3] focus:ring-1 focus:ring-[#4fb7b3] transition-all resize-none"
                            placeholder="Please describe your custom package requirements..."
                        />
                    </motion.div>
                )}

                {/* Parent Information */}
                <div>
                    <h3 className="text-xl font-heading font-bold text-white mb-4 flex items-center gap-2">
                        <UserCircle className="w-5 h-5 text-[#4fb7b3]" />
                        Parent Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="parentFirstName" className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                                First Name *
                            </label>
                            <input
                                type="text"
                                id="parentFirstName"
                                name="parentFirstName"
                                value={formData.parentFirstName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#4fb7b3] focus:ring-1 focus:ring-[#4fb7b3] transition-all"
                                placeholder="Enter first name"
                            />
                        </div>
                        <div>
                            <label htmlFor="parentLastName" className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                                Last Name *
                            </label>
                            <input
                                type="text"
                                id="parentLastName"
                                name="parentLastName"
                                value={formData.parentLastName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#4fb7b3] focus:ring-1 focus:ring-[#4fb7b3] transition-all"
                                placeholder="Enter last name"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#4fb7b3] focus:ring-1 focus:ring-[#4fb7b3] transition-all"
                                placeholder="your.email@example.com"
                            />
                        </div>
                    </div>
                </div>

                {/* Player Information */}
                <div>
                    <h3 className="text-xl font-heading font-bold text-white mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-[#637ab9]" />
                        Player Information
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="playerName" className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                                Player Name *
                            </label>
                            <input
                                type="text"
                                id="playerName"
                                name="playerName"
                                value={formData.playerName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#4fb7b3] focus:ring-1 focus:ring-[#4fb7b3] transition-all"
                                placeholder="Enter player name"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label htmlFor="position" className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                                    Position *
                                </label>
                                <select
                                    id="position"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#4fb7b3] focus:ring-1 focus:ring-[#4fb7b3] transition-all cursor-pointer"
                                >
                                    <option className="bg-[#1a1b3b] text-white" value="F">F</option>
                                    <option className="bg-[#1a1b3b] text-white" value="D">D</option>
                                    <option className="bg-[#1a1b3b] text-white" value="G">G</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="level" className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                                    Level *
                                </label>
                                <select
                                    id="level"
                                    name="level"
                                    value={formData.level}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#4fb7b3] focus:ring-1 focus:ring-[#4fb7b3] transition-all cursor-pointer"
                                >
                                    <option className="bg-[#1a1b3b] text-white" value="A">A</option>
                                    <option className="bg-[#1a1b3b] text-white" value="AA">AA</option>
                                    <option className="bg-[#1a1b3b] text-white" value="AAA">AAA</option>
                                    <option className="bg-[#1a1b3b] text-white" value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="playerCurrentLeague" className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                                    Current League *
                                </label>
                                <input
                                    type="text"
                                    id="playerCurrentLeague"
                                    name="playerCurrentLeague"
                                    value={formData.playerCurrentLeague}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#4fb7b3] focus:ring-1 focus:ring-[#4fb7b3] transition-all"
                                    placeholder="e.g., GTHL"
                                />
                            </div>

                            <div>
                                <label htmlFor="team" className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                                    Team *
                                </label>
                                <input
                                    type="text"
                                    id="team"
                                    name="team"
                                    value={formData.team}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#4fb7b3] focus:ring-1 focus:ring-[#4fb7b3] transition-all"
                                    placeholder="Enter team"
                                />
                            </div>
                        </div>

                        {formData.level === 'Other' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <label htmlFor="levelOther" className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                                    Please Specify Level *
                                </label>
                                <input
                                    type="text"
                                    id="levelOther"
                                    name="levelOther"
                                    value={formData.levelOther}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#4fb7b3] focus:ring-1 focus:ring-[#4fb7b3] transition-all"
                                    placeholder="Enter level"
                                />
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4 flex gap-4">
                    {!isInline && onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 border border-white/20 text-white font-bold uppercase tracking-wider rounded-lg hover:bg-white/10 transition-all"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        className="flex-1 px-6 py-4 bg-[#4fb7b3] text-black font-bold uppercase tracking-wider rounded-lg hover:bg-white transition-all shadow-[0_0_20px_rgba(79,183,179,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                    >
                        Submit Registration
                    </button>
                </div>
            </form>
        </motion.div>
    );

    if (isInline) {
        return formContent;
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg"
                >
                    {formContent}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CommitmentForm;
