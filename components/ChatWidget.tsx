'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

interface Message {
    id: number;
    text: string;
    sender: 'bot' | 'user';
    timestamp: Date;
}

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "Ciao! I'm your Mamah Faqih Pizza Bot. How can I help you today? 🍕",
            sender: 'bot',
            timestamp: new Date(),
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const chatRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = (text: string, isUser = true) => {
        if (!text.trim()) return;

        const newUserMsg: Message = {
            id: Date.now(),
            text,
            sender: isUser ? 'user' : 'bot',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, newUserMsg]);
        if (isUser) {
            setInputValue('');
            handleBotResponse(text.toLowerCase());
        }
    };

    const handleBotResponse = (userText: string) => {
        setIsTyping(true);

        // Match user text for responses
        setTimeout(() => {
            let botText = "Maaf, saya kurang mengerti pesan Anda. Apakah Anda ingin melihat menu kami atau jam operasional?";

            if (userText.includes('menu') || userText.includes('daftar')) {
                botText = "Anda dapat melihat menu lengkap kami di bagian 'Menu' pada website! Kami memiliki segalanya, mulai dari Margherita klasik hingga Pepperoni Pedas andalan kami. 🍕";
            } else if (userText.includes('hour') || userText.includes('jam') || userText.includes('buka') || userText.includes('tutup') || userText.includes('operasional')) {
                botText = "Kami buka Senin-Kamis (11:00-22:00) dan Jumat-Sabtu (11:00-23:30). Kami tutup pada hari Minggu! ⏰";
            } else if (userText.includes('lokasi') || userText.includes('alamat') || userText.includes('dimana') || userText.includes('tempat') || userText.includes('location')) {
                botText = "Kami berlokasi di Jl. Pizza Enak No. 123, Jakarta, Indonesia. Ayo mampir! 📍";
            } else if (userText.includes('order') || userText.includes('pesan') || userText.includes('beli') || userText.includes('bayar')) {
                botText = "Untuk memesan, Anda dapat mengklik tombol 'Order Now' di bagian atas halaman atau hubungi kami langsung di +62 123 4567 8900! 📞";
            } else if (userText.includes('hi') || userText.includes('hello') || userText.includes('halo') || userText.includes('hai') || userText.includes('pagi') || userText.includes('siang') || userText.includes('sore') || userText.includes('malam')) {
                botText = "Halo! Siap menikmati pizza yang lezat? Ada yang bisa saya bantu hari ini? 😊";
            }

            const newBotMsg: Message = {
                id: Date.now(),
                text: botText,
                sender: 'bot',
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, newBotMsg]);
            setIsTyping(false);
        }, 1500);
    };

    const toggleChat = () => {
        if (!isOpen) {
            setIsOpen(true);
            gsap.fromTo(chatRef.current,
                { opacity: 0, y: 50, scale: 0.8, pointerEvents: 'none' },
                { opacity: 1, y: 0, scale: 1, pointerEvents: 'auto', duration: 0.5, ease: 'back.out(1.7)' }
            );
        } else {
            gsap.to(chatRef.current, {
                opacity: 0, y: 50, scale: 0.8, pointerEvents: 'none', duration: 0.3, ease: 'power2.in',
                onComplete: () => setIsOpen(false)
            });
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] font-sans">
            {/* Chat Window */}
            <div
                ref={chatRef}
                className={`absolute bottom-20 right-0 w-[350px] sm:w-[400px] h-[500px] bg-white dark:bg-neutral-900 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden ${!isOpen ? 'hidden' : ''}`}
            >
                {/* Header */}
                <div className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 flex items-center gap-4">
                    <div className="relative w-12 h-12 bg-white rounded-full p-1 flex items-center justify-center">
                        <div className="relative w-full h-full bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-xl">👨‍🍳</span>
                        </div>
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-black uppercase tracking-widest text-sm">Chef Faqih Bot</span>
                        <span className="text-white/70 text-[10px] uppercase tracking-widest font-medium">Online • Ready to Help</span>
                    </div>
                    <button
                        onClick={toggleChat}
                        className="ml-auto text-white/50 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-neutral-50/50 dark:bg-neutral-950/50 custom-scrollbar">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                        >
                            <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${msg.sender === 'user'
                                ? 'bg-orange-500 text-white rounded-tr-none'
                                : 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 rounded-tl-none border border-neutral-100 dark:border-neutral-700'
                                }`}>
                                {msg.text}
                            </div>
                            <span className="text-[10px] text-neutral-400 mt-1 px-1">
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex flex-col items-start gap-1">
                            <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl rounded-tl-none border border-neutral-100 dark:border-neutral-700 shadow-sm flex gap-1">
                                <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Replies */}
                <div className="px-6 py-4 flex gap-2 overflow-x-auto no-scrollbar bg-neutral-50/30 dark:bg-neutral-950/30 border-t border-neutral-100 dark:border-neutral-800">
                    {['View Menu 🍕', 'Opening Hours ⏰', 'Location 📍'].map((btn) => (
                        <button
                            key={btn}
                            onClick={() => handleSendMessage(btn.replace(/[🍕⏰📍]/g, '').trim())}
                            className="whitespace-nowrap px-4 py-2 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-600 dark:text-orange-400 font-bold text-[10px] uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all duration-300"
                        >
                            {btn}
                        </button>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-3">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                        placeholder="Ketik pesan..."
                        className="flex-1 bg-neutral-100 dark:bg-neutral-800 border-2 border-transparent focus:border-orange-500 rounded-2xl py-3 px-5 text-sm font-medium text-black dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400 transition-all outline-none"
                    />
                    <button
                        onClick={() => handleSendMessage(inputValue)}
                        disabled={!inputValue.trim()}
                        className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-[0_5px_15px_rgba(249,115,22,0.3)] hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-5 h-5 rotate-90" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Floating Toggle Button */}
            <button
                onClick={toggleChat}
                className={`relative group w-16 h-16 rounded-full flex items-center justify-center text-white shadow-[0_10px_30px_rgba(249,115,22,0.4)] transition-all duration-500 hover:scale-110 active:scale-90 overflow-hidden ${isOpen ? 'bg-neutral-800' : 'bg-orange-500'}`}
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-600 to-orange-400"></div>

                {/* Icons Container */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <div className={`absolute transition-all duration-500 ${isOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}>
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                    <div className={`absolute transition-all duration-500 ${!isOpen ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}>
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                </div>

                {/* Pulse Effect */}
                {!isOpen && (
                    <div className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-20 pointer-events-none"></div>
                )}
            </button>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e5e5e5;
                    border-radius: 10px;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #262626;
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default ChatWidget;
