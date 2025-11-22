
import { GoogleGenAI } from "@google/genai";

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const { url } = await request.json();

    if (!url) {
      return new Response(JSON.stringify({ error: "URL is required" }), { status: 400 });
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Server misconfiguration" }), { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Analyze the e-commerce brand or service at this URL: ${url}. 
      
    Act as a "Forensic Market Analyst".
    
    1. **Forensic Search**:
       - Identify the business model and estimated scale.
       - Estimate Monthly Traffic & Ad Spend using search grounding.
       - Find official social media profiles (TikTok, Instagram, FB).
       - Detect "Recent Activities" (Price changes, new ads, viral spikes).
    
    2. **Threat Identification**:
       - Find 3-5 DIRECT competitors.
       - Analyze *why* they are threats.
    
    3. **Creative & Brand DNA**:
       - Extract precise Brand Colors (Hex Codes) and visual style.
       - Analyze "Ad Hooks" and generate "Counter-Hooks".
    
    CRITICAL: Return ONLY valid JSON.
    
    Schema:
    {
      "viralScore": number,
      "viralReasoning": string,
      "trafficIntel": {
         "monthlyVisits": string,
         "bounceRate": string,
         "estAdSpend": string,
         "trafficSources": [ { "source": string, "percent": number } ]
      },
      "socialLinks": [
         { "platform": "TikTok" | "Instagram" | "Facebook" | "YouTube" | "Twitter", "url": string, "followers": string }
      ],
      "directCompetitors": [
         { "name": string, "url": string, "threatLevel": "High" | "Medium" | "Low", "primaryAdvantage": string }
      ],
      "attackPlan": [
         { "tactic": string, "action": string, "difficulty": "Easy"|"Medium"|"Hard", "impact": "High"|"Critical" }
      ],
      "recentActivity": [
          { "date": string, "type": "AD_LAUNCH"|"PRICE_CHANGE"|"VIRAL_SPIKE"|"SOCIAL_POST", "description": string, "impactLevel": "LOW"|"MEDIUM"|"HIGH" }
      ],
      "seoStrategy": {
        "topKeywords": [string],
        "paidSearchTerms": [string]
      },
      "videoAds": [
          { 
            "thumbnail": string, 
            "hook": string, 
            "strategy": string,
            "counterHook": string 
          } 
      ],
      "brandIdentity": {
          "brandColors": [string, string, string] 
      }
    }`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }], 
      }
    });

    const text = response.text || "{}";
    // Robust JSON extraction
    const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const jsonText = match ? match[1] : text;
    
    return new Response(jsonText, {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Analysis Error:", error);
    return new Response(JSON.stringify({ error: "Analysis failed", details: error.message }), { status: 500 });
  }
}
