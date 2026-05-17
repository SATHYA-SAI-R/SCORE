import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
const systemMessages = [
    'verifying academic identity…',
    'indexing skills…',
    'analyzing project history…',
    'establishing trust layer…',
];
const LoadingScreen = ({ onComplete }) => {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(true);
    const [showCursor, setShowCursor] = useState(true);
    const [isGlitching, setIsGlitching] = useState(false);
    // Cursor blink effect
    useEffect(() => {
        const interval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 530);
        return () => clearInterval(interval);
    }, []);
    // Random glitch effect
    useEffect(() => {
        const glitchInterval = setInterval(() => {
            if (Math.random() > 0.7) {
                setIsGlitching(true);
                setTimeout(() => setIsGlitching(false), 150);
            }
        }, 2000);
        return () => clearInterval(glitchInterval);
    }, []);
    // Typing effect
    useEffect(() => {
        if (currentMessageIndex >= systemMessages.length) {
            setTimeout(onComplete, 800);
            return;
        }
        const currentMessage = systemMessages[currentMessageIndex];
        if (displayedText.length < currentMessage.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(currentMessage.slice(0, displayedText.length + 1));
            }, 40 + Math.random() * 30); // Variable typing speed for human feel
            return () => clearTimeout(timeout);
        }
        else {
            setIsTyping(false);
            const nextTimeout = setTimeout(() => {
                setCurrentMessageIndex(prev => prev + 1);
                setDisplayedText('');
                setIsTyping(true);
            }, 600);
            return () => clearTimeout(nextTimeout);
        }
    }, [displayedText, currentMessageIndex, onComplete]);
    return (<motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-background" exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
      {/* Noise overlay */}
      <div className="noise-overlay"/>
      
      {/* Scanlines */}
      <div className="scanlines"/>

      {/* Corner micro-text */}
      <span className="floating-text top-6 left-6">STUDENTS_CORE v1.0</span>
      <span className="floating-text top-6 right-6">SECURE_INIT</span>
      <span className="floating-text bottom-6 left-6">TRUST_PROTOCOL</span>
      <span className="floating-text bottom-6 right-6">SYS_CHECK</span>

      {/* Main terminal content */}
      <div className={`flex flex-col items-start gap-3 ${isGlitching ? 'glitch' : ''}`}>
        {/* Completed messages */}
        {systemMessages.slice(0, currentMessageIndex).map((msg, index) => (<motion.div key={index} initial={{ opacity: 0.6 }} animate={{ opacity: 0.8 }} className="text-sm text-primary uppercase tracking-widest font-bold">
            <span className="text-white mr-2">✓</span>
            {msg}
          </motion.div>))}
        
        {/* Current typing message */}
        {currentMessageIndex < systemMessages.length && (<div className="text-sm font-mono text-primary flex items-center shadow-neon">
            <span className="text-white mr-2">›</span>
            <span>{displayedText}</span>
            <span className={`ml-0.5 text-white ${showCursor ? 'opacity-100' : 'opacity-0'}`} style={{ transition: 'opacity 0.1s' }}>
              |
            </span>
          </div>)}
      </div>

      {/* Progress indicator - subtle line */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-32 h-px bg-foreground/10">
        <motion.div className="h-full bg-foreground/40" initial={{ width: '0%' }} animate={{ width: `${(currentMessageIndex / systemMessages.length) * 100}%` }} transition={{ duration: 0.3, ease: 'easeOut' }}/>
      </div>
    </motion.div>);
};
export default LoadingScreen;
