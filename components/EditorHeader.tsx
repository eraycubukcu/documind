import React, { useRef } from 'react';

interface EditorHeaderProps {
    onDownload: () => void;
    onFormat: (command: string, value?: string) => void;
    onMenuClick: () => void;
    onAiToggle: () => void;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({ onDownload, onFormat, onMenuClick, onAiToggle }) => {
    const titleInputRef = useRef<HTMLInputElement>(null);
    
    // Helper to prevent focus loss when clicking buttons
    const handleAction = (e: React.MouseEvent, command: string, value?: string) => {
        e.preventDefault();
        onFormat(command, value);
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFormat('foreColor', e.target.value);
    };

    const focusTitle = () => {
        titleInputRef.current?.focus();
    };

    return (
        <header className="h-16 border-b border-border flex items-center justify-between px-4 lg:px-6 bg-surface/80 backdrop-blur-md z-30 shrink-0 sticky top-0 transition-colors duration-300">
            <div className="flex items-center gap-3 lg:gap-4 overflow-hidden">
                {/* Mobile Menu Button */}
                <button onClick={onMenuClick} className="md:hidden p-2 -ml-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
                    <span className="material-symbols-outlined">menu</span>
                </button>

                <div className="flex items-center gap-2 group cursor-text min-w-0" onClick={focusTitle}>
                    <input 
                        ref={titleInputRef}
                        className="bg-transparent border-none p-0 text-zinc-900 dark:text-white text-base lg:text-lg font-medium focus:ring-0 w-32 lg:w-64 placeholder-zinc-400 dark:placeholder-zinc-600 truncate transition-all" 
                        placeholder="Untitled Document"
                        defaultValue="Untitled Document"
                    />
                    <span className="material-symbols-outlined text-zinc-400 dark:text-zinc-600 text-[18px] opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">edit</span>
                </div>
                <span className="hidden sm:inline-block px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-bold border border-zinc-200 dark:border-zinc-700 transition-colors">Draft</span>
            </div>
            
            {/* Toolbar Container: Scrollable on mobile */}
            <div className="flex-1 flex justify-center mx-2 lg:mx-4 overflow-x-auto scrollbar-hide">
                <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 transition-colors shadow-sm shrink-0">
                    <div className="flex items-center px-1 border-r border-zinc-200 dark:border-zinc-800">
                        <button onMouseDown={(e) => handleAction(e, 'undo')} className="p-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded transition-colors">
                            <span className="material-symbols-outlined text-[18px]">undo</span>
                        </button>
                        <button onMouseDown={(e) => handleAction(e, 'redo')} className="p-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded transition-colors">
                            <span className="material-symbols-outlined text-[18px]">redo</span>
                        </button>
                    </div>
                    
                    {/* Text Style Controls */}
                    <div className="flex items-center gap-0.5 px-2">
                        <button onMouseDown={(e) => handleAction(e, 'formatBlock', 'P')} className="px-2 py-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded transition-colors" title="Paragraph">N</button>
                        <button onMouseDown={(e) => handleAction(e, 'formatBlock', 'H1')} className="px-2 py-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded transition-colors whitespace-nowrap" title="Heading 1">H1</button>
                        <button onMouseDown={(e) => handleAction(e, 'formatBlock', 'H2')} className="px-2 py-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded transition-colors whitespace-nowrap" title="Heading 2">H2</button>
                    </div>

                    <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800"></div>
                    <button onMouseDown={(e) => handleAction(e, 'decreaseFontSize')} className="p-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded transition-colors">
                        <span className="material-symbols-outlined text-[18px]">remove</span>
                    </button>
                    <button onMouseDown={(e) => handleAction(e, 'increaseFontSize')} className="p-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded transition-colors">
                        <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                    <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800"></div>
                    
                    {/* Text Formatting */}
                    <button onMouseDown={(e) => handleAction(e, 'bold')} className="p-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded transition-colors">
                        <span className="material-symbols-outlined text-[18px] font-bold">format_bold</span>
                    </button>
                    <button onMouseDown={(e) => handleAction(e, 'italic')} className="p-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded transition-colors">
                        <span className="material-symbols-outlined text-[18px]">format_italic</span>
                    </button>
                    <button onMouseDown={(e) => handleAction(e, 'underline')} className="p-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded transition-colors">
                        <span className="material-symbols-outlined text-[18px]">format_underlined</span>
                    </button>
                    
                     {/* Color Picker */}
                    <div className="flex items-center justify-center w-8 h-8 relative group">
                         <span className="material-symbols-outlined text-[18px] text-zinc-500 dark:text-zinc-400 absolute pointer-events-none group-hover:text-zinc-900 dark:group-hover:text-white">palette</span>
                         <input 
                            type="color" 
                            onChange={handleColorChange}
                            className="opacity-0 w-full h-full cursor-pointer"
                            title="Text Color"
                        />
                    </div>

                    <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800"></div>
                    <button onMouseDown={(e) => handleAction(e, 'justifyLeft')} className="p-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded transition-colors">
                        <span className="material-symbols-outlined text-[18px]">format_align_left</span>
                    </button>
                     <button onMouseDown={(e) => handleAction(e, 'justifyCenter')} className="p-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded transition-colors">
                        <span className="material-symbols-outlined text-[18px]">format_align_center</span>
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-3">
                <button onClick={onDownload} className="bg-white text-zinc-900 border border-zinc-200 dark:bg-zinc-900 dark:text-white dark:border-zinc-700 px-3 py-2 lg:px-4 lg:py-2 rounded-lg text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap">
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    <span className="hidden sm:inline">Download</span>
                </button>
                <button onClick={onAiToggle} className="lg:hidden p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white">
                    <span className="material-symbols-outlined">smart_toy</span>
                </button>
            </div>
        </header>
    );
};

export default EditorHeader;