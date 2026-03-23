import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Loader2, Stethoscope, Bot, Sparkles, Shield, Zap, MessageSquare } from 'lucide-react';

const availableDoctors = [
    { name: 'Dr. John Smith', specialty: 'General Physician', conditions: ['Common Cold', 'Flu', 'Fever', 'Fatigue'] },
    { name: 'Dr. Emily Carter', specialty: 'Dermatologist', conditions: ['Psoriasis', 'Acne', 'Fungal infection', 'Impetigo'] },
    { name: 'Dr. Michael Lee', specialty: 'Cardiologist', conditions: ['Heart attack', 'Hypertension', 'Varicose veins'] },
    { name: 'Dr. James Anderson', specialty: 'Neurosurgeon', conditions: ['Migraine', 'Paralysis (brain hemorrhage)', 'Cervical spondylosis'] },
    { name: 'Dr. Robert Lee', specialty: 'Pediatrician', conditions: ['Chickenpox', 'Bronchial Asthma'] },
    { name: 'Dr. Sarah James', specialty: 'General Surgeon', conditions: ['Peptic ulcer diseae', 'Gastroenteritis', 'Hemorrhoids'] },
    { name: 'Dr. Laura Carter', specialty: 'Oncologist', conditions: ['Malignant', 'Cancer'] },
    { name: 'Dr. David Wilson', specialty: 'Gastroenterologist', conditions: ['GERD', 'Chronic cholestasis', 'Hepatitis'] },
    { name: 'Dr. Jennifer Brown', specialty: 'Endocrinologist', conditions: ['Diabetes', 'Hypothyroidism', 'Hyperthyroidism'] },
    { name: 'Dr. Thomas Garcia', specialty: 'Pulmonologist', conditions: ['Pneumonia', 'Tuberculosis', 'Asthma', 'Bronchitis'] },
];

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    suggestions?: string[];
    recommendedDoctor?: { name: string; specialty: string };
    predictedDisease?: string;
    mlConfidence?: number;
}

interface SymptomCheckerProps {
    onOpenChatbot?: (doctor: { name: string; specialty: string }) => void;
}

