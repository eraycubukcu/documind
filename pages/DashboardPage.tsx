import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="flex w-full h-full">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 bg-background relative z-10 overflow-hidden">
                <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-surface/50 backdrop-blur-md shrink-0 z-30">
                    <div className="flex-1 max-w-2xl relative group">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors">search</span>
                        <input className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 transition-all focus:bg-zinc-900/80" placeholder="Search documents..."/>
                    </div>
                    <button onClick={() => navigate('/')} className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-zinc-200 transition-colors flex items-center gap-2 shadow-lg shadow-white/5">
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        Create New
                    </button>
                </header>
                <main className="flex-1 overflow-y-auto p-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto space-y-12">
                        <section>
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-lg font-bold text-white tracking-tight">Start a new document</h2>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                <div onClick={() => navigate('/')} className="group cursor-pointer">
                                    <div className="aspect-[3/4] bg-white rounded-xl border border-zinc-800 flex items-center justify-center relative overflow-hidden hover:border-zinc-500 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                                        <span className="material-symbols-outlined text-4xl text-zinc-400 group-hover:text-black group-hover:scale-110 transition-all duration-300 z-10">add</span>
                                    </div>
                                    <h3 className="mt-3 text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">Blank Document</h3>
                                </div>
                            </div>
                        </section>
                        <section className="flex flex-col gap-5">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-white tracking-tight">Recent Documents</h2>
                            </div>
                            <div className="border border-zinc-800 rounded-xl overflow-hidden bg-surface/30">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-surface border-b border-zinc-800 text-zinc-500 font-bold text-[11px] uppercase tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4 font-bold cursor-pointer hover:text-white group flex items-center gap-1">Name</th>
                                            <th className="px-6 py-4 font-bold">Owner</th>
                                            <th className="px-6 py-4 font-bold">Last Modified</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-800/50">
                                        <tr onClick={() => navigate('/')} className="group hover:bg-zinc-800/50 transition-colors cursor-pointer">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2.5 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/10 group-hover:border-blue-500/20 transition-colors">
                                                        <span className="material-symbols-outlined text-[20px]">article</span>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white group-hover:text-blue-400 transition-colors text-[15px]">The Future of Enterprise AI</div>
                                                        <div className="text-xs text-zinc-500 mt-0.5">Project Strategy • 2.4MB</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4"><span className="text-zinc-300 text-xs font-medium">Alex Morgan (You)</span></td>
                                            <td className="px-6 py-4 text-zinc-400 text-xs font-medium">Just now</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardPage;