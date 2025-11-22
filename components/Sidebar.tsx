
import React from 'react';
import { AppView, BusinessModel } from '../types';
import { Search, X, Target, Bot } from 'lucide-react';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  isOpen: boolean;
  onClose: () => void;
  businessModel: BusinessModel | null;
  warRoomOnly?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ setView, isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      )}

      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 border-r border-slate-800/60 transform transition-transform duration-300 ease-in-out
        flex flex-col lg:translate-x-0 lg:static lg:h-screen
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/60 bg-slate-950/50 backdrop-blur">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center shadow-lg shadow-rose-500/20">
              <Target className="text-white" size={16} />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">ConversionCraft</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white p-1">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar">
          <div className="space-y-1">
            <div className="px-4 text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">Intelligence</div>
            <button
              onClick={() => setView(AppView.COMPETITOR_INTEL)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 bg-slate-800/80 text-rose-400 border border-rose-500/10`}
            >
              <Search size={18} /> War Room
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800/60 bg-slate-950/50 space-y-1">
          <div className="mt-2 px-4 py-2 bg-slate-900 rounded-lg border border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Bot size={16} />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Intel Engine</div>
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
