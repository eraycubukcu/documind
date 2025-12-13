import React from 'react';

interface CommentsPanelProps {
    onClose: () => void;
}

const CommentsPanel: React.FC<CommentsPanelProps> = ({ onClose }) => {
    return (
        <aside className="w-96 bg-surface border-l border-border flex flex-col shrink-0 z-20 shadow-xl h-full animate-in slide-in-from-right-10 duration-200">
            <div className="h-16 flex items-center justify-between px-6 border-b border-border shrink-0">
                <div className="flex items-center gap-3 text-white">
                    <span className="material-symbols-outlined text-white">forum</span>
                    <h2 className="font-bold text-base">Comments</h2>
                    <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] text-zinc-400 font-bold border border-zinc-700">4</span>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={onClose} className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors" title="Close Panel">
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                {/* Comment Item */}
                <div className="flex flex-col gap-2 group">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Now Viewing</span>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 flex flex-col gap-4 shadow-lg ring-1 ring-zinc-800/50">
                            <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                                <div className="size-8 rounded-full bg-cover bg-center ring-1 ring-zinc-600" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDQu_sbPNBF1ekP_4Dygy_u5TZDlfu4d96aE_pic1PFv9tF-4QVoBkPbafaUrjpOoOJOWQvc6qDabUrNHRWVTMf2cRiLEP58-4qJjqLQU0Zu4faauQNVJSo6cbA05_S47P2nsmSx3L-L9g7GJOuF8pVw_YlheuIgM5vRXlNsSyj25hmmAmGdyMhW_j5vbSYei2bD3Rv1A5cpMRpB2jd-9F5JtaFUGPM_mI9ZK8tEsEDuX1zTzYdz-uERK5qJbsk75QUJKrvjxuopzM')"}}></div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-white leading-none">Sarah J.</span>
                                    <span className="text-[10px] text-zinc-500 mt-1">10:42 AM</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-sm text-zinc-300 leading-relaxed">
                            Should we include the Q3 metrics here? The client specifically asked for them.
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4 border-t border-border bg-surface shrink-0 z-30">
                <button className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-dashed border-zinc-700 text-zinc-500 hover:text-white hover:border-zinc-500 hover:bg-zinc-800/50 transition-all group">
                    <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">add_comment</span>
                    <span className="text-sm font-medium">Add general comment</span>
                </button>
            </div>
        </aside>
    );
};

export default CommentsPanel;