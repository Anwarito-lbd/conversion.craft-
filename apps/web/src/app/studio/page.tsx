'use client';

import React, { useState, useEffect } from 'react';
import ProductCanvas from '@/components/dora/ProductCanvas';
import { generateStoryboard, publishCampaign } from '@/services/apiClient';
import { Box, Image as ImageIcon, Video, FileText, Play, Layers, Wand2, Loader2, Rocket } from 'lucide-react';

// Mock Project Data
const MOCK_PROJECT = {
    productName: "Levitating Moon Lamp",
    description: "A 3D printed moon lamp that floats and spins using magnetic levitation.",
    benefits: ["Magical floating effect", "3 color modes", "Wireless charging base"],
    modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb", // Using astronaut as placeholder
    assets: {
        models: ["Astronaut.glb"],
        images: ["render_01.jpg", "render_02.jpg"],
        videos: []
    },
    price: "129.99"
};

export default function StudioPage() {
    const [activeTab, setActiveTab] = useState<'copy' | 'video'>('copy');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [storyboard, setStoryboard] = useState<any>(null);
    const [copy, setCopy] = useState({
        headline: "Experience the Magic of Levitation",
        body: "Transform your space with the Levitating Moon Lamp. It floats, it spins, it lights up your world."
    });

    const handleGenerateVideo = async () => {
        setIsGenerating(true);
        try {
            const result = await generateStoryboard(MOCK_PROJECT.productName, MOCK_PROJECT.benefits);
            setStoryboard(result);
            setActiveTab('video');
        } catch (error) {
            console.error(error);
            alert("Failed to generate storyboard");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleLaunch = async () => {
        setIsPublishing(true);
        try {
            // In a real app, these tokens would come from auth context or user settings
            const mockTokens = {
                shop_url: "demo-store.myshopify.com",
                access_token: "shpat_mock_token_123"
            };

            const productData = {
                title: MOCK_PROJECT.productName,
                description: copy.body,
                price: MOCK_PROJECT.price,
                images: MOCK_PROJECT.assets.images.map(img => `https://example.com/${img}`), // Mock URLs
                model_url: MOCK_PROJECT.modelUrl
            };

            await publishCampaign(productData, mockTokens);
            alert("🚀 Campaign Launched Successfully! Product created in Shopify.");
        } catch (error) {
            console.error(error);
            alert("Failed to launch campaign. Check console for details.");
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">

            {/* Header */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-slate-950/80 backdrop-blur border-b border-slate-800 flex items-center justify-between px-6 z-20">
                <div className="font-bold text-white flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <Wand2 size={18} className="text-white" />
                    </div>
                    Studio Workspace
                </div>
                <button
                    onClick={handleLaunch}
                    disabled={isPublishing}
                    className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPublishing ? <Loader2 size={18} className="animate-spin" /> : <Rocket size={18} />}
                    Launch Campaign
                </button>
            </div>

            {/* Left Sidebar: Asset Manager */}
            <div className="w-64 border-r border-slate-800 bg-slate-900/50 flex flex-col mt-16">
                <div className="p-4 border-b border-slate-800 font-bold text-white flex items-center gap-2">
                    <Layers size={18} className="text-indigo-500" /> Asset Manager
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-6">

                    {/* 3D Models */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                            <Box size={14} /> 3D Models
                        </h3>
                        <div className="space-y-2">
                            {MOCK_PROJECT.assets.models.map((model, i) => (
                                <div key={i} className="bg-slate-800 p-3 rounded-lg text-sm hover:bg-slate-700 cursor-pointer border border-slate-700 hover:border-indigo-500 transition-all">
                                    {model}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Images */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                            <ImageIcon size={14} /> Generated Images
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {MOCK_PROJECT.assets.images.map((img, i) => (
                                <div key={i} className="aspect-square bg-slate-800 rounded-lg border border-slate-700 hover:border-indigo-500 cursor-pointer"></div>
                            ))}
                        </div>
                    </div>

                    {/* Videos */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                            <Video size={14} /> Video Clips
                        </h3>
                        <div className="text-xs text-slate-600 italic">No clips generated yet.</div>
                    </div>

                </div>
            </div>

            {/* Center: Preview Canvas */}
            <div className="flex-1 bg-black relative flex flex-col pt-16">
                <div className="absolute top-20 left-4 z-10 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-white border border-slate-700">
                    Preview Mode
                </div>
                <div className="flex-1">
                    <ProductCanvas modelUrl={MOCK_PROJECT.modelUrl} />
                </div>
            </div>

            {/* Right Sidebar: Campaign Editor */}
            <div className="w-96 border-l border-slate-800 bg-slate-900/50 flex flex-col mt-16">

                {/* Tabs */}
                <div className="flex border-b border-slate-800">
                    <button
                        onClick={() => setActiveTab('copy')}
                        className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'copy' ? 'bg-slate-800 text-white border-b-2 border-indigo-500' : 'text-slate-400 hover:text-white'}`}
                    >
                        <FileText size={16} /> Copy
                    </button>
                    <button
                        onClick={() => setActiveTab('video')}
                        className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'video' ? 'bg-slate-800 text-white border-b-2 border-indigo-500' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Video size={16} /> Video
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'copy' ? (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Headline</label>
                                <input
                                    type="text"
                                    value={copy.headline}
                                    onChange={(e) => setCopy({ ...copy, headline: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Body Copy</label>
                                <textarea
                                    value={copy.body}
                                    onChange={(e) => setCopy({ ...copy, body: e.target.value })}
                                    rows={6}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                <h3 className="font-bold text-white mb-2">AI Video Director</h3>
                                <p className="text-sm text-slate-400 mb-4">Generate a viral video storyboard based on your product benefits.</p>

                                <button
                                    onClick={handleGenerateVideo}
                                    disabled={isGenerating}
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isGenerating ? (
                                        <><Loader2 size={18} className="animate-spin" /> Generating...</>
                                    ) : (
                                        <><Wand2 size={18} /> Generate Storyboard</>
                                    )}
                                </button>
                            </div>

                            {storyboard && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-white">Storyboard</h3>
                                        <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded">Generated</span>
                                    </div>

                                    <div className="space-y-3">
                                        {storyboard.scenes?.map((scene: any) => (
                                            <div key={scene.id} className="bg-slate-950 border border-slate-800 p-3 rounded-lg flex gap-3">
                                                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center font-bold text-slate-500 shrink-0">
                                                    {scene.id}
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-300 mb-1">{scene.visual_prompt}</p>
                                                    <div className="text-xs text-slate-500 flex items-center gap-1">
                                                        <Play size={10} /> {scene.duration}s duration
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Voiceover Script</h4>
                                        <p className="text-sm text-slate-300 italic">"{storyboard.voiceover}"</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
