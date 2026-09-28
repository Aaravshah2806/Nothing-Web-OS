import React, { useState } from 'react';
import {
  Code,
  FileJson,
  CaseSensitive,
  Copy,
  Check,
  ArrowRightLeft,
  Hash,
} from 'lucide-react';
import { playMechanicalClick, playTactileClick } from '../../lib/soundEngine';
import styles from './DevToolsApp.module.css';

export default function DevToolsApp() {
  const [activeTab, setActiveTab] = useState('json');
  const [copiedKey, setCopiedKey] = useState(null);

  // JSON Tool state
  const [jsonInput, setJsonInput] = useState('{\n  "os": "Glyph OS (1)",\n  "version": "1.0.0",\n  "status": "online"\n}');
  const [jsonOutput, setJsonOutput] = useState('');
  const [jsonError, setJsonError] = useState(null);

  // Base64 Tool state
  const [b64Input, setB64Input] = useState('Hello Glyph OS');
  const [b64Output, setB64Output] = useState('');

  // Hash state
  const [hashInput, setHashInput] = useState('nothing-os-matrix');
  const [hashOutput, setHashOutput] = useState('');

  // Case Converter state
  const [caseInput, setCaseInput] = useState('nothing glyph web desktop os');

  // Copy helper
  const copyToClipboard = (text, key) => {
    playTactileClick();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  // JSON Actions
  const handleFormatJson = () => {
    playMechanicalClick();
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed, null, 2));
      setJsonError(null);
    } catch (e) {
      setJsonError(e.message);
    }
  };

  const handleMinifyJson = () => {
    playMechanicalClick();
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed));
      setJsonError(null);
    } catch (e) {
      setJsonError(e.message);
    }
  };

  // Base64 Actions
  const handleEncodeB64 = () => {
    playMechanicalClick();
    try {
      setB64Output(btoa(b64Input));
    } catch {
      setB64Output('Encoding Error: Invalid character sequence');
    }
  };

  const handleDecodeB64 = () => {
    playMechanicalClick();
    try {
      setB64Output(atob(b64Input));
    } catch {
      setB64Output('Decoding Error: Malformed Base64 string');
    }
  };

  // Hash Action
  const handleGenerateHash = async () => {
    playMechanicalClick();
    try {
      const msgBuffer = new TextEncoder().encode(hashInput);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      setHashOutput(hashHex);
    } catch (_e) {
      setHashOutput('Hash error');
    }
  };

  // UUID generator
  const [generatedUuid, setGeneratedUuid] = useState(crypto.randomUUID ? crypto.randomUUID() : '8f9e2b10-glyph-4a55-88f1');
  const handleNewUuid = () => {
    playMechanicalClick();
    setGeneratedUuid(crypto.randomUUID ? crypto.randomUUID() : 'uuid-' + Math.random().toString(36).slice(2));
  };

  return (
    <div className={styles.container}>
      {/* Sidebar Navigation */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarTitle}>DEV TOOLS</div>
        <button
          onClick={() => setActiveTab('json')}
          className={`${styles.tabBtn} ${activeTab === 'json' ? styles.activeTab : ''}`}
        >
          <FileJson size={15} />
          <span>JSON FORMATTER</span>
        </button>
        <button
          onClick={() => setActiveTab('base64')}
          className={`${styles.tabBtn} ${activeTab === 'base64' ? styles.activeTab : ''}`}
        >
          <ArrowRightLeft size={15} />
          <span>BASE64 CONVERT</span>
        </button>
        <button
          onClick={() => setActiveTab('hash')}
          className={`${styles.tabBtn} ${activeTab === 'hash' ? styles.activeTab : ''}`}
        >
          <Hash size={15} />
          <span>SHA-256 HASH</span>
        </button>
        <button
          onClick={() => setActiveTab('case')}
          className={`${styles.tabBtn} ${activeTab === 'case' ? styles.activeTab : ''}`}
        >
          <CaseSensitive size={15} />
          <span>CASE CONVERTER</span>
        </button>
      </div>

      {/* Main Studio Area */}
      <div className={styles.workspace}>
        {activeTab === 'json' && (
          <div className={styles.toolPane}>
            <div className={styles.toolbar}>
              <button onClick={handleFormatJson} className={styles.actionBtn}>
                <span>PRETTIFY (2 SPACES)</span>
              </button>
              <button onClick={handleMinifyJson} className={styles.actionBtn}>
                <span>MINIFY JSON</span>
              </button>
              {jsonOutput && (
                <button
                  onClick={() => copyToClipboard(jsonOutput, 'json')}
                  className={styles.copyBtn}
                >
                  {copiedKey === 'json' ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedKey === 'json' ? 'COPIED' : 'COPY OUTPUT'}</span>
                </button>
              )}
            </div>

            <div className={styles.splitEditor}>
              <div className={styles.editorCol}>
                <div className={styles.colHeader}>INPUT JSON</div>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className={styles.textarea}
                  spellCheck="false"
                />
              </div>
              <div className={styles.editorCol}>
                <div className={styles.colHeader}>
                  <span>RESULT</span>
                  {jsonError && <span className={styles.errorText}>SYNTAX ERROR</span>}
                </div>
                <textarea
                  value={jsonError || jsonOutput}
                  readOnly
                  className={`${styles.textarea} ${jsonError ? styles.textareaError : ''}`}
                  placeholder="Click Prettify or Minify to format..."
                  spellCheck="false"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'base64' && (
          <div className={styles.toolPane}>
            <div className={styles.toolbar}>
              <button onClick={handleEncodeB64} className={styles.actionBtn}>
                <span>ENCODE TEXT → BASE64</span>
              </button>
              <button onClick={handleDecodeB64} className={styles.actionBtn}>
                <span>DECODE BASE64 → TEXT</span>
              </button>
              {b64Output && (
                <button onClick={() => copyToClipboard(b64Output, 'b64')} className={styles.copyBtn}>
                  {copiedKey === 'b64' ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedKey === 'b64' ? 'COPIED' : 'COPY RESULT'}</span>
                </button>
              )}
            </div>

            <div className={styles.splitEditor}>
              <div className={styles.editorCol}>
                <div className={styles.colHeader}>PAYLOAD</div>
                <textarea
                  value={b64Input}
                  onChange={(e) => setB64Input(e.target.value)}
                  className={styles.textarea}
                  spellCheck="false"
                />
              </div>
              <div className={styles.editorCol}>
                <div className={styles.colHeader}>OUTPUT CONVERSION</div>
                <textarea
                  value={b64Output}
                  readOnly
                  className={styles.textarea}
                  placeholder="Output appears here..."
                  spellCheck="false"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hash' && (
          <div className={styles.toolPane}>
            <div className={styles.toolbar}>
              <button onClick={handleGenerateHash} className={styles.actionBtn}>
                <span>CALCULATE SHA-256</span>
              </button>
              <button onClick={handleNewUuid} className={styles.actionBtn}>
                <span>GENERATE V4 UUID</span>
              </button>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>PLAIN TEXT INPUT:</label>
              <input
                type="text"
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                className={styles.textInput}
              />
            </div>

            <div className={styles.inputGroup} style={{ marginTop: 16 }}>
              <div className={styles.labelRow}>
                <label className={styles.label}>SHA-256 HASH CHECKSUM:</label>
                {hashOutput && (
                  <button onClick={() => copyToClipboard(hashOutput, 'hash')} className={styles.inlineCopy}>
                    {copiedKey === 'hash' ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedKey === 'hash' ? 'COPIED' : 'COPY'}</span>
                  </button>
                )}
              </div>
              <input type="text" readOnly value={hashOutput} className={styles.textInput} placeholder="Click Calculate..." />
            </div>

            <div className={styles.inputGroup} style={{ marginTop: 20 }}>
              <div className={styles.labelRow}>
                <label className={styles.label}>GENERATED UUID (V4):</label>
                <button onClick={() => copyToClipboard(generatedUuid, 'uuid')} className={styles.inlineCopy}>
                  {copiedKey === 'uuid' ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedKey === 'uuid' ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>
              <input type="text" readOnly value={generatedUuid} className={styles.textInput} />
            </div>
          </div>
        )}

        {activeTab === 'case' && (
          <div className={styles.toolPane}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>RAW STRING INPUT:</label>
              <input
                type="text"
                value={caseInput}
                onChange={(e) => setCaseInput(e.target.value)}
                className={styles.textInput}
              />
            </div>

            <div className={styles.caseGrid}>
              {[
                { label: 'camelCase', val: caseInput.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()) },
                { label: 'snake_case', val: caseInput.toLowerCase().trim().replace(/\s+/g, '_') },
                { label: 'kebab-case', val: caseInput.toLowerCase().trim().replace(/\s+/g, '-') },
                { label: 'UPPERCASE', val: caseInput.toUpperCase() },
                { label: 'CONSTANT_CASE', val: caseInput.toUpperCase().trim().replace(/\s+/g, '_') },
                { label: 'dot.case', val: caseInput.toLowerCase().trim().replace(/\s+/g, '.') },
              ].map((item) => (
                <div key={item.label} className={styles.caseCard}>
                  <div className={styles.caseLabelRow}>
                    <span className={styles.caseLabel}>{item.label}</span>
                    <button onClick={() => copyToClipboard(item.val, item.label)} className={styles.inlineCopy}>
                      {copiedKey === item.label ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                  </div>
                  <div className={styles.caseValue}>{item.val}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
