import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

// Define the templates data structure with richer content
const templates = [
    {
        id: 'project-proposal',
        title: 'Strategic Project Proposal',
        category: 'Business',
        icon: 'rocket_launch',
        color: 'text-blue-500 dark:text-blue-400',
        description: 'A comprehensive proposal format including executive summary, objectives, timeline, and budget estimation.',
        content: `
            <h1 style="color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; margin-bottom: 20px;">Project Proposal: NextGen Integration</h1>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; background-color: #f8fafc; border: 1px solid #e2e8f0;">
                <tr>
                    <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold; width: 150px;">Prepared For</td>
                    <td style="padding: 12px; border: 1px solid #e2e8f0;">Executive Board</td>
                </tr>
                <tr>
                    <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold;">Date</td>
                    <td style="padding: 12px; border: 1px solid #e2e8f0;">October 27, 2024</td>
                </tr>
                <tr>
                    <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold;">Prepared By</td>
                    <td style="padding: 12px; border: 1px solid #e2e8f0;">Alex Morgan, Lead Strategist</td>
                </tr>
            </table>

            <h2 id="exec-summary" style="color: #1e293b; margin-top: 30px;">1. Executive Summary</h2>
            <p style="line-height: 1.6; color: #475569;">This proposal outlines the strategic initiative to integrate Generative AI into our core customer support workflow. By leveraging advanced language models, we aim to reduce ticket resolution time by <strong>40%</strong> while maintaining a CSAT score above 4.8/5.</p>

            <h2 id="objectives" style="color: #1e293b; margin-top: 30px;">2. Key Objectives</h2>
            <ul style="line-height: 1.8; color: #475569;">
                <li><strong>Automation:</strong> Automate responses for Tier 1 support queries.</li>
                <li><strong>Efficiency:</strong> Reduce average handling time (AHT) from 12 mins to 7 mins.</li>
                <li><strong>Scalability:</strong> Handle 2x query volume during peak season without additional headcount.</li>
            </ul>

            <h2 id="timeline" style="color: #1e293b; margin-top: 30px;">3. Proposed Timeline</h2>
            <div style="background-color: #f1f5f9; padding: 20px; border-left: 4px solid #2563eb; border-radius: 4px;">
                <p><strong>Phase 1: Research & Setup</strong> (Weeks 1-4)</p>
                <p><strong>Phase 2: Model Training & Beta</strong> (Weeks 5-8)</p>
                <p><strong>Phase 3: Full Deployment</strong> (Week 9+)</p>
            </div>
        `
    },
    {
        id: 'modern-resume',
        title: 'Modern Resume',
        category: 'Career',
        icon: 'badge',
        color: 'text-purple-500 dark:text-purple-400',
        description: 'Clean, professional resume layout designed to highlight skills and experience for tech and creative roles.',
        content: `
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px;">
                <div>
                    <h1 style="margin: 0; font-size: 36px; color: #111;">Alex Morgan</h1>
                    <p style="margin: 5px 0 0; color: #666; font-size: 18px;">Senior Product Designer</p>
                </div>
                <div style="text-align: right; font-size: 14px; color: #444;">
                    <p>sanfrancisco, ca</p>
                    <p>alex@email.com</p>
                    <p>(555) 123-4567</p>
                </div>
            </div>

            <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 15px; color: #333;">Professional Experience</h2>
            
            <div style="margin-bottom: 25px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <strong style="font-size: 16px;">Tech Solutions Inc.</strong>
                    <span style="color: #666;">2020 - Present</span>
                </div>
                <div style="font-style: italic; margin-bottom: 10px; color: #444;">Senior UI/UX Designer</div>
                <ul style="margin: 0; padding-left: 20px; line-height: 1.6; color: #333;">
                    <li>Led the redesign of the core mobile application, resulting in a 15% increase in user retention.</li>
                    <li>Established a unified design system used across 4 different product lines.</li>
                    <li>Mentored junior designers and conducted weekly design critiques.</li>
                </ul>
            </div>

            <div style="margin-bottom: 25px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <strong style="font-size: 16px;">Creative Studio</strong>
                    <span style="color: #666;">2018 - 2020</span>
                </div>
                <div style="font-style: italic; margin-bottom: 10px; color: #444;">Visual Designer</div>
                <ul style="margin: 0; padding-left: 20px; line-height: 1.6; color: #333;">
                    <li>Collaborated with marketing teams to create high-converting landing pages.</li>
                    <li>Designed brand identity assets for 10+ startups.</li>
                </ul>
            </div>

            <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 15px; color: #333; margin-top: 30px;">Skills</h2>
            <p style="line-height: 1.6;"><strong>Design:</strong> Figma, Adobe CC, Prototyping, Wireframing, User Research</p>
            <p style="line-height: 1.6;"><strong>Technical:</strong> HTML/CSS, Basic React, Webflow</p>
        `
    },
    {
        id: 'meeting-minutes',
        title: 'Board Meeting Minutes',
        category: 'Business',
        icon: 'groups',
        color: 'text-green-600 dark:text-green-400',
        description: 'Formal record keeping format for board meetings, including attendees, agenda, and action items.',
        content: `
            <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="margin-bottom: 5px;">Board Meeting Minutes</h1>
                <p style="color: #666;">Q4 Strategic Planning Session</p>
            </div>

            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 30px;">
                <p><strong>Date:</strong> October 24, 2024</p>
                <p><strong>Time:</strong> 10:00 AM - 12:00 PM</p>
                <p><strong>Location:</strong> Conference Room A / Zoom</p>
                <p><strong>Attendees:</strong> Sarah J. (CEO), Mike R. (CTO), Alex M. (Product), Jessica T. (Marketing)</p>
            </div>

            <h2 style="border-left: 5px solid #10b981; padding-left: 15px; color: #111;">1. Agenda Items</h2>
            <ol style="line-height: 1.8; margin-bottom: 20px;">
                <li>Review of Q3 Financial Performance</li>
                <li>Product Roadmap for 2025</li>
                <li>Marketing Budget Approval</li>
            </ol>

            <h2 style="border-left: 5px solid #10b981; padding-left: 15px; color: #111;">2. Discussion Summary</h2>
            <p style="margin-bottom: 15px;"><strong>Financials:</strong> Revenue exceeded projections by 12%. Operating costs remained stable.</p>
            <p style="margin-bottom: 15px;"><strong>Product:</strong> The mobile app launch is delayed by 2 weeks due to QA testing. The team is confident in the new timeline.</p>

            <h2 style="border-left: 5px solid #10b981; padding-left: 15px; color: #111;">3. Action Items</h2>
            <ul style="list-style-type: none; padding: 0;">
                <li style="margin-bottom: 10px; padding: 10px; background-color: #fff; border: 1px solid #ddd; border-radius: 6px;">
                    <input type="checkbox" disabled> <strong>Sarah:</strong> Finalize budget report for investors by Friday.
                </li>
                <li style="margin-bottom: 10px; padding: 10px; background-color: #fff; border: 1px solid #ddd; border-radius: 6px;">
                    <input type="checkbox" disabled> <strong>Mike:</strong> Share the updated QA report with the board.
                </li>
            </ul>
        `
    },
    {
        id: 'event-invite',
        title: 'Gala Invitation',
        category: 'Personal',
        icon: 'celebration',
        color: 'text-yellow-600 dark:text-yellow-400',
        description: 'Elegant invitation card suited for formal events, weddings, or corporate galas.',
        content: `
            <div style="text-align: center; border: 20px solid double #e5e7eb; padding: 60px 40px; max-width: 600px; margin: 0 auto;">
                <p style="font-style: italic; font-family: serif; color: #666; font-size: 18px; margin-bottom: 20px;">You are cordially invited to attend</p>
                
                <h1 style="font-family: serif; font-size: 48px; color: #111; margin-bottom: 10px; letter-spacing: 2px;">The Winter Gala</h1>
                
                <p style="text-transform: uppercase; letter-spacing: 3px; font-size: 12px; margin-bottom: 40px; color: #888;">A Night of Charity & Excellence</p>
                
                <div style="margin: 30px 0; font-size: 18px; line-height: 2;">
                    <p><strong>Saturday, December 15th</strong></p>
                    <p>at Seven O'Clock in the Evening</p>
                </div>
                
                <div style="margin: 30px 0;">
                    <p style="font-weight: bold; font-size: 18px;">The Grand Ballroom</p>
                    <p style="color: #666;">Downtown Luxury Hotel</p>
                    <p style="color: #666;">123 Main Street, Metropolis</p>
                </div>
                
                <p style="margin-top: 50px; font-size: 14px;"><strong>Dress Code:</strong> Black Tie Optional</p>
                <p style="font-size: 14px;">Please RSVP by December 1st</p>
            </div>
        `
    },
    {
        id: 'cover-letter',
        title: 'Cover Letter',
        category: 'Career',
        icon: 'mail',
        color: 'text-pink-500 dark:text-pink-400',
        description: 'A persuasive cover letter template to accompany your resume application.',
        content: `
            <p style="margin-bottom: 30px;">
                Alex Morgan<br>
                123 Design St.<br>
                San Francisco, CA 94103<br>
                (555) 123-4567 | alex@email.com
            </p>

            <p style="margin-bottom: 20px;">
                October 27, 2024<br><br>
                Hiring Manager<br>
                Creative Corp<br>
                New York, NY 10001
            </p>

            <p style="margin-bottom: 20px;"><strong>Re: Senior Product Designer Position</strong></p>

            <p style="margin-bottom: 15px; line-height: 1.6;">Dear Hiring Manager,</p>

            <p style="margin-bottom: 15px; line-height: 1.6;">
                I am writing to express my strong interest in the Senior Product Designer role at Creative Corp. With over 6 years of experience crafting user-centric digital products, I have long admired Creative Corp's commitment to intuitive design and innovation.
            </p>

            <p style="margin-bottom: 15px; line-height: 1.6;">
                In my current role at Tech Solutions Inc., I led a complete redesign of our flagship mobile app, which directly contributed to a 15% increase in user retention. My approach blends data-driven insights with creative problem-solving, ensuring that every design decision serves both the user and the business goals.
            </p>

            <p style="margin-bottom: 15px; line-height: 1.6;">
                I am particularly excited about the opportunity to bring my expertise in design systems and mentorship to your growing team. I am confident that my background aligns perfectly with your needs.
            </p>

            <p style="margin-bottom: 30px; line-height: 1.6;">
                Thank you for considering my application. I look forward to the possibility of discussing how I can contribute to Creative Corp.
            </p>

            <p>Sincerely,</p>
            <p style="margin-top: 30px;">Alex Morgan</p>
        `
    },
    {
        id: 'newsletter',
        title: 'Weekly Newsletter',
        category: 'Marketing',
        icon: 'campaign',
        color: 'text-orange-500 dark:text-orange-400',
        description: 'Engaging newsletter layout for email marketing campaigns and updates.',
        content: `
            <div style="background-color: #f3f4f6; padding: 20px; font-family: sans-serif;">
                <div style="background-color: white; max-width: 600px; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <div style="background-color: #1e293b; padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">The Weekly Insight</h1>
                        <p style="color: #94a3b8; margin: 10px 0 0; font-size: 14px;">Trends, Tech & Innovation | Issue #42</p>
                    </div>
                    
                    <div style="padding: 30px;">
                        <h2 style="color: #334155; margin-top: 0;">Top Story: AI in 2025</h2>
                        <img src="https://placehold.co/600x300/e2e8f0/64748b?text=Feature+Image" style="width: 100%; border-radius: 6px; margin: 15px 0;">
                        <p style="color: #475569; line-height: 1.6; margin-bottom: 20px;">
                            The landscape of artificial intelligence is shifting rapidly. As we approach 2025, experts predict a massive surge in agentic workflows where AI doesn't just generate text, but performs complex actions.
                        </p>
                        <a href="#" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-weight: bold; font-size: 14px;">Read Full Article &rarr;</a>
                        
                        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;">
                        
                        <h3 style="color: #334155;">Quick Hits</h3>
                        <ul style="color: #475569; line-height: 1.6; padding-left: 20px;">
                            <li style="margin-bottom: 10px;"><strong>Design:</strong> Minimalist interfaces are making a comeback.</li>
                            <li style="margin-bottom: 10px;"><strong>Code:</strong> TypeScript 6.0 features announced.</li>
                            <li style="margin-bottom: 10px;"><strong>Business:</strong> Remote work stats for Q3.</li>
                        </ul>
                    </div>
                    
                    <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                        <p style="margin: 0; font-size: 12px; color: #94a3b8;">&copy; 2024 Tech Insights Inc. • Unsubscribe</p>
                    </div>
                </div>
            </div>
        `
    },
    {
        id: 'lesson-plan',
        title: 'Lesson Plan',
        category: 'Education',
        icon: 'school',
        color: 'text-red-500 dark:text-red-400',
        description: 'Structured lesson plan for educators, covering objectives, materials, and activities.',
        content: `
            <div style="border: 1px solid #ddd; padding: 30px; border-radius: 8px;">
                <h1 style="color: #b91c1c; border-bottom: 2px solid #b91c1c; padding-bottom: 10px;">Lesson Plan: Introduction to Photosynthesis</h1>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; background-color: #fef2f2; padding: 15px; border-radius: 6px;">
                    <div>
                        <p><strong>Subject:</strong> Biology</p>
                        <p><strong>Grade Level:</strong> 9th Grade</p>
                    </div>
                    <div>
                        <p><strong>Duration:</strong> 45 Minutes</p>
                        <p><strong>Date:</strong> Nov 05, 2024</p>
                    </div>
                </div>

                <h3>Learning Objectives</h3>
                <ul style="line-height: 1.6;">
                    <li>Students will be able to define photosynthesis.</li>
                    <li>Students will identify the inputs and outputs of the process.</li>
                    <li>Students will understand the role of chlorophyll.</li>
                </ul>

                <h3>Materials Needed</h3>
                <ul style="line-height: 1.6;">
                    <li>Textbook Chapter 4</li>
                    <li>Projector & Slides</li>
                    <li>Leaf samples (Elodea)</li>
                    <li>Microscopes</li>
                </ul>

                <h3>Procedure</h3>
                <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                    <tr style="background-color: #eee;">
                        <th style="border: 1px solid #ccc; padding: 10px; text-align: left;">Time</th>
                        <th style="border: 1px solid #ccc; padding: 10px; text-align: left;">Activity</th>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ccc; padding: 10px;">0-5 min</td>
                        <td style="border: 1px solid #ccc; padding: 10px;">Bell Ringer: "How do plants eat?" discussion.</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ccc; padding: 10px;">5-20 min</td>
                        <td style="border: 1px solid #ccc; padding: 10px;">Direct Instruction: Slide presentation on cellular process.</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ccc; padding: 10px;">20-40 min</td>
                        <td style="border: 1px solid #ccc; padding: 10px;">Lab Activity: Observing plant cells under microscope.</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ccc; padding: 10px;">40-45 min</td>
                        <td style="border: 1px solid #ccc; padding: 10px;">Exit Ticket: Write the chemical equation for photosynthesis.</td>
                    </tr>
                </table>
            </div>
        `
    },
    {
        id: 'invoice',
        title: 'Service Invoice',
        category: 'Business',
        icon: 'receipt_long',
        color: 'text-emerald-500 dark:text-emerald-400',
        description: 'Professional invoice template with calculated tables and payment terms.',
        content: `
            <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 50px;">
                    <div>
                        <h1 style="color: #047857; margin: 0;">INVOICE</h1>
                        <p style="color: #666;">#INV-2024-001</p>
                    </div>
                    <div style="text-align: right;">
                        <p><strong>Your Company LLC</strong></p>
                        <p style="color: #666; font-size: 14px;">123 Business Rd<br>Tech City, TC 90210</p>
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
                    <div>
                        <p style="font-size: 12px; text-transform: uppercase; color: #888; font-weight: bold;">Bill To:</p>
                        <p><strong>Client Name</strong></p>
                        <p>Client Company Inc.</p>
                        <p>456 Client Street</p>
                    </div>
                    <div style="text-align: right;">
                        <p><strong>Date:</strong> Oct 27, 2024</p>
                        <p><strong>Due Date:</strong> Nov 27, 2024</p>
                    </div>
                </div>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                    <thead style="background-color: #064e3b; color: white;">
                        <tr>
                            <th style="padding: 12px; text-align: left;">Description</th>
                            <th style="padding: 12px; text-align: center;">Hours</th>
                            <th style="padding: 12px; text-align: right;">Rate</th>
                            <th style="padding: 12px; text-align: right;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 12px;">Web Development Services - Phase 1</td>
                            <td style="padding: 12px; text-align: center;">40</td>
                            <td style="padding: 12px; text-align: right;">$150.00</td>
                            <td style="padding: 12px; text-align: right;">$6,000.00</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 12px;">UI/UX Design Consultation</td>
                            <td style="padding: 12px; text-align: center;">10</td>
                            <td style="padding: 12px; text-align: right;">$175.00</td>
                            <td style="padding: 12px; text-align: right;">$1,750.00</td>
                        </tr>
                    </tbody>
                </table>

                <div style="text-align: right; margin-bottom: 50px;">
                    <p style="font-size: 18px;"><strong>Total Due: <span style="color: #047857;">$7,750.00</span></strong></p>
                </div>

                <div style="border-top: 1px solid #ddd; padding-top: 20px;">
                    <p style="font-weight: bold; font-size: 14px;">Payment Terms</p>
                    <p style="font-size: 13px; color: #666;">Please pay within 30 days via bank transfer or check.</p>
                </div>
            </div>
        `
    }
];

