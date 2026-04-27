import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export default function HUDOverlay() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute bottom-8 right-8 pointer-events-none text-right pr-4 z-50">
       <div className="text-[20px] font-black font-mono text-white tracking-[0.2em] leading-none mb-1 shadow-2xl">
          {currentTime.toLocaleTimeString('en-US', { hour12: false })}
       </div>
       <div className="flex items-center justify-end gap-2">
          <span className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-[8px] font-mono text-cyan-500/60 uppercase tracking-[0.4em]">Real-time Chrono</span>
       </div>
    </div>
  );
}
