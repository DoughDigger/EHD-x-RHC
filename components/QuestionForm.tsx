/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, HelpCircle, Mail, MessageSquare } from 'lucide-react';

interface QuestionFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [text, setText] = useState('Submit your questions');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('http://localhost:3001/api/question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, text }),
            });

            if (response.ok) {
                setIsSuccess(true);
                setTimeout(() => {
                    onClose();
                    setIsSuccess(false);
                    setEmail('');
                    setText('Submit your questions');
                }, 2000);
            } else {
                alert('Failed to submit question. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting question:', error);
            alert('Error connecting to server.');
        } finally {
            setIsSubmitting(false);
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
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-lg bg-[#1a1b3b] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-[#4fb7b3]/20"
                    >
                        {/* Header */}
                        <div className="relative bg-gradient-to-r from-[#4fb7b3]/20 to-[#637ab9]/20 border-b border-white/10 p-6 md:p-8">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-full bg-black/30 text-white hover:bg-white hover:text-black transition-colors border border-white/10"
                                data-hover="true"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-[#4fb7b3]/20 border border-[#4fb7b3]/30">
                                    <HelpCircle className="w-6 h-6 text-[#4fb7b3]" />
                                </div>
                                <h3 className="text-2xl font-heading font-bold text-white uppercase tracking-widest">
                                    Submit Question
                                </h3>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="p-6 md:p-8">
                            {!isSuccess ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="questionEmail" className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-[#4fb7b3]" />
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            id="questionEmail"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#4fb7b3] focus:ring-1 focus:ring-[#4fb7b3] transition-all"
                                            placeholder="your.email@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="questionText" className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4 text-[#637ab9]" />
                                            Your Question *
                                        </label>
                                        <textarea
                                            id="questionText"
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                            required
                                            rows={4}
                                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#4fb7b3] focus:ring-1 focus:ring-[#4fb7b3] transition-all resize-none"
                                            onClick={() => text === 'Submit your questions' && setText('')}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-[#4fb7b3] text-black font-bold uppercase tracking-widest rounded-lg hover:bg-white transition-all shadow-[0_0_20px_rgba(79,183,179,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Sending...' : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                Send Question
                                            </>
                                        )}
                                    </button>
                                </form>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="py-12 text-center"
                                >
                                    <div className="w-16 h-16 bg-[#4fb7b3]/20 border border-[#4fb7b3]/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Send className="w-8 h-8 text-[#4fb7b3]" />
                                    </div>
                                    <h4 className="text-xl font-heading font-bold text-white mb-2 uppercase tracking-widest">Sent!</h4>
                                    <p className="text-gray-400">We'll get back to you soon.</p>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default QuestionForm;
