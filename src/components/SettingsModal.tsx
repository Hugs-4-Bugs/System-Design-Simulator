import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Database, Save, AlertCircle } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [dbId, setDbId] = useState(localStorage.getItem('firebase_database_id_override') || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    if (dbId.trim()) {
      localStorage.setItem('firebase_database_id_override', dbId.trim());
    } else {
      localStorage.removeItem('firebase_database_id_override');
    }
    setIsSaved(true);
    setTimeout(() => {
      window.location.reload(); // Reload to apply new firebase config
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
        >
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <Database className="text-emerald-500" size={20} />
              </div>
              <h2 className="text-xl font-bold">Database Configuration</h2>
            </div>
            <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Firestore Database ID</label>
              <input
                type="text"
                value={dbId}
                onChange={(e) => setDbId(e.target.value)}
                placeholder="(default)"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
              />
              <p className="text-xs text-zinc-500 italic">
                Leave empty to use the default environment configuration.
              </p>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex gap-3">
              <AlertCircle className="text-amber-500 shrink-0" size={20} />
              <p className="text-sm text-amber-200/80 leading-relaxed">
                Changing the Database ID will cause the application to reload. Ensure your Firestore instance is correctly set up in the Firebase Console.
              </p>
            </div>

            <button
              onClick={handleSave}
              disabled={isSaved}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                isSaved 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-zinc-100 text-zinc-900 hover:bg-white'
              }`}
            >
              {isSaved ? (
                <>Saved! Reloading...</>
              ) : (
                <>
                  <Save size={20} />
                  Save Configuration
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
