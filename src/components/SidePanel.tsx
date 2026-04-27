import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle, Users, Box, Heart, Map, Navigation, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';

interface SidePanelProps {
  disaster: any | null;
  onClose: () => void;
}

const ResourceCard = ({ label, value, icon: Icon, unit }: any) => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4">
    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
      <Icon className="w-5 h-5 text-cyan-400" />
    </div>
    <div>
      <p className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-1">{label}</p>
      <p className="text-lg font-medium text-white">{value?.toLocaleString()} <span className="text-[10px] opacity-40 ml-1">{unit}</span></p>
    </div>
  </div>
);

export default function SidePanel({ disaster, onClose }: SidePanelProps) {
  if (!disaster) return null;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute top-0 right-0 w-96 h-full bg-[#020617]/95 backdrop-blur-2xl border-l border-white/10 z-[60] shadow-[-20px_0_40px_rgba(0,0,0,0.5)] flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center border border-red-500/40">
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">Event Monitoring</h2>
            <p className="text-[9px] font-mono text-cyan-400 opacity-60">ID: {disaster.id?.substring(0, 8)}</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors text-white/40 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
        {/* Status & Severity */}
        <div className="flex items-center gap-4">
          <div className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
            disaster.severity === 'high' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
            disaster.severity === 'medium' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
            'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
          }`}>
            {disaster.severity} Priority
          </div>
          <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-widest">
            {disaster.status}
          </div>
        </div>

        {/* SummarySection */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Analysis Summary</h3>
          <p className="text-sm leading-relaxed text-slate-300 bg-white/5 p-4 rounded-xl border border-white/5">
            {disaster.summary || 'Initial detection triggered. Neural core is processing current imagery and ground reports for detailed impact assessment.'}
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Impact Telemetry</h3>
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-[8px] font-bold uppercase tracking-widest text-white/30 mb-1">Alpha Casualties</p>
                <div className="flex items-baseline gap-2">
                   <p className="text-xl font-black text-white">{disaster.casualties || 0}</p>
                   <span className="text-[8px] text-red-500 font-mono tracking-tighter">SIGMA: {((disaster.casualties / (disaster.affectedPopulation || 1)) * 100).toFixed(1)}%</span>
                </div>
             </div>
             <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-[8px] font-bold uppercase tracking-widest text-white/30 mb-1">Infras. Damage</p>
                <div className="flex items-baseline gap-2">
                   <p className="text-xl font-black text-white">{disaster.infrastructureDamage || 0}%</p>
                   <span className="text-[8px] text-orange-500 font-mono tracking-tighter">VECTOR: CRITICAL</span>
                </div>
             </div>
             <div className="bg-white/5 border border-white/10 rounded-xl p-4 col-span-2">
                <p className="text-[8px] font-bold uppercase tracking-widest text-white/30 mb-2">Evacuation Protocol Status</p>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                   <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${disaster.evacuationStatus || 0}%` }}
                      className="h-full bg-cyan-500"
                   />
                </div>
                <div className="flex justify-between mt-1.5">
                   <span className="text-[8px] font-mono text-cyan-400">{disaster.evacuationStatus || 0}% SECURED</span>
                   <span className="text-[8px] font-mono text-white/20">REMAINING: {100 - (disaster.evacuationStatus || 0)}%</span>
                </div>
             </div>
          </div>
        </section>

        {/* Requirements Grid */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Required Resources</h3>
          <div className="space-y-3">
            <ResourceCard label="Affected Population" value={disaster.affectedPopulation || 0} icon={Users} unit="Est. People" />
            <ResourceCard label="Emergency Food" value={disaster.resources?.food || 0} icon={Box} unit="Kilograms" />
            <ResourceCard label="Potable Water" value={disaster.resources?.water || 0} icon={Heart} unit="Liters" />
            <ResourceCard label="Medical Supplies" value={disaster.resources?.medicalKits || 0} icon={ShieldCheck} unit="Alpha Kits" />
          </div>
        </section>

        {/* Suggested Actions */}
        {disaster.suggestedActions && (
          <section className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Tactical Recommendations</h3>
            <div className="space-y-2">
              {disaster.suggestedActions.map((action: string, i: number) => (
                <div key={i} className="flex gap-3 items-start text-[11px] text-slate-400 bg-white/5 p-3 rounded-lg border border-white/5">
                  <span className="text-cyan-500 font-bold">{i + 1}.</span>
                  {action}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Location Data */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Spatial Coordinates</h3>
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <Navigation className="w-5 h-5 text-white/20" />
               <p className="text-[11px] font-mono text-slate-400">
                  {disaster.location?.lat.toFixed(4)}° N, {disaster.location?.lng.toFixed(4)}° W
               </p>
            </div>
            <button className="text-[10px] font-bold uppercase tracking-widest text-cyan-500 hover:text-cyan-400">Lock-in Signal</button>
          </div>
        </section>
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-white/10 bg-white/5 space-y-3">
        <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold uppercase tracking-[0.2em] py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(8,145,178,0.2)]">
          Deploy Mobile Responders
        </button>
        <button className="w-full bg-white/5 hover:bg-white/10 text-white/60 font-bold uppercase tracking-[0.2em] py-4 rounded-xl transition-all border border-white/10">
          Mark as Contained
        </button>
      </div>
    </motion.div>
  );
}
