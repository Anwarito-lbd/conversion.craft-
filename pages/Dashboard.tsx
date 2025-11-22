
import React, { useState } from 'react';
import { TrendingUp, Zap, AlertTriangle, Activity, ArrowRight, Globe, ShoppingBag, Search, Target, Play, Clock, FastForward, CheckCircle2, Lock, ChevronRight, LayoutTemplate, PenTool, Truck } from 'lucide-react';
import { AppView, UserState, ProjectPhase } from '../types';

interface DashboardProps {
  setView: (view: AppView) => void;
  userState: UserState;
}

const Dashboard: React.FC<DashboardProps> = ({ setView, userState }) => {
  // Time Machine State
  const [daysInFuture, setDaysInFuture] = useState(0);
  
  // Base Stats (Simulated)
  const baseStats = {
    revenue: 0,
    traffic: 0,
    conversions: 0
  };
  
  // Projected Stats Calculation
  const projectedRevenue = Math.round(baseStats.revenue * (1 + (daysInFuture * 0.05))); 

  const roadmap = [
      {
          id: ProjectPhase.IDEATION,
          label: "Idea & Research",
          description: "Find a winning product or validate your service niche.",
          icon: ShoppingBag,
          action: "Find Product",
          view: AppView.PRODUCT_FINDER,
          color: "indigo",
          status: userState.hasItem ? 'completed' : 'current'
      },
      {
          id: ProjectPhase.MARKET_INTEL,
          label: "War Room Intel",
          description: "Analyze competitors, traffic sources, and ad strategies.",
          icon: Target,
          action: "Analyze Competitor",
          view: AppView.COMPETITOR_INTEL,
          color: "rose",
          status: userState.hasItem && userState.currentPhase === ProjectPhase.MARKET_INTEL ? 'current' : userState.completedSteps.includes('intel') ? 'completed' : 'pending'
      },
      {
          id: ProjectPhase.SOURCING,
          label: "Sourcing / Setup",
          description: "Find suppliers or setup service delivery pipelines.",
          icon: Truck,
          action: "Find Suppliers",
          view: AppView.SUPPLIER_FINDER_V2,
          color: "emerald",
          status: 'pending'
      },
      {
          id: ProjectPhase.CREATION,
          label: "Asset Creation",
          description: "Build landing page, generate ads, and write copy.",
          icon: PenTool,
          action: "Go to Studio",
          view: AppView.CREATIVE_STUDIO,
          color: "fuchsia",
          status: 'pending'
      }
  ];

  return (
    <div className="pb-20 animate-in fade-in duration-500 space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Mission Control</h2>
          <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-slate-400 text-sm font-medium">
                  Active Project: <span className="text-white font-bold">{userState.currentItemName || "Untitled Initiative"}</span>
              </p>
          </div>
        </div>
        <div className="flex gap-3">
           <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-white/5 rounded-lg text-sm font-medium text-white transition-colors flex items-center gap-2">
              <Clock size={16} className="text-slate-400"/> Activity Log
           </button>
           <button 
                onClick={() => setView(AppView.AUTO_PILOT)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-amber-500/20 flex items-center gap-2"
            >
              <Zap size={16} fill="currentColor"/> Auto-Pilot Mode
           </button>
        </div>
      </div>

      {/* PROJECT ROADMAP (THE STRUCTURE) */}
      <div>
          <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Project Roadmap</h3>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Phase {roadmap.findIndex(r => r.status === 'current') + 1} of {roadmap.length}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {roadmap.map((step, i) => {
                  const isCompleted = step.status === 'completed';
                  const isCurrent = step.status === 'current';
                  const isPending = step.status === 'pending';
                  
                  return (
                      <div 
                        key={step.id} 
                        onClick={() => !isPending && setView(step.view)}
                        className={`
                            relative p-6 rounded-2xl border transition-all duration-300 group cursor-pointer
                            ${isCurrent ? `bg-slate-900 border-${step.color}-500 ring-1 ring-${step.color}-500 shadow-lg shadow-${step.color}-500/10` : 
                              isCompleted ? 'bg-slate-950/50 border-emerald-500/30' : 
                              'bg-slate-950 border-slate-800 opacity-60 hover:opacity-80'}
                        `}
                      >
                          {isCompleted && (
                              <div className="absolute top-3 right-3 text-emerald-500">
                                  <CheckCircle2 size={20} />
                              </div>
                          )}
                          {isPending && (
                              <div className="absolute top-3 right-3 text-slate-600">
                                  <Lock size={16} />
                              </div>
                          )}
                          
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${isCurrent ? `bg-${step.color}-500 text-white` : isCompleted ? 'bg-emerald-900/20 text-emerald-400' : 'bg-slate-900 text-slate-500'}`}>
                              <step.icon size={24} />
                          </div>
                          
                          <h4 className={`font-bold text-lg mb-1 ${isCurrent ? 'text-white' : 'text-slate-300'}`}>{step.label}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed mb-4 min-h-[40px]">{step.description}</p>
                          
                          {isCurrent && (
                              <button className={`w-full py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-${step.color}-500/10 text-${step.color}-400 border border-${step.color}-500/20 flex items-center justify-center gap-2 group-hover:bg-${step.color}-500 group-hover:text-white transition-all`}>
                                  {step.action} <ArrowRight size={12} />
                              </button>
                          )}
                      </div>
                  )
              })}
          </div>
      </div>

      {/* Time Machine Notification */}
      {daysInFuture > 0 && (
         <div className="bg-fuchsia-900/20 border border-fuchsia-500/30 p-4 rounded-2xl flex items-center justify-between animate-in slide-in-from-bottom-4 fade-in duration-300">
             <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-fuchsia-600/20 flex items-center justify-center text-fuchsia-400">
                     <FastForward size={20} />
                 </div>
                 <div>
                     <h4 className="text-white font-bold">Future State Projection (+{daysInFuture} Days)</h4>
                     <p className="text-sm text-fuchsia-300">Viewing predicted metrics based on roadmap completion.</p>
                 </div>
             </div>
             <button 
               onClick={() => setDaysInFuture(0)}
               className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-sm font-bold transition-colors"
             >
                 Reset
             </button>
         </div>
      )}

      {/* Lower Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                 <Activity className="text-blue-500" /> Quick Actions
              </h3>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                 { label: "New Ad Script", icon: Zap, view: AppView.CREATIVE_STUDIO, desc: "Generate Viral Hook" },
                 { label: "Scan Competitor", icon: Search, view: AppView.COMPETITOR_INTEL, desc: "War Room Intel" },
                 { label: "Find Supplier", icon: Globe, view: AppView.SUPPLIER_FINDER_V2, desc: "Source Product" },
                 { label: "Page Builder", icon: LayoutTemplate, view: AppView.PAGE_BUILDER, desc: "Edit Landing Page" },
              ].map((tool, i) => (
                 <button 
                    key={i}
                    onClick={() => setView(tool.view)}
                    className="bg-slate-900/50 hover:bg-slate-800 border border-white/5 hover:border-indigo-500/30 p-4 rounded-2xl flex flex-col items-start justify-between gap-3 transition-all group h-32"
                 >
                    <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center border border-white/10 group-hover:border-indigo-500/50 transition-all">
                       <tool.icon size={20} className="text-slate-400 group-hover:text-indigo-400" />
                    </div>
                    <div className="text-left">
                        <span className="text-sm font-bold text-white block">{tool.label}</span>
                        <span className="text-[10px] text-slate-500">{tool.desc}</span>
                    </div>
                 </button>
              ))}
           </div>
        </div>

        {/* Alerts Panel */}
        <div className="lg:col-span-1">
           <div className="glass-panel rounded-3xl h-full border border-white/5 flex flex-col overflow-hidden bg-slate-950/30">
              <div className="p-5 border-b border-white/5 bg-slate-900/50 flex justify-between items-center">
                 <h3 className="font-bold text-white flex items-center gap-2">
                    <AlertTriangle size={18} className="text-amber-500" /> Alerts
                 </h3>
                 <span className="bg-amber-500/10 text-amber-500 text-[10px] font-bold px-2 py-1 rounded border border-amber-500/20">2 New</span>
              </div>
              <div className="flex-1 p-5 space-y-4">
                  <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5">
                      <div className="flex items-center gap-2 mb-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          <span className="text-xs font-bold text-white">Competitor Price Drop</span>
                      </div>
                      <p className="text-xs text-slate-400">"Lumina" dropped price by 15% on Amazon.</p>
                  </div>
                  <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5">
                      <div className="flex items-center gap-2 mb-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span className="text-xs font-bold text-white">Supplier Found</span>
                      </div>
                      <p className="text-xs text-slate-400">Verified supplier found with 5-day US shipping.</p>
                  </div>
              </div>
           </div>
        </div>
      </div>
      
      {/* TIME MACHINE SLIDER */}
      <div className="sticky bottom-6 z-40">
          <div className="glass-panel p-4 rounded-2xl border border-white/10 bg-slate-950/90 backdrop-blur-xl shadow-2xl max-w-2xl mx-auto flex items-center gap-6">
               <div className="flex items-center gap-2 shrink-0">
                   <div className="w-10 h-10 rounded-full bg-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-fuchsia-500/30">
                       <FastForward size={20} />
                   </div>
                   <div>
                       <h4 className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider">Time Machine</h4>
                       <p className="text-xs text-slate-400">Project Future State</p>
                   </div>
               </div>
               
               <div className="flex-1 relative">
                   <input 
                      type="range" 
                      min="0" 
                      max="90" 
                      step="1"
                      value={daysInFuture}
                      onChange={(e) => setDaysInFuture(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                   />
                   <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                       <span>Now</span>
                       <span>30 Days</span>
                       <span>60 Days</span>
                       <span>90 Days</span>
                   </div>
               </div>
               
               <div className="shrink-0 text-right w-24">
                   <div className="text-2xl font-mono font-bold text-white">+{daysInFuture}d</div>
               </div>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
