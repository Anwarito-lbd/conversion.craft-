import { GoogleGenAI, Type } from "@google/genai";
import { 
  CompetitorAnalysis, 
  BusinessModel, 
  WinningProduct, 
  Supplier, 
  LandingPageData, 
  AutoPilotResult, 
  AdScript, 
  AdMutation, 
  MarketSimulationResult, 
  TrendGenesisResult, 
  SupplierV2, 
  ArbitrageOpportunity,
  VideoArchetype
} from "../types";

/**
 * Public War Room Edition - API Proxy Service
 * This service routes requests to the secure backend endpoint for competitor analysis.
 */
export const analyzeCompetitor = async (url: string): Promise<{ data: CompetitorAnalysis; sources: string[] }> => {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error('Failed to connect to Intelligence Engine');
    }

    const data = await response.json();
    
    return {
      data: data,
      sources: [] 
    };
  } catch (error) {
    console.error("Proxy Error", error);
    throw error;
  }
};

// Initialize AI Client
const getAi = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSparkIdea = async (): Promise<string> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: "Generate a short, single-sentence marketing spark or growth hack idea for an e-commerce brand.",
    });
    return response.text || "Analyze a competitor to unlock strategic insights.";
}

export const findWinningProducts = async (niche: string): Promise<string> => {
    const ai = getAi();
    const prompt = `Find 5 winning products in the niche: "${niche}". 
    Focus on products with high viral potential and low saturation.
    Return a JSON array of objects matching the WinningProduct interface.
    Include realistic dummy data for salesData, suppliers, etc.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
        }
    });
    return response.text || "[]";
};

export const findWinningServices = async (niche: string): Promise<string> => {
    const ai = getAi();
    const prompt = `Find 5 winning drop-service ideas in the niche: "${niche}".
    Focus on high-ticket B2B or B2C services.
    Return a JSON array of objects matching the WinningProduct interface (adapt for services).`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
        }
    });
    return response.text || "[]";
};

export const generateMarketingImage = async (prompt: string): Promise<string> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: prompt }]
        },
        config: {
            imageConfig: { aspectRatio: "1:1" }
        }
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
    }
    throw new Error("No image generated");
};

export const editProductImage = async (image: string, prompt: string): Promise<string> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { inlineData: { data: image, mimeType: 'image/png' } },
                { text: prompt }
            ]
        }
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
    }
    throw new Error("No image generated");
};

// Helper for Veo API Key Check
const ensureVeoKey = async () => {
    if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
            await window.aistudio.openSelectKey();
        }
    }
};

export const generateVideoAd = async (prompt: string, aspectRatio: string = '9:16', archetype?: string): Promise<string> => {
    await ensureVeoKey();
    const ai = getAi();
    
    let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `${prompt} ${archetype ? `Style: ${archetype}` : ''}`,
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: aspectRatio === '16:9' ? '16:9' : '9:16'
        }
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const uri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!uri) throw new Error("Video generation failed");
    
    // Fetch the actual video bytes
    const videoResponse = await fetch(`${uri}&key=${process.env.API_KEY}`);
    const blob = await videoResponse.blob();
    return URL.createObjectURL(blob);
};

export const animateImageToVideo = async (image: string, mimeType: string, prompt: string): Promise<string> => {
    await ensureVeoKey();
    const ai = getAi();

    let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        image: {
            imageBytes: image,
            mimeType: mimeType
        },
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: '9:16'
        }
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const uri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!uri) throw new Error("Video generation failed");
    
    const videoResponse = await fetch(`${uri}&key=${process.env.API_KEY}`);
    const blob = await videoResponse.blob();
    return URL.createObjectURL(blob);
};

export const generateAdScript = async (prompt: string, platform: string, archetype?: string): Promise<string> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Write a viral ad script for ${platform}. Product/Idea: "${prompt}". Archetype: ${archetype || 'General'}. Return JSON matching AdScript interface.`,
        config: {
            responseMimeType: 'application/json'
        }
    });
    return response.text || "{}";
};

export const generateComfyUIWorkflow = async (script: any): Promise<object> => {
    // Simulation or simple generation
    return { nodes: [], links: [] };
};

