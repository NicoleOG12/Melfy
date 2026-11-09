import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown'; // <-- Importe aqui

export default function FloatingChat({ apiEndpoint }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Olá! Sou o assistente virtual da Melfy. Como posso te ajudar hoje? 🍫' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef(null);

    // Auto-scroll para a última mensagem
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
        setLoading(true);

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pergunta: userMessage }) // Ajuste a chave conforme o seu body do backend
            });

            const data = await response.json();

            // Ajuste 'data.resposta' caso o seu backend retorne com outro nome (ex: data.message, data.text)
            const botResponse = data.resposta || data.message || 'Desculpe, não consegui processar sua resposta.';

            setMessages((prev) => [...prev, { role: 'assistant', text: botResponse }]);
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            setMessages((prev) => [...prev, { role: 'assistant', text: '⚠️ Erro de conexão com o servidor.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50" style={{ fontFamily: 'var(--font-principal)' }}>
            {/* Janela do Chat */}
            {isOpen && (
                <div
                    className="w-80 sm:w-96 h-[500px] flex flex-col overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-5"
                    style={{
                        background: 'var(--surface-1)',
                        borderRadius: '20px',
                        border: '2px solid var(--border)',
                        boxShadow: '0 12px 35px rgba(74, 32, 20, 0.18)',
                    }}
                >
                    {/* Header */}
                    <div
                        className="px-4 py-3 flex items-center justify-between"
                        style={{
                            background: 'linear-gradient(135deg, var(--brown), var(--brown-light))',
                            borderBottom: '2px solid var(--yellow)',
                        }}
                    >
                        <div className="flex items-center gap-2">
                            <div className="relative w-9 h-9 shrink-0">
                                <div
                                    className="w-9 h-9 rounded-full overflow-hidden"
                                    style={{ background: 'var(--yellow)', border: '2px solid var(--yellow)' }}
                                >
                                    <img
                                        src="/assents/img/Geral/Abelha Cliente.png"
                                        alt="Mel, assistente da Melfy"
                                        className="w-full h-full object-cover"
                                        style={{ transform: 'scale(2.4)', transformOrigin: '50% 38%' }}
                                    />
                                </div>
                                <span
                                    className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full animate-pulse"
                                    style={{ background: 'var(--green-light)', border: '1.5px solid var(--brown)' }}
                                ></span>
                            </div>
                            <span className="text-sm font-bold" style={{ color: 'var(--header-text)', fontFamily: 'var(--font-principal)' }}>
                                Mel - Assistente Melfy
                            </span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="transition-opacity hover:opacity-70 p-1 rounded-full"
                            style={{ color: 'var(--yellow-mid)' }}
                        >
                            ✕
                        </button>
                    </div>

                    {/* Lista de Mensagens */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3" style={{ background: 'var(--surface-2)' }}>
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className="max-w-[80%] px-4 py-2.5 text-sm leading-relaxed"
                                    style={msg.role === 'user'
                                        ? {
                                            background: 'linear-gradient(135deg, var(--brown-light), var(--brown))',
                                            color: 'var(--header-text)',
                                            borderRadius: '18px 18px 4px 18px',
                                            boxShadow: '0 2px 8px rgba(74, 32, 20, 0.2)',
                                            fontFamily: 'var(--font-principal)',
                                        }
                                        : {
                                            background: 'var(--surface-0)',
                                            color: 'var(--brown-light)',
                                            border: '1.5px solid var(--border-light)',
                                            borderRadius: '18px 18px 18px 4px',
                                            boxShadow: '0 2px 8px rgba(74, 32, 20, 0.08)',
                                            fontFamily: 'var(--font-principal)',
                                        }
                                    }
                                >
                                 
                                       <ReactMarkdown>{msg.text}</ReactMarkdown>
           
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div
                                    className="px-4 py-3 flex items-center gap-1.5"
                                    style={{
                                        background: 'var(--surface-0)',
                                        border: '1.5px solid var(--border-light)',
                                        borderRadius: '18px 18px 18px 4px',
                                        boxShadow: '0 2px 8px rgba(74, 32, 20, 0.08)',
                                    }}
                                >
                                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--yellow-mid)' }}></div>
                                    <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:0.2s]" style={{ background: 'var(--yellow-mid)' }}></div>
                                    <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:0.4s]" style={{ background: 'var(--yellow-mid)' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input de Envio */}
                    <form
                        onSubmit={handleSubmit}
                        className="p-3 flex items-center gap-2"
                        style={{
                            background: 'var(--surface-1)',
                            borderTop: '1.5px solid var(--border-light)',
                        }}
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Digite sua dúvida..."
                            className="flex-1 text-sm focus:outline-none"
                            style={{
                                background: 'var(--surface-0)',
                                color: 'var(--brown-light)',
                                border: '1.5px solid var(--border)',
                                borderRadius: '12px',
                                padding: '8px 14px',
                                fontFamily: 'var(--font-principal)',
                                transition: 'border-color 0.2s, box-shadow 0.2s',
                            }}
                            onFocus={e => {
                                e.target.style.borderColor = 'var(--yellow-mid)';
                                e.target.style.boxShadow = '0 0 0 3px rgba(255, 196, 61, 0.2)';
                            }}
                            onBlur={e => {
                                e.target.style.borderColor = 'var(--border)';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="flex items-center justify-center text-sm font-bold transition-all active:scale-95"
                            style={{
                                background: 'linear-gradient(180deg, var(--yellow), var(--yellow-mid))',
                                color: 'var(--brown-light)',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '8px 14px',
                                fontFamily: 'var(--font-principal)',
                                boxShadow: '0 3px 0 var(--yellow-dark)',
                                opacity: (loading || !input.trim()) ? 0.5 : 1,
                                cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer',
                            }}
                        >
                            ➤
                        </button>
                    </form>

                </div>
            )}

            {/* Botão Flutuante (Launcher) - escondido com o chat aberto; o fechamento é pelo X do cabeçalho */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 focus:outline-none"
                    aria-label="Abrir Chat"
                    style={{
                        background: 'linear-gradient(180deg, var(--yellow), var(--yellow-mid))',
                        color: 'var(--brown-light)',
                        boxShadow: '0 4px 0 var(--yellow-dark), 0 6px 16px rgba(74, 32, 20, 0.25)',
                        border: '2px solid var(--yellow-dark)',
                    }}
                >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                    </svg>
                </button>
            )}
        </div>
    );
}
