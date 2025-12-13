import React from 'react';

interface ShareModalProps {
    onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-[580px] bg-[#141415] border border-zinc-800 rounded-2xl shadow-2xl flex flex-col relative overflow-hidden">
                <div className="px-6 py-5 border-b border-zinc-800/50 flex items-center justify-between bg-zinc-900/30">
                    <h2 className="text-lg font-bold text-white tracking-tight">Share "The Future of Enterprise AI"</h2>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors p-1 hover:bg-zinc-800 rounded-full">
                        <span className="material-symbols-outlined text-[22px]">close</span>
                    </button>
                </div>
                <div className="p-6 flex flex-col gap-8">
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2 relative">
                            <div className="flex-1 relative group">
                                <input className="w-full bg-[#1c1c1f] border border-zinc-700 text-white rounded-lg pl-4 pr-12 py-3 focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500 placeholder-zinc-500 text-sm outline-none transition-all" placeholder="Add people, groups, or emails" type="text"/>
                            </div>
                            <div className="relative">
                                <button className="h-full px-3 pl-4 bg-[#1c1c1f] border border-zinc-700 rounded-lg text-zinc-300 text-sm font-medium hover:bg-zinc-800 hover:text-white transition-colors flex items-center gap-2 group min-w-[110px] justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">edit_note</span>
                                        <span>Editor</span>
                                    </div>
                                    <span className="material-symbols-outlined text-[18px] text-zinc-500 group-hover:text-zinc-300">arrow_drop_down</span>
                                </button>
                            </div>
                            <button className="px-5 bg-white text-black font-bold text-sm rounded-lg hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5">
                                Send
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest pl-1">People with access</h3>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-800/30 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-cover bg-center ring-1 ring-zinc-800" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCcTFV5s_NVAkYXTM8wFpuWBA5yM5Vi_NNCphKADTHgRacVPnf1JIOlUvyCu1MwAoJDjEnkowJZrtorvf-Thntflrkg2xK5uaTkIj4WzdkNi8-1xvSRxtR5QbfiKIDs4bMlO-H_-y9Nt_id45GIhKpCJUngknaB_dwC1pWyVlrFx8jmsV4EzG7ovIDs2zbEBtA3O2ogbdIK2O0ThzeLAHmwwfXYGjuwoLmlselWSL12NF7lCIdFqdzbNXq4iWpeDGICErn8kX9l9SI')"}}></div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-zinc-200">Alex Morgan (You)</span>
                                        <span className="text-xs text-zinc-500">alex@workspace.ai</span>
                                    </div>
                                </div>
                                <span className="text-xs text-zinc-500 font-medium px-3">Owner</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-5 border-t border-zinc-800/50 flex items-center justify-between bg-zinc-900/30">
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 hover:border-zinc-600 transition-all text-sm font-semibold group">
                        <span className="material-symbols-outlined text-[18px] group-hover:rotate-45 transition-transform">link</span>
                        Copy link
                    </button>
                    <button onClick={onClose} className="px-8 py-2.5 bg-white text-black font-bold text-sm rounded-xl hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5">
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;