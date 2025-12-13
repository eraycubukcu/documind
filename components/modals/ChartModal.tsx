import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface ChartModalProps {
    onClose: () => void;
    contextText: string;
}

interface ChartData {
    title: string;
    labels: string[];
    datasets: {
        label: string;
        data: number[];
    }[];
}

const ChartModal: React.FC<ChartModalProps> = ({ onClose, contextText }) => {
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [prompt, setPrompt] = useState("");

    // Initialize prompt based on context
    useEffect(() => {
        if (contextText) {
            setPrompt(`Visualize data based on this text: "${contextText.substring(0, 300)}..."`);
        } else {
            setPrompt("Visualize Q1-Q4 2024 revenue growth.");
        }
    }, [contextText]);

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Extract numerical data from the text or generate reasonable placeholder data based on the request to create a bar chart. Request: "${prompt}". Return JSON matching this schema: { title: string, labels: string[], datasets: [{ label: string, data: number[] }] }`,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            labels: { type: Type.ARRAY, items: { type: Type.STRING } },
                            datasets: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        label: { type: Type.STRING },
                                        data: { type: Type.ARRAY, items: { type: Type.NUMBER } }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            if (response.text) {
                const data = JSON.parse(response.text);
                setChartData(data);
            }

        } catch (error) {
            console.error("Chart gen failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        if (!chartData) return;
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(chartData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "chart_data.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    // Auto-generate on open if context exists
    useEffect(() => {
        if (contextText && !chartData && !isLoading) {
            handleGenerate();
        }
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="relative w-full max-w-5xl bg-surface border border-border rounded-2xl shadow-2xl flex flex-col h-[700px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="h-16 px-6 border-b border-border flex items-center justify-between shrink-0 bg-surface/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-800 rounded-lg border border-zinc-700">
                            <span className="material-symbols-outlined text-white text-[20px]">bar_chart</span>
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white">Generate Chart</h2>
                            <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wide">Powered by Gemini 2.5 Flash</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>
                {/* Chart Modal Content */}
                <div className="flex-1 flex overflow-hidden">
                    <div className="w-80 bg-[#121214] border-r border-border p-5 flex flex-col gap-6 overflow-y-auto shrink-0">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Source Context</label>
                            <div className="p-3 bg-zinc-900/50 border border-zinc-800/50 rounded-xl text-xs text-zinc-400 italic leading-relaxed line-clamp-4">
                                {contextText || "No specific text selected. Using prompt."}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Refine Prompt</label>
                                <span className="text-[10px] text-zinc-600">AI Auto-filled</span>
                            </div>
                            <textarea 
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="w-full h-32 bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-200 placeholder-zinc-600 focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 resize-none leading-relaxed transition-all" 
                            ></textarea>
                        </div>
                        <div className="mt-auto pt-4 border-t border-zinc-800">
                            <button 
                                onClick={handleGenerate}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors border border-zinc-700 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                                ) : (
                                    <span className="material-symbols-outlined text-[18px]">refresh</span>
                                )}
                                {isLoading ? "Generating..." : "Regenerate"}
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 bg-[#09090b] flex items-center justify-center p-12 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 to-black relative">
                        {isLoading && (
                             <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 backdrop-blur-sm">
                                <div className="flex flex-col items-center">
                                    <span className="material-symbols-outlined animate-spin text-4xl text-primary mb-2">donut_large</span>
                                    <span className="text-zinc-400 text-sm">Analyzing data...</span>
                                </div>
                             </div>
                        )}
                        
                        {chartData ? (
                            <div className="w-full h-full flex flex-col">
                                <h3 className="text-xl font-bold text-white text-center mb-8">{chartData.title}</h3>
                                <div className="flex-1 flex items-end justify-center gap-8 px-12 pb-12 border-l border-b border-zinc-800">
                                    {chartData.labels.map((label, idx) => {
                                        // Simple logical scaling for display
                                        const values = chartData.datasets[0].data;
                                        const max = Math.max(...values);
                                        const val = values[idx];
                                        const height = (val / max) * 100;
                                        
                                        return (
                                            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                                                <div className="text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">{val}</div>
                                                <div 
                                                    className="w-full bg-primary/80 hover:bg-primary rounded-t-lg transition-all duration-500 ease-out relative"
                                                    style={{ height: `${height}%` }}
                                                >
                                                </div>
                                                <div className="text-xs text-zinc-500 mt-2 font-medium">{label}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center">
                                <span className="material-symbols-outlined text-6xl text-zinc-700">bar_chart</span>
                                <p className="text-zinc-500 mt-4">Chart Preview Will Appear Here</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="h-20 bg-surface border-t border-border px-8 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                        {chartData && <span>Generated via Gemini</span>}
                    </div>
                    <div className="flex items-center gap-3">
                            <button 
                                onClick={handleDownload}
                                className="px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 font-medium hover:bg-zinc-800 hover:text-white transition-colors flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[20px]">download</span>
                                Download JSON
                            </button>
                            <button onClick={onClose} className="bg-white text-black px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] flex items-center gap-2 transform hover:-translate-y-0.5">
                            <span className="material-symbols-outlined text-[18px]">add_circle</span>
                            Insert into Document
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChartModal;