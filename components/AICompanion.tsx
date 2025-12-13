import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { GoogleGenAI } from "@google/genai";

// Interface for Web Speech API
interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

interface AICompanionProps {
    documentContext: string;
    onInsertText: (text: string) => void;
    onRejectText: () => void;
    onInsertImage?: (imageSrc: string) => void;
    mobileOpen?: boolean;
    onClose?: () => void;
}

export interface AICompanionRef {
    ask: (prompt: string, hiddenContext?: string) => void;
}

interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
    status: 'pending' | 'approved' | 'rejected';
    image?: string; // For displaying user uploaded images in chat
}

interface SelectedImage {
    data: string; // base64 string without prefix
    mimeType: string;
    preview: string; // full data url for display
}

const AICompanion = forwardRef<AICompanionRef, AICompanionProps>(({ documentContext, onInsertText, onRejectText, onInsertImage, mobileOpen = false, onClose }, ref) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);
    
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const recognitionRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
        ask: (prompt: string, hiddenContext: string = "") => {
            handleSend(prompt, hiddenContext);
        }
    }));

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // File Upload Handler
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check if it is an image
            if (!file.type.startsWith('image/')) {
                alert("Please upload an image file.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                // Extract base64 data (remove "data:image/png;base64," prefix)
                const base64Data = result.split(',')[1];
                
                setSelectedImage({
                    data: base64Data,
                    mimeType: file.type,
                    preview: result
                });
            };
            reader.readAsDataURL(file);
        }
        // Reset input value to allow selecting the same file again if needed
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
    };

    // Voice Input Handler
    const toggleRecording = () => {
        const windowObj = window as unknown as IWindow;
        const SpeechRecognition = windowObj.SpeechRecognition || windowObj.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Your browser does not support speech recognition.");
            return;
        }

        if (isRecording) {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
                setIsRecording(false);
            }
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true; // Keep listening even if user pauses
        recognition.interimResults = true; // Show results as they are spoken
        recognition.lang = 'en-US'; 

        recognition.onstart = () => {
            setIsRecording(true);
        };

        recognition.onend = () => {
            setIsRecording(false);
        };

        // Important: SpeechRecognition needs careful state handling
        let finalTranscript = '';
        
        recognition.onresult = (event: any) => {
             let interimTranscript = '';
             let newFinal = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    newFinal += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            
            // Append final results to the input
            if (newFinal) {
                setInput(prev => (prev ? prev + ' ' : '') + newFinal);
            }
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsRecording(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
    };

    const handleSend = async (manualInput?: string, hiddenContext?: string) => {
        const textToSend = manualInput || input;
        const imageToSend = selectedImage; // Capture current image state

        if (!textToSend.trim() && !imageToSend) return;
        
        if (!manualInput) {
            setInput("");
            setSelectedImage(null);
        }
        
        // Add user message
        const userMessageId = Date.now().toString();
        setMessages(prev => [...prev, { 
            id: userMessageId, 
            role: 'user', 
            text: textToSend, 
            image: imageToSend?.preview,
            status: 'approved' 
        }]);
        
        setIsLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const contextToUse = hiddenContext 
                ? `Special Instruction: The user is asking to REWRITE a specific selection. Focus ONLY on the rewriting task for the provided selection.\nSelection Context: "${hiddenContext}"`
                : `Context: The user is editing a document. Here is the current content of the document:\n"""${documentContext.substring(0, 5000)}..."""`;

            const promptText = `
                ${contextToUse}
                
                User Request: ${textToSend}
                
                System: You are a helpful expert editor assistant. Be concise. If asked to rewrite or generate text, return ONLY the requested text without conversational filler.
            `;

            // Prepare contents (multimodal if image exists)
            let contents: any;
            if (imageToSend) {
                contents = {
                    parts: [
                        { text: promptText },
                        {
                            inlineData: {
                                mimeType: imageToSend.mimeType,
                                data: imageToSend.data
                            }
                        }
                    ]
                };
            } else {
                contents = promptText;
            }

            const response = await ai.models.generateContent({
                model: imageToSend ? 'gemini-2.5-flash-image' : 'gemini-3-pro-preview',
                contents: contents
            });

            const modelMessageId = (Date.now() + 1).toString();
            setMessages(prev => [...prev, { 
                id: modelMessageId, 
                role: 'model', 
                text: response.text || "I couldn't generate a response.", 
                status: 'pending' 
            }]);

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "Sorry, I encountered an error. Please try again.", status: 'rejected' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = (messageId: string, action: 'approved' | 'rejected') => {
        setMessages(prev => prev.map(msg => {
            if (msg.id === messageId) {
                if (action === 'approved') {
                    onInsertText(msg.text);
                } else if (action === 'rejected') {
                    onRejectText();
                }
                return { ...msg, status: action };
            }
            return msg;
        }));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Mobile Backdrop */}
            {mobileOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={onClose}
                ></div>
            )}
            
            <aside className={`
                fixed lg:relative inset-y-0 right-0 z-50
                w-full sm:w-96 bg-surface border-l border-border flex flex-col shrink-0 shadow-xl h-full transition-transform duration-300 ease-in-out
                ${mobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-border shrink-0 bg-surface">
                    <div className="flex items-center gap-2 text-zinc-900 dark:text-white">
                        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>smart_toy</span>
                        <h2 className="font-bold">AI Companion</h2>
                    </div>
                    {/* Close Button for Mobile */}
                    <button onClick={onClose} className="lg:hidden p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                    {messages.length === 0 && (
                        <div className="text-center text-zinc-500 text-sm mt-10">
                            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">smart_toy</span>
                            <p>Ask me to analyze, rewrite, or summarize your document.</p>
                        </div>
                    )}
                    
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} gap-1`}>
                            {msg.role === 'model' && (
                                <div className="flex items-center gap-2 mb-1 px-1">
                                    <span className="material-symbols-outlined text-[14px] text-zinc-900 dark:text-white">smart_toy</span>
                                    <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">AI Assistant</span>
                                </div>
                            )}
                            
                            {/* Display User Image if exists */}
                            {msg.role === 'user' && msg.image && (
                                <div className="flex flex-col items-end gap-1 mb-1">
                                    <img src={msg.image} alt="User Upload" className="max-w-[200px] rounded-lg border border-zinc-700" />
                                    {onInsertImage && (
                                        <button 
                                            onClick={() => onInsertImage(msg.image!)}
                                            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] px-2 py-1 rounded shadow transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[12px]">add_photo_alternate</span>
                                            Add to Document
                                        </button>
                                    )}
                                </div>
                            )}

                            <div className={`px-4 py-3 rounded-2xl text-sm w-fit max-w-[90%] leading-relaxed shadow-sm whitespace-pre-wrap ${
                                msg.role === 'user' 
                                    ? 'bg-zinc-800 text-white rounded-tr-sm border border-zinc-700' 
                                    : 'bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 rounded-tl-sm'
                            }`}>
                                {msg.text}
                            </div>
                            {msg.role === 'model' && msg.status === 'pending' && (
                                <div className="flex gap-2 mt-1 px-1">
                                    <button 
                                        onClick={() => handleAction(msg.id, 'approved')}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400 text-xs font-bold rounded-lg border border-green-500/20 transition-all"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">check</span>
                                        Onayla
                                    </button>
                                    <button 
                                        onClick={() => handleAction(msg.id, 'rejected')}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-lg border border-red-500/20 transition-all"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">close</span>
                                        Reddet
                                    </button>
                                </div>
                            )}
                            {msg.role === 'model' && msg.status === 'approved' && (
                                <span className="text-[10px] text-green-500 font-bold px-2 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[12px]">check_circle</span>
                                    Inserted to document
                                </span>
                            )}
                            {msg.role === 'model' && msg.status === 'rejected' && (
                                <span className="text-[10px] text-zinc-500 px-2">Rejected</span>
                            )}
                        </div>
                    ))}
                    
                    {isLoading && (
                         <div className="flex flex-col items-start gap-1">
                            <div className="flex items-center gap-2 mb-1 px-1">
                                <span className="material-symbols-outlined text-[14px] text-zinc-900 dark:text-white">smart_toy</span>
                                <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">Thinking...</span>
                            </div>
                            <div className="bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-2xl rounded-tl-sm w-16 h-10 flex items-center justify-center">
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce delay-75"></div>
                                    <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce delay-150"></div>
                                </div>
                            </div>
                         </div>
                    )}
                </div>
                
                <div className="p-4 border-t border-border bg-surface shrink-0">
                    {/* Image Preview Area */}
                    {selectedImage && (
                        <div className="mb-3 relative inline-block">
                            <img 
                                src={selectedImage.preview} 
                                alt="Preview" 
                                className="h-20 w-auto rounded-lg border border-zinc-700 shadow-lg" 
                            />
                            <button 
                                onClick={handleRemoveImage}
                                className="absolute -top-2 -right-2 bg-zinc-800 text-white rounded-full p-0.5 border border-zinc-600 hover:bg-red-500 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[16px]">close</span>
                            </button>
                        </div>
                    )}

                    <div className="relative bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 focus-within:ring-1 focus-within:ring-zinc-400 dark:focus-within:ring-zinc-600 transition-all shadow-inner">
                        <textarea 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full bg-transparent border-none text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-600 text-sm resize-none focus:ring-0 px-4 py-3 min-h-[50px] max-h-32" 
                            placeholder={isRecording ? "Listening..." : "Ask Gemini AI..."}
                            rows={1}
                            disabled={isLoading}
                        ></textarea>
                        
                        {/* Hidden File Input */}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileSelect} 
                            className="hidden" 
                            accept="image/*"
                        />

                        <div className="flex items-center justify-between px-2 pb-2">
                            <div className="flex items-center gap-1">
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-1.5 text-zinc-500 hover:text-black dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors" 
                                    title="Upload Image"
                                >
                                    <span className="material-symbols-outlined text-[18px]">add_circle</span>
                                </button>
                                <button 
                                    onClick={toggleRecording}
                                    className={`p-1.5 rounded-lg transition-colors ${isRecording ? 'text-red-500 bg-red-500/10 animate-pulse' : 'text-zinc-500 hover:text-black dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800'}`}
                                    title="Voice Input"
                                >
                                    <span className="material-symbols-outlined text-[18px]">mic</span>
                                </button>
                            </div>
                            <button 
                                onClick={() => handleSend()}
                                disabled={isLoading || (!input.trim() && !selectedImage)}
                                className={`p-1.5 rounded-lg transition-colors shadow-sm ${input.trim() || selectedImage ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed'}`}
                            >
                                <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                            </button>
                        </div>
                    </div>
                    <p className="text-[10px] text-center text-zinc-500 mt-3">AI generated content may be inaccurate.</p>
                </div>
            </aside>
        </>
    );
});

export default AICompanion;