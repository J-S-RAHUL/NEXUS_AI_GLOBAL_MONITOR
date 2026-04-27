import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, MapPin, CheckCircle2, Clock, Shield, UserPlus, Send, X, AlertCircle, Package, RefreshCw, Droplets, Heart, ChevronRight } from 'lucide-react';
import { dispatchVolunteer, updateDisaster, createAlert } from '../services/dataService';

interface VolunteerPanelProps {
  volunteers: any[];
  disasters: any[];
}

export default function VolunteerPanel({ volunteers, disasters }: VolunteerPanelProps) {
  const [selectedVolunteerId, setSelectedVolunteerId] = useState<string | null>(null);
  const [showDispatch, setShowDispatch] = useState(false);
  const [view, setView] = useState<'responders' | 'resources'>('responders');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedDisasterId, setSelectedDisasterId] = useState<string | null>(null);

  const activeDisasters = disasters.filter(d => d.status === 'active');
  const selectedDisaster = disasters.find(d => d.id === selectedDisasterId);

  const handleDispatch = async (volunteerId: string, location: { lat: number, lng: number }, disasterId: string) => {
    await dispatchVolunteer(volunteerId, location, disasterId);
    setSelectedVolunteerId(null);
    setShowDispatch(false);
  };

  const handleResourceUpdate = async (disaster: any) => {
    setUpdatingId(disaster.id);
    const updates = {
      resources: {
        food: Math.floor((disaster.resources?.food || 400) * (0.95 + Math.random() * 0.1)),
        water: Math.floor((disaster.resources?.water || 1200) * (0.95 + Math.random() * 0.1)),
        medicalKits: Math.max(0, (disaster.resources?.medicalKits || 50) + (Math.random() > 0.5 ? 1 : -1))
      }
    };
    
    setTimeout(async () => {
      await updateDisaster(disaster.id, updates);
      await createAlert(`RESOURCE: Telemetry updated for ${disaster.type} sector.`, 'success');
      setUpdatingId(null);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-black/20">
      <div className="scanline opacity-[0.03]" />
      
      <div className="border-b border-white/5 bg-white/[0.02]">
        <div className="flex p-1">
          <button 
            onClick={() => setView('responders')}
            className={`flex-1 py-2 text-[9px] font-bold uppercase tracking-[0.2em] transition-all rounded-lg flex items-center justify-center gap-2 ${
              view === 'responders' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-white/30 hover:text-white/60'
            }`}
          >
            <Users className="w-3 h-3" /> Responders
          </button>
          <button 
            onClick={() => setView('resources')}
            className={`flex-1 py-2 text-[9px] font-bold uppercase tracking-[0.2em] transition-all rounded-lg flex items-center justify-center gap-2 ${
              view === 'resources' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'text-white/30 hover:text-white/60'
            }`}
          >
            <Package className="w-3 h-3" /> Resources
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 scrollbar-hide">
        <AnimatePresence mode="wait">
          {view === 'responders' ? (
            <motion.div 
              key="responders-list"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex flex-col gap-4"
            >
              {volunteers.map((volunteer) => (
                <motion.div 
                  key={volunteer.id}
                  onClick={() => {
                    if (volunteer.status === 'available') {
                      setSelectedVolunteerId(volunteer.id === selectedVolunteerId ? null : volunteer.id);
                    }
                  }}
                  className={`p-4 border rounded-2xl flex items-center gap-4 group transition-all cursor-pointer relative overflow-hidden ${
                    selectedVolunteerId === volunteer.id 
                      ? 'bg-cyan-500/10 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.1)]' 
                      : 'bg-black/40 border-white/5 hover:border-white/10 hover:bg-white/[0.02]'
                  }`}
                >
                  {selectedVolunteerId === volunteer.id && (
                     <motion.div 
                       layoutId="active-responder"
                       className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent pointer-events-none"
                     />
                  )}
                  
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center overflow-hidden transition-all ${
                       selectedVolunteerId === volunteer.id ? 'scale-110 border-cyan-500/30' : ''
                    }`}>
                      <Shield className={`w-5 h-5 transition-colors ${
                         selectedVolunteerId === volunteer.id ? 'text-cyan-400' : 'text-white/10'
                      }`} />
                    </div>
                    <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-[#020617] ${
                      volunteer.status === 'available' ? 'bg-emerald-500 animate-pulse' : 
                      volunteer.status === 'busy' ? 'bg-orange-500' : 'bg-slate-500'
                    }`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[11px] font-bold text-white mb-0.5 truncate uppercase tracking-tight">{volunteer.name}</h4>
                    <p className="text-[8px] font-mono text-white/30 flex items-center gap-1 uppercase tracking-tighter">
                      <MapPin className="w-2.5 h-2.5 text-cyan-500/40" />
                      VEC: {volunteer.location?.lat.toFixed(3)}, {volunteer.location?.lng.toFixed(3)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1 px-1">
                    <span className={`text-[8px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border ${
                      volunteer.status === 'available' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 
                      'bg-orange-500/5 border-orange-500/20 text-orange-400'
                    }`}>
                      {volunteer.status}
                    </span>
                    {volunteer.status === 'busy' && (
                      <div className="flex items-center gap-1 text-[8px] text-white/20 uppercase font-mono">
                        <Clock className="w-2.5 h-2.5" /> ON-MISN
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {volunteers.length === 0 && (
                <div className="py-20 text-center opacity-20">
                  <p className="text-[10px] font-mono uppercase tracking-widest">No Responders Online</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="resources-view"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex flex-col gap-4 h-full"
            >
              <AnimatePresence mode="wait">
                {!selectedDisasterId ? (
                  <motion.div 
                    key="resources-list"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col gap-4"
                  >
                    {activeDisasters.map((disaster) => (
                      <div 
                        key={disaster.id} 
                        onClick={() => setSelectedDisasterId(disaster.id)}
                        className="p-4 border border-white/5 bg-black/40 rounded-2xl space-y-4 hover:border-white/10 hover:bg-white/[0.02] cursor-pointer transition-all active:scale-[0.98]"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                              disaster.severity === 'high' ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' : 'bg-orange-500/10 border-orange-500/30 text-orange-500'
                            }`}>
                               <AlertCircle className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="text-[10px] font-bold text-white uppercase tracking-tight">{disaster.type} Unit</h4>
                              <p className="text-[8px] font-mono text-white/30 uppercase">Sector {disaster.location.lat.toFixed(0)}-{disaster.location.lng.toFixed(0)}</p>
                            </div>
                          </div>
                          <div className="text-white/20">
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 pointer-events-none">
                          <ResourceStat icon={Package} label="Food" value={disaster.resources?.food || 0} color="text-orange-400" />
                          <ResourceStat icon={Droplets} label="Water" value={disaster.resources?.water || 0} color="text-cyan-400" />
                          <ResourceStat icon={Heart} label="Medical" value={disaster.resources?.medicalKits || 0} color="text-rose-400" />
                        </div>
                      </div>
                    ))}
                    {activeDisasters.length === 0 && (
                      <div className="py-20 text-center opacity-20">
                        <p className="text-[10px] font-mono uppercase tracking-widest">No Active Missions</p>
                      </div>
                    )}
                  </motion.div>
                ) : selectedDisaster ? (
                  <motion.div 
                    key="resource-detail"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col gap-6"
                  >
                    <button 
                      onClick={() => setSelectedDisasterId(null)}
                      className="flex items-center gap-2 text-[8px] font-mono uppercase tracking-widest text-cyan-400/60 hover:text-cyan-400 transition-colors w-fit"
                    >
                      <X className="w-3 h-3" /> Back to list
                    </button>

                    <div className="p-6 border border-white/10 bg-white/5 rounded-3xl space-y-6">
                      <div className="flex items-start justify-between">
                         <div>
                            <span className={`text-[8px] font-mono font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded border mb-2 inline-block ${
                               selectedDisaster.severity === 'high' ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' : 'bg-orange-500/10 border-orange-500/30 text-orange-500'
                            }`}>
                               {selectedDisaster.severity} Priority
                            </span>
                            <h3 className="text-2xl font-black uppercase text-white truncate max-w-[200px]">{selectedDisaster.type}</h3>
                            <p className="text-[10px] font-mono text-white/40 tracking-wider">SEC: {selectedDisaster.location.lat.toFixed(4)}, {selectedDisaster.location.lng.toFixed(4)}</p>
                         </div>
                         <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <AlertCircle className={`w-6 h-6 ${selectedDisaster.severity === 'high' ? 'text-rose-500' : 'text-orange-500'}`} />
                         </div>
                      </div>

                      <div className="space-y-2">
                         <h4 className="text-[9px] font-bold uppercase tracking-widest text-white/60">Mission Summary</h4>
                         <p className="text-[11px] leading-relaxed text-white/40 font-medium">
                            {selectedDisaster.summary || `Strategic response initiated for ${selectedDisaster.type} event. All units must prioritize civilian evacuation and containment of immediate hazards in Sector ${selectedDisaster.location.lat.toFixed(0)}.`}
                         </p>
                      </div>

                      <div className="space-y-4">
                         <h4 className="text-[9px] font-bold uppercase tracking-widest text-white/60">Resource Allocation</h4>
                         <div className="grid grid-cols-1 gap-3">
                            <DetailedResource 
                               icon={Package} 
                               label="Emergency Rations" 
                               value={selectedDisaster.resources?.food || 0} 
                               unit="CAL"
                               color="text-orange-400" 
                            />
                            <DetailedResource 
                               icon={Droplets} 
                               label="Potable Water" 
                               value={selectedDisaster.resources?.water || 0} 
                               unit="LTR"
                               color="text-cyan-400" 
                            />
                            <DetailedResource 
                               icon={Heart} 
                               label="Advanced Medical Kits" 
                               value={selectedDisaster.resources?.medicalKits || 0} 
                               unit="PKT"
                               color="text-rose-400" 
                            />
                         </div>
                      </div>

                      <button 
                        onClick={() => handleResourceUpdate(selectedDisaster)}
                        disabled={updatingId === selectedDisaster.id}
                        className="w-full py-4 bg-cyan-500 text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-xl hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        <RefreshCw className={`w-4 h-4 ${updatingId === selectedDisaster.id ? 'animate-spin' : ''}`} />
                        {updatingId === selectedDisaster.id ? 'Updating Telemetry...' : 'Request Resource Update'}
                      </button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dispatch Trigger & Modal (Keep same as before, only showing when view is responders) */}
      {view === 'responders' && (
        <>
          <AnimatePresence>
            {selectedVolunteerId && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="absolute bottom-24 left-4 right-4 p-4 bg-cyan-500 rounded-xl shadow-lg shadow-cyan-500/20 z-10 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Send className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-white">
                    <p className="text-[10px] font-bold uppercase tracking-widest leading-none">Ready for Deployment</p>
                    <p className="text-[9px] opacity-70">Assign {volunteers.find(v => v.id === selectedVolunteerId)?.name} to a vector</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowDispatch(true)}
                  className="px-4 py-2 bg-white text-cyan-600 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-cyan-50 transition-all"
                >
                  Dispatch
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showDispatch && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#020617] z-20 flex flex-col"
              >
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">Select Dispatch Vector</h3>
                  <button 
                    onClick={() => setShowDispatch(false)}
                    className="text-white/40 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                  {activeDisasters.length > 0 ? (
                    activeDisasters.map(disaster => (
                      <button
                        key={disaster.id}
                        onClick={() => handleDispatch(selectedVolunteerId!, disaster.location, disaster.id)}
                        className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-left flex items-center gap-4"
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                          disaster.severity === 'high' ? 'bg-rose-500/20 border-rose-500/50 text-rose-500' :
                          disaster.severity === 'medium' ? 'bg-orange-500/20 border-orange-500/50 text-orange-500' :
                          'bg-cyan-500/20 border-cyan-500/50 text-cyan-500'
                        }`}>
                          <AlertCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-[11px] font-bold text-white uppercase">{disaster.type}</h4>
                          <p className="text-[8px] text-white/40 uppercase">{disaster.severity} priority zone</p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="py-20 text-center opacity-40">
                      <p className="text-[10px] font-mono text-white/60">No Active Vectors Found</p>
                      <p className="text-[8px] mt-2">Initialize simulation or wait for alerts</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      <div className="p-4 border-t border-white/5 bg-white/5 space-y-3">
        <div className="grid grid-cols-2 gap-2">
           <div className="bg-black/20 p-2 rounded-lg text-center border border-white/5">
              <p className="text-[8px] font-bold uppercase tracking-widest text-white/30 mb-0.5">Deployment</p>
              <p className="text-xs font-bold text-white">
                {((volunteers.filter(v => v.status === 'busy').length / (volunteers.length || 1)) * 100).toFixed(0)}%
              </p>
           </div>
           <div className="bg-black/20 p-2 rounded-lg text-center border border-white/5">
              <p className="text-[8px] font-bold uppercase tracking-widest text-white/30 mb-0.5">Available</p>
              <p className="text-xs font-bold text-white">{volunteers.filter(v => v.status === 'available').length}</p>
           </div>
        </div>

        <div className="pt-2">
           <div className="flex items-center justify-between mb-2">
              <span className="text-[7px] font-mono text-white/20 uppercase tracking-widest">Active Comm Links</span>
              <span className="text-[7px] font-mono text-cyan-500 uppercase animate-pulse">Encrypted</span>
           </div>
           <div className="flex gap-1">
              {[...Array(12)].map((_, i) => (
                <motion.div 
                  key={i}
                  animate={{ height: [4, 12, 6, 14, 4] }}
                  transition={{ duration: 1 + Math.random(), repeat: Infinity, ease: "easeInOut" }}
                  className="flex-1 bg-white/10 rounded-full"
                />
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}

function ResourceStat({ icon: Icon, label, value, color }: { icon: any, label: string, value: number, color: string }) {
  return (
    <div className="bg-white/[0.03] p-2 rounded-xl border border-white/5 text-center">
      <Icon className={`w-3 h-3 mx-auto mb-1 ${color}`} />
      <p className="text-[7px] font-mono text-white/20 uppercase tracking-tighter mb-0.5">{label}</p>
      <p className="text-[10px] font-black text-white">{value >= 1000 ? `${(value/1000).toFixed(1)}k` : value}</p>
    </div>
  );
}

function DetailedResource({ icon: Icon, label, value, unit, color }: { icon: any, label: string, value: number, unit: string, color: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-2xl group hover:bg-white/5 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl bg-black/40 border border-white/10 ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-white uppercase tracking-tight">{label}</p>
          <p className="text-[8px] font-mono text-white/30 uppercase">{unit} ALLOCATION</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-lg font-black tracking-tighter ${color}`}>{value.toLocaleString()}</p>
        <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden mt-1">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (value / 2000) * 100)}%` }}
            className={`h-full opacity-50 ${color.replace('text-', 'bg-')}`}
          />
        </div>
      </div>
    </div>
  );
}
