import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Trash2,
  Copy,
  Check,
  Bot,
  Terminal,
  Cpu,
  FileText,
  Sparkles,
  Zap,
} from 'lucide-react';
import { api } from '../../lib/apiClient';
import { playTactileClick, playNotificationChime } from '../../lib/soundEngine';
import styles from './AIAssistantApp.module.css';

const DEFAULT_WELCOME = {
  id: 'welcome-1',
  role: 'assistant',
  content: `( · ) **GLYPH AI SYSTEM READY**\n\nI am your native OS intelligence layer. You can ask me to:\n- **Diagnose** hardware telemetry & window layout\n- **Write & format** clean code\n- **Summarize & organize** your notes\n- **Explain** Nothing design principles & keyboard shortcuts\n\nHow can I assist your workflow today?`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

const SUGGESTIONS = [
  { icon: Cpu, label: '[SYS] Hardware Diagnostics', prompt: 'Run a system diagnostic on this machine and explain my hardware telemetry.' },
  { icon: FileText, label: '[NOTE] Summarize Manifesto', prompt: 'Summarize the Nothing Design Manifesto into 4 key takeaways.' },
  { icon: Zap, label: '[CODE] React Hook', prompt: 'Write a lightweight React custom hook to detect window resize events.' },
  { icon: Terminal, label: '[KEYS] OS Shortcuts', prompt: 'List all global keyboard shortcuts for Glyph OS.' },
];

// Clean Markdown Formatter
function MarkdownContent({ content }) {
  const lines = content.split('\n');

  return (
    <div>
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (trimmed.startsWith('### ')) {
          return <h3 key={idx}>{trimmed.slice(4)}</h3>;
        }
        if (trimmed.startsWith('## ')) {
          return <h2 key={idx}>{trimmed.slice(3)}</h2>;
        }
        if (trimmed.startsWith('# ')) {
          return <h1 key={idx}>{trimmed.slice(2)}</h1>;
        }
        if (trimmed.startsWith('> ')) {
          return <blockquote key={idx}>{trimmed.slice(2)}</blockquote>;
        }
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <ul key={idx} style={{ margin: '2px 0' }}>
              <li>{renderFormattedText(trimmed.slice(2))}</li>
            </ul>
          );
        }
        if (/^\d+\.\s/.test(trimmed)) {
          return (
            <ol key={idx} style={{ margin: '2px 0' }}>
              <li>{renderFormattedText(trimmed.replace(/^\d+\.\s/, ''))}</li>
            </ol>
          );
        }
        if (trimmed.startsWith('```')) {
          return null; // Multi-line code handling can be simplified or styled
        }
        if (!trimmed) {
          return <div key={idx} style={{ height: '6px' }} />;
        }

        return <p key={idx}>{renderFormattedText(line)}</p>;
      })}
    </div>
  );
}

function renderFormattedText(text) {
  // Support **bold** and `code`
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

export default function AIAssistantApp() {
  const [messages, setMessages] = useState([DEFAULT_WELCOME]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [activeModel, setActiveModel] = useState('GEMINI 2.5');

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const idCounterRef = useRef(100);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async (customPrompt) => {
    const textToSend = (customPrompt || input).trim();
    if (!textToSend || isLoading) return;

    playTactileClick();

    idCounterRef.current += 1;
    const currentId = idCounterRef.current;

    const userMsg = {
      id: `user-${currentId}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history for context
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await api.ai.chat(textToSend, historyPayload);

      playNotificationChime();

      if (res && res.model) {
        setActiveModel(res.model.toUpperCase());
      }

      idCounterRef.current += 1;
      const assistantMsg = {
        id: `ai-${idCounterRef.current}`,
        role: 'assistant',
        content: res.reply || '( · ) No output generated.',
        model: res.model || 'GEMINI',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.warn('[GLYPH AI] Backend call failed, using intelligent offline fallback', err);

      // Intelligent local fallback if backend server isn't running
      const fallbackReply = `( · ) **GLYPH OFFLINE CORE**\n\n> Received: "${textToSend}"\n\nThe backend server is currently offline or unreachable at \`http://localhost:5000\`. Once you start the backend (\`npm run dev\` in \`backend/\`), live Google Gemini reasoning will activate automatically!\n\n**Quick Tips:**\n- Press \`Ctrl+K\` to launch Spotlight search\n- Use \`Alt+Left/Right\` to tile windows\n- Launch Notes to edit your manifesto`;

      idCounterRef.current += 1;
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${idCounterRef.current}`,
          role: 'assistant',
          content: fallbackReply,
          model: 'OFFLINE_CORE',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    playTactileClick();
    if (window.confirm('Clear all conversation history?')) {
      setMessages([DEFAULT_WELCOME]);
      api.ai.clearHistory().catch(() => {});
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.glyphStatusDot} />
          <span className={styles.title}>( · ) GLYPH AI</span>
          <span className={styles.modelBadge}>{activeModel}</span>
        </div>
        <div className={styles.headerActions}>
          <button
            className={`${styles.iconBtn} ${styles.clearBtn}`}
            onClick={handleClear}
            title="Clear Chat History"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Suggestion Chips */}
      <div className={styles.suggestionsBar}>
        {SUGGESTIONS.map((s, idx) => {
          const Icon = s.icon;
          return (
            <button
              key={idx}
              className={styles.suggestionChip}
              onClick={() => handleSend(s.prompt)}
              disabled={isLoading}
            >
              <Icon size={11} color="#FF3B30" />
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Messages Scroll Area */}
      <div className={styles.messagesList}>
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`${styles.messageRow} ${isUser ? styles.user : styles.assistant}`}
            >
              <div className={styles.senderMeta}>
                {isUser ? <span>USER</span> : <Sparkles size={10} color="#FF3B30" />}
                <span>{msg.timestamp}</span>
              </div>

              <div className={styles.bubble}>
                <MarkdownContent content={msg.content} />

                {!isUser && (
                  <div className={styles.bubbleActions}>
                    <button
                      className={styles.copyBtn}
                      onClick={() => handleCopy(msg.id, msg.content)}
                    >
                      {copiedId === msg.id ? <Check size={10} color="#4ADE80" /> : <Copy size={10} />}
                      <span>{copiedId === msg.id ? 'COPIED' : 'COPY'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className={styles.typingContainer}>
            <Bot size={13} color="#FF3B30" />
            <span>GLYPH AI IS THINKING</span>
            <div className={styles.dotPulse}>
              <span />
              <span />
              <span />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form
        className={styles.inputForm}
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <div className={styles.inputWrapper}>
          <span className={styles.terminalPrefix}>&gt;</span>
          <input
            ref={inputRef}
            type="text"
            className={styles.inputField}
            placeholder="Ask Glyph AI anything (code, notes, system)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          className={styles.sendBtn}
          disabled={!input.trim() || isLoading}
        >
          <Send size={12} />
          <span>SEND</span>
        </button>
      </form>
    </div>
  );
}
