import React, { createContext, useState, useEffect } from 'react';

export const ArenaContext = createContext();

export const ArenaProvider = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [liveVisitors, setLiveVisitors] = useState(148);
  const [digitalTime, setDigitalTime] = useState(new Date().toLocaleTimeString());

  // 1. Digital Clock Updater
  useEffect(() => {
    const timer = setInterval(() => {
      setDigitalTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Mock Live Visitor Counter (ticks up or down to resemble a live, crowded entertainment center)
  useEffect(() => {
    const visitorInterval = setInterval(() => {
      setLiveVisitors(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const nextVal = prev + change;
        return nextVal > 20 ? nextVal : 20; // Keep it above 20
      });
    }, 5000);
    return () => clearInterval(visitorInterval);
  }, []);

  // 3. Synth Sound Engine (Web Audio API)
  const playBeep = (frequency = 440, duration = 0.1, type = 'sine') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime); // keep volume low
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (err) {
      console.warn('Audio Context failed to initialize', err);
    }
  };

  const playClick = () => {
    playBeep(880, 0.05, 'triangle');
  };

  const playSuccess = () => {
    playBeep(523.25, 0.1, 'sine'); // C5
    setTimeout(() => {
      playBeep(659.25, 0.15, 'sine'); // E5
    }, 80);
  };

  const playScheduleTick = () => {
    playBeep(600, 0.08, 'sawtooth');
    setTimeout(() => {
      playBeep(1200, 0.04, 'square');
    }, 50);
  };

  const playCompleteTick = () => {
    playBeep(800, 0.08, 'sine');
    setTimeout(() => {
      playBeep(1000, 0.15, 'sine');
    }, 60);
  };

  return (
    <ArenaContext.Provider
      value={{
        soundEnabled,
        setSoundEnabled,
        liveVisitors,
        digitalTime,
        playClick,
        playSuccess,
        playScheduleTick,
        playCompleteTick
      }}
    >
      {children}
    </ArenaContext.Provider>
  );
};