const SymptomChecker: React.FC<SymptomCheckerProps> = ({ onOpenChatbot }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [conversationContext, setConversationContext] = useState<string[]>([]);
    const [mlServiceAvailable, setMlServiceAvailable] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);
    const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

    const mlServiceUrl = import.meta.env.VITE_ML_SERVICE_URL;

    useEffect(() => {
        checkMLService(); 
    }, []);

    const checkMLService = async () => {
      if (!mlServiceUrl) {
        setMlServiceAvailable(false);
        return;
      }
      try {
        const response = await fetch(`${mlServiceUrl}/`, { method: 'GET' });
        setMlServiceAvailable(response.ok);
      } catch (error) {
        setMlServiceAvailable(false);
      }
    };

    useEffect(() => {
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInputText(transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = () => setIsListening(false);
            recognitionRef.current.onend = () => setIsListening(false);
        }

        synthesisRef.current = new SpeechSynthesisUtterance();
        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
        };
    }, []);

    useEffect(() => {
        const chatContainer = document.getElementById('symptom-chat-body');
        if (chatContainer) {
            chatContainer.scrollTo({
                top: chatContainer.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, isLoading]);

    useEffect(() => {
        if (messages.length === 0) {
            const greeting: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: `Hello! I'm your AI Health Assistant. Please describe your symptoms in detail, and I'll help identify the right specialist for you.`,
                timestamp: new Date(),
                suggestions: ["I have a headache", "Feeling feverish", "Stomach pain"]
            };
            setMessages([greeting]);
        }
    }, [messages.length]);

    const toggleVoiceInput = () => {
        if (!recognitionRef.current) return;
        if (isListening) recognitionRef.current.stop();
        else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const predictDiseaseML = async (symptoms: string[]): Promise<{ disease: string; confidence: number } | null> => {
        if (!mlServiceAvailable) return null;
        try {
            const response = await fetch(`${mlServiceUrl}/predict`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symptoms }),
            });
            if (!response.ok) return null;
            const data = await response.json();
            return {
                disease: data.predicted_disease,
                confidence: data.confidence || 0.85
            };
        } catch (error) {
            return null;
        }
    };

    const extractSymptoms = (conversationHistory: string[]): string[] => {
        const symptomKeywords = ['fever', 'cough', 'headache', 'pain', 'nausea', 'vomiting', 'dizziness', 'fatigue', 'rash', 'breathing', 'chest pain'];
        const extracted: string[] = [];
        const combinedText = conversationHistory.join(' ').toLowerCase();
        symptomKeywords.forEach(s => { if (combinedText.includes(s)) extracted.push(s); });
        return extracted;
    };

    const findRecommendedDoctorRuleBased = (symptoms: string, predictedDisease?: string) => {
        const symptomsLower = symptoms.toLowerCase();
        if (predictedDisease) {
            const diseaseLower = predictedDisease.toLowerCase();
            for (const doctor of availableDoctors) {
                if (doctor.conditions.some(c => diseaseLower.includes(c.toLowerCase()) || c.toLowerCase().includes(diseaseLower))) return doctor;
            }
        }
        const specialtyKeywords: { [key: string]: string[] } = {
            'Neurosurgeon': ['headache', 'dizziness', 'brain'],
            'Dermatologist': ['rash', 'skin', 'itching'],
            'Cardiologist': ['chest pain', 'heart'],
            'Pulmonologist': ['breathing', 'cough']
        };
        for (const [specialty, keywords] of Object.entries(specialtyKeywords)) {
            if (keywords.some(k => symptomsLower.includes(k))) return availableDoctors.find(d => d.specialty === specialty) || null;
        }
        return availableDoctors.find(d => d.specialty === 'General Physician') || null;
    };

    const sendToGroq = async (userMessage: string, predictedDisease?: string, recommendedDoctor?: { name: string; specialty: string }) => {
        try {
            let systemPrompt = `You are a medical assistant. Help users describe symptoms. Keep responses concise (2 sentences). Never diagnose.`;
            if (predictedDisease && recommendedDoctor) {
                systemPrompt = `Analyze suggests ${predictedDisease}. Recommend ${recommendedDoctor.name} (${recommendedDoctor.specialty}). Use "Book Appointment" button.`;
            }
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userMessage }],
                    temperature: 0.7, max_tokens: 150
                })
            });
            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            return "Explain your symptoms so I can recommend a specialist.";
        }
    };

    const handleSendMessage = async (text?: string) => {
        const messageText = text || inputText.trim();
        if (!messageText || isLoading) return;
        if (messageText === "Start over") { setMessages([]); setConversationContext([]); return; }
        if (messageText === "Book Appointment") {
            const lastWithDoc = [...messages].reverse().find(m => m.role === 'assistant' && m.recommendedDoctor);
            if (lastWithDoc?.recommendedDoctor) handleBookAppointment(lastWithDoc.recommendedDoctor, lastWithDoc.predictedDisease);
            return;
        }
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: messageText, timestamp: new Date() }]);
        setInputText('');
        setIsLoading(true);
        const updatedContext = [...conversationContext, messageText];
        setConversationContext(updatedContext);
        let predictedDisease: string | undefined;
        let mlConfidence: number | undefined;
        let recommendedDoctor: { name: string; specialty: string } | undefined;
        if (updatedContext.length >= 4 || (mlServiceAvailable && updatedContext.length >= 2)) {
            const mlResult = await predictDiseaseML(extractSymptoms(updatedContext));
            if (mlResult) { 
                predictedDisease = mlResult.disease; 
                mlConfidence = mlResult.confidence; 
            }
            
            // Only suggest doctor if confidence is high or enough conversation has happened
            if (mlConfidence && mlConfidence > 0.85) {
                recommendedDoctor = findRecommendedDoctorRuleBased(updatedContext.join(' '), predictedDisease) || undefined;
            } else if (updatedContext.length >= 6) {
                recommendedDoctor = findRecommendedDoctorRuleBased(updatedContext.join(' '), predictedDisease) || undefined;
            }
        }
        const aiResponse = await sendToGroq(messageText, predictedDisease, recommendedDoctor);
        setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(), role: 'assistant', content: aiResponse, timestamp: new Date(),
            suggestions: recommendedDoctor ? ["Book Appointment", "Start over"] : ["Tell me more", "How long?"],
            recommendedDoctor, predictedDisease, mlConfidence
        }]);
        setIsLoading(false);
    };

    const handleBookAppointment = (doctor: { name: string; specialty: string }, predictedDisease?: string) => {
        localStorage.setItem('preSelectedDoctor', JSON.stringify(doctor));
        localStorage.setItem('symptomContext', JSON.stringify({ symptoms: conversationContext, predictedDisease: predictedDisease || 'Not specified' }));
        if (onOpenChatbot) onOpenChatbot(doctor);
        window.dispatchEvent(new CustomEvent('openChatbot', { detail: { doctor, predictedDisease } }));
    };

    return (
        <section className="py-24 bg-white dark:bg-slate-950 transition-colors duration-500 overflow-hidden relative">
            {/* Background Decorations */}
            <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    
                    {/* Left Side: Text and Icons */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full text-purple-500 text-xs font-bold uppercase tracking-widest mb-8">
                            <Sparkles className="w-4 h-4 mr-2" />
                            Next-Gen Diagnostics
                        </div>
                        
                        <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[0.9] tracking-tighter mb-10">
                            AI-Driven <br />
                            <span className="text-slate-400 italic">Symptom Checker.</span>
                        </h2>

                        <p className="text-slate-600 dark:text-slate-400 text-lg mb-12 max-w-lg leading-relaxed font-medium">
                            Experience the future of healthcare. Our advanced AI analyzes your symptoms in real-time to connect you with the world's leading specialists.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { icon: Shield, label: 'Private & Secure', color: 'cyan' },
                                { icon: Zap, label: 'Instant Analysis', color: 'purple' },
                                { icon: Stethoscope, label: 'Expert Referral', color: 'blue' },
                                { icon: MessageSquare, label: '24/7 Availability', color: 'rose' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center space-x-4">
                                    <div className={`w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-${item.color}-500`}>
                                        <item.icon size={20} />
                                    </div>
                                    <span className="font-bold text-sm text-slate-700 dark:text-slate-300 tracking-tight">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Side: Interactive Assistant Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="glass-card p-1 overflow-hidden">
                            <div className="bg-white dark:bg-slate-900/50 rounded-[2.3rem] overflow-hidden">
                                {/* Header */}
                                <div className="p-6 bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                                            <Bot className="text-white w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-900 dark:text-white tracking-tight uppercase text-xs">AI Assistant</h3>
                                            <div className="flex items-center space-x-1">
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                                <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Online</span>
                                            </div>
                                        </div>
                                    </div>
                                    {mlServiceAvailable && (
                                        <span className="px-3 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[10px] font-black uppercase tracking-widest rounded-full">ML Active</span>
                                    )}
                                </div>

                                {/* Chat Body */}
                                <div className="h-[450px] overflow-y-auto p-8 space-y-6 scrollbar-none" id="symptom-chat-body">
                                    <AnimatePresence>
                                        {messages.map((msg) => (
                                            <motion.div
                                                key={msg.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-[85%] rounded-[1.5rem] p-5 ${
                                                    msg.role === 'user' 
                                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-lg' 
                                                    : 'bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-medium'
                                                }`}>
                                                    <p className="text-sm leading-relaxed">{msg.content}</p>
                                                    
                                                    {msg.predictedDisease && (
                                                        <div className="mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <div className="flex items-center space-x-2 text-amber-500">
                                                                    <Stethoscope size={14} />
                                                                    <span className="text-[10px] font-black uppercase tracking-widest">Analysis</span>
                                                                </div>
                                                                {msg.mlConfidence !== undefined && (
                                                                    <span className="text-[10px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
                                                                        {(msg.mlConfidence * 100).toFixed(1)}% Match
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="font-bold text-slate-900 dark:text-white text-xs leading-tight">{msg.predictedDisease}</p>
                                                        </div>
                                                    )}

                                                    {msg.recommendedDoctor && (
                                                        <div className="mt-4 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30">
                                                            <div className="flex items-center space-x-2 text-cyan-500 mb-2">
                                                                <Stethoscope size={14} />
                                                                <span className="text-[10px] font-black uppercase">Specialist</span>
                                                            </div>
                                                            <p className="font-black text-slate-900 dark:text-white text-sm">{msg.recommendedDoctor.name}</p>
                                                            <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">{msg.recommendedDoctor.specialty}</p>
                                                        </div>
                                                    )}

                                                    {msg.suggestions && (
                                                        <div className="flex flex-wrap gap-2 mt-4">
                                                            {msg.suggestions.map((sug, i) => (
                                                                <button
                                                                    key={i}
                                                                    onClick={() => handleSendMessage(sug)}
                                                                    className="px-3 py-1.5 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-cyan-500 transition-all"
                                                                >
                                                                    {sug}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input Area */}
                                <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                                    <div className="flex items-center space-x-2 sm:space-x-3">
                                        <button 
                                            onClick={toggleVoiceInput}
                                            className={`p-3 rounded-2xl transition-all flex-shrink-0 ${isListening ? 'bg-rose-500 text-white' : 'bg-white dark:bg-white/5 text-slate-400 hover:text-cyan-500'}`}
                                        >
                                            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                                        </button>
                                        <input 
                                            type="text"
                                            value={inputText}
                                            onChange={(e) => setInputText(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                            placeholder="Describe your symptoms..."
                                            className="flex-1 min-w-0 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 sm:px-6 sm:py-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-cyan-500 transition-all"
                                        />
                                        <button 
                                            onClick={() => handleSendMessage()}
                                            disabled={!inputText.trim() || isLoading}
                                            className="p-3 sm:p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-lg hover:scale-105 transition-all disabled:opacity-50 flex-shrink-0"
                                        >
                                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default SymptomChecker;