export const generateAdMutations = async (script: AdScript): Promise<AdMutation[]> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Generate 3 variations (mutations) of this ad script for testing. Return JSON array of AdMutation objects. Base Script: ${JSON.stringify(script)}`,
        config: {
            responseMimeType: 'application/json'
        }
    });
    try {
        return JSON.parse(response.text || "[]");
    } catch {
        return [];
    }
};

export const generateProductPage = async (url: string, name: string, model: BusinessModel): Promise<LandingPageData> => {
    const ai = getAi();
    const prompt = `Generate a high-converting landing page content for ${name || 'a product'} (URL: ${url}). Business Model: ${model}.
    Return JSON matching LandingPageData interface. Include headline, subheadline, features, etc.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json'
        }
    });
    
    try {
        const data = JSON.parse(response.text || "{}");
        // Ensure arrays are present
        return {
            productName: name,
            headline: data.headline || "Amazing Product",
            subheadline: data.subheadline || "Buy it now",
            features: data.features || [],
            description: data.description || "",
            callToAction: data.callToAction || "Shop Now",
            seoTitle: data.seoTitle || "",
            seoMeta: data.seoMeta || "",
            reviews: data.reviews || [],
            mockupImages: [],
            professionalImages: [],
            visualDescription: data.visualDescription || "Product on white background"
        };
    } catch (e) {
        throw new Error("Failed to generate page data");
    }
};

export const generate3DMockup = async (name: string, description: string): Promise<string> => {
    return generateMarketingImage(`3D render of ${name}, ${description}, studio lighting, white background, 4k, octane render`);
};

export const runAutoPilot = async (niche: string, logCallback: (log: string, step: string) => void): Promise<AutoPilotResult> => {
    const ai = getAi();
    
    logCallback(`Analyzing niche: ${niche}...`, 'ANALYZE');
    // Step 1: Find Product
    const productsJson = await findWinningProducts(niche);
    const products = JSON.parse(productsJson);
    const product = products[0] || { name: "Generic Product", price: 29.99 };
    logCallback(`Selected Candidate: ${product.name}`, 'PLAN');

    // Step 2: Find Suppliers
    const suppliersJson = await findSuppliers(product.name);
    const suppliers = JSON.parse(suppliersJson);
    logCallback(`Found ${suppliers.length} suppliers.`, 'PLAN');

    // Step 3: Create Page
    logCallback(`Generating Landing Page copy...`, 'CREATE');
    const landingPage = await generateProductPage("", product.name, BusinessModel.DROPSHIPPING);

    // Step 4: Create Ads
    logCallback(`Writing Ad Scripts...`, 'CREATE');
    const adScriptJson = await generateAdScript(product.name, 'TikTok');
    const adScript = JSON.parse(adScriptJson);
    
    // Step 5: Generate Image
    logCallback(`Rendering Marketing Assets...`, 'CREATE');
    const marketingImage = await generateMarketingImage(`Professional product shot of ${product.name}`);

    logCallback(`Simulating Launch...`, 'PUBLISH');
    await new Promise(r => setTimeout(r, 1000));

    logCallback(`Optimizing Campaign...`, 'OPTIMIZE');
    
    return {
        product: product as WinningProduct,
        suppliers: suppliers as Supplier[],
        landingPage,
        adScript,
        marketingImage,
        comfyUiWorkflow: {},
        optimizationPlan: "1. Test 3 hooks.\n2. Scale winning creative.\n3. Retarget cart abandoners."
    };
};

export const findSuppliers = async (query: string): Promise<string> => {
    const ai = getAi();
    const prompt = `Find 5 suppliers for "${query}". Return JSON array of Supplier objects (name, url, price, notes, etc.).`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
    });
    return response.text || "[]";
};

export const findSuppliersV2 = async (query: string): Promise<string> => {
    const ai = getAi();
    const prompt = `Find 5 detailed suppliers for "${query}". Return JSON array of SupplierV2 objects. Include risk scores and locations.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
    });
    return response.text || "[]";
};

export const findArbitrageOpportunities = async (niche: string): Promise<ArbitrageOpportunity[]> => {
    const ai = getAi();
    const prompt = `Find 3 arbitrage opportunities in "${niche}". Compare source price (e.g. AliExpress) vs target price (e.g. Amazon). Return JSON array of ArbitrageOpportunity.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
    });
    try {
        return JSON.parse(response.text || "[]");
    } catch {
        return [];
    }
};

export const runMarketSimulation = async (productName: string, price: number): Promise<MarketSimulationResult> => {
    const ai = getAi();
    const prompt = `Simulate a market test for "${productName}" at $${price}. 
    Simulate 1000 agents. Return JSON matching MarketSimulationResult (predictedCVR, predictedROAS, verdict, etc.).`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
    });
    try {
        return JSON.parse(response.text || "{}");
    } catch {
        throw new Error("Simulation failed");
    }
};

export const runTrendGenesis = async (): Promise<TrendGenesisResult> => {
    const ai = getAi();
    const prompt = `Predict the next big e-commerce viral trend. 
    Return JSON matching TrendGenesisResult (trendName, confidenceScore, aestheticKeywords, etc.).`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', // Use pro for complex reasoning
        contents: prompt,
        config: { responseMimeType: 'application/json' }
    });
    try {
        return JSON.parse(response.text || "{}");
    } catch {
        throw new Error("Trend prediction failed");
    }
};
