import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Lock, Cpu, Activity, ChevronRight } from 'lucide-react';

interface AuthScreenProps {
  onLogin: () => void;
}

export default function AuthScreen({ onLogin }: AuthScreenProps) {
  const [loading, setLoading] = useState(false);
  const [accessCode, setAccessCode] = useState('');

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      onLogin();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#020617] flex items-center justify-center overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_40%,#1e293b_0%,transparent_70%)]" />
        <motion.div 
          animate={{ x: ['-20%', '20%'], y: ['-10%', '10%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute w-[200%] h-[200%] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"
        />
      </div>

      <div className="relative w-full max-w-md px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-6 group">
            <Shield className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <h1 className="text-3xl font-black text-white hover:tracking-widest transition-all uppercase tracking-tighter mb-2">NEURAL_NET <span className="text-cyan-500">INIT</span></h1>
          <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.2em]">India Bio-Threat & Response Grid v4.2.0</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-8 flex flex-col items-center gap-6"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-2 border-cyan-500/10 border-t-cyan-500 animate-spin" />
                  <Cpu className="absolute inset-0 m-auto w-6 h-6 text-cyan-400 animate-pulse" />
                </div>
                <div className="space-y-2 text-center">
                   <p className="text-cyan-500 font-mono text-[10px] uppercase tracking-widest animate-pulse">Establishing Secure Uplink...</p>
                   <p className="text-white/20 font-mono text-[8px] uppercase tracking-tighter">Bypassing Layer-7 Entropy Shields</p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
                    </div>
                    <input 
                      type="password"
                      placeholder="ACCESS_SIGMA_CODE"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 font-mono text-sm focus:outline-none focus:border-cyan-500/50 transition-all uppercase tracking-widest"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                   <button 
                     onClick={handleLogin}
                     className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-widest py-4 rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
                   >
                     Initialize Terminal <ChevronRight className="w-4 h-4" />
                   </button>
                </div>

                <div className="pt-4 flex items-center justify-between opacity-40">
                   <div className="flex items-center gap-2">
                      <Activity className="w-3 h-3 text-emerald-500" />
                      <span className="text-[9px] font-mono text-white tracking-tighter uppercase">Nodes: Active</span>
                   </div>
                   <span className="text-[9px] font-mono text-white tracking-widest uppercase">DEMO_ACCESS_V_03</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <p className="text-white/10 font-mono text-[9px] uppercase tracking-widest">Authorized Personnel Only // Restricted Access 256-Bit SSL</p>
        </motion.div>
      </div>

      {/* Aesthetic Scanning Line */}
      <motion.div 
        animate={{ y: ['-100%', '200%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute w-full h-[10%] bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none"
      />
    </div>
  );
}
