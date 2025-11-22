
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  COMPETITOR_INTEL = 'COMPETITOR_INTEL',
  PRODUCT_FINDER = 'PRODUCT_FINDER',
  PAGE_BUILDER = 'PAGE_BUILDER',
  CREATIVE_STUDIO = 'CREATIVE_STUDIO',
  SUPPLIER_FINDER = 'SUPPLIER_FINDER',
  SUPPLIER_FINDER_V2 = 'SUPPLIER_FINDER_V2',
  AUTO_PILOT = 'AUTO_PILOT',
  INNOVATION_LAB = 'INNOVATION_LAB',
  SETTINGS = 'SETTINGS',
  BILLING = 'BILLING',
}

export enum BusinessModel {
  DROPSHIPPING = 'DROPSHIPPING',
  DROPSERVICING = 'DROPSERVICING'
}

export enum ProjectPhase {
  IDEATION = 'IDEATION',
  MARKET_INTEL = 'MARKET_INTEL',
  SOURCING = 'SOURCING',
  CREATION = 'CREATION',
  LAUNCH = 'LAUNCH'
}

export interface UserState {
  onboardingComplete: boolean;
  businessModel: BusinessModel | null;
  hasItem: boolean; // true if they have a product/service idea
  currentItemName?: string; // Name of product or service
  currentReferenceUrl?: string; // URL of product or service
  currentPhase: ProjectPhase; // Track where they are in the lifecycle
  completedSteps: string[]; // Track progress IDs
}

export interface AnalysisResult {
  swot: string;
  hooks: string[];
  pricingStrategy: string;
  viralScore: number;
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

// Consolidated Winning Product Interface
export interface WinningProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  productImages: string[];
  price: number;
  cost: number;
  profit: number;
  roi: number;
  saturation: number; // 0-100
  competition: number; // 0-100
  viralScore: number; // 0-100
  shopifyStoreCount: number;
  salesData: { day: string; value: number }[];
  winningReason: string;
  marketPotential: string;
  benefits: string[];
  angles: string[];
  aliExpressSignals: string[];
  amazonSignals: string[];
  tiktokSignals: string[];
  suppliers: {
    name: string;
    link: string;
    price: number;
    shipping: string;
    moq: string;
    rating: number;
  }[];
}

export interface WinningProductV2 extends WinningProduct {}

export interface Supplier {
  name: string;
  url: string;
  price: string;
  notes: string;
  shippingTime?: string;
  moq?: string;
  rating?: number;
  isVerified?: boolean;
  location?: string;
}

export interface SupplierV2 {
  id: string;
  name: string;
  url: string;
  price: string;
  rating: number;
  moq: string;
  productImages: string[];
  verifiedSeller: boolean;
  warehouseLocations: string[];
  shippingTimeEstimated: string;
  orderVolumeHistory: number[]; // 6 months trend
  priceStability: 'High' | 'Medium' | 'Low';
  negotiationTips: string[];
  privateLabelPotential: string;
  supplyChainRiskScore: number; // 0-100 (Lower is better)
  reliabilityScore: number; // 0-100 (Higher is better)
  returnPolicy: string;
  productMatchConfidence: number; // 0-100
}

export interface CustomerReview {
  id: string;
  author: string;
  rating: number;
  content: string;
  date: string;
  avatar?: string;
  verified: boolean;
  image?: string;
}

export interface LandingPageData {
  productName?: string;
  headline: string;
  subheadline: string;
  features: string[];
  description: string;
  callToAction: string;
  seoTitle: string;
  seoMeta: string;
  reviews: CustomerReview[];
  mockupImages: string[]; // 3D renders
  professionalImages: string[]; // Generated photos
  templateName?: string;
  visualDescription?: string;
}

export interface AdScript {
  hook: string;
  body: string;
  visualCue: string;
  cta: string;
}

export interface AutoPilotResult {
  product: WinningProduct;
  suppliers: Supplier[];
  landingPage: LandingPageData;
  adScript: AdScript;
  marketingImage: string;
  comfyUiWorkflow: object;
  optimizationPlan: string;
}

export interface BillingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  isPopular?: boolean;
}

export interface SocialPost {
  platform: 'TikTok' | 'Instagram' | 'Facebook';
  caption: string;
  hashtags: string[];
  scheduledTime?: string;
}

export interface MarketSimulationResult {
  productName: string;
  pricePoint: number;
  agentsSimulated: number;
  predictedCVR: number;
  predictedROAS: number;
  audienceBreakdown: {
    segment: string;
    conversionRate: number;
    objection: string;
  }[];
  salesHeatmap: { hour: number; sales: number }[];
  verdict: string;
}

export interface TrendGenesisResult {
  trendName: string;
  predictionDate: string;
  confidenceScore: number;
  aestheticKeywords: string[];
  originSignal: string; // e.g. "Shenzhen Factory Orders" or "Pinterest Color Variance"
  growthTrajectory: { week: string; score: number }[];
  description: string;
}

export interface ArbitrageOpportunity {
  id: string;
  productName: string;
  sourcePrice: number; // e.g. 5.00
  targetPrice: number; // e.g. 25.00
  margin: number;
  platform: string; // Where to sell
  confidenceScore: number;
  sourceUrl: string;
}

export interface AdMutation {
  id: string;
  variantName: string;
  hook: string;
  visualStyle: string;
  predictedCTR: number;
  status: 'Active' | 'Killed' | 'Breeding';
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

// --- MARKETING TYPES ---
export enum MarketingStrategy {
  ORGANIC_VIRAL = 'ORGANIC_VIRAL', // Free, quantity-focused
  PAID_SCALING = 'PAID_SCALING' // High-production, ROI-focused
}

export type VideoArchetype = 'AI_INFLUENCER' | 'ASMR_UNBOXING' | 'GREEN_SCREEN' | 'CINEMATIC_DEMO';

export interface ConnectedAccount {
  platform: 'TikTok' | 'Instagram' | 'Facebook' | 'YouTube';
  username: string;
  isConnected: boolean;
  followers: string;
  avatar?: string;
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
