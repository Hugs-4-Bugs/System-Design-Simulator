import React, { useState } from 'react';
import { Save, Share2, LogIn, User, LogOut, Download, Clock, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  onSave: () => void;
  onShare: () => void;
  onDownloadPDF: () => void;
  onOpenSavedDesigns: () => void;
  user: any;
  onLogin: () => void;
  onLogout: () => void;
}

export default function Header({ 
  onSave, 
  onShare, 
  onDownloadPDF, 
  onOpenSavedDesigns,
  user, 
  onLogin, 
  onLogout 
}: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-6 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Save className="text-zinc-950" size={24} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white leading-tight">System Design Simulator</h1>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Production Ready Architecture</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={onSave}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-all text-sm font-semibold border border-zinc-700"
        >
          <Save size={18} />
          Save Design
        </button>
        <button 
          onClick={onDownloadPDF}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-all text-sm font-semibold border border-zinc-700"
        >
          <Download size={18} />
          PDF
        </button>
        <button 
          onClick={onShare}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-all text-sm font-semibold border border-zinc-700"
        >
          <Share2 size={18} />
          Share
        </button>
        
        <div className="h-8 w-px bg-zinc-800 mx-2" />

        {user ? (
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 p-1 pr-3 hover:bg-zinc-800 rounded-2xl transition-all border border-transparent hover:border-zinc-700 group"
            >
              <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden group-hover:border-emerald-500/50 transition-colors">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User size={20} className="text-zinc-500" />
                )}
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs font-bold text-white leading-none">{user.displayName || 'User'}</span>
                <span className="text-[10px] text-zinc-500 font-medium">Pro Member</span>
              </div>
              <ChevronDown size={14} className={`text-zinc-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsProfileOpen(false)} 
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-20 overflow-hidden py-2"
                  >
                    <div className="px-4 py-3 border-b border-zinc-800 mb-2">
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Account</p>
                      <p className="text-sm text-white truncate font-medium mt-1">{user.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        onOpenSavedDesigns();
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all text-left"
                    >
                      <Clock size={16} />
                      My Saved Designs
                    </button>

                    <div className="h-px bg-zinc-800 my-2" />

                    <button
                      onClick={() => {
                        onLogout();
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-400 hover:text-red-400 hover:bg-red-400/10 transition-all text-left"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <button 
            onClick={onLogin}
            className="flex items-center gap-2 px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl transition-all text-sm font-bold shadow-lg shadow-emerald-500/20"
          >
            <LogIn size={18} />
            Login
          </button>
        )}
      </div>
    </header>
  );
}
