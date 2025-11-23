import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function MainLayout({ children }) {
    const location = useLocation();

    const navItems = [
        { path: '/dashboard', label: 'Home', icon: '🏠' },
        { path: '/pos', label: 'POS', icon: '🛒' },
        { path: '/production', label: 'Make', icon: '🥣' },
        { path: '/stock', label: 'Stock', icon: '📦' },
        { path: '/sales-history', label: 'History', icon: '📊' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-[#0B1120] text-white font-sans selection:bg-pink-500 selection:text-white pb-24 pt-20 md:pt-24">
            
            {/* --- TOP NAVBAR (Desktop & Mobile Header) --- */}
            <div className="fixed top-0 left-0 w-full bg-[#0F172A]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center z-50">
                <div className="flex items-center gap-2">
                     <div className="w-8 h-8 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white">I</div>
                     <h1 className="text-xl font-black tracking-widest text-white uppercase">
                        ICE<span className="text-pink-500">MGR</span>
                    </h1>
                </div>

                {/* Desktop Menu (Visible only on large screens) */}
                <div className="hidden md:flex gap-6">
                    {navItems.map(item => (
                        <Link key={item.path} to={item.path} className={`text-sm font-bold transition-colors ${isActive(item.path) ? 'text-pink-400' : 'text-gray-400 hover:text-white'}`}>
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">👤</div>
            </div>

            {/* --- MOBILE BOTTOM BAR --- */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#0F172A]/90 backdrop-blur-lg border-t border-white/5 px-6 py-4 flex justify-between items-center z-50">
                {navItems.map((item) => (
                    <Link key={item.path} to={item.path} className="flex flex-col items-center gap-1 relative">
                        {isActive(item.path) && <div className="absolute -top-10 w-10 h-10 bg-pink-500/20 rounded-full blur-xl"></div>}
                        <div className={`text-2xl transition-all ${isActive(item.path) ? '-translate-y-1 text-pink-500' : 'text-gray-500'}`}>{item.icon}</div>
                    </Link>
                ))}
            </div>

            <main className="w-full max-w-7xl mx-auto px-4">
                {children}
            </main>
        </div>
    );
}