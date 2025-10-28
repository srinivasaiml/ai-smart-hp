import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Loader2, Stethoscope, User, Bot, Sparkles, AlertCircle } from 'lucide-react';

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
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [conversationContext, setConversationContext] = useState<string[]>([]);
    const [mlServiceAvailable, setMlServiceAvailable] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);
    const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        checkMLService();
    }, []);
    const mlServiceUrl = import.meta.env.VITE_ML_API_URL;
    const checkMLService = async () => {
        try {
            const response = await fetch(`${mlServiceUrl}/`, { method: 'GET' });
            if (response.ok) {
                setMlServiceAvailable(true);
                console.log('✅ ML Service is available');
            }
        } catch (error) {
            setMlServiceAvailable(false);
            console.log('⚠️ ML Service unavailable - using rule-based fallback');
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
        synthesisRef.current.rate = 1.0;
        synthesisRef.current.pitch = 1.0;

        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
        };
    }, []);

    useEffect(() => {
        const scrollToBottom = () => {
            messagesEndRef.current?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'nearest'
            });
        };

        if (messagesContainerRef.current) {
            const container = messagesContainerRef.current;
            const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
            
            const lastMessage = messages[messages.length - 1];
            const shouldScroll = isAtBottom || (lastMessage && lastMessage.role === 'assistant');
            
            if (shouldScroll) {
                setTimeout(scrollToBottom, 50);
            }
        }
    }, [messages]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const greeting: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: `Hello! I'm your AI Health Assistant${mlServiceAvailable ? ' powered by machine learning' : ''}. Please describe your symptoms in detail, and I'll help identify the right specialist for you.`,
                timestamp: new Date(),
                suggestions: ["I have a headache", "Feeling feverish", "Stomach pain", "Skin rash"]
            };
            setMessages([greeting]);
        }
    }, [isOpen, messages.length, mlServiceAvailable]);

    const toggleVoiceInput = () => {
        if (!recognitionRef.current) {
            alert('Voice recognition is not supported in your browser.');
            return;
        }
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const speakText = (text: string) => {
        if (synthesisRef.current) {
            window.speechSynthesis.cancel();
            synthesisRef.current.text = text;
            window.speechSynthesis.speak(synthesisRef.current);
        }
    };
    const predictDiseaseML = async (symptoms: string[]): Promise<{ disease: string; confidence: number } | null> => {
        if (!mlServiceAvailable) return null;

        try {
            const response = await fetch(`${mlServiceUrl}/predict`,  {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symptoms })
            });

            if (!response.ok) return null;

            const data = await response.json();
            return {
                disease: data.predicted_disease,
                confidence: data.confidence || 0.85
            };
        } catch (error) {
            console.error('ML prediction error:', error);
            return null;
        }
    };

    const extractSymptoms = (conversationHistory: string[]): string[] => {
        const symptomKeywords = [
            'fever', 'cough', 'headache', 'pain', 'nausea', 'vomiting', 'dizziness',
            'fatigue', 'weakness', 'rash', 'itching', 'breathing', 'chest pain',
            'stomach ache', 'diarrhea', 'constipation', 'joint pain', 'muscle pain',
            'sore throat', 'runny nose', 'congestion', 'sweating', 'chills'
        ];

        const extractedSymptoms: string[] = [];
        const combinedText = conversationHistory.join(' ').toLowerCase();

        symptomKeywords.forEach(symptom => {
            if (combinedText.includes(symptom)) {
                extractedSymptoms.push(symptom);
            }
        });

        return extractedSymptoms;
    };

    const findRecommendedDoctorRuleBased = (symptoms: string, predictedDisease?: string) => {
        const symptomsLower = symptoms.toLowerCase();
        
        if (predictedDisease) {
            const diseaseLower = predictedDisease.toLowerCase();
            for (const doctor of availableDoctors) {
                const hasMatchingCondition = doctor.conditions.some(condition => 
                    diseaseLower.includes(condition.toLowerCase()) || 
                    condition.toLowerCase().includes(diseaseLower)
                );
                if (hasMatchingCondition) return doctor;
            }
        }

        const specialtyKeywords: { [key: string]: string[] } = {
            'Neurosurgeon': ['migraine', 'headache', 'paralysis', 'vertigo', 'dizziness', 'brain', 'head injury', 'seizure'],
            'Dermatologist': ['rash', 'skin', 'acne', 'psoriasis', 'eczema', 'allergy', 'itching', 'hives', 'pimple'],
            'Cardiologist': ['chest pain', 'heart', 'palpitations', 'hypertension', 'blood pressure', 'breathless', 'cardiac'],
            'Pediatrician': ['child', 'baby', 'infant', 'kid', 'vaccination', 'toddler'],
            'General Surgeon': ['abdominal pain', 'appendix', 'hernia', 'surgery', 'lump'],
            'Oncologist': ['tumor', 'cancer', 'mass', 'growth', 'malignant'],
            'Gastroenterologist': ['stomach', 'gastro', 'digestive', 'intestinal', 'bowel', 'hepatitis'],
            'Endocrinologist': ['diabetes', 'thyroid', 'hormone', 'gland'],
            'Pulmonologist': ['breathing', 'lung', 'respiratory', 'pneumonia', 'asthma', 'tuberculosis']
        };

        for (const [specialty, keywords] of Object.entries(specialtyKeywords)) {
            if (keywords.some(keyword => symptomsLower.includes(keyword))) {
                const doctor = availableDoctors.find(doc => doc.specialty === specialty);
                if (doctor) return doctor;
            }
        }

        return availableDoctors.find(doc => doc.specialty === 'General Physician') || null;
    };

    const generateSuggestions = (userMessage: string): string[] => {
        const messageLower = userMessage.toLowerCase();
        if (messageLower.includes('headache') || messageLower.includes('head')) {
            return ["It's severe", "It's mild", "I also feel dizzy", "I have nausea"];
        } else if (messageLower.includes('fever') || messageLower.includes('temperature')) {
            return ["Yes, high fever", "Mild fever", "Chills too", "Body aches"];
        } else if (messageLower.includes('stomach') || messageLower.includes('abdominal')) {
            return ["Sharp pain", "Dull ache", "After eating", "Nausea present"];
        } else if (messageLower.includes('chest')) {
            return ["Sharp pain", "Pressure feeling", "Shortness of breath", "Left side"];
        } else if (messageLower.includes('cough') || messageLower.includes('cold')) {
            return ["Dry cough", "With mucus", "Sore throat", "Runny nose"];
        }
        return ["Tell me more", "I have other symptoms", "How long?", "Started recently"];
    };

    const sendToGroq = async (userMessage: string) => {
        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                   'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,

                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [
                        {
                            role: 'system',
                            content: `You are a compassionate medical assistant. Help users describe their symptoms through friendly conversation. Ask follow-up questions to understand better. Keep responses concise (2-3 sentences). Never diagnose - only gather information. Previous conversation: ${conversationContext.join('. ')}`
                        },
                        { role: 'user', content: userMessage }
                    ],
                    temperature: 0.7,
                    max_tokens: 200
                })
            });

            if (!response.ok) throw new Error('API request failed');
            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Groq API Error:', error);
            return "I'm having trouble processing that. Could you describe your symptoms again?";
        }
    };

    const handleSendMessage = async (text?: string) => {
        const messageText = text || inputText.trim();
        if (!messageText || isLoading) return;

        const userMessage: Message = { 
            id: Date.now().toString(), 
            role: 'user', 
            content: messageText, 
            timestamp: new Date() 
        };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        const updatedContext = [...conversationContext, messageText];
        setConversationContext(updatedContext);

        const aiResponse = await sendToGroq(messageText);
        const suggestions = generateSuggestions(messageText);

        let predictedDisease: string | undefined;
        let mlConfidence: number | undefined;
        let recommendedDoctor: { name: string; specialty: string } | undefined;

        if (updatedContext.length >= 3) {
            const extractedSymptoms = extractSymptoms(updatedContext);
            
            const mlResult = await predictDiseaseML(extractedSymptoms);
            
            if (mlResult) {
                predictedDisease = mlResult.disease;
                mlConfidence = mlResult.confidence;
                console.log(`✅ ML Prediction: ${predictedDisease} (${(mlConfidence * 100).toFixed(1)}% confidence)`);
            }

            const allSymptoms = updatedContext.join(' ');
            recommendedDoctor = findRecommendedDoctorRuleBased(allSymptoms, predictedDisease) || undefined;
        }

        const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date(),
            suggestions: suggestions,
            recommendedDoctor: recommendedDoctor,
            predictedDisease: predictedDisease,
            mlConfidence: mlConfidence
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
        speakText(aiResponse);
    };

    const handleBookAppointment = (doctor: { name: string; specialty: string }, predictedDisease?: string) => {
        const appointmentData = {
            name: doctor.name,
            specialty: doctor.specialty
        };

        const symptomData = {
            symptoms: conversationContext,
            predictedDisease: predictedDisease || 'Not specified',
            mlBased: !!predictedDisease
        };

        // FIXED: Use localStorage instead of window object
        try {
            localStorage.setItem('preSelectedDoctor', JSON.stringify(appointmentData));
            localStorage.setItem('symptomContext', JSON.stringify(symptomData));
            console.log('✅ Stored doctor data:', appointmentData);
        } catch (error) {
            console.error('Error storing doctor data:', error);
        }

        if (onOpenChatbot) {
            onOpenChatbot(doctor);
            return;
        }

        const chatbotEvent = new CustomEvent('openChatbot', {
            detail: { doctor, predictedDisease }
        });
        window.dispatchEvent(chatbotEvent);

        setIsOpen(false);
    };

    return (
        <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            <div className="max-w-5xl mx-auto px-4">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg mb-4">
                        <Sparkles className="text-purple-600" size={24} />
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            AI Health Assistant
                        </h2>
                        {mlServiceAvailable && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">ML Powered</span>
                        )}
                    </div>
                    <p className="text-gray-600 text-lg">
                        Describe your symptoms and get connected with the right specialist
                    </p>
                </div>

                <div className="relative h-[500px] w-full flex items-center justify-center">
                    <style>{`
                        @keyframes rotate-balls { from { transform: translateX(-50%) translateY(-50%) rotate(360deg); } to { transform: translateX(-50%) translateY(-50%) rotate(0deg); } }
                        @keyframes blink-eyes { 46%, 50%, 96%, 100% { height: 52px; } 48%, 98% { height: 20px; } }
                        .container-ai-input { position: relative; width: 100%; height: 100%; display: grid; grid-template-columns: repeat(5, 1fr); grid-template-rows: repeat(3, 1fr); }
                        .area { position: relative; }
                        .container-wrap { position: absolute; left: 50%; top: 50%; transform: translateX(-50%) translateY(-50%); z-index: 10; cursor: pointer; padding: 4px; transition: all 0.3s ease; }
                        .container-wrap:hover { padding: 0; }
                        .container-wrap:active { transform: translateX(-50%) translateY(-50%) scale(0.95); }
                        .container-wrap::after { content: ""; position: absolute; left: 50%; top: 50%; transform: translateX(-50%) translateY(-55%); width: 12rem; height: 11rem; background-color: #dedfe0; border-radius: 3.2rem; transition: all 0.3s ease; z-index: -1; }
                        .container-wrap:hover::after { transform: translateX(-50%) translateY(-50%); height: 12rem; }
                        .checkbox-input { opacity: 0; width: 0; height: 0; position: absolute; }
                        .checkbox-input:checked ~ .card .eyes { opacity: 0; }
                        .checkbox-input:checked ~ .card .content-card { width: 440px; height: 560px; }
                        .checkbox-input:checked ~ .card .background-blur-balls { border-radius: 20px; }
                        .checkbox-input:checked ~ .card .container-ai-chat { opacity: 1; visibility: visible; pointer-events: auto; }
                        .card { width: 100%; height: 100%; transform-style: preserve-3d; will-change: transform; transition: all 0.6s ease; border-radius: 3rem; display: flex; align-items: center; justify-content: center; transform: perspective(1000px) translateZ(50px); }
                        .card:hover { box-shadow: 0 10px 40px rgba(0, 0, 60, 0.25), inset 0 0 10px rgba(255, 255, 255, 0.5); }
                        .background-blur-balls { position: absolute; left: 50%; top: 50%; transform: translateX(-50%) translateY(-50%); width: 100%; height: 100%; z-index: -10; border-radius: 3rem; transition: all 0.3s ease; background-color: rgba(255, 255, 255, 0.8); overflow: hidden; }
                        .balls { position: absolute; left: 50%; top: 50%; transform: translateX(-50%) translateY(-50%); animation: rotate-balls 10s linear infinite; }
                        .container-wrap:hover .balls { animation-play-state: paused; }
                        .ball { width: 6rem; height: 6rem; position: absolute; border-radius: 50%; filter: blur(30px); }
                        .ball.violet { top: 0; left: 50%; transform: translateX(-50%); background-color: #9147ff; }
                        .ball.green { bottom: 0; left: 50%; transform: translateX(-50%); background-color: #34d399; }
                        .ball.rosa { top: 50%; left: 0; transform: translateY(-50%); background-color: #ec4899; }
                        .ball.cyan { top: 50%; right: 0; transform: translateY(-50%); background-color: #05e0f5; }
                        .content-card { width: 12rem; height: 12rem; display: flex; border-radius: 3rem; transition: all 0.3s ease; overflow: hidden; }
                        .background-blur-card { width: 100%; height: 100%; backdrop-filter: blur(50px); position: relative; }
                        .eyes { position: absolute; left: 50%; bottom: 50%; transform: translateX(-50%); display: flex; align-items: center; justify-content: center; height: 52px; gap: 2rem; transition: all 0.3s ease; }
                        .eye { width: 26px; height: 52px; background-color: #fff; border-radius: 16px; animation: blink-eyes 10s infinite linear; }
                        .eyes.happy { display: none; color: #fff; gap: 0; }
                        .eyes.happy svg { width: 60px; }
                        .container-wrap:hover .eyes .eye { display: none; }
                        .container-wrap:hover .eyes.happy { display: flex; }
                        .container-ai-chat { position: absolute; width: 100%; height: 100%; padding: 6px; opacity: 0; pointer-events: none; visibility: hidden; transition: all 0.3s ease; }
                        .chat { display: flex; justify-content: space-between; flex-direction: column; border-radius: 15px; width: 100%; height: 100%; padding: 8px; overflow: hidden; background-color: #ffffff; }
                        .messages-container { flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 12px; scroll-behavior: smooth; }
                        .messages-container::-webkit-scrollbar { width: 6px; }
                        .messages-container::-webkit-scrollbar-track { background: transparent; }
                        .messages-container::-webkit-scrollbar-thumb { background: #dedfe0; border-radius: 5px; }
                        .input-area { display: flex; gap: 8px; padding: 12px; border-top: 1px solid #e5e7eb; }
                        .input-field { flex: 1; padding: 10px 14px; border: 2px solid #e5e7eb; border-radius: 12px; outline: none; font-size: 14px; transition: all 0.3s ease; }
                        .input-field:focus { border-color: #9147ff; box-shadow: 0 0 0 3px rgba(145, 71, 255, 0.1); }
                        .icon-btn { width: 40px; height: 40px; border-radius: 10px; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; }
                        .mic-btn { background-color: #f3e8ff; color: #9147ff; }
                        .mic-btn:hover { background-color: #e9d5ff; }
                        .mic-btn.active { background-color: #ef4444; color: white; animation: pulse 1.5s infinite; }
                        .send-btn { background: linear-gradient(to top, #ff4141, #9147ff, #3b82f6); color: white; opacity: 0.7; }
                        .send-btn:hover { opacity: 1; }
                        .send-btn:disabled { opacity: 0.3; cursor: not-allowed; }
                        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
                    `}</style>

                    <div className="container-ai-input">
                        {[...Array(15)].map((_, i) => <div key={i} className="area" />)}
                        <label className="container-wrap">
                            <input type="checkbox" className="checkbox-input" checked={isOpen} onChange={(e) => setIsOpen(e.target.checked)} />
                            <div className="card">
                                <div className="background-blur-balls">
                                    <div className="balls"><span className="ball rosa" /><span className="ball violet" /><span className="ball green" /><span className="ball cyan" /></div>
                                </div>
                                <div className="content-card">
                                    <div className="background-blur-card">
                                        <div className="eyes"><span className="eye" /><span className="eye" /></div>
                                        <div className="eyes happy">
                                            <svg fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M8.28386 16.2843C8.9917 15.7665 9.8765 14.731 12 14.731C14.1235 14.731 15.0083 15.7665 15.7161 16.2843C17.8397 17.8376 18.7542 16.4845 18.9014 15.7665C19.4323 13.1777 17.6627 11.1066 17.3088 10.5888C16.3844 9.23666 14.1235 8 12 8C9.87648 8 7.61556 9.23666 6.69122 10.5888C6.33728 11.1066 4.56771 13.1777 5.09858 15.7665C5.24582 16.4845 6.16034 17.8376 8.28386 16.2843Z" /></svg>
                                            <svg fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M8.28386 16.2843C8.9917 15.7665 9.8765 14.731 12 14.731C14.1235 14.731 15.0083 15.7665 15.7161 16.2843C17.8397 17.8376 18.7542 16.4845 18.9014 15.7665C19.4323 13.1777 17.6627 11.1066 17.3088 10.5888C16.3844 9.23666 14.1235 8 12 8C9.87648 8 7.61556 9.23666 6.69122 10.5888C6.33728 11.1066 4.56771 13.1777 5.09858 15.7665C5.24582 16.4845 6.16034 17.8376 8.28386 16.2843Z" /></svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="container-ai-chat">
                                    <div className="chat">
                                        <div className="messages-container" ref={messagesContainerRef}>
                                            {messages.map((msg) => (
                                                <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                                                    <div style={{ maxWidth: '80%', display: 'flex', gap: '8px', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: msg.role === 'user' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'linear-gradient(135deg, #9147ff, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                            {msg.role === 'user' ? <User size={18} color="white" /> : <Bot size={18} color="white" />}
                                                        </div>
                                                        <div>
                                                            <div style={{ padding: '10px 14px', borderRadius: '16px', background: msg.role === 'user' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : '#f3f4f6', color: msg.role === 'user' ? 'white' : '#1f2937', fontSize: '14px', lineHeight: '1.5' }}>{msg.content}</div>
                                                            
                                                            {msg.predictedDisease && (
                                                                <div style={{ marginTop: '8px', padding: '8px 12px', background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: '10px', fontSize: '12px' }}>
                                                                    <div style={{ fontWeight: '600', color: '#92400e', marginBottom: '4px' }}>
                                                                        🔬 Analysis: {msg.predictedDisease}
                                                                    </div>
                                                                    {msg.mlConfidence && (
                                                                        <div style={{ fontSize: '11px', color: '#78350f' }}>
                                                                            Confidence: {(msg.mlConfidence * 100).toFixed(1)}% {mlServiceAvailable ? '(ML-based)' : '(Rule-based)'}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}

                                                            {msg.suggestions && (
                                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                                                                    {msg.suggestions.map((sug, idx) => (
                                                                        <button key={idx} onClick={() => handleSendMessage(sug)} style={{ padding: '6px 12px', background: '#f3e8ff', border: '1px solid #e9d5ff', borderRadius: '12px', fontSize: '12px', color: '#9147ff', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#e9d5ff'} onMouseOut={(e) => e.currentTarget.style.background = '#f3e8ff'}>{sug}</button>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            
                                                            {msg.recommendedDoctor && (
                                                                <div style={{ marginTop: '12px', padding: '12px', background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)', borderRadius: '12px', border: '2px solid #6ee7b7' }}>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                                        <Stethoscope size={16} color="#059669" />
                                                                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#059669' }}>Recommended Specialist</span>
                                                                    </div>
                                                                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#047857' }}>{msg.recommendedDoctor.name}</div>
                                                                    <div style={{ fontSize: '12px', color: '#059669', marginBottom: '8px' }}>{msg.recommendedDoctor.specialty}</div>
                                                                    <button 
                                                                        onClick={() => handleBookAppointment(msg.recommendedDoctor!, msg.predictedDisease)}
                                                                        style={{ width: '100%', padding: '8px', background: '#059669', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s' }}
                                                                        onMouseOver={(e) => e.currentTarget.style.background = '#047857'}
                                                                        onMouseOut={(e) => e.currentTarget.style.background = '#059669'}
                                                                    >
                                                                        📅 Book Appointment with {msg.recommendedDoctor.name.split(' ')[1]}
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {isLoading && (
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #9147ff, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Bot size={18} color="white" />
                                                    </div>
                                                    <div style={{ padding: '10px 14px', background: '#f3f4f6', borderRadius: '16px', display: 'flex', gap: '4px' }}>
                                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#9147ff', animation: 'pulse 1.4s ease-in-out infinite' }} />
                                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#9147ff', animation: 'pulse 1.4s ease-in-out 0.2s infinite' }} />
                                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#9147ff', animation: 'pulse 1.4s ease-in-out 0.4s infinite' }} />
                                                    </div>
                                                </div>
                                            )}
                                            <div ref={messagesEndRef} />
                                        </div>
                                        <div className="input-area">
                                            <button className={`icon-btn mic-btn ${isListening ? 'active' : ''}`} onClick={toggleVoiceInput}>{isListening ? <MicOff size={18} /> : <Mic size={18} />}</button>
                                            <input type="text" className="input-field" placeholder="Describe your symptoms..." value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} disabled={isLoading} />
                                            <button className="icon-btn send-btn" onClick={() => handleSendMessage()} disabled={!inputText.trim() || isLoading}>{isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </label>
                    </div>
                </div>

                {!mlServiceAvailable && (
                    <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                        <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                        <div>
                            <p className="text-sm text-amber-800">
                                <strong>ML Service Offline:</strong> Using rule-based recommendations. 
                                For ML-powered predictions, start the Flask service on port 5001.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default SymptomChecker;