import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { Info, CheckCircle, AlertTriangle, XCircle, Clock, Activity } from 'lucide-react';

const getIcon = (type: string) => {
  switch (type) {
    case 'success': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    case 'warning': return <AlertTriangle className="w-4 h-4 text-orange-400" />;
    case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
    default: return <Info className="w-4 h-4 text-cyan-400" />;
  }
};

const getBg = (type: string) => {
  switch (type) {
    case 'success': return 'bg-emerald-500/10 border-emerald-500/20';
    case 'warning': return 'bg-orange-500/10 border-orange-500/20';
    case 'error': return 'bg-red-500/10 border-red-500/20';
    default: return 'bg-cyan-500/10 border-cyan-500/20';
  }
};

interface ActivityFeedProps {
  alerts: any[];
}

export default function ActivityFeed({ alerts }: ActivityFeedProps) {
  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      <div className="scanline" />
      
      <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <h2 className="text-[9px] font-bold uppercase tracking-[0.4em] opacity-40 flex items-center gap-2">
          <Clock className="w-3 h-3 text-cyan-500" /> Sensor Output
        </h2>
        <div className="flex items-center gap-2">
           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
           <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Receiving</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-5 py-6 scrollbar-hide flex flex-col gap-4">
        <AnimatePresence initial={false}>
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className={`p-5 rounded-2xl border bg-black/40 ${getBg(alert.type)} flex gap-5 items-start relative group transition-all hover:bg-white/[0.02]`}
            >
              <div className="mt-1 p-2 rounded-lg bg-black/20 border border-white/5">{getIcon(alert.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] leading-relaxed text-white/80 font-medium">{alert.message}</p>
                <div className="flex items-center justify-between mt-3">
                   <p className="text-[8px] font-mono text-white/20 uppercase tracking-tighter">
                     T-Stamp: {alert.timestamp?.toDate ? format(alert.timestamp.toDate(), 'HH:mm:ss O') : 'Now'}
                   </p>
                   {alert.type === 'error' && (
                      <span className="text-[8px] font-mono text-red-500/50 uppercase animate-pulse">Critical Fail</span>
                   )}
                </div>
              </div>
              <div className="absolute top-2 right-2 flex gap-0.5">
                 <div className="w-0.5 h-4 bg-white/[0.05]" />
                 <div className="w-0.5 h-4 bg-white/[0.05]" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {alerts.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
            <Activity className="w-12 h-12 mb-4" />
            <p className="text-[10px] font-mono uppercase tracking-[0.2em]">Awaiting Signals...</p>
          </div>
        )}
      </div>
    </div>
  );
}
