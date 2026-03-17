import React from 'react';
import { X, Clock, ExternalLink, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SavedDesign {
  id: string;
  name: string;
  createdAt: any;
  nodes: any[];
  edges: any[];
}

interface SavedDesignsModalProps {
  isOpen: boolean;
  onClose: () => void;
  designs: SavedDesign[];
  onLoad: (design: SavedDesign) => void;
  onDelete: (id: string) => void;
}

export default function SavedDesignsModal({ isOpen, onClose, designs, onLoad, onDelete }: SavedDesignsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">My Saved Designs</h2>
                <p className="text-sm text-zinc-500">Access and manage your architecture blueprints</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-6">
              {designs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Clock className="text-zinc-600" size={32} />
                  </div>
                  <h3 className="text-white font-semibold">No designs saved yet</h3>
                  <p className="text-sm text-zinc-500 mt-1">Your saved system architectures will appear here.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {designs.map((design) => (
                    <div 
                      key={design.id}
                      className="group p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-xl hover:border-emerald-500/50 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700">
                            <span className="text-xs font-bold text-emerald-500">
                              {design.nodes.length}N
                            </span>
                          </div>
                          <div>
                            <h4 className="text-white font-semibold group-hover:text-emerald-400 transition-colors">
                              {design.name || 'Untitled Design'}
                            </h4>
                            <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-wider font-bold mt-1">
                              <Clock size={10} />
                              {design.createdAt?.toDate().toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onLoad(design)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-zinc-950 rounded-lg transition-all text-xs font-bold"
                          >
                            <ExternalLink size={14} />
                            Load
                          </button>
                          <button
                            onClick={() => onDelete(design.id)}
                            className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 bg-zinc-900/50 border-t border-zinc-800 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-zinc-400 hover:text-white text-sm font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
