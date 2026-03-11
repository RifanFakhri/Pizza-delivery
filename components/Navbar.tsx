'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Navbar = () => {
    const [theme, setTheme] = useState('dark');
    const [activeSection, setActiveSection] = useState('home');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Init theme
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // --- ACTIVE SECTION OBSERVER ---
        const sections = ['home', 'about', 'menu', 'contact'];
        const observerOptions = {
            root: null,
            rootMargin: '-40% 0px -40% 0px', // Trigger when section is in the middle 20%
            threshold: 0
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMobileMenuOpen]);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);

        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const scrollTo = (id: string) => {
        setIsMobileMenuOpen(false);
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const NavLink = ({ id, label, mobile = false }: { id: string, label: string, mobile?: boolean }) => {
        const isActive = activeSection === id;

        if (mobile) {
            return (
                <button
                    onClick={() => scrollTo(id)}
                    className="w-full text-left py-2 border-b border-foreground/5 group overflow-hidden"
                >
                    <div className="flex justify-between items-center h-12">
                        <span className={`text-4xl font-black uppercase tracking-tighter transition-all duration-500 ${isActive ? 'text-orange-500 pl-4' : 'text-foreground hover:pl-4'}`}>
                            {label}
                        </span>
                        {isActive && <div className="w-8 h-1 bg-orange-500 rounded-full"></div>}
                    </div>
                </button>
            );
        }

        return (
            <Link
                href={`#${id}`}
                className={`relative group overflow-hidden py-1 transition-all duration-500 ${isActive ? 'border-b-2 border-orange-500' : ''}`}
                onClick={(e) => { e.preventDefault(); scrollTo(id); }}
            >
                <span className={`block transition-all duration-300 ${isActive ? 'text-orange-500' : 'group-hover:-translate-y-full'}`}>
                    {label}
                </span>
                {!isActive && (
                    <span className="absolute top-full left-0 group-hover:-translate-y-full transition-transform duration-300 block text-orange-500">
                        {label}
                    </span>
                )}
            </Link>
        );
    };

    return (
        <>
            <nav className="fixed top-0 left-0 w-full z-[70] flex justify-between items-center px-6 md:px-12 py-6 transition-all duration-300">
                {/* Background Blur */}
                <div className={`absolute inset-0 -z-10 bg-white/70 dark:bg-black/10 backdrop-blur-md border-b border-black/5 dark:border-white/10 shadow-2xl transition-opacity duration-500 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></div>

                <div className="flex items-center gap-3 group cursor-pointer relative z-[60]" onClick={() => scrollTo('home')}>
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-700 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                        <span className="text-lg font-black italic text-white">M</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-extrabold tracking-tight leading-none text-orange-500 uppercase">Mamah Faqih</span>
                        <span className="text-[10px] uppercase tracking-[0.3em] font-medium opacity-70 text-foreground transition-colors duration-500">Fine Dining Pizza</span>
                    </div>
                </div>

                <div className="hidden md:flex gap-10 text-[13px] uppercase tracking-widest font-semibold text-foreground transition-colors duration-500">
                    <NavLink id="home" label="Home" />
                    <NavLink id="about" label="About" />
                    <NavLink id="menu" label="Menu" />
                    <NavLink id="contact" label="Contact" />
                </div>

                <div className="flex items-center gap-4 md:gap-8 relative z-[60]">
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

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="flex md:hidden flex-col gap-1.5 p-2 focus:outline-none group relative w-10 h-10 items-center justify-center"
                    >
                        <span className={`w-8 h-0.5 bg-orange-500 rounded-full transition-all duration-500 absolute ${isMobileMenuOpen ? 'rotate-45' : '-translate-y-2'}`}></span>
                        <span className={`w-8 h-0.5 bg-orange-500 rounded-full transition-all duration-500 absolute ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                        <span className={`w-8 h-0.5 bg-orange-500 rounded-full transition-all duration-500 absolute ${isMobileMenuOpen ? '-rotate-45' : 'translate-y-2'}`}></span>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 z-[60] md:hidden transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}
            >
                {/* Visual Background */}
                <div className="absolute inset-0 bg-background transition-colors duration-500"></div>
                <div className="absolute inset-0 bg-[url('/bg.png')] opacity-10 dark:opacity-20 mix-blend-overlay pointer-events-none"></div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-center px-8 pt-10">
                    <div className="flex flex-col gap-1 max-w-xs">
                        <NavLink id="home" label="Home" mobile />
                        <NavLink id="about" label="About" mobile />
                        <NavLink id="menu" label="Menu" mobile />
                        <NavLink id="contact" label="Contact" mobile />
                    </div>

                    <div className="mt-12 flex flex-col gap-6">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase tracking-[0.4em] font-black text-orange-500">Contact Us</span>
                            <span className="text-xl font-bold text-foreground">+62 123 4567 8900</span>
                        </div>
                        <div className="flex gap-6">
                            {['Instagram', 'Twitter', 'Facebook'].map(s => (
                                <span key={s} className="text-[10px] font-black uppercase tracking-widest text-foreground/40">{s}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Decorative background text */}
                <div className="absolute bottom-10 right-0 select-none pointer-events-none opacity-5 leading-none overflow-hidden">
                    <span className="text-[10rem] font-black text-foreground vertical-text rotate-90 block">MENU</span>
                </div>
            </div>
        </>
    );
};

export default Navbar;
