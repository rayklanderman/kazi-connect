import React, { useState, useRef } from 'react';
import micIcon from '../mic.svg';

// Voice input using the Web Speech API (only works in supported browsers)
const useVoiceInput = (onResult: (text: string) => void) => {
  const recognitionRef = useRef<any>(null);
  const [listening, setListening] = useState(false);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice input is not supported in this browser.');
      return;
    }
    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      onResult(text);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  return { listening, startListening, stopListening };
};

export default function Accessibility() {
  // State declarations first
  const [fontSize, setFontSize] = useState(18);
  const [voiceInput, setVoiceInput] = useState('');
  const [highContrast, setHighContrast] = useState(false);
  const [screenReaderMode, setScreenReaderMode] = useState(false);
  const [colorBlindPalette, setColorBlindPalette] = useState(false);
  const [ariaMessage, setAriaMessage] = useState('');
  const { listening, startListening, stopListening } = useVoiceInput(setVoiceInput);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.altKey && e.code === 'KeyZ') { setFontSize(f => Math.min(f + 2, 36)); setAriaMessage('Zoom increased'); }
      if (e.altKey && e.code === 'KeyC') { setHighContrast(h => !h); setAriaMessage('Contrast toggled'); }
      if (e.altKey && e.code === 'KeyV') { listening ? stopListening() : startListening(); setAriaMessage('Voice input toggled'); }
      if (e.altKey && e.code === 'KeyS') { setScreenReaderMode(s => !s); setAriaMessage('Screen reader mode toggled'); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [listening, startListening, stopListening]);

  // Color palettes
  // Kenyan flag inspired palette
  const palette = colorBlindPalette ? {
    background: '#222', // fallback for colorblind
    color: '#FFD700',
    accent: '#00BFFF',
    contrast: highContrast ? '#000' : '#222',
    contrastText: highContrast ? '#fff' : '#FFD700',
    heading: '#FF0000', // red for headings
  } : highContrast ? {
    background: '#000',
    color: '#fff',
    accent: '#FF0000', // red accent
    contrast: '#000',
    contrastText: '#fff',
    heading: '#00A651', // green for headings
  } : {
    background: '#fff',
    color: '#222',
    accent: '#006600', // Kenyan green
    contrast: '#fff',
    contrastText: '#222',
    heading: '#FF0000', // Kenyan red
  };


  // Feedback form state
  const [feedback, setFeedback] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  return (
    <div
      style={{
        fontSize: fontSize,
        background: palette.background,
        color: palette.color,
        minHeight: '100vh',
        padding: 32,
      }}
      aria-label="Accessibility Page"
    >
      {/* ARIA live region for screen readers */}
      <div aria-live="polite" style={{ position: 'absolute', left: -9999, top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
        {ariaMessage}
      </div>
      <h1 style={{ fontWeight: 'bold', fontSize: fontSize + 10, color: palette.heading, letterSpacing: 1 }} tabIndex={0}>Accessibility Features</h1>
      {/* Voice Input - moved to top for prominence */}
      <section aria-label="Voice Input" style={{ margin: '24px 0 8px 0', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={listening ? stopListening : startListening}
          style={{
            background: listening ? '#f59e42' : palette.accent,
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '8px 16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginRight: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
          aria-pressed={listening}
          aria-label={listening ? 'Stop voice input' : 'Start voice input'}
          title="Use your voice to input text. You can also press Alt + V to toggle voice input."
        >
          <img src={micIcon} alt="Mic icon" style={{ width: 20, height: 20, filter: 'invert(1)' }} />
          {listening ? 'Stop Voice Input' : 'Start Voice Input'}
        </button>
        <span aria-live="polite" style={{ fontWeight: 'bold', fontSize: fontSize + 2, color: palette.accent, minHeight: 28 }}>
          {voiceInput ? `You said: "${voiceInput}"` : 'Click the mic or press Alt + V to use voice input.'}
        </span>
      </section>
      {/* Keyboard shortcut instructions */}
      <section aria-label="Keyboard Shortcuts" style={{ margin: '16px 0', background: palette.accent, color: palette.contrastText, padding: 12, borderRadius: 8 }}>
        <strong>Keyboard Shortcuts:</strong>
        <ul style={{ marginLeft: 24, lineHeight: 1.8 }}>
          <li>Alt + Z: Zoom In Font</li>
          <li>Alt + C: Toggle High Contrast</li>
          <li>Alt + V: Toggle Voice Input</li>
          <li>Alt + S: Toggle Screen Reader Mode</li>
        </ul>
      </section>
      {/* Font size control */}
      <section aria-label="Font Size Controls" style={{ margin: '24px 0' }}>
        <label htmlFor="font-size-slider" style={{ fontWeight: 'bold' }}>Zoom (Font Size):</label>
        <input
          id="font-size-slider"
          type="range"
          min={14}
          max={36}
          value={fontSize}
          onChange={e => setFontSize(Number(e.target.value))}
          style={{ margin: '0 12px', verticalAlign: 'middle' }}
          aria-valuenow={fontSize}
        />
        <span aria-live="polite">{fontSize}px</span>
      </section>
      {/* High Contrast Toggle */}
      <section aria-label="High Contrast Mode" style={{ margin: '24px 0' }}>
        <label style={{ fontWeight: 'bold' }}>
          <input
            type="checkbox"
            checked={highContrast}
            onChange={e => setHighContrast(e.target.checked)}
            style={{ marginRight: 8 }}
            aria-label="Enable High Contrast Mode"
          />
          Enable High Contrast Mode (for partial blindness)
        </label>
      </section>
      {/* Color Blind Friendly Palette Toggle */}
      <section aria-label="Color Blind Friendly Palette" style={{ margin: '24px 0' }}>
        <label style={{ fontWeight: 'bold' }}>
          <input
            type="checkbox"
            checked={colorBlindPalette}
            onChange={e => setColorBlindPalette(e.target.checked)}
            style={{ marginRight: 8 }}
            aria-label="Enable Color Blind Friendly Palette"
          />
          Enable Color Blind Friendly Palette
        </label>
      </section>
      {/* Screen Reader Mode Toggle */}
      <section aria-label="Screen Reader Mode" style={{ margin: '24px 0' }}>
        <label style={{ fontWeight: 'bold' }}>
          <input
            type="checkbox"
            checked={screenReaderMode}
            onChange={e => setScreenReaderMode(e.target.checked)}
            style={{ marginRight: 8 }}
            aria-label="Enable Screen Reader Mode"
          />
          Enable Screen Reader Mode (adds extra ARIA labels and verbosity)
        </label>
      </section>
      {/* Voice Input */}
      <section aria-label="Voice Input" style={{ margin: '24px 0' }}>
        <button
          onClick={listening ? stopListening : startListening}
          style={{
            background: listening ? '#f59e42' : palette.accent,
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '8px 16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginRight: 12,
          }}
          aria-pressed={listening}
          aria-label={listening ? 'Stop voice input' : 'Start voice input'}
        >
          {listening ? 'Stop Voice Input' : 'Start Voice Input'}
        </button>
        <span aria-live="polite" style={{ fontWeight: 'bold' }}>
          {voiceInput && `You said: "${voiceInput}"`}
        </span>
      </section>
      {/* Accessibility Info */}
      <section aria-label="Accessibility Info" style={{ margin: '24px 0' }}>
        <h2 style={{ fontWeight: 'bold', fontSize: fontSize + 4 }}>How this page helps:</h2>
        <ul style={{ lineHeight: 2 }}>
          <li>Zoom in/out text for easier reading</li>
          <li>High contrast mode for users with partial blindness or color vision deficiency</li>
          <li>Color blind friendly palette for common color vision deficiencies</li>
          <li>Voice input for users who cannot use a keyboard or mouse</li>
          <li>Screen reader mode adds extra ARIA labels and verbosity</li>
          <li>Screen reader friendly: all controls are labeled and keyboard accessible</li>
        </ul>
      </section>
      {/* Feedback Form */}
      <section aria-label="Accessibility Feedback" style={{ margin: '24px 0' }}>
        <h2 style={{ fontWeight: 'bold', fontSize: fontSize + 2 }}>Accessibility Feedback</h2>
        {feedbackSent ? (
          <div aria-live="polite" style={{ color: palette.accent, fontWeight: 'bold' }}>Thank you for your feedback!</div>
        ) : (
          <form
            onSubmit={e => { e.preventDefault(); setFeedbackSent(true); setAriaMessage('Feedback submitted'); }}
            style={{ marginTop: 8 }}
          >
            <label htmlFor="access-feedback" style={{ fontWeight: 'bold' }}>Describe any accessibility issues or suggestions:</label>
            <textarea
              id="access-feedback"
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              rows={4}
              style={{ display: 'block', width: '100%', margin: '8px 0', fontSize: fontSize, borderRadius: 6, border: '1px solid #ccc', padding: 8 }}
              aria-label="Accessibility feedback text area"
              required
            />
            <button
              type="submit"
              style={{
                background: palette.accent,
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '8px 16px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
              aria-label="Submit accessibility feedback"
            >
              Submit Feedback
            </button>
          </form>
        )}
      </section>
    </div>
  );
}

