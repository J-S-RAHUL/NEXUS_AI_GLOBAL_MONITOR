import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, RefreshCw, Zap, Server, Globe, Users } from 'lucide-react';
import { createDisaster, createAlert, createVolunteer, fetchUSGSEarthquakes, fetchLiveWeatherAlerts } from '../services/dataService';
import { v4 as uuidv4 } from 'uuid';

export default function SimulationControls() {
  const [running, setRunning] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [intervalId, setIntervalId] = useState<any>(null);

  const syncLiveFeeds = async () => {
    setSyncing(true);
    try {
      await createAlert("SYSTEM: Initializing live tactical data sync...", "info");
      
      const earthquakes = await fetchUSGSEarthquakes();
      const weatherEvents = await fetchLiveWeatherAlerts();
      
      const allEvents = [...earthquakes, ...weatherEvents];
      
      if (allEvents.length === 0) {
        await createAlert("SYNC: No new significant global events detected in current window.", "info");
      } else {
        for (const event of allEvents.slice(0, 3)) { // Limit to top 3 to avoid spam
          await createDisaster(event);
          await createAlert(`LIVE: ${event.title.toUpperCase()} detected via orbital downlink. Severity: ${event.severity.toUpperCase()}`, event.severity === 'high' ? 'error' : 'warning');
        }
        await createAlert(`SYNC: Successfully synchronized ${Math.min(allEvents.length, 3)} live global vectors.`, "success");
      }
    } catch (error) {
      await createAlert("SYNC_ERROR: Failed to establish secure connection with global data nodes.", "error");
    } finally {
      setSyncing(false);
    }
  };

  const seedVolunteers = async () => {
    const names = [
      'DELTA-RAY 01', 'SIERRA-FOX 09', 'OMEGA-UNIT 12', 
      'RAPID-RESPONSE 04', 'ALPHA-CORE 07', 'VANGUARD-02',
      'VECTOR-PRIME', 'STEALTH-MED 11', 'HEAVY-ASSET 05'
    ];
    const shuffled = [...names].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    
    for (const name of selected) {
       await createVolunteer(name, {
          lat: 8 + Math.random() * 25,
          lng: 68 + Math.random() * 25
       });
    }
    await createAlert(`NEURAL: Provisioned ${selected.length} tactical units to active grid. Status nominal.`, "info");
  };

  const triggerRandomEvent = async () => {
    const scenarios = [
      { type: 'fire', title: 'Urban Structural Incursion', summary: 'Multi-story structural collapse and localized fire system failure detected in dense urban sector. Infrastructure damage to local power grid verified.' },
      { type: 'flood', title: 'Flash Surge Event', summary: 'Abrupt precipitation peak exceeding 200mm/hr. Low-lying residential sectors at risk of immediate inundation. Critical drainage blockage reported.' },
      { type: 'earthquake', title: 'Seismic Subduction Fault', summary: 'Magnitude 6.4 seismic activity localized at fault line intersections. Structural integrity of major transit hubs compromised. Secondary gas leak risks detected.' },
      { type: 'hurricane', title: 'Cyclonic Pressure Gradient', summary: 'Sustained wind velocities exceeding 140km/h. High probability of maritime asset failure and communication tower misalignment in coastal vectors.' },
      { type: 'tornado', title: 'Atmospheric Vortex Cell', summary: 'Vortex formation verified via Doppler telemetry. Non-linear trajectory impacting industrial zones. High-velocity debris mitigation protocols engaged.' }
    ];
    
    const severities = ['low', 'medium', 'high'];
    
    // Random location in India
    const lat = 8 + Math.random() * 25;
    const lng = 68 + Math.random() * 25;
    
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)] as 'low' | 'medium' | 'high';
    
    const popBase = severity === 'high' ? 8000 : severity === 'medium' ? 2500 : 450;
    const affectedPopulation = Math.floor(popBase + Math.random() * popBase);

    const disaster = {
      id: uuidv4(),
      type: scenario.type,
      title: scenario.title,
      severity,
      location: { lat, lng },
      summary: scenario.summary,
      affectedPopulation,
      resources: {
        food: Math.floor(affectedPopulation * (6 + Math.random() * 4)),
        water: Math.floor(affectedPopulation * (12 + Math.random() * 8)),
        medicalKits: Math.ceil(affectedPopulation / (8 + Math.random() * 4))
      },
      casualties: Math.floor(affectedPopulation * (severity === 'high' ? 0.05 : 0.01)),
      infrastructureDamage: Math.floor(Math.random() * 100),
      evacuationStatus: Math.floor(Math.random() * 40)
    };

    await createDisaster(disaster);
    await createAlert(`TACTICAL: ${scenario.title.toUpperCase()} confirmed in Sector ${Math.floor(lat)}-${Math.floor(lng)}. Deploying resources.`, severity === 'high' ? 'error' : 'warning');
  };

  const toggleSimulation = () => {
    if (running) {
      clearInterval(intervalId);
      setRunning(false);
    } else {
      const id = setInterval(triggerRandomEvent, 15000); // Every 15 seconds
      setIntervalId(id);
      setRunning(true);
      triggerRandomEvent();
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-xl p-5">
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-3 h-3 rounded-full ${running ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`} />
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Simulation Engine</h3>
          <p className="text-[9px] text-white/40 uppercase tracking-widest">{running ? 'Operational' : 'On Standby'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={toggleSimulation}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-[10px] font-bold uppercase tracking-[0.1em] transition-all ${
            running 
            ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20' 
            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
          }`}
        >
          {running ? <><Pause className="w-3 h-3" /> Halt Engine</> : <><Play className="w-3 h-3" /> Start Simulation</>}
        </button>
        
        <button 
          onClick={triggerRandomEvent}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-[10px] font-bold uppercase tracking-[0.1em] bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 transition-all"
        >
          <RefreshCw className="w-3 h-3" /> Force Event
        </button>

        <button 
          onClick={syncLiveFeeds}
          disabled={syncing}
          className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-[10px] font-bold uppercase tracking-[0.1em] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all disabled:opacity-50"
        >
          <Globe className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} /> {syncing ? 'Syncing Nodes...' : 'Sync Live Global Feeds'}
        </button>

        <button 
          onClick={seedVolunteers}
          className="col-span-2 mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-[10px] font-bold uppercase tracking-[0.1em] bg-cyan-900/20 text-cyan-400 border border-cyan-500/10 hover:bg-cyan-900/40 transition-all"
        >
          <Users className="w-3 h-3" /> Seed Responders
        </button>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between text-[8px] font-mono uppercase text-white/40">
          <span>Orbital Sync</span>
          <span className="text-emerald-500">Active</span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-cyan-500"
            animate={{ width: running ? ['0%', '100%'] : '100%' }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    </div>
  );
}