const TemplatesPage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const categories = ['All', 'Business', 'Personal', 'Career', 'Marketing', 'Education'];

    const handleTemplateClick = (content: string) => {
        navigate('/', { state: { initialContent: content } });
    };

    const filteredTemplates = selectedCategory === 'All' 
        ? templates 
        : templates.filter(t => t.category === selectedCategory);

    return (
        <div className="flex w-full h-full relative">
            <Sidebar mobileOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 flex flex-col min-w-0 bg-background relative z-10 transition-colors duration-300">
                <header className="h-20 border-b border-border flex items-center justify-between px-4 lg:px-8 bg-surface/80 backdrop-blur-md z-30 shrink-0 transition-colors duration-300">
                    <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-2">
                             <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-1 -ml-1 text-zinc-500">
                                <span className="material-symbols-outlined">menu</span>
                             </button>
                             <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Template Gallery</h1>
                        </div>
                        <p className="text-xs text-zinc-500 hidden sm:block">Start your next project with AI-powered drafts</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <button onClick={() => navigate('/')} className="bg-white text-zinc-900 border border-zinc-200 dark:bg-zinc-900 dark:text-white dark:border-zinc-700 pl-3 pr-4 py-2 rounded-lg text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-sm">
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            New <span className="hidden sm:inline">Blank Doc</span>
                        </button>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-4 lg:p-10 scroll-smooth bg-background transition-colors duration-300">
                    <div className="flex items-center gap-2 mb-6 lg:mb-10 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map((cat) => (
                            <button 
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-sm font-bold border transition-all whitespace-nowrap ${
                                    selectedCategory === cat 
                                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-black border-zinc-900 dark:border-white shadow-lg' 
                                        : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600'
                                }`}
                            >
                                {cat === 'All' ? 'All Templates' : cat}
                            </button>
                        ))}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {/* Blank Document Option */}
                        {selectedCategory === 'All' && (
                            <div onClick={() => navigate('/')} className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 rounded-xl p-5 transition-all hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col">
                                <div className="h-36 bg-zinc-50 dark:bg-zinc-950 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden border border-zinc-100 dark:border-zinc-800 group-hover:border-zinc-200 dark:group-hover:border-zinc-700 transition-colors">
                                    <span className="material-symbols-outlined text-4xl text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors duration-300 relative z-10">add</span>
                                </div>
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-bold text-zinc-900 dark:text-white text-base">Blank Document</h3>
                                </div>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-4">Start from scratch with a clean slate.</p>
                            </div>
                        )}

                        {/* Mapped Templates */}
                        {filteredTemplates.map((template) => (
                            <div 
                                key={template.id} 
                                onClick={() => handleTemplateClick(template.content)} 
                                className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 rounded-xl p-5 transition-all hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col animate-in fade-in duration-300"
                            >
                                <div className="h-36 bg-zinc-50 dark:bg-zinc-950 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden border border-zinc-100 dark:border-zinc-800 group-hover:border-zinc-200 dark:group-hover:border-zinc-700 transition-colors">
                                    <span className={`material-symbols-outlined text-4xl group-hover:scale-110 transition-transform duration-300 relative z-10 ${template.color}`}>{template.icon}</span>
                                    {/* Abstract background decoration */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-zinc-200/20 dark:via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </div>
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-bold text-zinc-900 dark:text-white text-base leading-tight">{template.title}</h3>
                                    <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 px-1.5 py-0.5 rounded shrink-0 ml-2">{template.category}</span>
                                </div>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-4">{template.description}</p>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default TemplatesPage;