'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Navbar = () => {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        // Init theme
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);

        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        console.log('Theme toggled to:', newTheme);
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-6 transition-all duration-300">
            {/* Background Blur */}
            <div className="absolute inset-0 -z-10 bg-white/5 dark:bg-black/10 backdrop-blur-md border-b border-black/5 dark:border-white/5 shadow-2xl"></div>

            <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-700 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                    <span className="text-lg font-black italic text-white">M</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-extrabold tracking-tight leading-none text-orange-500 uppercase">Mamah Faqih</span>
                    <span className="text-[10px] uppercase tracking-[0.3em] font-medium opacity-70 text-foreground transition-colors duration-500">Fine Dining Pizza</span>
                </div>
            </div>

            <div className="hidden md:flex gap-10 text-[13px] uppercase tracking-widest font-semibold text-foreground transition-colors duration-500">
                <Link href="#" className="relative group overflow-hidden py-1 border-b-2 border-orange-500">
                    <span className="text-orange-500">Home</span>
                </Link>
                <Link href="#" className="relative group overflow-hidden py-1">
                    <span className="group-hover:-translate-y-full transition-transform duration-300 block">Menu</span>
                    <span className="absolute top-full left-0 group-hover:-translate-y-full transition-transform duration-300 block text-orange-500">Menu</span>
                </Link>
                <Link href="#" className="relative group overflow-hidden py-1">
                    <span className="group-hover:-translate-y-full transition-transform duration-300 block">About</span>
                    <span className="absolute top-full left-0 group-hover:-translate-y-full transition-transform duration-300 block text-orange-500">About</span>
                </Link>
                <Link href="#" className="relative group overflow-hidden py-1">
                    <span className="group-hover:-translate-y-full transition-transform duration-300 block">Contact</span>
                    <span className="absolute top-full left-0 group-hover:-translate-y-full transition-transform duration-300 block text-orange-500">Contact</span>
                </Link>
            </div>

            <div className="flex items-center gap-4 md:gap-8">
                <button className="hidden sm:block px-6 py-2.5 bg-foreground text-background text-xs font-bold uppercase tracking-widest rounded-full hover:bg-orange-500 dark:hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-xl border border-white/20">
                    Order Now
                </button>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
                >
                    {theme === 'dark' ? (
                        <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                    )}
                </button>

                <button className="flex md:hidden flex-col gap-1.5 p-2 focus:outline-none group">
                    <span className="w-8 h-0.5 bg-zinc-900 dark:bg-white rounded-full transition-all group-hover:w-4 group-hover:bg-orange-500"></span>
                    <span className="w-8 h-0.5 bg-zinc-900 dark:bg-white rounded-full transition-all group-hover:bg-orange-500"></span>
                    <span className="w-4 h-0.5 bg-zinc-900 dark:bg-white rounded-full transition-all group-hover:w-8 group-hover:bg-orange-500"></span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
