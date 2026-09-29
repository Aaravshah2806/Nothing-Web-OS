import { GoogleGenAI } from '@google/genai';
import { supabase } from '../config/supabase.js';
import dotenv from 'dotenv';
dotenv.config();

const SYSTEM_INSTRUCTION = `You are GLYPH AI (v1.0), the native system intelligence of Glyph OS — a web operating system inspired by Nothing Technology's industrial aesthetic (dot-matrix typography, monochrome surfaces, red signal accents, transparent hardware layering, and strict 8px grid discipline).

Your Core Attributes:
- Utilitarian, precise, sharp, minimal, and technically deep.
- Avoid pleasantries, fluff, or boilerplate apologies ("Certainly!", "I'd be happy to help", "As an AI...").
- Format answers cleanly with markdown (headings, bullet points, concise codeblocks).
- When asked about system architecture: You know Glyph OS is built with React 19, Vite, Zustand, Express.js, and Supabase.
- You know all built-in apps: Notes, Glyph Lab, Focus Timer, Voice Recorder, Music Player, Terminal, Dev Tools, Calculator, Gallery, File Manager.
- You know shortcuts: Ctrl/Cmd+K (Spotlight), Alt+Arrows (Window tiling), Alt+Tab (Switcher).
- Signature sign-off or prompt style: ( · ) GLYPH OS / READY.`;

// In-memory fallback conversation cache for guest sessions
const guestConversations = new Map();

/**
 * Handle AI chat interaction
 */
export const chatWithAI = async (req, res) => {
  const { message, history = [] } = req.body;
  const user = req.user;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message cannot be empty.' });
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  const openaiApiKey = process.env.OPENAI_API_KEY;

  // 1. If Gemini API key is available
  if (geminiApiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey: geminiApiKey });

      // Format previous conversation history for Gemini
      const contents = [];
      for (const msg of history.slice(-8)) {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        });
      }
      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      });

      const replyText = response.text || '( · ) No output generated.';

      // Persist in Supabase if user is logged in
      if (user && supabase && user.id !== 'guest-user') {
        try {
          await supabase.from('ai_messages').insert([
            { user_id: user.id, role: 'user', content: message },
            { user_id: user.id, role: 'assistant', content: replyText },
          ]);
        } catch (dbErr) {
          console.warn('[GLYPH AI] Supabase message log error:', dbErr.message);
        }
      }

      return res.json({
        reply: replyText,
        model: 'gemini-2.5-flash',
        provider: 'Google Gemini',
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error('[GLYPH AI] Gemini API error:', err);
      // Continue to OpenAI or fallback simulator
    }
  }

  // 2. If OpenAI API key is available
  if (openaiApiKey) {
    try {
      const messages = [
        { role: 'system', content: SYSTEM_INSTRUCTION },
        ...history.slice(-8).map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: message },
      ];

      const oaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (oaiRes.ok) {
        const oaiData = await oaiRes.json();
        const replyText = oaiData.choices?.[0]?.message?.content || '( · ) No reply from OpenAI.';

        if (user && supabase && user.id !== 'guest-user') {
          await supabase.from('ai_messages').insert([
            { user_id: user.id, role: 'user', content: message },
            { user_id: user.id, role: 'assistant', content: replyText },
          ]);
        }

        return res.json({
          reply: replyText,
          model: 'gpt-4o-mini',
          provider: 'OpenAI',
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error('[GLYPH AI] OpenAI API error:', err);
    }
  }

  // 3. Fallback Smart Glyph Simulator (When no API keys are yet configured)
  const simulatedReply = generateSimulatedReply(message);
  return res.json({
    reply: simulatedReply,
    model: 'glyph-neural-v1 (simulated)',
    provider: 'Glyph OS Offline Core',
    notice: 'To connect live models, set GEMINI_API_KEY in backend/.env',
    timestamp: new Date().toISOString(),
  });
};

/**
 * Fetch chat history for logged-in user
 */
export const getChatHistory = async (req, res) => {
  const user = req.user;
  if (!user || user.id === 'guest-user' || !supabase) {
    return res.json({ messages: guestConversations.get('guest') || [] });
  }

  try {
    const { data, error } = await supabase
      .from('ai_messages')
      .select('id, role, content, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(50);

    if (error) throw error;
    return res.json({ messages: data || [] });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve AI chat history', details: err.message });
  }
};

/**
 * Clear chat history
 */
export const clearChatHistory = async (req, res) => {
  const user = req.user;
  if (user && supabase && user.id !== 'guest-user') {
    try {
      await supabase.from('ai_messages').delete().eq('user_id', user.id);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to clear history', details: err.message });
    }
  } else {
    guestConversations.set('guest', []);
  }

  return res.json({ success: true, message: 'Chat history cleared.' });
};

/**
 * Procedural offline responses for testing before API key is plugged in
 */
function generateSimulatedReply(input) {
  const q = input.toLowerCase().trim();

  if (q.includes('hello') || q.includes('hi') || q.includes('who are you')) {
    return `( · ) **GLYPH AI INITIALIZED**\n\nI am your system intelligence layer for Glyph OS. I can assist with:\n- System diagnostics and window control\n- Code formatting and debugging\n- Markdown note synthesis\n- Hardware sound engine tuning\n\n> *Notice:* Live LLM reasoning requires adding \`GEMINI_API_KEY\` to \`backend/.env\`.`;
  }

  if (q.includes('spec') || q.includes('system') || q.includes('hardware') || q.includes('telemetry')) {
    return `### ( · ) SYSTEM DIAGNOSTIC REPORT\n\n- **OS Kernel:** Glyph Web OS (Laptop Edition)\n- **Render Engine:** React 19 + Vite 8\n- **Window Manager:** 8-Directional Aero Snap (Alt+Left/Right)\n- **Sound Synthesis:** Procedural Web Audio API\n- **Status:** Nominal (All systems responsive)`;
  }

  if (q.includes('shortcut') || q.includes('keys')) {
    return `### ( · ) KEYBOARD SHORTCUTS\n\n| Shortcut | Function |\n|---|---|\n| \`Cmd/Ctrl + K\` | Spotlight Search |\n| \`Alt + Left/Right\` | 50% Window Aero Snap |\n| \`Alt + Up/Down\` | Maximize / Minimize |\n| \`Alt + Tab\` | Task Switcher Overlay |\n| \`Escape\` | Dismiss Modals |`;
  }

  return `( · ) **GLYPH CORE QUERY RECEIVED**\n\n> "${input}"\n\nI am running in local simulation mode. To enable full reasoning, open \`backend/.env\` and insert:\n\`\`\`env\nGEMINI_API_KEY=your_google_gemini_api_key\n\`\`\`\n\nOnce added, I will provide full natural language synthesis, code execution analysis, and multi-turn conversational intelligence.`;
}
