import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, Shield, Cpu, Activity, AlertTriangle, Fingerprint } from 'lucide-react';

export default function CoreOverrides() {
  const [overrides, setOverrides] = useState({
    neuralOptimization: true,
    autoDeployment: false,
    sectorLockdown: false,
    orbitalPriority: true,
    threatSuppressionV2: true,
  });

  const toggleOverride = (key: keyof typeof overrides) => {
    setOverrides(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
           <Fingerprint className="w-8 h-8 text-rose-500 animate-pulse" />
           <div className="h-px flex-1 bg-rose-500/20" />
        </div>
        <h2 className="text-5xl font-black uppercase tracking-tighter mb-4">Core <span className="text-rose-500">Overrides</span></h2>
        <p className="text-white/40 font-mono text-xs uppercase tracking-[0.2em] leading-relaxed max-w-xl">
           Advanced tactical control protocols. Unauthorized modification of these vectors may result in catastrophic grid de-sync.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OverrideCard 
          icon={<Cpu className="w-5 h-5" />}
          label="Neural Optimization"
          description="Enables ultra-fast trajectory prediction and casualty mitigation models."
          enabled={overrides.neuralOptimization}
          onClick={() => toggleOverride('neuralOptimization')}
        />
        <OverrideCard 
          icon={<Zap className="w-5 h-5" />}
          label="Auto Deployment"
          description="Automates responder dispatch based on real-time threat hierarchy."
          enabled={overrides.autoDeployment}
          onClick={() => toggleOverride('autoDeployment')}
          danger
        />
        <OverrideCard 
          icon={<Shield className="w-5 h-5" />}
          label="Sector Lockdown"
          description="Immediate quarantine of high-risk sectors to prevent cascade failure."
          enabled={overrides.sectorLockdown}
          onClick={() => toggleOverride('sectorLockdown')}
          danger
        />
        <OverrideCard 
          icon={<Activity className="w-5 h-5" />}
          label="Threat Suppression"
          description="High-frequency signal jamming in disaster zones to prevent info leaks."
          enabled={overrides.threatSuppressionV2}
          onClick={() => toggleOverride('threatSuppressionV2')}
        />
      </div>

      <div className="mt-12 p-8 bg-rose-500/5 border border-rose-500/20 rounded-3xl flex items-start gap-6">
        <div className="p-3 bg-rose-500/20 rounded-2xl">
           <AlertTriangle className="w-8 h-8 text-rose-500" />
        </div>
        <div>
           <h4 className="text-rose-500 font-black uppercase tracking-wide mb-1">Critical System Integrity</h4>
           <p className="text-xs text-rose-500/60 font-mono uppercase tracking-tighter leading-relaxed">
              System is currently operating under Emergency Directive 402. All core overrides are subject to immediate audit by the National Security Council. Ensure all protocols are logged.
           </p>
        </div>
      </div>
    </div>
  );
}

function OverrideCard({ icon, label, description, enabled, onClick, danger }: any) {
  return (
    <button 
      onClick={onClick}
      className={`relative p-8 rounded-3xl border text-left transition-all group overflow-hidden ${
        enabled 
          ? danger ? 'bg-rose-500/20 border-rose-500/40 text-rose-500' : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400' 
          : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
      }`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-2xl ${enabled ? 'bg-current opacity-20' : 'bg-white/10'}`}>
          {icon}
        </div>
        <div className={`w-12 h-6 rounded-full relative transition-colors ${enabled ? 'bg-current opacity-40' : 'bg-white/10'}`}>
           <motion.div 
             animate={{ x: enabled ? 26 : 2 }}
             className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg"
           />
        </div>
      </div>
      <div>
        <h3 className="font-black uppercase tracking-tight mb-2 group-hover:tracking-widest transition-all">{label}</h3>
        <p className={`text-[10px] font-mono uppercase tracking-tighter leading-relaxed ${enabled ? 'opacity-70' : 'opacity-30'}`}>
          {description}
        </p>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-2 opacity-5 translate-x-4 -translate-y-4">
         {React.cloneElement(icon, { size: 120 })}
      </div>
    </button>
  );
}
