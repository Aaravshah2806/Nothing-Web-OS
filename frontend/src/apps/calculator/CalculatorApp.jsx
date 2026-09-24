import React, { useState, useEffect } from 'react';
import styles from './CalculatorApp.module.css';

export default function CalculatorApp() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [hasEvaluated, setHasEvaluated] = useState(false);

  const handleDigit = (digit) => {
    if (hasEvaluated) {
      setDisplay(digit);
      setEquation('');
      setHasEvaluated(false);
      return;
    }
    if (display === '0') {
      setDisplay(digit);
    } else {
      if (display.length < 12) {
        setDisplay(display + digit);
      }
    }
  };

  const handleDecimal = () => {
    if (hasEvaluated) {
      setDisplay('0.');
      setEquation('');
      setHasEvaluated(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperator = (op) => {
    setEquation(`${display} ${op}`);
    setDisplay('0');
    setHasEvaluated(false);
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
    setHasEvaluated(false);
  };

  const handleBackspace = () => {
    if (hasEvaluated) return;
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handlePercent = () => {
    const val = parseFloat(display);
    if (!isNaN(val)) {
      setDisplay(String(val / 100));
    }
  };

  const handleToggleSign = () => {
    const val = parseFloat(display);
    if (!isNaN(val)) {
      setDisplay(String(-val));
    }
  };

  const handleEvaluate = () => {
    if (!equation) return;
    const parts = equation.split(' ');
    const firstOperand = parseFloat(parts[0]);
    const operator = parts[1];
    const secondOperand = parseFloat(display);

    if (isNaN(firstOperand) || isNaN(secondOperand)) return;

    let result = 0;
    switch (operator) {
      case '+':
        result = firstOperand + secondOperand;
        break;
      case '−':
      case '-':
        result = firstOperand - secondOperand;
        break;
      case '×':
      case '*':
        result = firstOperand * secondOperand;
        break;
      case '÷':
      case '/':
        result = secondOperand === 0 ? 'ERROR' : firstOperand / secondOperand;
        break;
      default:
        return;
    }

    const formatted = typeof result === 'number' ? String(Number(result.toFixed(6))) : result;
    setEquation(`${equation} ${display} =`);
    setDisplay(formatted);
    setHasEvaluated(true);
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === '.') {
        handleDecimal();
      } else if (e.key === '+') {
        handleOperator('+');
      } else if (e.key === '-') {
        handleOperator('−');
      } else if (e.key === '*') {
        handleOperator('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEvaluate();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div className={styles.container}>
      {/* Dot-matrix LED Display */}
      <div className={styles.displayPanel}>
        <div className={styles.subEquation}>{equation || ' '}</div>
        <div className={styles.mainDisplay}>{display}</div>
      </div>

      {/* Grid Keypad */}
      <div className={styles.keypad}>
        <button onClick={handleClear} className={`${styles.btn} ${styles.btnAction}`}>C</button>
        <button onClick={handleToggleSign} className={`${styles.btn} ${styles.btnOp}`}>±</button>
        <button onClick={handlePercent} className={`${styles.btn} ${styles.btnOp}`}>%</button>
        <button onClick={() => handleOperator('÷')} className={`${styles.btn} ${styles.btnOp}`}>÷</button>

        <button onClick={() => handleDigit('7')} className={styles.btn}>7</button>
        <button onClick={() => handleDigit('8')} className={styles.btn}>8</button>
        <button onClick={() => handleDigit('9')} className={styles.btn}>9</button>
        <button onClick={() => handleOperator('×')} className={`${styles.btn} ${styles.btnOp}`}>×</button>

        <button onClick={() => handleDigit('4')} className={styles.btn}>4</button>
        <button onClick={() => handleDigit('5')} className={styles.btn}>5</button>
        <button onClick={() => handleDigit('6')} className={styles.btn}>6</button>
        <button onClick={() => handleOperator('−')} className={`${styles.btn} ${styles.btnOp}`}>−</button>

        <button onClick={() => handleDigit('1')} className={styles.btn}>1</button>
        <button onClick={() => handleDigit('2')} className={styles.btn}>2</button>
        <button onClick={() => handleDigit('3')} className={styles.btn}>3</button>
        <button onClick={() => handleOperator('+')} className={`${styles.btn} ${styles.btnOp}`}>+</button>

        <button onClick={handleBackspace} className={styles.btn}>⌫</button>
        <button onClick={() => handleDigit('0')} className={styles.btn}>0</button>
        <button onClick={handleDecimal} className={styles.btn}>.</button>
        <button onClick={handleEvaluate} className={`${styles.btn} ${styles.btnEquals}`}>=</button>
      </div>
    </div>
  );
}
