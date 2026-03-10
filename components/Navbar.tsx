'use client';

import React from 'react';
import Link from 'next/link';

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-6 text-white transition-all duration-300">
            {/* Background Blur on Scroll - Simple CSS for now */}
            <div className="absolute inset-0 -z-10 bg-black/10 backdrop-blur-md border-b border-white/5 shadow-2xl"></div>

            <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-700 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                    <span className="text-lg font-black italic">M</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-extrabold tracking-tight leading-none text-orange-500 uppercase">Mamah Faqih</span>
                    <span className="text-[10px] uppercase tracking-[0.3em] font-medium opacity-60">Fine Dining Pizza</span>
                </div>
            </div>

            <div className="hidden md:flex gap-10 text-[13px] uppercase tracking-widest font-semibold">
                <Link href="#" className="relative group overflow-hidden py-1">
                    <span className="group-hover:-translate-y-full transition-transform duration-300 block">Home</span>
                    <span className="absolute top-full left-0 group-hover:-translate-y-full transition-transform duration-300 block text-orange-500">Home</span>
                </Link>
                <Link href="#" className="relative group overflow-hidden py-1">
                    <span className="group-hover:-translate-y-full transition-transform duration-300 block">Menu</span>
                    <span className="absolute top-full left-0 group-hover:-translate-y-full transition-transform duration-300 block text-orange-500">Menu</span>
                </Link>
                <Link href="#" className="relative group overflow-hidden py-1">
                    <span className="group-hover:-translate-y-full transition-transform duration-300 block">About</span>
                    <span className="absolute top-full left-0 group-hover:-translate-y-full transition-transform duration-300 block text-orange-500">About</span>
                </Link>
                <Link href="#" className="relative group overflow-hidden py-1 border-b-2 border-orange-500">
                    <span className="text-orange-500">Contact</span>
                </Link>
            </div>

            <div className="flex items-center gap-8">
                <button className="hidden sm:block px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-xl border border-white/20">
                    Order Now
                </button>
                <button className="flex flex-col gap-1.5 p-2 focus:outline-none group">
                    <span className="w-8 h-0.5 bg-white rounded-full transition-all group-hover:w-4 group-hover:bg-orange-500"></span>
                    <span className="w-8 h-0.5 bg-white rounded-full transition-all group-hover:bg-orange-500"></span>
                    <span className="w-4 h-0.5 bg-white rounded-full transition-all group-hover:w-8 group-hover:bg-orange-500"></span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
