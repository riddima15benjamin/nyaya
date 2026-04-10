import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Send, Menu, MessageSquare, Plus } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Chat() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(localStorage.getItem('nyaya_language') || '');
  const [showPicker, setShowPicker] = useState(!localStorage.getItem('nyaya_language'));
  const [confirmationMsg, setConfirmationMsg] = useState(null);

  const languageOptions = ['English', 'हिन्दी', 'தமிழ்', 'తెలుగు', 'ಕನ್ನಡ', 'മലയാളം', 'मराठी', 'বাংলা', 'ગુજરાતી', 'ਪੰਜਾਬੀ'];
  const languageConfirmations = {
    'English': "Great! I will help you in English. You may ask your question.",
    'हिन्दी': "बढ़िया! मैं हिन्दी में आपकी मदद करूँगा। आप अपना सवाल पूछ सकते हैं।",
    'தமிழ்': "சிறப்பு! நான் தமிழில் உங்களுக்கு உதவுகிறேன். நீங்கள் உங்கள் கேள்வியை கேட்கலாம்.",
    'తెలుగు': "గొప్పది! నేను మీకు తెలుగులో సహాయం చేస్తాను. మీరు మీ ప్రశ్న అడగవచ్చు.",
    'ಕನ್ನಡ': "ಉತ್ತಮ! ನಾನು ನಿಮಗೆ ಕನ್ನಡದಲ್ಲಿ ಸಹಾಯ ಮಾಡುತ್ತೇನೆ. ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ನೀವು ಕೇಳಬಹುದು.",
    'മലയാളം': "കൊള്ളാം! ഞാൻ നിങ്ങളെ മലയാളത്തിൽ സഹായിക്കാം. നിങ്ങൾക്ക് നിങ്ങളുടെ ചോദ്യം ചോദിക്കാം.",
    'मराठी': "उत्तम! मी तुम्हाला मराठीत मदत करेन. तुम्ही तुमचा प्रश्न विचारू शकता.",
    'বাংলা': "চমৎকার! আমি আপনাকে বাংলায় সাহায্য করব। আপনি আপনার প্রশ্ন জিজ্ঞাসাপতি করতে পারেন।",
    'ગુજરાતી': "સરસ! હું તમને ગુજરાતીમાં મદદ કરીશ. તમે તમારો પ્રશ્ન પૂછી શકો છો.",
    'ਪੰਜਾਬੀ': "ਬਹੁਤ ਵਧੀਆ! ਮੈਂ ਪੰਜਾਬੀ ਵਿੱਚ ਤੁਹਾਡੀ ਮਦਦ ਕਰਾਂਗਾ। ਤੁਸੀਂ ਆਪਣਾ ਸਵਾਲ ਪੁੱਛ ਸਕਦੇ ਹੋ।"
  };

  const handleLanguageSelect = (lang) => {
    localStorage.setItem('nyaya_language', lang);
    setLanguage(lang);
    setShowPicker(false);
    setConfirmationMsg({
      id: 'confirm-' + Date.now(),
      role: 'assistant',
      content: languageConfirmations[lang] || languageConfirmations['English']
    });
  };
  const [typing, setTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  // Load initial data
  useEffect(() => {
    const initializeChat = async () => {
      setLoading(true);
      await fetchSessions(true);
      setLoading(false);
    };
    
    initializeChat();
  }, []);

  // Handle "New Case" link clicks (from location state change)
  useEffect(() => {
    if (location.state?.action === 'new_case') {
      createNewSession();
      // clear state so it doesn't trigger again on random unmounts
      navigate('/chat', { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const fetchSessions = async (initialLoad = false) => {
    if (!user) return;
    
    // Get all sessions
    const { data: sessionData, error: sessionError } = await supabase
      .from('chat_sessions')
      .select(`
        id, created_at,
        chat_messages (content, created_at)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
      
    if (sessionError) {
      console.error("Error fetching sessions:", sessionError);
      return;
    }

    // Process sessions to find first message for sidebar title
    const processedSessions = sessionData.map(s => {
      // Sort messages to get the first one
      const sortedMsgs = s.chat_messages?.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)) || [];
      const firstMsg = sortedMsgs.length > 0 ? sortedMsgs[0].content : 'Empty Chat';
      return {
        id: s.id,
        created_at: s.created_at,
        title: firstMsg.length > 40 ? firstMsg.substring(0, 40) + '...' : firstMsg
      };
    });

    setSessions(processedSessions);

    if (initialLoad) {
      if (processedSessions.length > 0) {
        // Automatically load most recent
        await fetchMessages(processedSessions[0].id);
      } else {
        // Create silent new session
        await createNewSession();
      }
    }
  };

  const createNewSession = async () => {
    if (!user) return;
    setMessages([]);
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({ user_id: user.id })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating session:", error);
      return;
    }
    
    setActiveSessionId(data.id);
    setConfirmationMsg(null);
    setShowPicker(!localStorage.getItem('nyaya_language'));
    // Add to sidebar immediately
    setSessions(prev => [{
      id: data.id,
      created_at: data.created_at,
      title: 'New Chat'
    }, ...prev]);
  };

  const loadSession = async (sessionId) => {
    if (sessionId === activeSessionId) return;
    await fetchMessages(sessionId);
  };

  const fetchMessages = async (sessionId) => {
    if (!sessionId) return;
    
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });
      
    if (error) {
      console.error("Error fetching messages:", error);
      return;
    }
    
    setActiveSessionId(sessionId);
    setConfirmationMsg(null);
    setShowPicker(!localStorage.getItem('nyaya_language'));
    setMessages(data);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !activeSessionId) return;

    const userText = input.trim();
    setInput('');
    
    // Add to local UI instantly
    const newMsg = { id: Date.now().toString(), session_id: activeSessionId, role: 'user', content: userText };
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setTyping(true);

    // 1. Insert user message to Supabase
    const { error: insertError } = await supabase
      .from('chat_messages')
      .insert({ session_id: activeSessionId, role: 'user', content: userText });
      
    if (insertError) {
      console.error("Error saving user message:", insertError);
      setTyping(false);
      return;
    }
    
    // If it was a 'New Chat', we should refresh the sessions list to update the title
    if (updatedMessages.length === 1) {
       fetchSessions(false); 
    }

    // 2. Format request for Gemini API
    try {
      // Get last 10 messages for context
      const historyContext = updatedMessages.slice(-10)
        .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
        .join('\n');
        
      const promptText = `Chat History:\n${historyContext}\nUser: ${userText}\nAssistant:`;
      
      const language = localStorage.getItem('nyaya_language') || 'English';
      const systemPromptText = `You are Nyaya, a compassionate and highly knowledgeable legal aid assistant helping underprivileged people in India understand their legal rights. You provide free, accurate, and easy-to-understand legal preliminary guidance.

CRITICAL INSTRUCTIONS:
1. Language: Always respond entirely in ${language}. Do not mix languages unless providing specific legal terms that are best understood in English alongside the translation.
2. Tone: Be warm, empathetic, and strictly professional. Do not sound like a generic AI machine. Speak simply and avoid confusing legal jargon when possible.
3. Structure your response clearly using markdown:
   - "The Situation": A brief empathetic summary of their issue.
   - "The Law (Simple Terms)": Explain the relevant Indian laws (e.g., IPC, BNS, BNSS, POSH Act, etc.) very simply.
   - "Your Legal Rights": Bullet points of exactly what rights they have in this scenario.
   - "Next Actionable Steps": A numbered clear action plan of what they should actually DO right now (e.g., "Gather these documents," "Visit this specific local office," etc.).
4. Guardrails & Safety: 
   - NEVER draft binding legal documents (contracts, wills).
   - If a situation involves immediate physical danger or domestic violence, you MUST immediately advise them to contact the Police (100) or Women's Helpline (1091).
   - Constantly state that you are an AI assistant and they should consult a registered lawyer or District Legal Services Authority (DLSA) for formal representation.
5. Focus: Reject non-legal topics politely.`;

      const payload = {
        contents: [
          { role: "user", parts: [{ text: promptText }] }
        ],
        systemInstruction: {
          parts: [{ text: systemPromptText }]
        }
      };

      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      let aiText = "I'm sorry, I'm having trouble connecting right now. Please try again later.";
      if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
        aiText = result.candidates[0].content.parts[0].text;
      }

      // Add AI response to UI
      const aiResponseMsg = { id: Date.now().toString() + 'ai', session_id: activeSessionId, role: 'assistant', content: aiText };
      setMessages(prev => [...prev, aiResponseMsg]);
      
      // 3. Insert AI response to Supabase
      await supabase
        .from('chat_messages')
        .insert({ session_id: activeSessionId, role: 'assistant', content: aiText });
        
    } catch (err) {
      console.error("Gemini API Error:", err);
      // Optional: Add an error message blurb
    } finally {
      setTyping(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <p style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Loading chat session...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      height: 'calc(100vh - 84px)', // Deduct ~ Navbar height to fit screen perfectly
      overflow: 'hidden',
      backgroundColor: '#f5f5f5' // slightly darker outside the chat
    }}>
      
      {/* Sidebar - Desktop */}
      <div style={{
        width: sidebarOpen ? '320px' : '0',
        transition: 'width 0.3s ease',
        backgroundColor: 'var(--color-card)',
        borderRight: '1px solid rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      }}>
        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', margin: 0 }}>History</h3>
          <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', color: 'rgba(0,0,0,0.4)', padding: '0.25rem' }}>
            <Menu size={20} />
          </button>
        </div>
        
        <div style={{ padding: '1rem', flex: 1, overflowY: 'auto' }}>
          <button 
             onClick={createNewSession}
             style={{ 
               width: '100%', 
               padding: '0.75rem', 
               backgroundColor: 'var(--color-primary)', 
               color: 'white',
               borderRadius: '8px',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               gap: '0.5rem',
               marginBottom: '1rem',
               fontWeight: 600
             }}
          >
            <Plus size={18} /> New Session
          </button>
        
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {sessions.map(ss => (
              <button 
                key={ss.id}
                onClick={() => loadSession(ss.id)}
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  backgroundColor: ss.id === activeSessionId ? 'rgba(201, 168, 76, 0.1)' : 'transparent',
                  border: ss.id === activeSessionId ? '1px solid rgba(201, 168, 76, 0.3)' : '1px solid transparent',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  color: ss.id === activeSessionId ? 'var(--color-primary)' : 'rgba(44,44,44,0.7)'
                }}
                onMouseEnter={(e) => {
                 if(ss.id !== activeSessionId) e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.02)'
                }}
                onMouseLeave={(e) => {
                 if(ss.id !== activeSessionId) e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <div style={{ marginTop: '0.2rem' }}>
                  <MessageSquare size={16} />
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                    {new Date(ss.created_at).toLocaleDateString()}
                  </div>
                  <div style={{ fontSize: '0.9rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {ss.title}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-card)',
        position: 'relative'
      }}>
        
        {/* Toggle Sidebar Button (if closed) */}
        {!sidebarOpen && (
          <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 10 }}>
            <button onClick={() => setSidebarOpen(true)} style={{ 
              background: 'white', 
              boxShadow: 'var(--shadow-md)', 
              borderRadius: '8px', 
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)'
            }}>
              <Menu size={20} />
            </button>
          </div>
        )}

        {/* Messages List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {messages.length === 0 && (
            <div style={{
              alignSelf: 'flex-start',
              maxWidth: '85%',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem'
            }}>
              <div style={{
                backgroundColor: 'var(--color-bg)',
                color: 'var(--color-text)',
                padding: '1.25rem 1.75rem',
                borderRadius: '16px',
                borderTopLeftRadius: '4px',
                boxShadow: 'var(--shadow-sm)',
                lineHeight: '1.6',
                fontSize: '1.05rem',
              }}>
                {showPicker ? (
                  <>
                    <div style={{ whiteSpace: 'pre-wrap', marginBottom: '1.25rem' }}>
                      Namaste! 🙏 I'm Nyaya, your free legal aid assistant.{"\n"}
                      I'm here to help you understand your legal rights in India.{"\n\n"}
                      Please select your preferred language to get started:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                      {languageOptions.map(lang => (
                        <button 
                          key={lang}
                          onClick={() => handleLanguageSelect(lang)}
                          className="btn-outline"
                          style={{ padding: '0.4rem 1rem', fontSize: '0.9rem', borderRadius: '50px' }}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ whiteSpace: 'pre-wrap' }}>
                      Welcome back! 🙏 I'm Nyaya. How can I help you today?
                    </div>
                    <button 
                      onClick={() => setShowPicker(true)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: 'var(--color-accent)', 
                        fontSize: '0.85rem', 
                        marginTop: '0.5rem', 
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        padding: 0,
                        fontFamily: 'var(--font-body)'
                      }}
                    >
                      Change language
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {confirmationMsg && messages.length === 0 && (
             <div className="animate-fade-in-up" style={{
               alignSelf: 'flex-start',
               maxWidth: '75%',
               display: 'flex',
               alignItems: 'flex-start',
               gap: '1rem'
             }}>
               <div style={{
                 backgroundColor: 'var(--color-bg)',
                 color: 'var(--color-text)',
                 padding: '1.25rem 1.5rem',
                 borderRadius: '16px',
                 borderTopLeftRadius: '4px',
                 boxShadow: 'var(--shadow-sm)',
                 lineHeight: '1.6',
                 fontSize: '1.05rem',
                 whiteSpace: 'pre-wrap'
               }}>
                 {confirmationMsg.content}
               </div>
             </div>
          )}
          
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div key={msg.id || idx} style={{
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '75%',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                flexDirection: isUser ? 'row-reverse' : 'row'
              }}>
                <div style={{
                  backgroundColor: isUser ? 'var(--color-primary)' : 'var(--color-bg)',
                  color: isUser ? 'white' : 'var(--color-text)',
                  padding: '1.25rem 1.5rem',
                  borderRadius: '16px',
                  borderTopRightRadius: isUser ? '4px' : '16px',
                  borderTopLeftRadius: isUser ? '16px' : '4px',
                  boxShadow: 'var(--shadow-sm)',
                  lineHeight: '1.6',
                  fontSize: '1.05rem',
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.content}
                </div>
              </div>
            );
          })}
          
          {/* Typing Indicator */}
          {typing && (
            <div style={{
              alignSelf: 'flex-start',
              backgroundColor: 'var(--color-bg)',
              padding: '1rem 1.5rem',
              borderRadius: '16px',
              borderTopLeftRadius: '4px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center'
            }}>
              <span className="dot-typing" style={{ width: '8px', height: '8px', backgroundColor: 'var(--color-accent)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both' }}></span>
              <span className="dot-typing" style={{ width: '8px', height: '8px', backgroundColor: 'var(--color-accent)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.2s' }}></span>
              <span className="dot-typing" style={{ width: '8px', height: '8px', backgroundColor: 'var(--color-accent)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.4s' }}></span>
              
              {/* Add keyframes inline for just this component */}
              <style>{`
                @keyframes bounce {
                  0%, 80%, 100% { transform: scale(0); }
                  40% { transform: scale(1); }
                }
              `}</style>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ 
          padding: '1.5rem 2rem', 
          borderTop: '1px solid rgba(0,0,0,0.05)',
          backgroundColor: 'white'
        }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={showPicker ? "Please select a language first..." : "Describe your legal issue here..."}
              disabled={showPicker}
              style={{
                flex: 1,
                padding: '1rem 1.5rem',
                borderRadius: '50px',
                border: '1px solid rgba(0,0,0,0.1)',
                backgroundColor: showPicker ? '#eee' : 'var(--color-bg)',
                fontSize: '1.05rem',
                outline: 'none',
                fontFamily: 'var(--font-body)',
                transition: 'border-color 0.2s',
                opacity: showPicker ? 0.6 : 1
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-accent)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || typing || showPicker}
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '56px',
                height: '56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: input.trim() && !typing && !showPicker ? 'pointer' : 'default',
                opacity: input.trim() && !typing && !showPicker ? 1 : 0.6,
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { if(input.trim() && !typing && !showPicker) e.currentTarget.style.transform = 'scale(1.05)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
            >
              <Send size={24} style={{ marginLeft: '4px' }} /> {/* Optically center the paper plane */}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.85rem', color: 'rgba(0,0,0,0.5)' }}>
            Nyaya can make mistakes. Consider consulting a professional.
          </div>
        </div>
      </div>

    </div>
  );
}
