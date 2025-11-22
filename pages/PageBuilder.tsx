
import React, { useState } from 'react';
import { generateProductPage, generate3DMockup, generateMarketingImage } from '../services/geminiService';
import { LandingPageData, BusinessModel } from '../types';
import { LayoutTemplate, Loader2, CheckCircle2, ShoppingCart, Star, Eye, Edit3, Share2, Globe, Box, Image as ImageIcon, MessageSquare, Plus, Link as LinkIcon, Zap, Lock, Save } from 'lucide-react';
import { saveIdea } from '../services/ideaStore';

interface PageBuilderProps {
    businessModel: BusinessModel | null;
}

enum BuilderTab {
  EDITOR = 'EDITOR',
  ASSETS = 'ASSETS',
  REVIEWS = 'REVIEWS',
  PREVIEW = 'PREVIEW'
}

const PageBuilder: React.FC<PageBuilderProps> = ({ businessModel }) => {
  const [productName, setProductName] = useState('');
  const [supplierUrl, setSupplierUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [assetLoading, setAssetLoading] = useState(false);
  const [pageData, setPageData] = useState<LandingPageData | null>(null);
  const [activeTab, setActiveTab] = useState<BuilderTab>(BuilderTab.EDITOR);

  const isService = businessModel === BusinessModel.DROPSERVICING;

  const handleGenerate = async () => {
    if (!supplierUrl && !productName) {
        alert("Please enter a URL or a Name to generate.");
        return;
    }
    setLoading(true);
    setActiveTab(BuilderTab.PREVIEW); // Switch to preview on generate
    try {
      // Always uses default viral context (Nue Cup) defined in service
      const data = await generateProductPage(supplierUrl, productName, businessModel || BusinessModel.DROPSHIPPING);
      setPageData(data);
      // Update local product name if it was inferred
      if (!productName && data.productName) {
          setProductName(data.productName);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to generate page. Try again.");
      setActiveTab(BuilderTab.EDITOR);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
      if (!pageData) return;
      saveIdea({
          title: `Page Draft: ${pageData.productName || 'Untitled'}`,
          snippet: `Headline: ${pageData.headline}. Theme: ${isService ? 'Agency Funnel' : 'Viral Store'}.`,
          module: 'PageBuilder',
          data: pageData
      });
      window.dispatchEvent(new Event('ideas-updated'));
      alert("Draft saved to Ideas panel.");
  };

  const generateMockup = async () => {
      if (!pageData || (!productName && !pageData.productName)) return;
      const finalName = productName || pageData.productName || "Product";
      setAssetLoading(true);
      try {
          // Use the visual description found during page generation for better accuracy
          const visualDesc = (pageData as any).visualDescription || "";
          const url = await generate3DMockup(finalName, visualDesc);
          setPageData(prev => prev ? ({ ...prev, mockupImages: [...prev.mockupImages, url] }) : null);
      } catch (e) {
          console.error(e);
          alert("Mockup generation failed.");
      } finally {
          setAssetLoading(false);
      }
  };

  const generatePhoto = async () => {
      if (!pageData || (!productName && !pageData.productName)) return;
      const finalName = productName || pageData.productName || "Product";
      setAssetLoading(true);
      try {
          const visualDesc = (pageData as any).visualDescription || "";
          const url = await generateMarketingImage(`Professional ${isService ? 'office/dashboard' : 'product'} photography of ${finalName}, ${visualDesc}, commercial lighting, high detail, photorealistic.`);
          setPageData(prev => prev ? ({ ...prev, professionalImages: [...prev.professionalImages, url] }) : null);
      } catch (e) {
          console.error(e);
          alert("Photo generation failed.");
      } finally {
          setAssetLoading(false);
      }
  };

  return (
    <div className="h-[calc(100vh-120px)] lg:h-[calc(100vh-80px)] flex flex-col lg:flex-row gap-6 animate-in fade-in-up duration-500">
      
      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex overflow-x-auto rounded-lg bg-slate-800 p-1 shrink-0 gap-1">
          {[
              { id: BuilderTab.EDITOR, icon: Edit3, label: 'Edit' },
              { id: BuilderTab.ASSETS, icon: Box, label: 'Assets' },
              { id: BuilderTab.REVIEWS, icon: MessageSquare, label: 'Reviews' },
              { id: BuilderTab.PREVIEW, icon: Eye, label: 'View' },
          ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'bg-slate-700 text-white shadow' : 'text-slate-400'}`}
              >
                  <tab.icon size={14}/> {tab.label}
              </button>
          ))}
      </div>

      {/* Sidebar Column (Controls) */}
      <div className={`
        lg:w-1/3 flex flex-col overflow-hidden
        ${activeTab === BuilderTab.PREVIEW ? 'hidden lg:flex' : 'flex'}
      `}>
        <div className="mb-6 shrink-0 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Store Builder</h2>
            <p className="text-slate-400 mt-1">
                Create high-converting {isService ? 'service funnels' : 'product pages'} from a single link.
            </p>
          </div>
          {pageData && (
              <button 
                onClick={handleSaveDraft} 
                className="p-2 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="Save Draft"
              >
                  <Save size={20}/>
              </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
            
            {/* EDITOR TAB */}
            {activeTab === BuilderTab.EDITOR && (
                <div className="glass-panel p-6 rounded-2xl space-y-6">
                    {/* Active Theme Indicator */}
                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950">
                            <Zap size={20} fill="currentColor" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-amber-400">Viral Framework Active</span>
                                <Lock size={12} className="text-slate-500"/>
                            </div>
                            <div className="text-xs text-slate-400">{isService ? 'Agency Funnel Mode' : 'Nue Cup Mode (System Default)'}</div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">{isService ? 'Reference Service URL' : 'Supplier / Product URL'}</label>
                        <div className="relative">
                            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input 
                                type="text" 
                                value={supplierUrl}
                                onChange={(e) => setSupplierUrl(e.target.value)}
                                placeholder={isService ? "https://competitor-agency.com" : "https://aliexpress.com/item/..."}
                                className="glass-input w-full rounded-xl px-4 py-3 pl-11 text-white placeholder:text-slate-600 focus:outline-none"
                            />
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            *Optional. The system will extract details from this link.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">{isService ? 'Service Name' : 'Product Name'}</label>
                        <input 
                            type="text" 
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            placeholder="Auto-detect from URL if empty"
                            className="glass-input w-full rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none"
                        />
                    </div>
                    
                    <button 
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <LayoutTemplate size={20} />}
                        Generate {isService ? 'Funnel' : 'Store'}
                    </button>

                    {pageData && (
                        <div className="pt-4 border-t border-white/5 space-y-4">
                            <h4 className="text-sm font-bold text-white flex items-center gap-2"><Globe size={14} className="text-emerald-400"/> SEO Metadata</h4>
                            <div className="bg-slate-950/50 p-3 rounded-lg border border-white/5">
                                <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">SEO Title</span>
                                <p className="text-sm text-indigo-300 font-medium mt-1">{pageData.seoTitle}</p>
                            </div>
                            <button className="w-full border border-slate-700 hover:bg-slate-800 text-slate-300 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                <Share2 size={16}/> Export HTML
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* ASSETS TAB */}
            {activeTab === BuilderTab.ASSETS && (
                <div className="glass-panel p-6 rounded-2xl space-y-6">
                     <h3 className="font-bold text-white flex items-center gap-2"><Box size={18} className="text-amber-400"/> Asset Studio</h3>
                     
                     {!pageData ? (
                         <p className="text-slate-500 text-sm">Generate a page first to create assets.</p>
                     ) : (
                         <>
                            <div className="space-y-3">
                                {!isService && (
                                    <button 
                                        onClick={generateMockup}
                                        disabled={assetLoading}
                                        className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                                    >
                                        {assetLoading ? <Loader2 size={16} className="animate-spin"/> : <Box size={16}/>}
                                        Generate 3D Mockup (White BG)
                                    </button>
                                )}
                                <button 
                                    onClick={generatePhoto}
                                    disabled={assetLoading}
                                    className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                                >
                                    {assetLoading ? <Loader2 size={16} className="animate-spin"/> : <ImageIcon size={16}/>}
                                    Generate {isService ? 'Service Visual' : 'Pro Photo'}
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {pageData.mockupImages.map((img, i) => (
                                    <div key={i} className="aspect-square rounded-lg bg-white overflow-hidden border border-slate-800 relative">
                                        <img src={img} className="w-full h-full object-contain" alt="Mockup" />
                                        <div className="absolute bottom-1 right-1 bg-black/60 px-1.5 py-0.5 rounded text-[10px] font-bold text-white">3D</div>
                                    </div>
                                ))}
                                {pageData.professionalImages.map((img, i) => (
                                    <div key={i} className="aspect-square rounded-lg bg-slate-950 overflow-hidden border border-slate-800 relative">
                                        <img src={img} className="w-full h-full object-cover" alt="Pro Photo" />
                                        <div className="absolute bottom-1 right-1 bg-black/60 px-1.5 py-0.5 rounded text-[10px] font-bold text-white">PRO</div>
                                    </div>
                                ))}
                            </div>
                         </>
                     )}
                </div>
            )}
            
            {/* REVIEWS TAB */}
            {activeTab === BuilderTab.REVIEWS && (
                <div className="glass-panel p-6 rounded-2xl space-y-6">
                    <h3 className="font-bold text-white flex items-center gap-2"><MessageSquare size={18} className="text-cyan-400"/> Review Manager</h3>
                     
                     {!pageData ? (
                         <p className="text-slate-500 text-sm">Generate a page first to manage reviews.</p>
                     ) : (
                         <div className="space-y-4">
                             <button className="w-full border border-dashed border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                 <Plus size={16}/> Add Custom Review
                             </button>
                             
                             {pageData.reviews.map((review, idx) => (
                                 <div key={idx} className="bg-slate-950/50 p-4 rounded-xl border border-white/5">
                                     <div className="flex justify-between items-start mb-2">
                                         <div className="flex items-center gap-2">
                                             <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white">
                                                 {review.author.charAt(0)}
                                             </div>
                                             <span className="text-sm font-bold text-white">{review.author}</span>
                                         </div>
                                         <div className="flex text-amber-400">
                                             {[...Array(review.rating)].map((_, i) => <Star key={i} size={10} fill="currentColor"/>)}
                                         </div>
                                     </div>
                                     <p className="text-xs text-slate-400 line-clamp-3">"{review.content}"</p>
                                 </div>
                             ))}
                         </div>
                     )}
                </div>
            )}

        </div>
      </div>

      {/* Preview Column */}
      <div className={`
        flex-1 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative flex flex-col
        ${activeTab === BuilderTab.PREVIEW ? 'block h-full' : 'hidden lg:flex'}
      `}>
        {/* Browser Chrome */}
        <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center gap-4 shrink-0">
            <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
            </div>
            <div className="flex-1 bg-slate-900 rounded-md px-3 py-1.5 text-xs text-slate-500 font-mono text-center truncate border border-slate-800">
                {supplierUrl ? supplierUrl : 'https://store.com/...'}
            </div>
            <div className="hidden md:flex items-center gap-2 px-2 py-1 rounded text-xs font-medium border bg-slate-800 border-slate-700 text-slate-300">
                <Zap size={12} className="text-amber-400" fill="currentColor"/> {isService ? 'Agency Mode' : 'Nue Cup Mode'}
            </div>
        </div>

        <div className="flex-1 relative overflow-hidden bg-white">
            {!pageData && !loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 text-slate-400 p-6 text-center">
                    <LayoutTemplate size={48} className="mb-4 opacity-20 text-indigo-500"/>
                    <p className="text-lg font-medium text-slate-500">Ready to build.</p>
                    <p className="text-sm">Enter details to start.</p>
                </div>
            )}
            
            {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-10">
                    <Loader2 size={48} className="animate-spin text-indigo-600 mb-4"/>
                    <p className="text-slate-900 font-semibold">Building {isService ? 'funnel' : 'store'}...</p>
                    <p className="text-slate-500 text-sm">Analyzing data, writing copy, and designing layout.</p>
                </div>
            )}

            {pageData && (
                <div className="h-full overflow-y-auto bg-white text-slate-900 font-sans scroll-smooth">
                    {/* Announcement Bar */}
                    {!isService && (
                        <div className="text-white text-[10px] md:text-xs text-center py-2.5 font-bold tracking-widest uppercase bg-amber-500 text-black">
                            🔥 50% OFF ENDS IN 04:23:10 🔥
                        </div>
                    )}

                    {/* Navbar */}
                    <div className="border-b border-slate-100 px-6 py-4 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur z-10">
                        <span className="font-extrabold text-xl tracking-tighter uppercase">
                            {pageData.productName ? pageData.productName.split(' ')[0] : 'BRAND'}
                        </span>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium hidden sm:block">Services</span>
                            <span className="text-sm font-medium hidden sm:block">About</span>
                            {!isService && <ShoppingCart className="text-slate-900" size={24}/>}
                            {isService && <button className="bg-black text-white px-4 py-2 rounded-lg text-xs font-bold">Book Call</button>}
                        </div>
                    </div>

                    {/* Hero */}
                    <div className="px-6 md:px-12 py-16 lg:py-24 text-center max-w-5xl mx-auto bg-slate-50">
                         <div className="mb-6 flex justify-center gap-2">
                             <span className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wide">Trusted By</span>
                             <span className="text-slate-400 font-bold text-xs">Stripe</span>
                             <span className="text-slate-400 font-bold text-xs">Google</span>
                         </div>
                        <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 bg-rose-600 text-white animate-pulse">
                            {isService ? 'Accepting New Clients' : 'Viral Sensation'}
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-[1.1] tracking-tight">
                            {pageData.headline}
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                            {pageData.subheadline}
                        </p>
                        <button className="text-white px-8 md:px-12 py-4 rounded-full text-lg font-bold shadow-xl hover:scale-105 transition-transform duration-200 bg-gradient-to-r from-amber-500 to-orange-600 shadow-orange-500/40">
                            {pageData.callToAction} &rarr;
                        </button>
                    </div>

                    {/* 3D Showcase / Image Gallery */}
                    <div className="bg-slate-50 py-16 px-6">
                        <div className="max-w-4xl mx-auto">
                            <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl bg-white relative group border border-slate-100">
                                {pageData.mockupImages[0] ? (
                                    <img src={pageData.mockupImages[0]} alt="Showcase" className="w-full h-full object-contain p-8" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-white text-slate-400">
                                        <div className="text-center">
                                            <Box size={48} className="mx-auto mb-2 opacity-20"/>
                                            <p>No Visual Generated Yet</p>
                                            <p className="text-sm">Use 'Assets' tab to create one.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="px-6 md:px-12 py-20 max-w-6xl mx-auto">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
                            <div className="space-y-8 order-2 md:order-1">
                                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Why choose us</h3>
                                <ul className="space-y-4">
                                    {pageData.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-4 group">
                                            <div className="mt-1 p-1 rounded-full bg-amber-100">
                                                <CheckCircle2 className="text-amber-600 shrink-0" size={16}/>
                                            </div>
                                            <span className="text-slate-700 font-medium text-lg">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-slate-600 leading-relaxed mt-4 text-lg">
                                    {pageData.description}
                                </p>
                            </div>
                            <div className="order-1 md:order-2 grid grid-cols-2 gap-4">
                                {pageData.professionalImages.slice(0, 4).map((img, i) => (
                                    <img key={i} src={img} className="rounded-2xl shadow-lg w-full aspect-square object-cover" alt="Feature" />
                                ))}
                                {pageData.professionalImages.length === 0 && (
                                    <div className="col-span-2 aspect-square bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                                        Generated photos appear here
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="py-20 px-6 bg-slate-50 text-slate-900">
                        <div className="max-w-6xl mx-auto">
                            <h3 className="text-3xl font-bold text-center mb-12">Trusted by Customers</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {pageData.reviews.map((review, i) => (
                                    <div key={i} className="p-6 rounded-2xl bg-white shadow-xl border border-slate-100">
                                        <div className="flex gap-1 mb-4 text-amber-400">
                                            {[...Array(review.rating)].map((_, r) => <Star key={r} size={16} fill="currentColor"/>)}
                                        </div>
                                        <p className="mb-6 leading-relaxed text-slate-600">"{review.content}"</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-slate-900 text-white">
                                                {review.author.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900">{review.author}</div>
                                                <div className="text-xs text-emerald-400 flex items-center gap-1">
                                                    <CheckCircle2 size={10}/> Verified
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                     {/* Sticky CTA Mobile */}
                    <div className="p-6 border-t border-slate-100 text-center bg-white md:hidden sticky bottom-0 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-20">
                         <button className="w-full text-white px-12 py-4 rounded-xl font-bold text-lg shadow-lg bg-amber-500">
                            {pageData.callToAction}
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default PageBuilder;
