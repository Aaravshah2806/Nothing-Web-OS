import React, { useState } from 'react';
import { RotateCw, Quote } from 'lucide-react';
import { playMechanicalClick } from '../../lib/soundEngine';
import styles from './QuotesWidget.module.css';

const NOTHING_QUOTES = [
  { text: 'Technology should feel like nothing: effortless, intuitive, and human.', author: 'CARL PEI' },
  { text: 'Monochrome first, red as signal. Remove the noise to find clarity.', author: 'NOTHING MANIFESTO' },
  { text: 'Transparency is honesty in industrial hardware design.', author: 'TEENAGE ENGINEERING' },
  { text: 'Form follows emotion. Pure geometry meets raw tactile mechanics.', author: 'DESIGN LAB (1)' },
  { text: 'Making tech fun again. In a sea of black mirrors, make something distinct.', author: 'GLYPH OS (1)' },
];

export default function QuotesWidget() {
  const [idx, setIdx] = useState(0);

  const current = NOTHING_QUOTES[idx];

  const handleNext = (e) => {
    e.stopPropagation();
    playMechanicalClick();
    setIdx((prev) => (prev + 1) % NOTHING_QUOTES.length);
  };

  return (
    <div className={styles.widget} title="Nothing OS Quotes & Facts (NThing-UI)">
      <div className={styles.headerRow}>
        <div className={styles.titleBadge}>
          <Quote size={10} className={styles.quoteIcon} />
          <span>THOUGHT (1)</span>
        </div>
        <button onClick={handleNext} className={styles.refreshBtn} title="Next Thought">
          <RotateCw size={11} />
        </button>
      </div>

      <p className={styles.quoteBody}>“{current.text}”</p>

      <div className={styles.footerRow}>
        <span className={styles.accentDot} />
        <span className={styles.author}>{current.author}</span>
      </div>
    </div>
  );
}
