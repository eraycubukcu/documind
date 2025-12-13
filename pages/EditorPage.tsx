import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar, { OutlineItem } from '../components/Sidebar';
import EditorHeader from '../components/EditorHeader';
import AICompanion, { AICompanionRef } from '../components/AICompanion';
import ShareModal from '../components/modals/ShareModal';
import ChartModal from '../components/modals/ChartModal';
import ImageGenerationModal from '../components/modals/ImageGenerationModal';
import TemplateLibraryModal from '../components/modals/TemplateLibraryModal';
import { GoogleGenAI } from "@google/genai";

const EditorPage: React.FC = () => {
    const location = useLocation();
    const [showShareModal, setShowShareModal] = useState(false);
    const [showChartModal, setShowChartModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
    const [generatedImageData, setGeneratedImageData] = useState<string | null>(null);
    const [outline, setOutline] = useState<OutlineItem[]>([]);
    
    // Mobile & Layout State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAiOpen, setIsAiOpen] = useState(false);

    // Stats State
    const [wordCount, setWordCount] = useState(0);
    const [readingTime, setReadingTime] = useState(0);
    
    // Editor State
    const editorRef = useRef<HTMLDivElement>(null);
    const aiCompanionRef = useRef<AICompanionRef>(null);
    const [selectionRange, setSelectionRange] = useState<Range | null>(null);
    const [toolbarPosition, setToolbarPosition] = useState<{top: number, left: number} | null>(null);
    const [selectedText, setSelectedText] = useState("");
    const [isAiProcessing, setIsAiProcessing] = useState(false);
    
    // Track valid cursor position for inserting text from sidebar
    const lastCursorPosition = useRef<Range | null>(null);
    const pendingRewriteWrapperId = "pending-rewrite-highlight";

    // Update outline and stats based on content
    const updateDocumentState = () => {
        if (!editorRef.current) return;
        
        // 1. Update Outline
        const headers = editorRef.current.querySelectorAll('h1, h2, h3');
        const newOutline = Array.from(headers).map((header, index) => {
            if (!header.id) header.id = `section-${index}-${Date.now()}`;
            return {
                id: header.id,
                text: (header as HTMLElement).innerText || "Untitled Section",
                tag: header.tagName.toLowerCase()
            };
        });
        
        setOutline(prev => {
            if (prev.length !== newOutline.length) return newOutline;
            const isDifferent = prev.some((item, i) => item.text !== newOutline[i].text || item.tag !== newOutline[i].tag);
            return isDifferent ? newOutline : prev;
        });

        // 2. Update Stats (Word Count & Reading Time)
        const text = editorRef.current.innerText || "";
        const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
        const time = Math.ceil(words / 200); // Assuming 200 words per minute
        
        setWordCount(words);
        setReadingTime(time || 1); // Minimum 1 min reading time if there is text
    };

    // Document Formatting Handler
    const handleFormat = (command: string, value?: string) => {
        if (!editorRef.current) return;
        
        // Restore focus to editor before executing command
        editorRef.current.focus();
        
        if (command === 'increaseFontSize' || command === 'decreaseFontSize') {
            // Get current font size
            const sizeVal = document.queryCommandValue('fontSize');
            let currentSize = 3; // Default standard size (approx 16px)

            if (sizeVal) {
                // If browser returns 1-7
                if (/^[1-7]$/.test(sizeVal)) {
                    currentSize = parseInt(sizeVal);
                } 
                // If browser returns pixels (e.g. "16px")
                else if (sizeVal.includes('px')) {
                    const px = parseInt(sizeVal);
                    // Map approx pixels to 1-7 scale
                    if (px <= 10) currentSize = 1;
                    else if (px <= 13) currentSize = 2;
                    else if (px <= 16) currentSize = 3;
                    else if (px <= 18) currentSize = 4;
                    else if (px <= 24) currentSize = 5;
                    else if (px <= 32) currentSize = 6;
                    else currentSize = 7;
                }
            }

            if (command === 'increaseFontSize') {
                currentSize = Math.min(currentSize + 1, 7);
            } else {
                currentSize = Math.max(currentSize - 1, 1);
            }

            document.execCommand('fontSize', false, currentSize.toString());
        } else {
            // Execute standard command
            document.execCommand(command, false, value);
        }
        
        // Update selection state after command
        updateSelectionState();
        // Update document state immediately after formatting
        setTimeout(updateDocumentState, 0); 
    };

    const handleDownload = () => {
        if (!editorRef.current) return;
        
        // Wrap content in a basic HTML structure for the converter
        const content = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="utf-8">
                <title>Document</title>
                <style>
                    body { font-family: 'Segoe UI', sans-serif; }
                </style>
            </head>
            <body>
                ${editorRef.current.innerHTML}
            </body>
            </html>
        `;

        // Check if htmlDocx is available from the global script
        const htmlDocx = (window as any).htmlDocx;

        if (htmlDocx) {
            // Convert to DOCX Blob using html-docx-js
            const blob = htmlDocx.asBlob(content, {
                orientation: 'portrait',
                margins: { top: 720, right: 720, bottom: 720, left: 720 }
            });
            
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `document-${new Date().toISOString().slice(0,10)}.docx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } else {
            console.warn("html-docx-js library not loaded. Falling back to HTML download.");
            // Fallback to HTML
            const blob = new Blob([content], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `document-${new Date().toISOString().slice(0,10)}.html`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    };

    const updateSelectionState = () => {
         const selection = window.getSelection();
         if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            
            // Track valid cursor position whenever it's inside editor
            if (editorRef.current?.contains(range.commonAncestorContainer)) {
                 lastCursorPosition.current = range.cloneRange();
            }

            // Toolbar logic (only for text selection)
            if (!selection.isCollapsed && editorRef.current?.contains(range.commonAncestorContainer)) {
                const rect = range.getBoundingClientRect();
                setToolbarPosition({
                    top: rect.top - 60,
                    left: rect.left + (rect.width / 2)
                });
                setSelectionRange(range);
                setSelectedText(selection.toString());
            } else {
                setToolbarPosition(null);
                setSelectionRange(null);
                setSelectedText("");
            }
         }
    };

    useEffect(() => {
        // Initialize
        if (editorRef.current) {
            editorRef.current.focus();

            // Check for template content passed via navigation
            const state = location.state as { initialContent?: string };
            if (state?.initialContent) {
                editorRef.current.innerHTML = state.initialContent;
                // Clear the state so refreshing doesn't re-apply if we were to handle navigation history more strictly, 
                // but for now, this ensures the template loads.
                window.history.replaceState({}, document.title);
            }
            
            updateDocumentState();

            // Use MutationObserver to detect DOM changes (headings added/removed)
            const observer = new MutationObserver((mutations) => {
                 updateDocumentState();
            });
            
            observer.observe(editorRef.current, {
                childList: true,
                subtree: true,
                characterData: true,
                attributes: true
            });

            return () => observer.disconnect();
        }
    }, [location.state]); // Re-run if location state changes (though mostly happens on mount)
    
    useEffect(() => {
        document.addEventListener('selectionchange', updateSelectionState);
        return () => document.removeEventListener('selectionchange', updateSelectionState);
    }, []);

    // Handle text insertion from AI Companion (Approve Action)
    const handleAiTextInsertion = (text: string) => {
        if (!editorRef.current) return;
        editorRef.current.focus();

        // Check if there is a pending rewrite highlight
        const pendingSpan = document.getElementById(pendingRewriteWrapperId);
        
        if (pendingSpan) {
            // Rewrite Mode: Replace the highlighted text
            pendingSpan.outerHTML = text; // Replace highlight with new text
        } else {
            // General Chat Mode: Insert at cursor
            const sel = window.getSelection();
            if (lastCursorPosition.current) {
                sel?.removeAllRanges();
                sel?.addRange(lastCursorPosition.current);
            } else {
                const range = document.createRange();
                range.selectNodeContents(editorRef.current);
                range.collapse(false);
                sel?.removeAllRanges();
                sel?.addRange(range);
            }
            document.execCommand('insertText', false, text);
        }
        
        // Cleanup and State Update
        updateSelectionState();
        // Allow DOM to update before checking outline
        setTimeout(updateDocumentState, 0);
        
        // On mobile, maybe close AI pane after insertion?
        if (window.innerWidth < 1024) {
            setIsAiOpen(false);
        }
    };

    // Handle Image Insertion Direct from Chat (Drag & Drop or + Upload)
    const handleAiImageDirectInsertion = (imageSrc: string) => {
        const img = document.createElement('img');
        img.src = imageSrc;
        img.className = "my-4 rounded-xl shadow-lg w-full max-h-[400px] object-cover border border-zinc-200 block";
        
        if (editorRef.current) {
            editorRef.current.focus();
            if (lastCursorPosition.current) {
                const range = lastCursorPosition.current;
                range.collapse(false);
                range.insertNode(img);
            } else {
                 editorRef.current.appendChild(img);
            }
            setTimeout(updateDocumentState, 0);
        }
        
        if (window.innerWidth < 1024) {
            setIsAiOpen(false);
        }
    };

    // Handle Reject Action from AI Companion
    const handleAiTextRejection = () => {
        const pendingSpan = document.getElementById(pendingRewriteWrapperId);
        if (pendingSpan) {
            // Unwrap the span, keeping the original text
            const parent = pendingSpan.parentNode;
            while (pendingSpan.firstChild) {
                parent?.insertBefore(pendingSpan.firstChild, pendingSpan);
            }
            parent?.removeChild(pendingSpan);
        }
    };

    // AI Operations (Toolbar)
    const handleRewrite = () => {
        if (!selectionRange || !selectedText) return;
        
        // 1. Mark the selection visually (Wrap in a span)
        const span = document.createElement("span");
        span.id = pendingRewriteWrapperId;
        span.className = "bg-purple-900/30 text-purple-200 border-b-2 border-purple-500 animate-pulse";
        
        try {
            selectionRange.surroundContents(span);
        } catch (e) {
            // Fallback for complex selections (overlapping elements)
             document.execCommand('insertHTML', false, `<span id="${pendingRewriteWrapperId}" class="bg-purple-900/30 text-purple-200 border-b-2 border-purple-500 animate-pulse">${selectedText}</span>`);
        }

        // 2. Hide Toolbar
        setToolbarPosition(null);
        window.getSelection()?.removeAllRanges();

        // 3. Open AI Pane (important for mobile)
        setIsAiOpen(true);

        // 4. Trigger AI Companion
        if (aiCompanionRef.current) {
            aiCompanionRef.current.ask(`Rewrite this text to be more professional: "${selectedText}"`, selectedText);
        }
    };

    const handleGenImage = async () => {
        if (!selectionRange || !selectedText) return;
        setIsAiProcessing(true);
        setGeneratedImageData(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: selectedText,
            });

            // Find image part
            let base64Image = null;
            if (response.candidates?.[0]?.content?.parts) {
                 for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData) {
                        base64Image = part.inlineData.data;
                        break;
                    }
                 }
            }

            if (base64Image) {
                 setGeneratedImageData(base64Image);
                 setShowImageModal(true);
                 setToolbarPosition(null);
            } else {
                alert("No image generated.");
            }

        } catch (error) {
            console.error("Image gen failed", error);
             alert("Failed to generate image.");
        } finally {
            setIsAiProcessing(false);
        }
    };

    const handleInsertImage = () => {
        if (!generatedImageData) return;
        
        const img = document.createElement('img');
        img.src = `data:image/png;base64,${generatedImageData}`;
        img.className = "my-4 rounded-xl shadow-lg w-full max-h-[400px] object-cover border border-zinc-200 block";
        
        if (editorRef.current) {
            editorRef.current.focus();
            if (selectionRange) {
                selectionRange.collapse(false);
                selectionRange.insertNode(img);
            } else if (lastCursorPosition.current) {
                const range = lastCursorPosition.current;
                range.collapse(false);
                range.insertNode(img);
            } else {
                 editorRef.current.appendChild(img);
            }
        }

        setShowImageModal(false);
        setGeneratedImageData(null);
        setTimeout(updateDocumentState, 0);
    };

    return (
        <div className="flex w-full h-full relative">
            <Sidebar 
                outline={outline} 
                wordCount={wordCount} 
                readingTime={readingTime} 
                mobileOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
            
            <div className="flex-1 flex flex-col min-w-0 bg-background relative z-10 transition-colors duration-300">
                <EditorHeader 
                    onDownload={handleDownload} 
                    onFormat={handleFormat}
                    onMenuClick={() => setIsSidebarOpen(true)}
                    onAiToggle={() => setIsAiOpen(true)}
                />
                
                {/* Main area background matches the global theme background via 'bg-background' variable in Tailwind config */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center bg-background relative scroll-smooth transition-colors duration-300" onClick={() => {
                   if(editorRef.current && document.activeElement !== editorRef.current) {
                       // Optional: Focus editor if clicking outside within the main area
                   }
                }}>
                    <div 
                        ref={editorRef}
                        contentEditable
                        suppressContentEditableWarning
                        onInput={updateDocumentState}
                        className="bg-white text-black w-full max-w-[850px] min-h-[800px] md:min-h-[1100px] page-shadow relative px-6 py-10 md:px-20 md:py-24 selection-highlight mb-20 outline-none font-body leading-loose text-base md:text-lg empty:before:text-zinc-400"
                    >
                    </div>
                </main>

                {/* Floating AI Toolbar */}
                {toolbarPosition && (
                    <div 
                        className="fixed z-50 flex items-center gap-1 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xl rounded-full px-1 py-1 border border-zinc-200 dark:border-zinc-700 animate-in fade-in zoom-in-95 duration-150"
                        style={{ top: toolbarPosition.top, left: toolbarPosition.left, transform: 'translateX(-50%)' }}
                        onMouseDown={(e) => e.preventDefault()} // Prevent losing selection when clicking toolbar
                    >
                        {isAiProcessing ? (
                            <div className="px-4 py-1.5 flex items-center gap-2">
                                <span className="material-symbols-outlined animate-spin text-[18px] text-primary">progress_activity</span>
                                <span className="text-xs font-bold">Thinking...</span>
                            </div>
                        ) : (
                            <>
                                <button onClick={handleRewrite} className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors group">
                                    <span className="material-symbols-outlined text-[18px] text-purple-500 dark:text-purple-400 group-hover:text-purple-600 dark:group-hover:text-purple-300">auto_awesome</span>
                                    <span className="text-xs font-bold whitespace-nowrap">Rewrite</span>
                                </button>
                                <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700"></div>
                                <button onClick={handleGenImage} className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white">
                                    <span className="material-symbols-outlined text-[18px]">image</span>
                                    <span className="text-xs font-bold whitespace-nowrap">Gen Image</span>
                                </button>
                                <button onClick={() => setShowChartModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white">
                                    <span className="material-symbols-outlined text-[18px]">bar_chart</span>
                                    <span className="text-xs font-bold whitespace-nowrap">Chart</span>
                                </button>
                            </>
                        )}
                    </div>
                )}

                {showShareModal && <ShareModal onClose={() => setShowShareModal(false)} />}
                {showChartModal && (
                    <ChartModal 
                        onClose={() => setShowChartModal(false)} 
                        contextText={selectedText || editorRef.current?.innerText || ""}
                    />
                )}
                {showImageModal && (
                    <ImageGenerationModal 
                        onClose={() => setShowImageModal(false)}
                        imageData={generatedImageData}
                        onInsert={handleInsertImage}
                    />
                )}
                {showTemplateLibrary && <TemplateLibraryModal onClose={() => setShowTemplateLibrary(false)} />}

            </div>
            
            <AICompanion 
                ref={aiCompanionRef}
                documentContext={editorRef.current?.innerText || ""}
                onInsertText={handleAiTextInsertion}
                onRejectText={handleAiTextRejection}
                onInsertImage={handleAiImageDirectInsertion}
                mobileOpen={isAiOpen}
                onClose={() => setIsAiOpen(false)}
            />
        </div>
    );
};

export default EditorPage;