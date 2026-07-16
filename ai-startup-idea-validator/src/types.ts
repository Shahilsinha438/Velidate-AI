export interface MarketSizeDetail {
  value: string;
  definition: string;
  description: string;
}

export interface Competitor {
  name: string;
  strength: string;
  weakness: string;
  marketShare: string;
  differentiator: string;
}

export interface RevenueModel {
  modelName: string;
  description: string;
  pricingStructure: string;
  pros: string[];
  cons: string[];
}

export interface AudienceSegment {
  name: string;
  description: string;
  size: string;
  painPoints: string[];
}

export interface UserPersona {
  name: string;
  role: string;
  bio: string;
  motivations: string[];
  frustration: string;
}

export interface TargetAudience {
  segments: AudienceSegment[];
  userPersona: UserPersona;
}

export interface MarketingChannel {
  channel: string;
  description: string;
  cost: string;
  impact: string;
}

export interface MVPPhase {
  phase: string;
  duration: string;
  keyDeliverables: string[];
  focus: string;
}

export interface MonthMilestone {
  monthRange: string;
  objective: string;
  activities: string[];
  milestones: string[];
}

export interface ValidationReport {
  score: number;
  summary: string;
  marketAnalysis: {
    overview: string;
    drivers: string[];
    barriers: string[];
    trends: string[];
  };
  competitors: Competitor[];
  marketSize: {
    tam: MarketSizeDetail;
    sam: MarketSizeDetail;
    som: MarketSizeDetail;
  };
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  revenueModels: RevenueModel[];
  targetAudience: TargetAudience;
  marketingStrategy: MarketingChannel[];
  mvpRoadmap: MVPPhase[];
  businessPlan12Month: MonthMilestone[];
}

export interface ValidationRequest {
  ideaName: string;
  description: string;
  industry: string;
  geography: string;
  fundingStage?: string;
  targetBudget?: string;
  currencySymbol?: string;
  currencyCode?: string;
}
