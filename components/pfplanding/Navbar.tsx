"use client"
import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Zap, Target, Crosshair } from 'lucide-react';

export const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    const navLinks = [
        { name: 'About', href: '/about', desc: 'Mission' },
        { name: 'Blog', href: '/blog', desc: 'Intel' },
        { name: 'Pricing', href: '/pricing', desc: 'Upgrade' },
    ];

    // Animation variants for the "shutter" slices
    const shutterVariants = {
        closed: { height: "0%" },
        open: (i: number) => ({
            height: "100%",
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                delay: i * 0.05, // Faster stagger
            },
        }),
        exit: (i: number) => ({
            height: "0%",
            transition: {
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                delay: i * 0.03,
            },
        }),
    };

    return (
        <nav
            className={`sticky top-0 left-0 w-full z-50 border-b transition-all duration-300 border-b-[#333] ${scrolled
                    ? 'bg-black/90 backdrop-blur-none border-[#333]'
                    : 'bg-transparent border-transparent'
                }`}
        >
            <div className="flex justify-between items-center h-20 px-6 md:px-12 relative z-50 max-w-[1920px] mx-auto">
                
                {/* --- Logo Section --- */}
                <Link href="/" className="relative z-50">
                    <div className="flex items-center gap-4 group cursor-pointer">
                        {/* Angular Logo Mark */}
                        <div className="relative w-8 h-8 flex items-center justify-center border border-[#333] group-hover:border-[#CCFF00] transition-colors duration-300 bg-black">
                            <Crosshair className="w-4 h-4 text-[#CCFF00] group-hover:rotate-90 transition-transform duration-500" />
                            {/* Corner Accents */}
                            <div className="absolute top-0 left-0 w-1 h-1 bg-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="absolute bottom-0 right-0 w-1 h-1 bg-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        
                        <div className="flex flex-col">
                            <span className="font-display font-bold text-xl tracking-tight uppercase text-white leading-none group-hover:text-[#CCFF00] transition-colors">
                                UnrealShot AI
                            </span>
                            <span className="font-mono text-[9px] text-[#666] uppercase tracking-widest group-hover:text-white transition-colors flex items-center gap-1">
                                <span className="w-1 h-1 bg-[#CCFF00] animate-pulse"></span>
                                AI Photoshoots
                            </span>
                        </div>
                    </div>
                </Link>


                {/* --- Desktop Navigation (Angular Tech-Bar) --- */}
                <div className="hidden md:flex items-center bg-black border border-[#333] px-1 h-10">
                    {navLinks.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="relative h-full px-6 flex items-center justify-center font-mono text-xs uppercase tracking-widest text-[#a4a4a4] hover:text-black hover:bg-[#CCFF00] transition-all duration-200 group border-r border-[#333] last:border-r-0"
                        >
                            <span className="relative z-10">{item.name}</span>
                        </Link>
                    ))}
                </div>

                {/* --- Desktop Actions --- */}
                <div className="hidden md:flex items-center gap-6">
                    <Link href="/login" className="font-mono text-xs uppercase text-[#666] hover:text-white transition-colors relative group">
                        <span className="relative z-10">Login</span>
                        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#CCFF00] group-hover:w-full transition-all duration-300"></span>
                    </Link>
                    <Link href="/login">
                        <button className="relative bg-transparent border border-[#CCFF00] text-[#CCFF00] font-mono font-bold uppercase text-xs px-6 py-2 group overflow-hidden">
                            <span className="relative z-10 group-hover:text-black transition-colors duration-300">Initialize</span>
                            <div className="absolute inset-0 bg-[#CCFF00] translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0"></div>
                        </button>
                    </Link>
                </div>

                {/* --- Mobile Menu Toggle (Brutalist Box) --- */}
                <div className="flex md:hidden items-center gap-4 z-50">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-12 h-12 flex flex-col justify-center items-center gap-[4px] border border-[#333] bg-black hover:border-[#CCFF00] transition-colors relative group"
                        aria-label="Toggle Menu"
                    >
                        {/* Animated Lines */}
                        <motion.div 
                            animate={isOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                            className="w-4 h-[2px] bg-white group-hover:bg-[#CCFF00] transition-colors"
                        />
                         <motion.div 
                            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                            className="w-4 h-[2px] bg-white group-hover:bg-[#CCFF00] transition-colors"
                        />
                         <motion.div 
                            animate={isOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                            className="w-4 h-[2px] bg-white group-hover:bg-[#CCFF00] transition-colors"
                        />
                    </button>
                </div>
            </div>

            {/* --- Mobile Menu (Cyber Shutter Reveal) --- */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-40 flex flex-col md:hidden">
                        
                        {/* 1. Shutter Slices (Background) */}
                        <div className="absolute inset-0 flex pointer-events-none">
                            {[0, 1, 2, 3, 4].map((i) => (
                                <motion.div
                                    key={i}
                                    custom={i}
                                    variants={shutterVariants}
                                    initial="closed"
                                    animate="open"
                                    exit="exit"
                                    className="h-full flex-1 bg-black border-r border-[#333] last:border-r-0 relative overflow-hidden"
                                >
                                     {/* Premium Scanline Texture */}
                                    <div className="absolute inset-0 opacity-10 pointer-events-none" 
                                        style={{ 
                                            backgroundImage: 'linear-gradient(to bottom, transparent 50%, #ffffff 50%)', 
                                            backgroundSize: '100% 4px' 
                                        }}>
                                    </div>
                                    {/* Vignette */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50"></div>
                                </motion.div>
                            ))}
                        </div>

                        {/* 2. Menu Content (Fade In) */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: 0.4, duration: 0.3 }}
                            className="relative z-50 flex flex-col h-full pt-32 px-8"
                        >
                            {/* Navigation Links */}
                            <div className="flex flex-col gap-2">
                                {navLinks.map((item, i) => (
                                    <Link 
                                        key={item.name}
                                        href={item.href} 
                                        onClick={() => setIsOpen(false)}
                                        className="group block relative overflow-hidden"
                                    >
                                        <div className="flex items-center justify-between py-6 border-b border-[#333] group-hover:border-[#CCFF00] transition-colors relative z-10 bg-black/0 hover:bg-white/5 px-4 -mx-4">
                                            <div className="flex items-center gap-4">
                                                <span className="font-mono text-xs text-[#666] group-hover:text-[#CCFF00]">0{i+1}</span>
                                                <span className="font-display text-5xl font-bold uppercase text-white group-hover:translate-x-4 transition-transform duration-300">
                                                    {item.name}
                                                </span>
                                            </div>
                                            <ArrowRight className="w-6 h-6 text-[#333] group-hover:text-[#CCFF00] transition-colors" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            
                            {/* CTA Area */}
                            <div className="mt-12">
                                <Link href="/login" onClick={() => setIsOpen(false)}>
                                    <button className="w-full bg-[#CCFF00] text-black font-display font-bold uppercase text-2xl py-6 hover:bg-white transition-colors flex items-center justify-center gap-4 group border border-[#CCFF00]">
                                        <Target className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                                        <span>Initialize App</span>
                                    </button>
                                </Link>
                            </div>

                            {/* Footer Status */}
                            <div className="mt-auto pb-12 pt-8 flex justify-between items-end border-t border-[#333]">
                                <div className="font-mono text-[10px] text-[#666]">
                                    SECURE CONNECTION <br/>
                                    <span className="text-[#CCFF00] animate-pulse">● LIVE</span>
                                </div>
                                <div className="font-mono text-[10px] text-[#666] text-right">
                                    UNREALSHOT AI <br/>
                                    BUILD v2.5
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </nav>
    );
};
