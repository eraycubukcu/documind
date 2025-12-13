import React from 'react';

interface TemplateLibraryModalProps {
    onClose: () => void;
}

const TemplateLibraryModal: React.FC<TemplateLibraryModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-surface w-full max-w-6xl h-[85vh] rounded-2xl border border-border shadow-2xl flex overflow-hidden ring-1 ring-white/10">
                <div className="w-64 border-r border-border bg-zinc-900/50 flex flex-col p-6 gap-6">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-white text-lg">Library</h2>
                        <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-700">142</span>
                    </div>
                        <div className="space-y-1">
                        <button className="w-full flex items-center justify-between px-3 py-2 bg-zinc-800 text-white rounded-lg text-sm font-medium border border-zinc-700 shadow-sm">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-[18px]">grid_view</span>
                                All Templates
                            </div>
                        </button>
                    </div>
                </div>
                <div className="flex-1 flex flex-col bg-[#0c0c0e]">
                    <div className="h-16 border-b border-border flex items-center justify-between px-8 bg-surface/50 backdrop-blur-md">
                            <div className="flex items-center gap-4 ml-auto">
                            <button onClick={onClose} className="size-8 rounded-lg hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                    </div>
                        <div className="flex-1 overflow-y-auto p-8">
                        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-yellow-500">auto_awesome</span>
                            Recommended for You
                        </h3>
                        <div className="grid grid-cols-3 lg:grid-cols-4 gap-6">
                            <div className="group relative aspect-[3/4] rounded-xl border border-dashed border-zinc-700 hover:border-zinc-500 bg-zinc-900/20 hover:bg-zinc-900/40 transition-all cursor-pointer flex flex-col items-center justify-center gap-4" onClick={onClose}>
                                <div className="size-14 rounded-full bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg border border-zinc-700">
                                    <span className="material-symbols-outlined text-3xl text-white">add</span>
                                </div>
                                <span className="font-medium text-white text-sm">Blank Document</span>
                            </div>
                            {/* Example placeholder templates */}
                            <div className="group relative aspect-[3/4] rounded-xl border border-zinc-800 hover:border-zinc-500 bg-zinc-900 transition-all cursor-pointer flex flex-col overflow-hidden" onClick={onClose}>
                                 <div className="h-1/2 bg-zinc-800/50 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-4xl text-zinc-600">article</span>
                                 </div>
                                 <div className="p-4">
                                     <h4 className="font-bold text-white text-sm">Quarterly Review</h4>
                                     <p className="text-xs text-zinc-500 mt-2">Standard business reporting format.</p>
                                 </div>
                            </div>
                        </div>
                        </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateLibraryModal;