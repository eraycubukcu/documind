import React from 'react';

interface ImageGenerationModalProps {
    onClose: () => void;
    imageData: string | null;
    onInsert: () => void;
}

const ImageGenerationModal: React.FC<ImageGenerationModalProps> = ({ onClose, imageData, onInsert }) => {
    
    const handleDownload = () => {
        if (!imageData) return;
        const link = document.createElement('a');
        link.href = `data:image/png;base64,${imageData}`;
        link.download = `generated-image-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose}></div>
            <div className="relative bg-surface w-full max-w-2xl rounded-2xl border border-border shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/10">
                <div className="h-16 px-6 border-b border-border flex items-center justify-between shrink-0 bg-zinc-900">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-white">image</span>
                        <h2 className="font-bold text-white text-base">Generated Image</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <div className="p-8 flex items-center justify-center bg-[#0c0c0e]">
                    {imageData ? (
                        <img 
                            src={`data:image/png;base64,${imageData}`} 
                            alt="AI Generated" 
                            className="max-h-[500px] w-auto rounded-xl shadow-2xl border border-zinc-800"
                        />
                    ) : (
                         <div className="flex flex-col items-center justify-center h-64 gap-4 text-zinc-500">
                            <span className="material-symbols-outlined text-4xl animate-spin">progress_activity</span>
                            <span>Generating Image...</span>
                         </div>
                    )}
                </div>

                <div className="p-6 border-t border-border bg-surface flex items-center justify-end gap-3">
                    <button 
                        onClick={handleDownload}
                        className="px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 font-medium hover:bg-zinc-800 hover:text-white transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[20px]">download</span>
                        Download
                    </button>
                    <button 
                        onClick={onInsert}
                        className="px-6 py-2.5 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[20px]">add_photo_alternate</span>
                        Insert to Document
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageGenerationModal;