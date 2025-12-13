import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export interface OutlineItem {
    id: string;
    text: string;
    tag: string;
}

interface SidebarProps {
    outline?: OutlineItem[];
    wordCount?: number;
    readingTime?: number;
    mobileOpen?: boolean;
    onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ outline = [], wordCount = 0, readingTime = 0, mobileOpen = false, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const isActive = (path: string) => location.pathname === path;

    const handleOutlineClick = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        if (onClose) onClose(); // Close sidebar on selection (mobile)
    };

    const handleNav = (path: string) => {
        navigate(path);
        if (onClose) onClose();
    }

    return (
        <>
            {/* Mobile Backdrop */}
            {mobileOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={onClose}
                ></div>
            )}

            <aside className={`
                fixed md:relative inset-y-0 left-0 z-50
                w-72 bg-surface border-r border-border flex flex-col shrink-0 transition-transform duration-300 ease-in-out
                ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
            `}>
                {/* Header: Left aligned (px-6) instead of centered */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-border shrink-0 group relative overflow-hidden cursor-pointer" onClick={() => handleNav('/')}>
                     {/* Shine Effect Overlay */}
                     <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-zinc-400/20 dark:via-white/20 to-transparent z-10 pointer-events-none"></div>

                    <div className="flex items-center gap-3 relative z-20">
                        {/* Minimalist Logo */}
                        <div className="size-8 flex items-center justify-center shrink-0">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
                                <defs>
                                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" className="stop-zinc-800 dark:stop-white" style={{stopColor: 'currentColor'}} />
                                        <stop offset="50%" className="stop-zinc-500 dark:stop-zinc-400" style={{stopColor: 'currentColor'}} />
                                        <stop offset="100%" className="stop-zinc-800 dark:stop-zinc-200" style={{stopColor: 'currentColor'}} />
                                    </linearGradient>
                                </defs>
                                <path 
                                    d="M6 8C6 5.79086 7.79086 4 10 4H14C16.2091 4 18 5.79086 18 8V16C18 18.2091 16.2091 20 14 20H10C7.79086 20 6 18.2091 6 16V8Z" 
                                    stroke="url(#logoGradient)" 
                                    strokeWidth="2.5" 
                                    strokeLinecap="round"
                                    className="text-zinc-800 dark:text-white"
                                />
                                <circle cx="12" cy="12" r="2" fill="url(#logoGradient)" className="text-zinc-800 dark:text-white" />
                            </svg>
                        </div>

                        {/* App Name */}
                        <span className="font-black italic text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 via-zinc-500 to-zinc-800 dark:from-white dark:via-zinc-400 dark:to-zinc-200 pr-4 leading-none pt-0.5">
                            DocuMind
                        </span>
                    </div>
                    {/* Mobile Close Button */}
                    <button onClick={onClose} className="md:hidden text-zinc-500">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-8">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 px-2">Operations</h3>
                        <button 
                            onClick={() => handleNav('/')}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left group ${isActive('/') ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}
                        >
                            <span className={`material-symbols-outlined text-[20px] ${isActive('/') ? 'text-zinc-900 dark:text-white' : 'group-hover:text-zinc-900 dark:group-hover:text-white'}`}>edit_note</span>
                            <span className="text-sm font-medium">Editor</span>
                        </button>
                        <button 
                            onClick={() => handleNav('/templates')}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left group ${isActive('/templates') ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}
                        >
                            <span className={`material-symbols-outlined text-[20px] ${isActive('/templates') ? 'text-zinc-900 dark:text-white' : 'group-hover:text-zinc-900 dark:group-hover:text-white'}`}>dashboard</span>
                            <span className="text-sm font-medium">Templates</span>
                        </button>
                        <button 
                            onClick={() => handleNav('/settings')}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left group ${isActive('/settings') ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}
                        >
                            <span className={`material-symbols-outlined text-[20px] ${isActive('/settings') ? 'text-zinc-900 dark:text-white' : 'group-hover:text-zinc-900 dark:group-hover:text-white'}`}>settings</span>
                            <span className="text-sm font-medium">Settings</span>
                        </button>
                    </div>
                    
                    {isActive('/') && (
                        <div className="flex flex-col gap-1">
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 px-2">Başlıklar</h3>
                            {outline.length > 0 ? (
                                <div className="flex flex-col relative border-l border-border ml-4 py-1">
                                    {outline.map((item) => (
                                        <a 
                                            key={item.id}
                                            href={`#${item.id}`}
                                            onClick={(e) => handleOutlineClick(e, item.id)}
                                            className={`pl-4 py-1.5 text-sm transition-colors block border-l-2 -ml-[1px] ${
                                                // Simple styling logic for hierarchy
                                                item.tag === 'h1' ? 'text-zinc-900 dark:text-white font-medium border-transparent hover:border-zinc-500' : 
                                                item.tag === 'h2' ? 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 border-transparent hover:border-zinc-500 pl-6' :
                                                'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 border-transparent hover:border-zinc-500 pl-8'
                                            }`}
                                        >
                                            <span className="truncate block">{item.text || "Untitled Section"}</span>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <div className="px-4 py-4 text-xs text-zinc-500 italic text-center border border-dashed border-border rounded-lg mx-2">
                                    No headings found.<br/>Use 'Başlık 1' or 'Başlık 2' to create an outline.
                                </div>
                            )}
                        </div>
                    )}

                    {isActive('/') && (
                        <div className="bg-zinc-100 dark:bg-zinc-900/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800/50 mt-auto mb-4 transition-all">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Word Count</span>
                                <span className="text-xs font-bold text-zinc-900 dark:text-white">{wordCount.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-zinc-300 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                {/* Visual progress bar just for aesthetics based on a goal of ~2000 words */}
                                <div 
                                    className="bg-zinc-600 dark:bg-zinc-600 h-full transition-all duration-500" 
                                    style={{ width: `${Math.min((wordCount / 2000) * 100, 100)}%` }}
                                ></div>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Reading Time</span>
                                <span className="text-xs font-bold text-zinc-900 dark:text-white">{readingTime} min</span>
                            </div>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;