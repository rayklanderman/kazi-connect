import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Volume2, VolumeX, Mic, MicOff, ZoomIn, ZoomOut, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

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
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { listening, startListening, stopListening } = useVoiceInput(setVoiceInput);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.altKey && e.code === 'KeyZ') { setFontSize(f => Math.min(f + 2, 36)); setAriaMessage('Zoom increased'); }
      if (e.altKey && e.code === 'KeyX') { setFontSize(f => Math.max(f - 2, 12)); setAriaMessage('Zoom decreased'); }
      if (e.altKey && e.code === 'KeyC') { setHighContrast(h => !h); setAriaMessage('Contrast toggled'); }
      if (e.altKey && e.code === 'KeyV') { listening ? stopListening() : startListening(); setAriaMessage('Voice input toggled'); }
      if (e.altKey && e.code === 'KeyS') { setScreenReaderMode(s => !s); setAriaMessage('Screen reader mode toggled'); }
      if (e.altKey && e.code === 'KeyB') { setColorBlindPalette(c => !c); setAriaMessage('Color blind palette toggled'); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [listening, startListening, stopListening]);
  
  // Show success message temporarily
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => setShowSuccessMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  // Color palettes
  // Kenyan flag inspired palette
  const palette = colorBlindPalette ? {
    background: '#222', // fallback for colorblind
    color: '#FFD700',
    accent: '#00BFFF',
    contrast: highContrast ? '#000' : '#222',
    contrastText: highContrast ? '#fff' : '#FFD700',
    heading: '#FF0000', // red for headings
    border: '#00BFFF',
    card: '#333',
  } : highContrast ? {
    background: '#000',
    color: '#fff',
    accent: '#FF0000', // red accent
    contrast: '#000',
    contrastText: '#fff',
    heading: '#00A651', // green for headings
    border: '#fff',
    card: '#222',
  } : {
    background: '#fff',
    color: '#222',
    accent: 'var(--kenya-green)', // Kenyan green
    contrast: '#fff',
    contrastText: '#222',
    heading: 'var(--kenya-black)', // Kenyan black
    border: 'var(--kenya-green)',
    card: 'var(--kenya-green)/5',
  };


  // Feedback form state
  const [feedback, setFeedback] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  return (
    <div className="container mx-auto py-8 px-4">
      {/* ARIA live region for screen readers */}
      <div aria-live="polite" style={{ position: 'absolute', left: -9999, top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
        {ariaMessage}
      </div>
      
      {/* Hero section */}
      <div className="bg-gradient-to-r from-[var(--kenya-green)]/10 to-[var(--kenya-black)]/5 rounded-xl p-6 md:p-10 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--kenya-black)]">Accessibility Features</h1>
        <p className="text-muted-foreground mb-6 max-w-2xl">
          We're committed to making Kazi Connect accessible to all users. Customize your experience with the options below.
        </p>
      </div>
      
      <div
        style={{
          fontSize: fontSize,
          background: palette.background,
          color: palette.color,
          borderRadius: '0.75rem',
          padding: '1.5rem',
          border: `1px solid ${palette.border}`,
        }}
        aria-label="Accessibility Controls"
        className="shadow-md"
      >
      {/* Voice Input */}
      <section 
        aria-label="Voice Input" 
        className="p-6 mb-6 rounded-lg" 
        style={{ background: `rgba(${palette.card})` }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Mic className="h-5 w-5" style={{ color: palette.accent }} />
          <h2 className="text-xl font-semibold" style={{ color: palette.heading }}>Voice Input</h2>
        </div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <Button
            onClick={listening ? stopListening : startListening}
            className="flex items-center gap-2"
            style={{
              background: listening ? '#f59e42' : palette.accent,
              color: '#fff',
            }}
            aria-pressed={listening}
            aria-label={listening ? 'Stop voice input' : 'Start voice input'}
          >
            {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {listening ? 'Stop Voice Input' : 'Start Voice Input'}
          </Button>
          
          {voiceInput && (
            <div 
              aria-live="polite" 
              className="p-3 rounded-md" 
              style={{ background: 'rgba(var(--kenya-green)/10)' }}
            >
              <p className="font-medium">You said: "{voiceInput}"</p>
            </div>
          )}
        </div>
        
        <p className="text-sm mt-4 text-muted-foreground">
          Press <kbd className="px-2 py-1 rounded bg-muted">Alt + V</kbd> to toggle voice input
        </p>
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
      {/* Display Settings */}
      <section 
        aria-label="Display Settings" 
        className="p-6 mb-6 rounded-lg" 
        style={{ background: `rgba(${palette.card})` }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Eye className="h-5 w-5" style={{ color: palette.accent }} />
          <h2 className="text-xl font-semibold" style={{ color: palette.heading }}>Display Settings</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="high-contrast" className="font-medium">High Contrast Mode</Label>
              <p className="text-sm text-muted-foreground">Increases contrast for better visibility</p>
            </div>
            <Switch
              id="high-contrast"
              checked={highContrast}
              onCheckedChange={(checked) => {
                setHighContrast(checked);
                setAriaMessage(checked ? 'High contrast mode enabled' : 'High contrast mode disabled');
              }}
              aria-label="Toggle high contrast mode"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="color-blind" className="font-medium">Color Blind Friendly Mode</Label>
              <p className="text-sm text-muted-foreground">Optimizes colors for color vision deficiencies</p>
            </div>
            <Switch
              id="color-blind"
              checked={colorBlindPalette}
              onCheckedChange={(checked) => {
                setColorBlindPalette(checked);
                setAriaMessage(checked ? 'Color blind mode enabled' : 'Color blind mode disabled');
              }}
              aria-label="Toggle color blind friendly mode"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="screen-reader" className="font-medium">Screen Reader Mode</Label>
              <p className="text-sm text-muted-foreground">Adds extra ARIA labels and verbosity</p>
            </div>
            <Switch
              id="screen-reader"
              checked={screenReaderMode}
              onCheckedChange={(checked) => {
                setScreenReaderMode(checked);
                setAriaMessage(checked ? 'Screen reader mode enabled' : 'Screen reader mode disabled');
              }}
              aria-label="Toggle screen reader mode"
            />
          </div>
        </div>
        
        <p className="text-sm mt-4 text-muted-foreground">
          Press <kbd className="px-2 py-1 rounded bg-muted">Alt + C</kbd> to toggle contrast or <kbd className="px-2 py-1 rounded bg-muted">Alt + B</kbd> for color blind mode
        </p>
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
      {/* Accessibility Info */}
      <section 
        aria-label="Accessibility Info" 
        className="p-6 mb-6 rounded-lg" 
        style={{ background: `rgba(${palette.card})` }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Volume2 className="h-5 w-5" style={{ color: palette.accent }} />
          <h2 className="text-xl font-semibold" style={{ color: palette.heading }}>How These Features Help</h2>
        </div>
        
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <div className="h-6 w-6 flex items-center justify-center rounded-full" style={{ background: palette.accent, color: '#fff' }}>1</div>
            <span>Adjustable text size for easier reading and reduced eye strain</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="h-6 w-6 flex items-center justify-center rounded-full" style={{ background: palette.accent, color: '#fff' }}>2</div>
            <span>High contrast mode for users with partial blindness or color vision deficiency</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="h-6 w-6 flex items-center justify-center rounded-full" style={{ background: palette.accent, color: '#fff' }}>3</div>
            <span>Color blind friendly palette for common color vision deficiencies</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="h-6 w-6 flex items-center justify-center rounded-full" style={{ background: palette.accent, color: '#fff' }}>4</div>
            <span>Voice input for users who cannot use a keyboard or mouse</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="h-6 w-6 flex items-center justify-center rounded-full" style={{ background: palette.accent, color: '#fff' }}>5</div>
            <span>Screen reader mode adds extra ARIA labels and verbosity</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="h-6 w-6 flex items-center justify-center rounded-full" style={{ background: palette.accent, color: '#fff' }}>6</div>
            <span>All controls are labeled and keyboard accessible</span>
          </li>
        </ul>
      </section>
      {/* Feedback Form */}
      <section 
        aria-label="Accessibility Feedback" 
        className="p-6 rounded-lg" 
        style={{ background: `rgba(${palette.card})` }}
      >
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="h-5 w-5" style={{ color: palette.accent }} />
          <h2 className="text-xl font-semibold" style={{ color: palette.heading }}>Accessibility Feedback</h2>
        </div>
        
        {showSuccessMessage ? (
          <div 
            aria-live="polite" 
            className="p-4 rounded-md" 
            style={{ background: 'rgba(var(--kenya-green)/20)' }}
          >
            <p className="font-medium text-[var(--kenya-green)]">Thank you for your feedback! We appreciate your input.</p>
          </div>
        ) : (
          <form
            onSubmit={e => { 
              e.preventDefault(); 
              setShowSuccessMessage(true); 
              setAriaMessage('Feedback submitted'); 
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="access-feedback" className="font-medium">Describe any accessibility issues or suggestions:</Label>
              <Textarea
                id="access-feedback"
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                rows={4}
                className="w-full"
                style={{ fontSize: fontSize }}
                aria-label="Accessibility feedback text area"
                required
              />
            </div>
            
            <Button
              type="submit"
              className="flex items-center gap-2"
              style={{ background: palette.accent, color: '#fff' }}
              aria-label="Submit accessibility feedback"
            >
              <Send className="h-4 w-4" />
              Submit Feedback
            </Button>
          </form>
        )}
      </section>
      </div>
    </div>
  );
}

