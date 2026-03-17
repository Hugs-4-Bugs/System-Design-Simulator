import React from 'react';
import { Sparkles, Zap, Shield, Share2, Maximize2, X } from 'lucide-react';

interface WelcomeOverlayProps {
  onClose: () => void;
}

export default function WelcomeOverlay({ onClose }: WelcomeOverlayProps) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
        <div className="relative p-8 text-center space-y-6">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-all"
          >
            <X size={24} />
          </button>

          <div className="inline-flex p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl mb-2">
            <Sparkles size={40} />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white">Welcome to System Design Simulator</h2>
            <p className="text-zinc-400 max-w-md mx-auto">The ultimate playground for designing, simulating, and stress-testing production-ready architectures.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="p-4 bg-zinc-800/50 rounded-2xl border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-500">
                <Zap size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">Real-time Simulation</span>
              </div>
              <p className="text-xs text-zinc-500">Watch request flows and monitor latency, RPS, and error rates live.</p>
            </div>
            <div className="p-4 bg-zinc-800/50 rounded-2xl border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2 text-blue-500">
                <Shield size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">Chaos Engineering</span>
              </div>
              <p className="text-xs text-zinc-500">Inject failures and latency to test your system's resilience.</p>
            </div>
            <div className="p-4 bg-zinc-800/50 rounded-2xl border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2 text-purple-500">
                <Share2 size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">Collaboration</span>
              </div>
              <p className="text-xs text-zinc-500">Save your designs and share them with your team or community.</p>
            </div>
            <div className="p-4 bg-zinc-800/50 rounded-2xl border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-500">
                <Maximize2 size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">Immersive Mode</span>
              </div>
              <p className="text-xs text-zinc-500">Expand to full screen for a focused architecture design experience.</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-emerald-500/20"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
