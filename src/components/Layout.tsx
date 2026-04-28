import React from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  Map as MapIcon, 
  Shield, 
  Users, 
  Settings, 
  AlertCircle,
  Database,
  BarChart3,
  Search,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { auth } from '../lib/firebase';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
}

const SidebarItem = ({ icon: Icon, label, id, active, onClick }: any) => (
  <button 
    onClick={() => onClick(id)}
    className={`w-full flex items-center gap-4 px-6 py-4 transition-all relative group ${
      active 
      ? 'text-cyan-400 bg-cyan-400/5' 
      : 'text-white/40 hover:text-white/70 hover:bg-white/5'
    }`}
  >
    {active && <motion.div layoutId="active-nav" className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]" />}
    <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${active ? 'animate-pulse' : ''}`} />
    <span className="text-[11px] font-bold uppercase tracking-[0.2em]">{label}</span>
    {active && <ChevronRight className="w-3 h-3 ml-auto opacity-50" />}
  </button>
);

export default function Layout({ children, activeTab, setActiveTab, user }: LayoutProps) {
  return (
    <div className="flex h-screen w-full bg-[#020617] text-slate-200 overflow-hidden font-sans selection:bg-cyan-500/30 relative">
      {/* Global CRT Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none z-[100] opacity-[0.015] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_3px,3px_100%] transition-opacity duration-1000" />
      
      {/* Structural Sidebar */}
      <aside className="w-72 bg-[#020617] border-r border-white/5 flex flex-col z-50 relative overflow-hidden">
        <div className="scanline" />
        
        {/* Logo Section */}
        <div className="p-8 pb-12 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold tracking-[0.3em] uppercase text-xl leading-none glitch-text cursor-default">Nexus</h1>
            <span className="text-[9px] font-mono text-cyan-500/60 uppercase tracking-[0.2em] mt-1 block">System Command Core</span>
          </div>
        </div>

        {/* Tactical Globe Hook */}
        <div className="relative h-64 w-full -mt-8 mb-4 flex items-center justify-center overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent to-[#020617] z-10" />
          
          <motion.div 
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-[180%] h-[180%] absolute"
          >
             <div className="w-full h-full rounded-full border border-cyan-500/20 scale-90 translate-y-4" />
          </motion.div>

          {/* Animated Globe Component */}
          <div className="w-40 h-40 relative z-0">
             <motion.div 
               animate={{ 
                 y: [0, -10, 0],
                 rotateY: 360 
               }}
               transition={{ 
                 y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                 rotateY: { duration: 20, repeat: Infinity, ease: "linear" }
               }}
               className="w-full h-full rounded-full border border-cyan-500/10 flex items-center justify-center relative shadow-[0_0_60px_rgba(6,182,212,0.05)]"
               style={{ transformStyle: 'preserve-3d' }}
             >
                {/* Horizontal Rings */}
                {[0.2, 0.4, 0.6, 0.8].map((scale, i) => (
                  <motion.div 
                    key={`h-ring-${i}`}
                    animate={{ rotateZ: i % 2 === 0 ? 360 : -360 }}
                    transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border border-cyan-500/10 rounded-full"
                    style={{ transform: `scaleY(${scale})` }}
                  />
                ))}

                {/* Vertical Rings */}
                {[0.2, 0.4, 0.6, 0.8].map((scale, i) => (
                  <motion.div 
                    key={`v-ring-${i}`}
                    animate={{ rotateX: i % 2 === 0 ? 360 : -360 }}
                    transition={{ duration: 12 + i * 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border border-cyan-500/5 rounded-full"
                    style={{ transform: `scaleX(${scale})` }}
                  />
                ))}

                {/* Orbital Nodes */}
                {[0, 120, 240].map((angle, i) => (
                  <motion.div
                    key={`node-${i}`}
                    animate={{ rotateY: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear", delay: i * 1.5 }}
                    className="absolute inset-0 z-20"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div 
                      className="w-1.5 h-1.5 rounded-full bg-cyan-400 absolute left-1/2 -top-1 shadow-[0_0_10px_#06b6d4]"
                      style={{ transform: 'translateX(-50%) translateZ(80px)' }}
                    />
                  </motion.div>
                ))}

                {/* Core pulse */}
                <div className="relative flex items-center justify-center">
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute w-8 h-8 rounded-full bg-cyan-500/20 blur-xl"
                  />
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shadow-[0_0_15px_#06b6d4]" />
                  <div className="w-1 h-1 rounded-full bg-white absolute z-10" />
                </div>
             </motion.div>
          </div>
          
          <div className="absolute bottom-6 left-0 right-0 text-center">
             <div className="flex flex-col items-center gap-1">
                <span className="text-[7px] font-mono text-cyan-500 animate-pulse uppercase tracking-[0.5em]">Global Grid Active</span>
                <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
             </div>
          </div>
        </div>

        {/* System Monitoring Mock */}
        <div className="px-8 mb-6 space-y-3">
           <div className="flex justify-between items-center text-[8px] font-mono uppercase tracking-widest text-white/30">
              <span>Neural Load</span>
              <span className="text-cyan-400">42%</span>
           </div>
           <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '42%' }}
                className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
              />
           </div>
           <div className="flex justify-between items-center text-[8px] font-mono uppercase tracking-widest text-white/30">
              <span>Grid Sync</span>
              <span className="text-emerald-400 text-[10px]">● Active</span>
           </div>
        </div>

        {/* Global Search Mock */}
        <div className="px-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input 
               type="text" 
               placeholder="Search Global Grid..."
               className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-[10px] font-mono text-white/60 placeholder:text-white/20 focus:outline-none focus:border-cyan-500/30 transition-all"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          <p className="px-8 text-[9px] font-mono text-white/30 uppercase tracking-[0.2em] mb-4">Operations</p>
          <SidebarItem icon={MapIcon} label="Tactical Grid" id="dashboard" active={activeTab === 'dashboard'} onClick={setActiveTab} />
          <SidebarItem icon={Users} label="Responders" id="volunteers" active={activeTab === 'volunteers'} onClick={setActiveTab} />
          <SidebarItem icon={BarChart3} label="Impact Analytics" id="analytics" active={activeTab === 'analytics'} onClick={setActiveTab} />
          
          <div className="pt-8">
            <p className="px-8 text-[9px] font-mono text-white/30 uppercase tracking-[0.2em] mb-4">Security</p>
            <SidebarItem icon={Database} label="Neural History" id="history" active={activeTab === 'history'} onClick={setActiveTab} />
            <SidebarItem icon={Settings} label="Core Overrides" id="settings" active={activeTab === 'settings'} onClick={setActiveTab} />
          </div>
        </nav>

        {/* User Status / Footer */}
        <div className="mt-auto p-6 bg-white/5 border-t border-white/5">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border border-white/20 bg-slate-800 flex items-center justify-center relative overflow-hidden group">
                 {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                 ) : (
                    <span className="text-xs font-bold text-white/40 uppercase">{user?.email?.charAt(0) || 'A'}</span>
                 )}
                 <div className="absolute inset-0 bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex-1 min-w-0">
                 <p className="text-[11px] font-bold text-white truncate">{user?.displayName || user?.email?.split('@')[0] || 'Operator 001'}</p>
                 <p className="text-[9px] font-mono text-cyan-400 uppercase tracking-tighter truncate">Neural-Locked</p>
              </div>
              <button 
                onClick={() => auth.signOut()}
                className="p-2 hover:bg-white/10 rounded-lg transition-all text-white/30 hover:text-red-400 group"
                title="Disconnect"
              >
                 <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </button>
           </div>
        </div>
      </aside>

      {/* Main View Area */}
      <main className="flex-1 relative overflow-hidden">
        {children}
      </main>

      {/* Extreme Depth FX */}
      <div className="fixed inset-0 pointer-events-none border-[32px] border-[#020617] z-[100] opacity-50" />
    </div>
  );
}
