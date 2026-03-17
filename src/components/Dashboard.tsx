import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Activity, Zap, AlertCircle, Clock } from 'lucide-react';

interface DashboardProps {
  history: any[];
}

export default function Dashboard({ history }: DashboardProps) {
  const latest = history[history.length - 1] || { rps: 0, latency: 0, errorRate: 0 };

  return (
    <div className="w-96 h-full bg-zinc-900 border-l border-zinc-800 flex flex-col overflow-y-auto">
      <div className="p-6 border-b border-zinc-800">
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Real-time Metrics</h2>
      </div>

      <div className="p-6 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-800/50 p-4 rounded-2xl border border-zinc-800">
            <div className="flex items-center gap-2 text-emerald-500 mb-1">
              <Activity size={14} />
              <span className="text-[10px] font-bold uppercase">Throughput</span>
            </div>
            <div className="text-xl font-bold text-white">{latest.rps} <span className="text-xs font-normal text-zinc-500">req/s</span></div>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-2xl border border-zinc-800">
            <div className="flex items-center gap-2 text-blue-500 mb-1">
              <Clock size={14} />
              <span className="text-[10px] font-bold uppercase">Latency</span>
            </div>
            <div className="text-xl font-bold text-white">{latest.latency} <span className="text-xs font-normal text-zinc-500">ms</span></div>
          </div>
        </div>

        {/* Throughput Chart */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2">
              <Zap size={14} className="text-emerald-500" /> Throughput
            </h3>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorRps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis hide domain={[0, 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area type="monotone" dataKey="rps" stroke="#10b981" fillOpacity={1} fill="url(#colorRps)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Latency Chart */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2">
              <Clock size={14} className="text-blue-500" /> Latency
            </h3>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis hide domain={[0, 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Line type="monotone" dataKey="latency" stroke="#3b82f6" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Error Rate */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2">
              <AlertCircle size={14} className="text-red-500" /> Error Rate
            </h3>
            <span className="text-xs font-mono text-red-500">{latest.errorRate}%</span>
          </div>
          <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-500 transition-all duration-500" 
              style={{ width: `${latest.errorRate}%` }} 
            />
          </div>
        </section>

        {/* System Health */}
        <section className="bg-zinc-800/30 p-4 rounded-2xl border border-zinc-800/50">
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase mb-3">System Health</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-400">Availability</span>
              <span className="text-xs font-mono text-emerald-500">99.99%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-400">Queue Depth</span>
              <span className="text-xs font-mono text-zinc-300">12ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-400">Cache Hit Rate</span>
              <span className="text-xs font-mono text-zinc-300">84%</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
