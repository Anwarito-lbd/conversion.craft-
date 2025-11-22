
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import CompetitorIntel from './pages/CompetitorIntel';
import { AppView } from './types';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  // Force view to Competitor Intel for Public Release
  const [currentView, setView] = useState<AppView>(AppView.COMPETITOR_INTEL);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#020617] text-slate-100 font-sans overflow-hidden relative">
      <Sidebar 
        currentView={currentView} 
        setView={setView} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        businessModel={null}
        warRoomOnly={true}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        <header className="h-14 border-b border-white/5 bg-slate-950/50 backdrop-blur flex items-center justify-between px-4 md:px-8 shrink-0 z-30 sticky top-0">
            <div className="flex items-center gap-4 lg:hidden">
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 text-slate-400 hover:text-white active:bg-slate-800 rounded-lg transition-colors"
                >
                    <Menu size={20} />
                </button>
                <span className="font-bold text-white tracking-tight">War Room</span>
            </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 scroll-smooth custom-scrollbar">
          <div className="max-w-[1600px] mx-auto min-h-full pb-20 lg:pb-0">
            <CompetitorIntel />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
