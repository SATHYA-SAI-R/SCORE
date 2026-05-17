import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = () => {
  const [lines, setLines] = useState([]);
  const [percent, setPercent] = useState(0);

  const bootSequence = [
    "INITIALIZING CORE KERNEL...",
    "LOADING MEMORY MODULES... [OK]",
    "MOUNTING FILE SYSTEM... [OK]",
    "ESTABLISHING SECURE CONNECTION...",
    "VERIFYING USER HANDSHAKE...",
    "DECRYPTING ASSETS...",
    "RENDERING UI COMPONENTS...",
    "EXECUTING STARTUP SCRIPT...",
    "ACCESS GRANTED."
  ];

  useEffect(() => {
    let lineIndex = 0;
    const lineInterval = setInterval(() => {
      if (lineIndex < bootSequence.length) {
        setLines(prev => [...prev, bootSequence[lineIndex]]);
        lineIndex++;
      } else {
        clearInterval(lineInterval);
      }
    }, 300);

    const progressInterval = setInterval(() => {
      setPercent(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 40);

    return () => {
      clearInterval(lineInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center font-mono text-primary p-10 overflow-hidden cursor-wait selection:bg-white selection:text-black">
        {/* CRT Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none" />
        
        <div className="w-full max-w-2xl relative z-10">
            <div className="mb-10 text-center">
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-widest mb-2 glitch-wrapper" data-text="SYSTEM_BOOT">
                    SYSTEM_BOOT
                </h1>
                <div className="h-1 w-full bg-surface relative overflow-hidden">
                    <motion.div 
                        className="absolute h-full bg-primary"
                        style={{ width: `${percent}%` }}
                    />
                </div>
                <div className="flex justify-between mt-2 text-xs uppercase tracking-widest text-text-muted">
                    <span>v2.0.4</span>
                    <span>{percent}% LOADED</span>
                </div>
            </div>

            <div className="bg-surface/50 border border-white/10 p-4 h-64 overflow-hidden relative font-mono text-sm uppercase">
                <div className="absolute top-0 left-0 bg-primary text-black px-2 py-1 text-[10px] font-bold">
                    TERMINAL_OUTPUT
                </div>
                <div className="mt-6 space-y-1">
                    {lines.map((line, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-primary/80"
                        >
                            <span className="text-white/30 mr-2">[{new Date().toLocaleTimeString()}]</span>
                            {line}
                        </motion.div>
                    ))}
                    <motion.div 
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="w-2 h-4 bg-primary inline-block align-middle ml-1"
                    />
                </div>
            </div>
        </div>

        <div className="absolute bottom-10 left-0 w-full text-center">
             <p className="text-[10px] text-text-muted uppercase tracking-[0.5em]">Secure Connection Initiated</p>
        </div>
    </div>
  );
};

export default LoadingScreen;
