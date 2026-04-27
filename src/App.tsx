import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  ChevronRight, 
  Loader2, 
  Activity, 
  Map as MapIcon, 
  Bell, 
  Users,
  AlertTriangle
} from 'lucide-react';
import { auth } from './lib/firebase';
import { subscribeToDisasters, subscribeToAlerts, subscribeToVolunteers, dispatchVolunteer } from './services/dataService';

// Components
import Layout from './components/Layout';
import MapDashboard from './components/MapDashboard';
import ActivityFeed from './components/ActivityFeed';
import VolunteerPanel from './components/VolunteerPanel';
import SimulationControls from './components/SimulationControls';
import SidePanel from './components/SidePanel';
import VolunteerSim from './components/VolunteerSim';
import HUDOverlay from './components/HUDOverlay';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

// --- Login Screen ---

const LoginScreen = () => {
  const handleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  return (
    <div className="h-screen w-full bg-[#020617] text-white overflow-hidden relative font-sans">
      {/* Background Cinematic Asset */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-60 scale-110"
          alt="Orbital Background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/80 via-transparent to-[#020617]/40" />
      </div>

      {/* Top Navigation */}
      <nav className="absolute top-0 left-0 w-full z-50 px-12 py-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md">
            <div className="w-6 h-6 rounded-full border border-cyan-500/50 flex items-center justify-center">
              <Shield className="w-3 h-3 text-cyan-400" />
            </div>
          </div>
          <span className="font-medium tracking-[0.6em] text-xl uppercase text-white/90">Nexus</span>
        </div>

        <div className="hidden lg:flex items-center gap-10 text-[10px] font-medium uppercase tracking-[0.4em] text-white/40">
          <a href="#" className="hover:text-cyan-400 transition-colors">Navigation</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Automations</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Resources</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Contact</a>
        </div>

        <div className="flex items-center gap-8">
          <button onClick={handleLogin} className="text-[10px] font-medium uppercase tracking-[0.4em] text-white/40 hover:text-white transition-colors">Log in</button>
          <button onClick={handleLogin} className="bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-400 text-[10px] font-bold uppercase tracking-[0.2em] px-8 py-3 rounded-md backdrop-blur-md border border-cyan-500/30 transition-all active:scale-95">
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-12 lg:px-24">
        <div className="max-w-3xl space-y-8">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-cyan-500/80 font-medium text-[12px] tracking-[0.4em] uppercase"
          >
            Nexus System
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-7xl lg:text-8xl font-medium leading-[1.05] tracking-tight"
          >
            Autonomous.<br />
            Life-Saving.
          </motion.h1>
        </div>
      </div>

      {/* Right Stats Sidebar */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 z-20 space-y-6 w-72">
        <StatCard 
          title="Avg. Threat Reduction" 
          value="84.2%" 
          color="text-emerald-500" 
          chartColor="#10b981"
        />
        <StatCard 
          title="Active Deployment Latency" 
          value="36.1s" 
          color="text-cyan-400" 
          chartColor="#22d3ee"
        />
        <StatCard 
          title="Resource Flow Efficacy" 
          value="91.4%" 
          color="text-cyan-400" 
          chartColor="#22d3ee"
        />
      </div>

      {/* Bottom Status Bar */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 w-full max-w-5xl px-6">
        <div className="bg-black/20 backdrop-blur-2xl border border-white/5 rounded-2xl p-6 flex justify-between items-center shadow-2xl">
          <BottomStat label="Neural Accuracy" value="98.2%" />
          <div className="w-px h-8 bg-white/5" />
          <BottomStat label="Lives Safeguarded" value="12k+" />
          <div className="w-px h-8 bg-white/5" />
          <BottomStat label="Alert Nodes" value="4.2k" />
          <div className="w-px h-8 bg-white/5" />
          <BottomStat label="Mitigated Risk" value="High" />
        </div>
      </div>

      {/* Center Globe Markers (Data Signals) */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute left-[45%] top-[40%]"
        >
          <div className="flex flex-col items-start gap-1">
             <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
             <div className="text-[8px] font-mono text-cyan-400/80 uppercase tracking-widest bg-black/40 px-2 py-0.5 rounded">
               Data Signal: Active
             </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute left-[55%] top-[60%]"
        >
          <div className="flex flex-col items-start gap-1">
             <div className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
             <div className="text-[8px] font-mono text-red-400/80 uppercase tracking-widest bg-black/40 px-2 py-0.5 rounded">
               Threat Detected
             </div>
          </div>
        </motion.div>
      </div>

      {/* Orbital Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none z-40 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,4px_100%]" />
    </div>
  );
};

const StatCard = ({ title, value, color, chartColor }: { title: string, value: string, color: string, chartColor: string }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="bg-black/30 backdrop-blur-xl border border-white/5 rounded-xl p-6 space-y-4 shadow-xl hover:border-white/10 transition-all group"
  >
    <div className="space-y-1">
      <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/40">{title}</p>
      <p className={`text-4xl font-black ${color} tracking-tight`}>{value}</p>
    </div>
    
    <div className="h-10 w-full flex items-end">
      <svg className="w-full h-full" viewBox="0 0 200 40">
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2 }}
          d="M0,35 Q20,30 40,35 T80,25 T120,30 T160,10 T200,20"
          fill="none"
          stroke={chartColor}
          strokeWidth="1.5"
          className="opacity-60"
        />
      </svg>
    </div>
  </motion.div>
);

const BottomStat = ({ label, value }: { label: string, value: string }) => (
  <div className="flex items-center gap-4 group cursor-default">
    <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-white/30 group-hover:text-cyan-400 transition-colors">{label}:</span>
    <span className="text-xl font-bold text-cyan-400/90 tracking-tight">{value}</span>
  </div>
);


const VitalBox = ({ label, value }: { label: string, value: string }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1">
     <p className="text-[8px] font-mono text-white/30 uppercase tracking-[0.2em]">{label}</p>
     <p className="text-xl font-black text-white tracking-widest">{value}</p>
  </div>
);

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [disasters, setDisasters] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [selectedDisaster, setSelectedDisaster] = useState<any | null>(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const unsubD = subscribeToDisasters(setDisasters);
    const unsubA = subscribeToAlerts(setAlerts);
    const unsubV = subscribeToVolunteers(setVolunteers);

    return () => {
      unsubD();
      unsubA();
      unsubV();
    };
  }, [user]);

  if (loading) return (
    <div className="h-screen w-full bg-[#020617] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
        <p className="text-cyan-500 font-mono text-[10px] uppercase tracking-[0.4em] animate-pulse">Syncing Neural Core...</p>
      </div>
    </div>
  );

  if (!user) return <LoginScreen />;

  return (
    <Layout user={user} activeTab={activeTab} setActiveTab={setActiveTab}>
      <VolunteerSim volunteers={volunteers} />
      <div className="h-full flex relative overflow-hidden">
        
        {/* Primary Content (Dashboard / Analysis) */}
        <div className="flex-1 overflow-y-auto bg-black scrollbar-hide relative">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <MapDashboard disasters={disasters} onSelectDisaster={setSelectedDisaster} />
                
                {/* Floating HUD controls on Map */}
                <div className="absolute top-8 left-8 flex flex-col gap-4 pointer-events-none">
                   <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-4 pointer-events-auto">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/40">
                         <AlertTriangle className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                         <p className="text-[10px] font-bold uppercase tracking-widest text-white">Grid Status</p>
                         <p className="text-[9px] font-mono text-orange-400 mt-0.5">{disasters.filter(d => d.severity === 'high').length} High-Risk Zones</p>
                      </div>
                   </div>
                </div>

                <div className="absolute bottom-8 left-8 pointer-events-auto max-w-sm">
                   <SimulationControls />
                </div>
              </motion.div>
            )}

            {activeTab === 'volunteers' && (
              <motion.div 
                key="volunteers"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-12 relative min-h-full"
              >
                <div className="mb-12">
                   <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">Tactical <span className="text-cyan-500">Responders</span></h2>
                   <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.2em]">Deployment status for {volunteers.length} active units</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {volunteers.map(v => (
                    <div key={v.id} className={`p-6 border rounded-2xl transition-all duration-500 group hover:scale-[1.02] ${
                      v.status === 'busy' ? 'bg-orange-500/5 border-orange-500/20' : 'bg-white/5 border-white/10'
                    }`}>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center group-hover:border-cyan-500/50 transition-colors">
                          <Users className={`w-6 h-6 ${v.status === 'available' ? 'text-emerald-400' : 'text-orange-400'}`} />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg group-hover:text-cyan-400 transition-colors">{v.name}</h4>
                          <span className={`text-[10px] font-mono uppercase ${v.status === 'available' ? 'text-emerald-400' : 'text-orange-400'}`}>
                            {v.status === 'available' ? 'Rescuer-Alpha (Standby)' : 'Active-Deployment'}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-white/40 mb-6 font-medium leading-relaxed">
                        {v.status === 'available' 
                          ? `Standing by at vector ${v.location.lat.toFixed(2)}N, ${v.location.lng.toFixed(2)}E. Structural integrity verified.` 
                          : `En route to hazard zone. ETA: 8m. Mission clock active. Life-signs stable.`}
                      </p>
                      
                      {v.status === 'available' ? (
                        <button 
                          onClick={() => {
                            const d = disasters.find(d => d.status === 'active');
                            if (d) {
                              dispatchVolunteer(v.id, d.location, d.id);
                            } else {
                              // Random point in India if no disaster
                              dispatchVolunteer(v.id, { lat: 20 + Math.random() * 5, lng: 78 + Math.random() * 5 });
                            }
                          }}
                          className="w-full py-3 bg-cyan-500 text-black font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
                        >
                          Dispatch Instruction
                        </button>
                      ) : (
                        <button className="w-full py-3 bg-white/5 text-white/20 font-bold uppercase tracking-widest text-[10px] rounded-xl cursor-not-allowed border border-white/5">
                          Mission In Progress
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <HUDOverlay />
              </motion.div>
            )}

            {activeTab === 'analytics' && (
               <motion.div 
                 key="analytics"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="p-12 relative min-h-full"
               >
                 <div className="mb-12 flex items-end justify-between">
                    <div>
                       <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">Impact <span className="text-cyan-500">Analytics</span></h2>
                       <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.2em]">Global response efficiency & casualty mitigation</p>
                    </div>
                    <div className="flex gap-4">
                       <div className="text-right">
                          <p className="text-[9px] font-mono text-cyan-500/60 uppercase">System Integrity</p>
                          <p className="text-xl font-black text-white">NOMINAL</p>
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* casualty chart */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
                       <div className="flex items-center justify-between">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Casualty Mitigation Vector</p>
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                             <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em]">-24% THREAT REDUCTION</span>
                          </div>
                       </div>
                       <div className="h-64 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                             <AreaChart data={[
                                { name: '00:00', val: 400, cap: 200 },
                                { name: '04:00', val: 300, cap: 150 },
                                { name: '08:00', val: 600, cap: 400 },
                                { name: '12:00', val: 800, cap: 600 },
                                { name: '16:00', val: 500, cap: 300 },
                                { name: '20:00', val: 900, cap: 700 },
                                { name: '24:00', val: 700, cap: 550 },
                             ]}>
                                <defs>
                                   <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                   </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="name" stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                                <Tooltip 
                                   contentStyle={{ backgroundColor: '#020617', border: '1px solid #ffffff20', borderRadius: '8px' }}
                                   itemStyle={{ color: '#06b6d4' }}
                                />
                                <Area type="monotone" dataKey="val" name="Threat Index" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorVal)" />
                                <Area type="monotone" dataKey="cap" name="Mitigated" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                             </AreaChart>
                          </ResponsiveContainer>
                       </div>
                    </div>

                    {/* response time chart */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
                       <div className="flex items-center justify-between">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-orange-400">Response Latency (By Region)</p>
                          <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em]">AVG: 38.2m Deployment Time</span>
                       </div>
                       <div className="h-64 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                             <BarChart data={[
                                { name: 'Asia', time: 45, target: 40 },
                                { name: 'Europe', time: 32, target: 40 },
                                { name: 'NA', time: 28, target: 40 },
                                { name: 'SA', time: 55, target: 40 },
                                { name: 'Africa', time: 62, target: 40 },
                                { name: 'Oceania', time: 38, target: 40 },
                             ]}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="name" stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                                <Tooltip 
                                   contentStyle={{ backgroundColor: '#020617', border: '1px solid #ffffff20', borderRadius: '8px' }}
                                   itemStyle={{ color: '#f97316' }}
                                />
                                <Bar dataKey="time" name="Actual Prep Time" fill="#f97316" radius={[4, 4, 0, 0]}>
                                   { [0,1,2,3,4,5].map((entry, index) => (
                                      <Cell key={`cell-${index}`} fillOpacity={0.4 + (index * 0.1)} />
                                   ))}
                                </Bar>
                             </BarChart>
                          </ResponsiveContainer>
                       </div>
                    </div>

                    {/* system vitals */}
                    <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                       <VitalBox label="Resource Efficiency" value="84%" />
                       <VitalBox label="Uptime Sigma" value="99.99%" />
                       <VitalBox label="Node Latency" value="12ms" />
                       <VitalBox label="Active Responders" value={volunteers.length.toString()} />
                    </div>

                    <div className="lg:col-span-2 p-8 border border-white/10 bg-white/[0.02] rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-12">
                       <div className="space-y-4">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Casualty Avoidance Index</p>
                          <div className="flex items-baseline gap-2">
                             <p className="text-5xl font-black tracking-tighter text-white">92.4%</p>
                             <span className="text-emerald-500 font-mono text-[10px] uppercase font-bold">+2.1% PREV. WK</span>
                          </div>
                          <p className="text-[11px] text-white/30 leading-relaxed uppercase">Neural core optimization has resulted in a significant increase in early-warning effectiveness.</p>
                       </div>
                       <div className="space-y-4">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-orange-400">Resource Delivery Velocity</p>
                          <div className="flex items-baseline gap-2">
                             <p className="text-5xl font-black tracking-tighter text-white">1.8h</p>
                             <span className="text-orange-500 font-mono text-[10px] uppercase font-bold">-0.4h AVG</span>
                          </div>
                          <p className="text-[11px] text-white/30 leading-relaxed uppercase">Deployment speed for critical medical assets is trending towards sub-90 minute global capability.</p>
                       </div>
                       <div className="space-y-4">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-rose-400">Total Mitigated Losses</p>
                          <div className="flex items-baseline gap-2">
                             <p className="text-5xl font-black tracking-tighter text-white">$4.2B</p>
                             <span className="text-rose-500 font-mono text-[10px] uppercase font-bold">EST. IMPACT</span>
                          </div>
                          <p className="text-[11px] text-white/30 leading-relaxed uppercase">Cumulative infrastructure protection value according to orbital damage assessment model.</p>
                       </div>
                    </div>
                 </div>
                 <HUDOverlay />
               </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Sidebar: Feed & Volunteers */}
        {activeTab === 'dashboard' && (
          <aside className="w-96 border-l border-white/5 flex flex-col bg-[#020617]/50 backdrop-blur-3xl">
            <div className="flex-1 overflow-hidden">
               <ActivityFeed alerts={alerts} />
            </div>
            <div className="h-96 border-t border-white/5 overflow-hidden">
               <VolunteerPanel volunteers={volunteers} disasters={disasters} />
            </div>
          </aside>
        )}

        {/* Selected Event Detail Overlay */}
        <AnimatePresence>
          {selectedDisaster && (
            <SidePanel 
              disaster={selectedDisaster} 
              onClose={() => setSelectedDisaster(null)} 
            />
          )}
        </AnimatePresence>

      </div>
    </Layout>
  );
}
