import React from 'react';
import { X, Copy, Check, Twitter, Linkedin, Facebook } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

export default function ShareModal({ isOpen, onClose, url }: ShareModalProps) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Share Architecture</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Share Link</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                readOnly 
                value={url}
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm text-zinc-300 outline-none"
              />
              <button 
                onClick={copyToClipboard}
                className="p-2 bg-emerald-500 text-zinc-950 rounded-xl hover:bg-emerald-400 transition-all"
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button className="flex flex-col items-center gap-2 p-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-2xl border border-zinc-800 transition-all group">
              <Twitter size={24} className="text-sky-400 group-hover:scale-110 transition-all" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase">Twitter</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-2xl border border-zinc-800 transition-all group">
              <Linkedin size={24} className="text-blue-500 group-hover:scale-110 transition-all" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase">LinkedIn</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-2xl border border-zinc-800 transition-all group">
              <Facebook size={24} className="text-blue-600 group-hover:scale-110 transition-all" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase">Facebook</span>
            </button>
          </div>
        </div>

        <div className="p-6 bg-zinc-800/30 text-center">
          <p className="text-xs text-zinc-500">Anyone with this link can view and simulate this architecture.</p>
        </div>
      </div>
    </div>
  );
}
