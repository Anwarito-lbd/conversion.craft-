
import React, { useState, useEffect } from 'react';
import FiltersBar from '../components/productFinderV2/FiltersBar';
import ProductTable from '../components/productFinderV2/ProductTable';
import ProductDrawer from '../components/productFinderV2/ProductDrawer';
import ComparisonModal from '../components/productFinderV2/ComparisonModal';
import { BusinessModel, WinningProduct } from '../types';
import { findWinningProducts, findWinningServices } from '../services/geminiService';
import { ShoppingBag, Loader2, CheckCircle2, X, Sparkles, TrendingUp, Zap, Lightbulb } from 'lucide-react';

interface ProductFinderProps {
    businessModel: BusinessModel | null;
}

const ProductFinder: React.FC<ProductFinderProps> = ({ businessModel }) => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<WinningProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<WinningProduct | null>(null);
  const [currentNiche, setCurrentNiche] = useState('Global Viral Trends');
  
  // Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  const isService = businessModel === BusinessModel.DROPSERVICING;

  // Auto-load trending products on mount
  useEffect(() => {
    handleSearch("Global Viral Trends");
  }, [businessModel]);

  const handleSearch = async (niche: string) => {
      if (!niche) return;
      setLoading(true);
      setCurrentNiche(niche);
      setProducts([]);
      setSelectedIds([]); // Reset selection on new search
      try {
          let jsonStr = "";
          if (isService) {
              jsonStr = await findWinningServices(niche);
          } else {
              jsonStr = await findWinningProducts(niche);
          }
          const parsed = JSON.parse(jsonStr);
          setProducts(parsed);
      } catch (e) {
          console.error(e);
          alert("Failed to fetch data. Please try again.");
      } finally {
          setLoading(false);
      }
  }

  const toggleSelection = (id: string) => {
      setSelectedIds(prev => 
          prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
  }

  const getSelectedProducts = () => {
      return products.filter(p => selectedIds.includes(p.id));
  }

  return (
    <div className="pb-24 animate-in fade-in-up duration-500 relative">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3 mb-2">
                    {isService ? <Lightbulb className="text-fuchsia-500" size={32}/> : <ShoppingBag className="text-indigo-500" size={32}/>}
                    {isService ? 'Service Idea Finder' : 'Product Finder Pro'}
                </h2>
                <p className="text-slate-400 max-w-2xl">
                    {isService ? 'Find high-ticket, scalable service ideas before they become saturated.' : 'Deep-dive market intelligence database. Find winners before they go viral.'}
                </p>
            </div>
            <button 
                onClick={() => handleSearch("Global Viral Trends")}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all flex items-center gap-2 border border-slate-700 shadow-lg"
            >
                <Sparkles size={16} className="text-amber-400" /> Suggest Opportunities
            </button>
        </div>

        <FiltersBar onSearch={handleSearch} />

        {/* Proactive Suggestion Banner */}
        {!loading && products.length > 0 && currentNiche === 'Global Viral Trends' && (
            <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none -mr-10 -mt-10 group-hover:bg-indigo-500/20 transition-colors"></div>
                <div className="relative z-10 flex items-start gap-4">
                    <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
                        <Zap className="text-indigo-400" size={24} fill="currentColor"/>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-1">AI Opportunity Radar</h3>
                        <p className="text-slate-300 text-sm max-w-3xl">
                            We analyzed real-time market signals to find <span className="text-white font-bold">10 high-potential {isService ? 'service niches' : 'products'}</span> showing early signs of virality with low saturation.
                        </p>
                    </div>
                </div>
            </div>
        )}

        {loading ? (
            <div className="h-96 flex flex-col items-center justify-center text-slate-500 rounded-3xl border border-slate-800 bg-slate-900/50">
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 rounded-full animate-pulse"></div>
                    <Loader2 size={48} className="animate-spin text-indigo-500 relative z-10"/>
                </div>
                <p className="font-bold text-xl text-white mb-2">
                    {currentNiche === 'Global Viral Trends' ? 'Identifying Breakout Trends...' : `Scanning market for "${currentNiche}"...`}
                </p>
                <p className="text-sm text-slate-400">Analyzing demand, competition, and profitability.</p>
            </div>
        ) : (
            <ProductTable 
                products={products} 
                onProductClick={setSelectedProduct} 
                selectedIds={selectedIds}
                onToggleSelect={toggleSelection}
            />
        )}

        <ProductDrawer product={selectedProduct} onClose={() => setSelectedProduct(null)} />

        {isComparisonOpen && (
            <ComparisonModal 
                products={getSelectedProducts()} 
                onClose={() => setIsComparisonOpen(false)} 
            />
        )}

        {/* Floating Comparison Action Bar */}
        {selectedIds.length > 0 && !isComparisonOpen && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 border border-slate-700 shadow-2xl shadow-black/50 rounded-full px-6 py-3 flex items-center gap-6 animate-in slide-in-from-bottom-10 fade-in duration-300">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                        {selectedIds.length}
                    </div>
                    <span className="text-white font-medium text-sm">{isService ? 'Ideas' : 'Products'} Selected</span>
                </div>

                <div className="h-6 w-px bg-slate-700"></div>

                <div className="flex gap-2">
                    <button 
                        onClick={() => setIsComparisonOpen(true)}
                        className="bg-white hover:bg-slate-200 text-slate-950 px-4 py-1.5 rounded-full text-sm font-bold transition-colors flex items-center gap-2"
                    >
                        <CheckCircle2 size={16}/> Compare
                    </button>
                    <button 
                        onClick={() => setSelectedIds([])}
                        className="text-slate-400 hover:text-white px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <X size={16}/> Clear
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};

export default ProductFinder;
