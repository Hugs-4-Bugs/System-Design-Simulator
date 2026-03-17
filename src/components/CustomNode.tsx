import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { 
  Server, 
  Database, 
  Zap, 
  Layers, 
  Cpu, 
  Globe, 
  ShieldCheck, 
  MessageSquare,
  Activity
} from 'lucide-react';
import { SystemNodeData } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const iconMap: Record<string, any> = {
  'api-gateway': ShieldCheck,
  'load-balancer': Layers,
  'microservice': Server,
  'database': Database,
  'cache': Zap,
  'queue': MessageSquare,
  'worker': Cpu,
  'cdn': Globe,
  'auth-service': ShieldCheck,
};

const CustomNode = ({ data, selected }: NodeProps<SystemNodeData>) => {
  const Icon = iconMap[data.type] || Server;
  const metrics = data.metrics;
  const isHealthy = !metrics || metrics.errorRate < 50;

  return (
    <div className={cn(
      "px-4 py-3 shadow-xl rounded-xl border-2 bg-zinc-900 transition-all duration-300 min-w-[180px]",
      selected ? "border-emerald-500 shadow-emerald-500/20" : "border-zinc-800",
      !isHealthy && "border-red-500 shadow-red-500/20 animate-pulse"
    )}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-emerald-500 border-2 border-zinc-900" />
      
      <div className="flex items-center gap-3 mb-2">
        <div className={cn(
          "p-2 rounded-lg",
          isHealthy ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
        )}>
          <Icon size={20} />
        </div>
        <div>
          <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{data.type.replace('-', ' ')}</div>
          <div className="text-sm font-semibold text-white">{data.label}</div>
        </div>
      </div>

      {metrics && (
        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-zinc-800/50">
          <div className="space-y-1">
            <div className="text-[10px] text-zinc-500 uppercase">RPS</div>
            <div className="text-xs font-mono text-emerald-400">{metrics.rps}</div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] text-zinc-500 uppercase">LATENCY</div>
            <div className="text-xs font-mono text-blue-400">{metrics.latency}ms</div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] text-zinc-500 uppercase">CPU</div>
            <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
              <div 
                className={cn("h-full transition-all duration-500", metrics.cpu > 80 ? "bg-red-500" : "bg-emerald-500")} 
                style={{ width: `${metrics.cpu}%` }} 
              />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] text-zinc-500 uppercase">ERROR</div>
            <div className="text-xs font-mono text-red-400">{metrics.errorRate}%</div>
          </div>
        </div>
      )}

      <div className="mt-2 flex justify-between items-center">
        <div className="text-[10px] text-zinc-500">Instances: {data.instances}</div>
        {data.instances > 1 && (
          <div className="flex gap-0.5">
            {[...Array(Math.min(3, data.instances))].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
            ))}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-emerald-500 border-2 border-zinc-900" />
    </div>
  );
};

export default memo(CustomNode);
