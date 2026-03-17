import React from 'react';
import { 
  Server, 
  Database, 
  Zap, 
  Layers, 
  Cpu, 
  Globe, 
  ShieldCheck, 
  MessageSquare,
  Play,
  Square,
  Plus,
  Minus,
  AlertTriangle,
  Flame,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { ComponentType, SimulationState } from '../types';
import { motion } from 'motion/react';
import { Node } from 'reactflow';

const components: { type: ComponentType; icon: any; label: string }[] = [
  { type: 'cdn', icon: Globe, label: 'CDN' },
  { type: 'load-balancer', icon: Layers, label: 'Load Balancer' },
  { type: 'api-gateway', icon: ShieldCheck, label: 'API Gateway' },
  { type: 'auth-service', icon: ShieldCheck, label: 'Auth Service' },
  { type: 'microservice', icon: Server, label: 'Microservice' },
  { type: 'database', icon: Database, label: 'Database' },
  { type: 'cache', icon: Zap, label: 'Cache (Redis)' },
  { type: 'queue', icon: MessageSquare, label: 'Queue (Kafka)' },
  { type: 'worker', icon: Cpu, label: 'Worker' },
];

interface SidebarProps {
  simulationState: SimulationState;
  setSimulationState: React.Dispatch<React.SetStateAction<SimulationState>>;
  cost: number;
  nodes: Node[];
}

export default function Sidebar({ simulationState, setSimulationState, cost, nodes }: SidebarProps) {
  const onDragStart = (event: React.DragEvent, nodeType: ComponentType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const toggleSimulation = () => {
    setSimulationState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const adjustTraffic = (delta: number) => {
    setSimulationState(prev => ({ 
      ...prev, 
      trafficLoad: Math.max(0, prev.trafficLoad + delta) 
    }));
  };

  return (
    <div className="w-80 h-full bg-zinc-900 border-r border-zinc-800 flex flex-col overflow-y-auto">
      <div className="p-6 border-b border-zinc-800">
        <h1 className="text-xl font-bold text-white mb-1">System Design</h1>
        <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Simulator v1.0</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Simulation Controls */}
        <section>
          <h2 className="text-xs font-bold text-zinc-500 uppercase mb-4 tracking-wider">Simulation</h2>
          <div className="grid grid-cols-1 gap-3">
            <button 
              onClick={toggleSimulation}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                simulationState.isRunning 
                ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20" 
                : "bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
              }`}
            >
              {simulationState.isRunning ? <><Square size={18} fill="currentColor" /> Stop Simulation</> : <><Play size={18} fill="currentColor" /> Start Simulation</>}
            </button>
          </div>
        </section>

        {/* Traffic Controls */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Traffic Load</h2>
            <span className="text-xs font-mono text-emerald-500">{simulationState.trafficLoad} req/s</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => adjustTraffic(-100)} className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 text-zinc-400"><Minus size={16} /></button>
            <div className="flex-1 bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-300" 
                style={{ width: `${Math.min(100, (simulationState.trafficLoad / 5000) * 100)}%` }} 
              />
            </div>
            <button onClick={() => adjustTraffic(100)} className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 text-zinc-400"><Plus size={16} /></button>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <button 
              onClick={() => setSimulationState(prev => ({ ...prev, trafficLoad: 5000 }))}
              className="text-[10px] py-1.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-md hover:bg-red-500/20 flex items-center justify-center gap-1"
            >
              <TrendingUp size={12} /> DDoS Mode
            </button>
            <button 
              onClick={() => setSimulationState(prev => ({ ...prev, trafficLoad: 100 }))}
              className="text-[10px] py-1.5 bg-zinc-800 text-zinc-400 rounded-md hover:bg-zinc-700"
            >
              Reset Traffic
            </button>
          </div>
        </section>

        {/* Components */}
        <section>
          <h2 className="text-xs font-bold text-zinc-500 uppercase mb-4 tracking-wider">Components</h2>
          <div className="grid grid-cols-2 gap-2">
            {components.map((comp) => (
              <div
                key={comp.type}
                draggable
                onDragStart={(e) => onDragStart(e, comp.type)}
                className="flex flex-col items-center justify-center p-3 bg-zinc-800/50 border border-zinc-800 rounded-xl cursor-grab hover:border-emerald-500/50 hover:bg-zinc-800 transition-all group"
              >
                <comp.icon size={20} className="text-zinc-400 group-hover:text-emerald-500 mb-2" />
                <span className="text-[10px] font-medium text-zinc-400 text-center">{comp.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Chaos Mode */}
        <section>
          <h2 className="text-xs font-bold text-zinc-500 uppercase mb-4 tracking-wider">Chaos Engineering</h2>
          <div className="space-y-4">
            {/* Latency */}
            <button 
              onClick={() => setSimulationState(prev => ({ ...prev, chaosMode: { ...prev.chaosMode, latency: prev.chaosMode.latency === 0 ? 500 : 0 } }))}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-xs font-semibold ${
                simulationState.chaosMode.latency > 0 
                ? "bg-amber-500/10 border-amber-500/50 text-amber-500" 
                : "bg-zinc-800/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
              }`}
            >
              <AlertTriangle size={16} /> Add Network Latency
            </button>

            {/* Packet Loss */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Packet Loss</span>
                <span className="text-xs font-mono text-amber-500">{simulationState.chaosMode.packetLoss}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="50" 
                step="1"
                value={simulationState.chaosMode.packetLoss}
                onChange={(e) => setSimulationState(prev => ({ 
                  ...prev, 
                  chaosMode: { ...prev.chaosMode, packetLoss: parseInt(e.target.value) } 
                }))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Database Failure */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Database Failure</span>
              <div className="space-y-1">
                {nodes.filter(n => n.data.type === 'database').map(dbNode => (
                  <button
                    key={dbNode.id}
                    onClick={() => setSimulationState(prev => ({
                      ...prev,
                      chaosMode: {
                        ...prev.chaosMode,
                        failures: prev.chaosMode.failures.includes(dbNode.id)
                          ? prev.chaosMode.failures.filter(id => id !== dbNode.id)
                          : [...prev.chaosMode.failures, dbNode.id]
                      }
                    }))}
                    className={`w-full flex items-center justify-between p-2 rounded-lg border text-[10px] font-medium transition-all ${
                      simulationState.chaosMode.failures.includes(dbNode.id)
                      ? "bg-red-500/10 border-red-500/50 text-red-500"
                      : "bg-zinc-800/30 border-zinc-800/50 text-zinc-500 hover:bg-zinc-800"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Database size={12} />
                      {dbNode.data.label}
                    </div>
                    {simulationState.chaosMode.failures.includes(dbNode.id) ? 'FAILED' : 'HEALTHY'}
                  </button>
                ))}
                {nodes.filter(n => n.data.type === 'database').length === 0 && (
                  <p className="text-[10px] text-zinc-600 italic">No database nodes found</p>
                )}
              </div>
            </div>

            <button 
              onClick={() => {
                const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
                if (randomNode) {
                  setSimulationState(prev => ({
                    ...prev,
                    chaosMode: {
                      ...prev.chaosMode,
                      failures: prev.chaosMode.failures.includes(randomNode.id) 
                        ? prev.chaosMode.failures.filter(id => id !== randomNode.id)
                        : [...prev.chaosMode.failures, randomNode.id]
                    }
                  }));
                }
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl border bg-zinc-800/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800 text-xs font-semibold"
            >
              <Flame size={16} /> Kill Random Service
            </button>
          </div>
        </section>

        {/* Cost Estimator */}
        <section className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-emerald-500 mb-2">
            <DollarSign size={18} />
            <h2 className="text-xs font-bold uppercase tracking-wider">Monthly Cost</h2>
          </div>
          <div className="text-2xl font-bold text-white">${cost.toLocaleString()}</div>
          <p className="text-[10px] text-zinc-500 mt-1">Estimated AWS/GCP infrastructure cost</p>
        </section>
      </div>
    </div>
  );
}
