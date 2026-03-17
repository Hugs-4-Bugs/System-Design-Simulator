import React, { useState } from 'react';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { suggestArchitecture } from '../services/geminiService';

interface AIAssistantProps {
  onSuggest: (data: any) => void;
  user: any;
  onLogin: () => void;
}

export default function AIAssistant({ onSuggest, user, onLogin }: AIAssistantProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSuggest = async () => {
    if (!prompt.trim()) return;
    
    if (!user) {
      onLogin();
      return;
    }

    setIsLoading(true);
    try {
      const suggestion = await suggestArchitecture(prompt, user.uid);
      onSuggest(suggestion);
      setPrompt('');
    } catch (error: any) {
      if (error.message === 'DAILY_LIMIT_REACHED') {
        return;
      }
      
      console.error("AI Suggestion failed", error);
      const errorMessage = error.message || "An unexpected error occurred.";
      toast.error(`Generation failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-50">
      <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-2 rounded-2xl shadow-2xl flex items-center gap-2">
        <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
          <Sparkles size={20} />
        </div>
        <input 
          type="text" 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSuggest()}
          placeholder="Ask AI to design an architecture (e.g., 'Design YouTube backend')"
          className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-zinc-500 px-2"
        />
        <button 
          onClick={handleSuggest}
          disabled={isLoading || !prompt.trim()}
          className="p-2 bg-emerald-500 text-zinc-950 rounded-xl hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
        </button>
      </div>
    </div>
  );
}
