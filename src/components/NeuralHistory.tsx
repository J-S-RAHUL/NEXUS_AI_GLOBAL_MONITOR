import React from 'react';
import { motion } from 'motion/react';
import { Clock, Activity, Shield, Cpu, Terminal } from 'lucide-react';

const historyItems = [
  { id: 1, type: 'mitigation', event: 'Tactical Deployment Delta-9', status: 'Success', time: '04:22:11', impact: '94%' },
  { id: 2, type: 'alert', event: 'Seismic Anomaly Detection', status: 'Logged', time: '02:15:45', impact: 'N/A' },
  { id: 3, type: 'resource', event: 'Orbital Stockpile Re-alloc', status: 'Complete', time: '23:54:12', impact: '1.2k Assets' },
  { id: 4, type: 'system', event: 'Neural Core Optimization', status: 'Optimal', time: '21:00:00', impact: '+12ms' },
  { id: 5, type: 'mitigation', event: 'Sector-B Flood Bypass', status: 'Active', time: '18:30:22', impact: '42%' },
];

export default function NeuralHistory() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">Neural <span className="text-cyan-500">History</span></h2>
          <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.2em]">Cryptographic log of all grid operations & tactical cycles</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
             {[...Array(3)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                   <Activity className="w-3 h-3 text-cyan-500" />
                </div>
             ))}
          </div>
          <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
             <span className="text-[10px] font-black text-emerald-500 font-mono">ENCRYPTED_STREAM</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {historyItems.map((item, index) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 hover:bg-white/[0.05] rounded-2xl p-6 transition-all"
          >
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className={`p-3 rounded-xl ${
                      item.type === 'mitigation' ? 'bg-emerald-500/10 text-emerald-400' :
                      item.type === 'alert' ? 'bg-rose-500/10 text-rose-400' :
                      'bg-cyan-500/10 text-cyan-400'
                   } border border-current opacity-60`}>
                      {item.type === 'mitigation' ? <Shield className="w-4 h-4" /> : 
                       item.type === 'alert' ? <Activity className="w-4 h-4" /> : 
                       <Cpu className="w-4 h-4" />}
                   </div>
                   <div>
                      <h4 className="text-sm font-black text-white/80 uppercase tracking-tight group-hover:text-white transition-colors">{item.event}</h4>
                      <div className="flex items-center gap-3 mt-1">
                         <span className="text-[9px] font-mono text-white/30 uppercase flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {item.time} PST
                         </span>
                         <span className="text-[9px] font-mono text-white/30 uppercase">• STATUS: {item.status}</span>
                      </div>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-1">Impact Val</p>
                   <p className="text-lg font-black text-white tracking-tighter">{item.impact}</p>
                </div>
             </div>
             
             {/* Progress visualizer decoration */}
             <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent overflow-hidden">
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: 'linear' }}
                  className="w-1/4 h-full bg-cyan-500/20"
                />
             </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 p-12 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-center opacity-40 hover:opacity-100 transition-opacity">
        <Terminal className="w-8 h-8 text-white/20 mb-4" />
        <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">End of Transmission Cycle // Archive Limit Exceeded</p>
      </div>
    </div>
  );
}
