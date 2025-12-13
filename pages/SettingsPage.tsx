import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useTheme } from '../context/ThemeContext';

const SettingsPage: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex w-full h-full bg-background transition-colors duration-300 relative">
            <Sidebar mobileOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background relative transition-colors duration-300 z-10">
                <div className="bg-background z-10 shrink-0 border-b border-border transition-colors duration-300">
                    <div className="max-w-[1000px] mx-auto w-full px-4 lg:px-12 pt-6 lg:pt-8 pb-6 lg:pb-8">
                         {/* Mobile Sidebar Toggle in Header */}
                         <div className="md:hidden mb-4">
                            <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-zinc-500">
                                <span className="material-symbols-outlined">menu</span>
                            </button>
                        </div>
                        <div className="flex flex-col gap-2">
                            <h1 className="text-zinc-900 dark:text-white text-2xl lg:text-4xl font-black leading-tight tracking-[-0.033em]">Settings</h1>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm lg:text-base font-normal">Manage your workspace appearance and general preferences.</p>
                        </div>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 lg:p-12">
                    <div className="max-w-[960px] mx-auto flex flex-col gap-10 pb-20">
                        <section>
                            <h2 className="text-zinc-900 dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-zinc-900 dark:text-white">tune</span> General Settings
                            </h2>
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-border bg-surface hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors shadow-sm">
                                    <div className="flex flex-col">
                                        <p className="text-zinc-900 dark:text-white text-sm font-medium">Interface Theme</p>
                                        <p className="text-zinc-500 text-sm">Choose your preferred visual appearance.</p>
                                    </div>
                                    <div className="flex bg-zinc-100 dark:bg-black border border-border rounded-lg p-1 self-start sm:self-auto">
                                        <button 
                                            onClick={() => toggleTheme('light')}
                                            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${theme === 'light' ? 'bg-white text-black shadow-md ring-1 ring-zinc-200' : 'text-zinc-500 hover:text-black dark:hover:text-white'}`}
                                        >
                                            Light
                                        </button>
                                        <button 
                                            onClick={() => toggleTheme('dark')}
                                            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${theme === 'dark' ? 'bg-zinc-800 text-white shadow-md ring-1 ring-zinc-700' : 'text-zinc-500 hover:text-black dark:hover:text-white'}`}
                                        >
                                            Dark
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SettingsPage;