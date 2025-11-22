
export enum AppView {
  COMPETITOR_INTEL = 'COMPETITOR_INTEL',
}

export enum BusinessModel {
  DROPSHIPPING = 'DROPSHIPPING',
  DROPSERVICING = 'DROPSERVICING'
}

export interface TrafficIntel {
  monthlyVisits: string;
  bounceRate: string;
  avgDuration: string;
  topCountry: string;
  estAdSpend: string;
  trafficSources: { source: string; percent: number }[];
}

export interface AttackAction {
  tactic: string;
  action: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  impact: 'High' | 'Critical';
}

export interface CompetitorActivity {
  date: string; // e.g., "2 days ago"
  type: 'AD_LAUNCH' | 'PRICE_CHANGE' | 'VIRAL_SPIKE' | 'SOCIAL_POST';
  description: string;
  impactLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface DirectCompetitor {
  name: string;
  url: string;
  threatLevel: 'High' | 'Medium' | 'Low';
  primaryAdvantage: string; // e.g. "Lower Price", "Better Branding"
}

export interface CompetitorAnalysis {
  viralScore: number;
  viralReasoning: string;
  trafficIntel: TrafficIntel;
  attackPlan: AttackAction[];
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  recentActivity: CompetitorActivity[];
  directCompetitors: DirectCompetitor[]; // New field for "Other Threats"
  adHooks: string[];
  marketingChannels: {
    channel: string;
    percentage: number;
    insight: string;
  }[];
  priorityChannels: {
    channel: string;
    rationale: string;
  }[];
  demographics: {
    ageRange: string;
    gender: string;
    topInterests: string[];
    locations: string[];
  };
  seoStrategy: {
    topKeywords: string[];
    paidSearchTerms: string[];
    keywordStrategySummary: string;
  };
  categoryTrends: {
    keyword: string;
    growth: number;
    volume: number;
  }[];
  keyInfluencers: {
    name: string;
    platform: string;
    reach: string;
    engagement: string;
  }[];
  influencerSummary: string[];
  videoAds: {
    thumbnail: string;
    hook: string;
    strategy: string;
    counterHook: string; // New field for attack strategy
  }[];
  adStrategySummary: string[];
  funnelAnalysis: {
    step: string;
    frictionPoints: string[];
    conversionRateEst: string;
  }[];
  croRecommendations: string[];
  offerAnalysis: {
    pricingModel: string;
    bundles: string[];
    guarantees: string;
    strategyInsight: string;
  };
  sentimentAnalysis: {
    sentimentScore: number; // 0-100 based on positive/negative ratio
    positiveHighlights: string[];
    negativeHighlights: string[];
    commonPhrases: string[];
  };
  brandIdentity: {
    voice: string;
    visualStyle: string;
    keyThemes: string[];
    brandColors: string[]; // Estimated hex codes or color names
  };
  socialLinks: {
    platform: 'TikTok' | 'Instagram' | 'Facebook' | 'YouTube' | 'Twitter';
    url: string;
    followers: string;
  }[];
}

export interface IdeaItem {
  id: string;
  title: string;
  snippet: string;
  module: 'WarRoom' | 'ProductFinder' | 'PageBuilder' | 'General';
  date: string; // ISO string
  data?: any; // Store specific data like competitor analysis or product details
  isPinned?: boolean;
  link?: string;
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}
