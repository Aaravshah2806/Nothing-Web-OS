import React, { useState, useRef, useEffect } from 'react';
import { useDesktopStore } from '../../store/useDesktopStore';
import { useWindowStore } from '../../store/useWindowStore';
import { APP_REGISTRY } from '../appRegistry';
import { api } from '../../lib/apiClient';
import styles from './TerminalApp.module.css';

const ASCII_LOGO = `
   ▄██████▄   ██      ██   ▄██████▄  ██    ██
  ██▀      ▀  ██      ██  ██▀      ▀ ██    ██
  ██   ▄▄▄▄▄  ██      ██  ██   ▄▄▄▄▄ ████████
  ██      ██  ██      ██  ██      ██ ██    ██
   ▀███████▀  ███████ ██   ▀███████▀ ██    ██
  (1) NOTHING-INSPIRED WEB DESKTOP OS
`;

const INITIAL_LOGS = [
  'GLYPH OS (1) [Kernel 6.1.0-glyph-amd64]',
  'Type "help" to view available system commands or "glyphfetch" for telemetry.',
  '',
];

export default function TerminalApp() {
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [matrixActive, setMatrixActive] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const { theme, setTheme, accentColor, setAccentColor, wallpaper, setWallpaper } = useDesktopStore();
  const openApp = useWindowStore((state) => state.openApp);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCommand = (rawCmd) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) {
      setLogs((prev) => [...prev, `root@glyph-os:~$ `]);
      return;
    }

    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    const newLogs = [...logs, `root@glyph-os:~$ ${trimmed}`];

    switch (cmd) {
      case 'help':
        newLogs.push(
          'AVAILABLE SYSTEM COMMANDS:',
          '  ai <prompt>           - Query native Glyph AI intelligence layer',
          '  glyphfetch / neofetch - Display system hardware & OS telemetry',
          '  matrix                - Toggle dot-matrix falling rain screen',
          '  open <app>            - Launch app (ai, glyph, notes, pomodoro, music, recorder, devtools, files, calc, settings)',
          '  theme <dark|light>    - Change desktop color scheme',
          '  accent <hex>          - Change accent signal color',
          '  wallpaper <name>      - Change wallpaper (dot-grid, glyph-lines, minimal-gradient)',
          '  calc <expr>           - Evaluate arithmetic expression',
          '  ls                    - List virtual directory contents',
          '  cat <file>            - View file contents',
          '  date                  - Print current system timestamp',
          '  whoami                - Print current user session',
          '  clear                 - Clear console window'
        );
        break;

      case 'ai':
        if (!args.length) {
          newLogs.push('Usage: ai <question or prompt to Glyph AI>');
        } else {
          const userQuery = args.join(' ');
          newLogs.push(`( · ) Querying Glyph AI: "${userQuery}"...`);
          setLogs([...newLogs]);
          api.ai
            .chat(userQuery)
            .then((res) => {
              setLogs((prev) => [
                ...prev,
                `[GLYPH AI / ${res.model || 'GEMINI'}]:`,
                res.reply || '( · ) No response generated.',
              ]);
            })
            .catch(() => {
              setLogs((prev) => [
                ...prev,
                `[GLYPH AI OFFLINE]: Backend server offline. Start backend to query live Gemini AI.`,
              ]);
            });
          return;
        }
        break;

      case 'glyphfetch':
      case 'neofetch':
        newLogs.push(
          ASCII_LOGO,
          'OS:         GLYPH OS (1) 64-bit Web Workstation',
          'KERNEL:     Vite 8.3.0 / React 19.x Engine',
          'SHELL:      glyph-sh 1.0.4',
          'THEME:      ' + theme.toUpperCase() + ' (Accent: ' + accentColor + ')',
          'WALLPAPER:  ' + wallpaper,
          'DISPLAY:    ' + window.innerWidth + 'x' + window.innerHeight + ' (8px Grid Discipline)',
          'MEMORY:     3.8 GiB / 8.0 GiB (48%)'
        );
        break;

      case 'matrix':
        setMatrixActive(true);
        setTimeout(() => setMatrixActive(false), 5000);
        newLogs.push('INITIALIZING GLYPH MATRIX STREAM (5s)...');
        break;

      case 'clear':
        setLogs([]);
        return;

      case 'open':
        if (!args[0]) {
          newLogs.push('Usage: open <glyph|notes|pomodoro|music|recorder|devtools|files|calc|settings>');
        } else {
          const target = args[0].toLowerCase();
          const app =
            APP_REGISTRY[target] ||
            (target === 'calc' ? APP_REGISTRY.calculator : null) ||
            (target === 'timer' ? APP_REGISTRY.pomodoro : null) ||
            (target === 'memo' ? APP_REGISTRY.recorder : null) ||
            (target === 'tools' ? APP_REGISTRY.devtools : null);
          if (app) {
            openApp(app);
            newLogs.push(`Launched application [${app.name}].`);
          } else {
            newLogs.push(`App not found: ${args[0]}`);
          }
        }
        break;

      case 'theme':
        if (args[0] === 'dark' || args[0] === 'light') {
          setTheme(args[0]);
          newLogs.push(`Theme switched to ${args[0].toUpperCase()}.`);
        } else {
          newLogs.push('Usage: theme <dark|light>');
        }
        break;

      case 'accent':
        if (args[0]) {
          setAccentColor(args[0]);
          newLogs.push(`Accent color updated to ${args[0]}.`);
        } else {
          newLogs.push('Usage: accent <#hexColor>');
        }
        break;

      case 'wallpaper':
        if (['dot-grid', 'glyph-lines', 'minimal-gradient'].includes(args[0])) {
          setWallpaper(args[0]);
          newLogs.push(`Wallpaper set to ${args[0]}.`);
        } else {
          newLogs.push('Usage: wallpaper <dot-grid|glyph-lines|minimal-gradient>');
        }
        break;

      case 'calc':
        try {
          const expr = args.join(' ');
          // Safe evaluation of basic math
          const sanitized = expr.replace(/[^0-9+\-*/().\s]/g, '');
          const res = Function(`'use strict'; return (${sanitized})`)();
          newLogs.push(`= ${res}`);
        } catch {
          newLogs.push('Error: Invalid mathematical expression');
        }
        break;

      case 'ls':
        newLogs.push(
          'drwxr-xr-x  2 root root 4096 Desktop/',
          'drwxr-xr-x  4 root root 4096 Documents/',
          '-rw-r--r--  1 root root  420 README.md',
          '-rw-r--r--  1 root root 1024 glyph_spec.json'
        );
        break;

      case 'cat':
        if (args[0] === 'README.md') {
          newLogs.push(
            '# GLYPH OS (1)',
            'An original web desktop operating system borrowing Nothing OS design language.',
            'Built with React, Vite, Zustand, and strict 8px grid discipline.'
          );
        } else {
          newLogs.push(`cat: ${args[0] || ''}: No such file or directory`);
        }
        break;

      case 'whoami':
        newLogs.push('root (Glyph Administrator)');
        break;

      case 'date':
        newLogs.push(new Date().toString());
        break;

      default:
        newLogs.push(`Command not recognized: "${cmd}". Type "help" for command list.`);
    }

    setLogs(newLogs);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
      setInputVal('');
    } else if (e.key === 'ArrowUp') {
      if (history.length > 0) {
        const nextIdx = historyIndex + 1 < history.length ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIdx);
        setInputVal(history[history.length - 1 - nextIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(history[history.length - 1 - nextIdx] || '');
      } else {
        setHistoryIndex(-1);
        setInputVal('');
      }
    }
  };

  return (
    <div className={styles.terminalContainer} onClick={() => inputRef.current?.focus()}>
      {matrixActive && <div className={styles.matrixOverlay}>GLYPH_STREAM_ACTIVE</div>}

      <div className={styles.outputArea}>
        {logs.map((line, idx) => (
          <div key={idx} className={styles.logLine}>
            {line}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className={styles.promptRow}>
        <span className={styles.promptLabel}>root@glyph-os:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.inputField}
          autoFocus
          spellCheck="false"
        />
      </div>
    </div>
  );
}
