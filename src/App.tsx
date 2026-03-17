/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Node, 
  Edge, 
  useNodesState, 
  useEdgesState, 
  MarkerType 
} from 'reactflow';
import { Maximize2, Minimize2, Save, Download, Share2, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'react-hot-toast';
import Header from './components/Header';
import ShareModal from './components/ShareModal';
import SavedDesignsModal from './components/SavedDesignsModal';
import WelcomeOverlay from './components/WelcomeOverlay';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import Dashboard from './components/Dashboard';
import AIAssistant from './components/AIAssistant';
import SettingsModal from './components/SettingsModal';
import AuthModal from './components/AuthModal';
import { SimulationState, NodeMetrics } from './types';
import { auth, db, googleProvider, signInWithPopup, signOut, onAuthStateChanged, doc, setDoc, serverTimestamp, collection, query, where, onSnapshot, deleteDoc } from './firebase';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const initialNodes: Node[] = [
  {
    id: 'cdn-1',
    type: 'systemNode',
    data: { label: 'Global CDN', type: 'cdn', instances: 1 },
    position: { x: 400, y: 50 },
  },
  {
    id: 'lb-1',
    type: 'systemNode',
    data: { label: 'Main Load Balancer', type: 'load-balancer', instances: 2 },
    position: { x: 400, y: 200 },
  },
  {
    id: 'api-1',
    type: 'systemNode',
    data: { label: 'API Gateway', type: 'api-gateway', instances: 3 },
    position: { x: 400, y: 350 },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'cdn-1', target: 'lb-1', animated: false, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' }, style: { stroke: '#10b981' } },
  { id: 'e2-3', source: 'lb-1', target: 'api-1', animated: false, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' }, style: { stroke: '#10b981' } },
];

export default function App() {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSavedDesignsModalOpen, setIsSavedDesignsModalOpen] = useState(false);
  const [savedDesigns, setSavedDesigns] = useState<any[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [simulationState, setSimulationState] = useState<SimulationState>({
    isRunning: false,
    trafficLoad: 100,
    chaosMode: {
      latency: 0,
      packetLoss: 0,
      failures: [],
    },
  });

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [metrics, setMetrics] = useState<Record<string, NodeMetrics>>({});
  const [history, setHistory] = useState<any[]>([]);
  const [cost, setCost] = useState(0);
  const ws = useRef<WebSocket | null>(null);

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
      if (currentUser) {
        // Sync user to Firestore
        setDoc(doc(db, 'users', currentUser.uid), {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
          lastLogin: serverTimestamp(),
        }, { merge: true });
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch Saved Designs
  useEffect(() => {
    if (!user) {
      setSavedDesigns([]);
      return;
    }

    const q = query(collection(db, 'designs'), where('ownerUid', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const designs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          nodes: typeof data.nodes === 'string' ? JSON.parse(data.nodes) : data.nodes,
          edges: typeof data.edges === 'string' ? JSON.parse(data.edges) : data.edges,
        };
      });
      setSavedDesigns(designs);
    }, (error) => {
      console.error('Fetch designs error:', error);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogin = async () => {
    setIsAuthModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout.');
    }
  };

  const handleSaveDesign = async () => {
    if (!user) {
      toast.error('Please login to save your design.');
      return;
    }

    const designId = `design-${Date.now()}`;
    const designData = {
      id: designId,
      name: `Design ${new Date().toLocaleString()}`,
      ownerUid: user.uid,
      nodes: JSON.stringify(nodes),
      edges: JSON.stringify(edges),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      await setDoc(doc(db, 'designs', designId), designData);
      toast.success('Architecture saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save design.');
    }
  };

  const handleLoadDesign = (design: any) => {
    setNodes(design.nodes);
    setEdges(design.edges);
    setIsSavedDesignsModalOpen(false);
    toast.success(`Loaded: ${design.name || 'Untitled Design'}`);
  };

  const handleDeleteDesign = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'designs', id));
      toast.success('Design deleted');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete design');
    }
  };

  const handleDownloadPDF = async () => {
    const canvasElement = document.querySelector('.react-flow__renderer') as HTMLElement;
    if (!canvasElement) {
      toast.error('Canvas not found');
      return;
    }

    const toastId = toast.loading('Generating PDF...');

    try {
      // Temporarily hide controls for a cleaner capture
      const controls = document.querySelector('.react-flow__controls') as HTMLElement;
      const attribution = document.querySelector('.react-flow__attribution') as HTMLElement;
      if (controls) controls.style.display = 'none';
      if (attribution) attribution.style.display = 'none';

      const canvas = await html2canvas(canvasElement, {
        backgroundColor: '#09090b', // zinc-950
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        onclone: (clonedDoc) => {
          // Aggressively fix for oklch color parsing error in html2canvas
          // This error occurs because html2canvas doesn't support modern CSS color functions like oklch()
          
          // 1. Fix inline styles
          const elements = clonedDoc.getElementsByTagName('*');
          for (let i = 0; i < elements.length; i++) {
            const el = elements[i] as HTMLElement;
            if (el.style.cssText.includes('oklch')) {
              // Replace oklch with a safe fallback (e.g., gray)
              el.style.cssText = el.style.cssText.replace(/oklch\([^)]+\)/g, '#71717a');
            }
          }

          // 2. Fix style tags
          const styleTags = clonedDoc.getElementsByTagName('style');
          for (let i = 0; i < styleTags.length; i++) {
            const tag = styleTags[i];
            if (tag.innerHTML.includes('oklch')) {
              tag.innerHTML = tag.innerHTML.replace(/oklch\([^)]+\)/g, '#71717a');
            }
          }
        }
      });

      // Restore controls
      if (controls) controls.style.display = 'flex';
      if (attribution) attribution.style.display = 'block';

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`system-design-${Date.now()}.pdf`);
      
      toast.success('PDF downloaded!', { id: toastId });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF', { id: toastId });
    }
  };

  // WebSocket Connection
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}`);
    ws.current = socket;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'METRICS_UPDATE') {
        setMetrics(data.payload);
        
        // Update history for charts
        const aggregate = Object.values(data.payload as Record<string, NodeMetrics>).reduce(
          (acc, curr) => ({
            rps: acc.rps + curr.rps,
            latency: Math.max(acc.latency, curr.latency),
            errorRate: Math.max(acc.errorRate, curr.errorRate),
          }),
          { rps: 0, latency: 0, errorRate: 0 }
        );

        setHistory(prev => [...prev.slice(-20), { ...aggregate, time: new Date().toLocaleTimeString() }]);
      }
    };

    return () => socket.close();
  }, []);

  // Sync state to backend
  useEffect(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      const nodeData = nodes.reduce((acc, node) => {
        acc[node.id] = node;
        return acc;
      }, {} as any);

      ws.current.send(JSON.stringify({
        type: 'UPDATE_STATE',
        payload: {
          ...simulationState,
          nodes: nodeData,
          edges,
        }
      }));
    }
  }, [simulationState, nodes, edges]);

  // Calculate Cost
  useEffect(() => {
    let total = 0;
    nodes.forEach(node => {
      const instances = node.data.instances || 1;
      const baseCost = 50; // $50 per instance base
      total += instances * baseCost;
    });
    // Traffic cost: $0.01 per req/s per month
    total += simulationState.trafficLoad * 0.01;
    setCost(Math.round(total));
  }, [nodes, simulationState.trafficLoad]);

  const handleAISuggestion = useCallback((suggestion: { nodes: any[], edges: any[] }) => {
    if (!suggestion || !suggestion.nodes || !Array.isArray(suggestion.nodes)) {
      toast.error("Invalid architecture data received.");
      return;
    }

    const newNodes: Node[] = suggestion.nodes.map(n => ({
      id: n.id || `node-${Math.random().toString(36).substr(2, 9)}`,
      type: 'systemNode',
      position: { x: n.x || 0, y: n.y || 0 },
      data: { label: n.label || 'New Node', type: n.type || 'microservice', instances: n.instances || 1 }
    }));

    const edgesToMap = Array.isArray(suggestion.edges) ? suggestion.edges : [];
    const newEdges: Edge[] = edgesToMap.map((e, i) => ({
      id: `ai-edge-${i}`,
      source: e.source,
      target: e.target,
      animated: simulationState.isRunning,
      markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
      style: { stroke: '#10b981' }
    }));

    setNodes(newNodes);
    setEdges(newEdges);
  }, [simulationState.isRunning, setNodes, setEdges]);

  return (
    <div className="flex flex-col h-screen w-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      <Toaster position="top-center" />
      {!isFullScreen && (
        <Header 
          onSave={handleSaveDesign}
          onShare={() => setIsShareModalOpen(true)}
          onDownloadPDF={handleDownloadPDF}
          onOpenSavedDesigns={() => setIsSavedDesignsModalOpen(true)}
          user={user}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
      )}
      
      <div className="flex flex-1 overflow-hidden">
        {!isFullScreen && (
          <Sidebar 
            simulationState={simulationState} 
            setSimulationState={setSimulationState} 
            cost={cost}
            nodes={nodes}
          />
        )}
        
        <main className="flex-1 relative">
          <Canvas 
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            setNodes={setNodes}
            setEdges={setEdges}
            simulationState={simulationState}
            metrics={metrics}
          />
          <AIAssistant onSuggest={handleAISuggestion} user={user} onLogin={handleLogin} />

          {/* Vertical Action Bar for Full Screen Mode */}
          <AnimatePresence>
            {isFullScreen && (
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 p-2 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl shadow-2xl"
              >
                <button 
                  onClick={handleSaveDesign}
                  className="p-3 text-zinc-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all group relative"
                  title="Save Design"
                >
                  <Save size={20} />
                  <span className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap font-bold uppercase tracking-wider">Save Design</span>
                </button>
                <button 
                  onClick={handleDownloadPDF}
                  className="p-3 text-zinc-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all group relative"
                  title="Download PDF"
                >
                  <Download size={20} />
                  <span className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap font-bold uppercase tracking-wider">Download PDF</span>
                </button>
                <button 
                  onClick={() => setIsShareModalOpen(true)}
                  className="p-3 text-zinc-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all group relative"
                  title="Share Architecture"
                >
                  <Share2 size={20} />
                  <span className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap font-bold uppercase tracking-wider">Share Architecture</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Full Screen Toggle Button */}
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="absolute top-4 right-4 z-50 p-3 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl text-zinc-400 hover:text-emerald-500 transition-all shadow-xl"
            title={isFullScreen ? "Exit Full Screen" : "Full Screen Mode"}
          >
            {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>

          {/* Settings Toggle Button */}
          {!isFullScreen && (
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="absolute top-4 right-20 z-50 p-3 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl text-zinc-400 hover:text-emerald-500 transition-all shadow-xl"
              title="Database Settings"
            >
              <Settings size={20} />
            </button>
          )}
        </main>

        {!isFullScreen && <Dashboard history={history} />}
      </div>

      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        url={window.location.href}
      />

      <SavedDesignsModal
        isOpen={isSavedDesignsModalOpen}
        onClose={() => setIsSavedDesignsModalOpen(false)}
        designs={savedDesigns}
        onLoad={handleLoadDesign}
        onDelete={handleDeleteDesign}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {showWelcome && <WelcomeOverlay onClose={() => setShowWelcome(false)} />}
    </div>
  );
}
