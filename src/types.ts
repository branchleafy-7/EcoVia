export type VenueType = 'indoor' | 'outdoor' | 'hybrid';
export type LocationSetting = 'campus' | 'metro' | 'suburban' | 'rural';
export type BudgetTier = 'lean' | 'standard' | 'premium';
export type ServingType = 'buffet' | 'individual' | 'food_trucks' | 'finger_food';
export type WasteSegregationLevel = 'excellent' | 'good' | 'partial' | 'limited' | 'none';
export type CutleryType = 'single_use_plastic' | 'compostable' | 'reusable';
export type WaterProvision = 'bottled' | 'dispensers' | 'bring_own_bottle';
export type PowerSource = 'grid_renewable' | 'grid_standard' | 'generators_diesel' | 'hybrid_solar';
export type BannerType = 'pvc_flex' | 'fabric_reusable' | 'digital_only';
export type BadgeType = 'plastic_single' | 'digital_qr' | 'lanyards_returned';

export type EventStatus = 'draft' | 'analyzed' | 'optimized';

export type ThemeMode = 'light' | 'dark';

export interface EventData {
  id: string;
  name: string;
  type: string;
  attendees: number;
  durationHours: number;
  venueType: VenueType;
  locationSetting: LocationSetting;
  budgetTier: BudgetTier;
  
  // Status and Persistence
  status?: EventStatus;
  updatedAt?: string;
  createdAt?: string;
  eventDate?: string;
  baselineScore?: number;
  projectedScore?: number;
  analysisOutdated?: boolean;
  optimizationOutdated?: boolean;
  completedTasks?: string[];
  whatIfSelectedScenarioIds?: string[];
  draftStep?: number;
  
  // Step 2: Food & Catering
  servingType: ServingType;
  mealCount: number;
  expectedLeftoverPercent: number; // 5 - 40%
  isLeftoverEstimated: boolean;
  plantBasedRatio: number; // 0 - 100%
  surplusDonationPlanned: boolean;
  
  // Step 3: Waste & Single-Use
  disposableCupsCount: number;
  isCupsEstimated: boolean;
  cutleryType: CutleryType;
  wasteSegregation: WasteSegregationLevel;
  compostingPlanned: boolean;
  
  // Step 4: Water
  waterProvision: WaterProvision;
  refillStationsCount: number;
  packagedBottlesCount: number;
  isBottlesEstimated: boolean;
  byobEncouraged: boolean;
  
  // Step 5: Energy
  powerSource: PowerSource;
  stageLightingIntensity: 'low' | 'medium' | 'high';
  hvacActive: boolean;
  soundScreenRig: 'standard' | 'high_output' | 'minimal';
  generatorHours: number;
  
  // Step 6: Transport
  publicTransitPercent: number; // 0 - 100%
  carpoolPercent: number;
  privateCarPercent: number;
  venueNearTransit: boolean;
  shuttleProvided: boolean;
  
  // Step 7: Materials
  bannerType: BannerType;
  bannerCount: number;
  badgeType: BadgeType;
  printedPrograms: boolean;
}

export type CategoryId = 'waste' | 'food' | 'water' | 'energy' | 'transport' | 'materials';

export interface CategoryScore {
  id: CategoryId;
  name: string;
  emoji: string;
  score: number; // 0 - 100
  weight: number; // percentage (e.g. 25, 20, 15, etc.)
  label: string; // e.g. "Low Impact" / "Needs Attention" / "Good"
  summary: string;
  keyDriver: string;
  positiveAspect: string;
}

export interface Hotspot {
  id: string;
  rank: string; // "01", "02", "03"
  problem: string;
  severity: 'High impact' | 'Medium impact' | 'Moderate impact';
  evidence: string;
  explanation: string;
  recommendedAction: string;
  recommendationId: string;
  categoryId: CategoryId;
}

export type MatrixZone = 'DO_FIRST' | 'PLAN' | 'QUICK_WIN' | 'DEPRIORITIZE';

export interface Recommendation {
  id: string;
  title: string;
  emoji: string;
  whyItMatters: string;
  potentialEffect: string; // e.g. "+8 points projected"
  effort: 'Low' | 'Medium' | 'High';
  cost: '₹' | '₹₹' | '₹₹₹';
  priority: MatrixZone; // DO_FIRST | PLAN | QUICK_WIN | DEPRIORITIZE
  description: string;
  whyEcoviaRecommendsThis: string;
  categoryId: CategoryId;
  scoreBoost: number;
}

export interface OptimizedVariableChange {
  categoryId: CategoryId;
  parameter: string;
  currentValue: string;
  optimizedValue: string;
  rationale: string;
  confidenceNote: string;
}

export interface ScenarioOption {
  id: string;
  label: string;
  emoji: string;
  scoreBoost: number;
  explanation: string;
  categoryId: CategoryId;
  overrideDelta: Partial<EventData>;
}

export type TimelineGroup = '4_weeks_before' | '2_weeks_before' | '1_week_before' | 'event_day' | 'post_event';

export interface ActionTask {
  id: string;
  title: string;
  phase: 'before' | 'during' | 'after';
  timelineGroup: TimelineGroup;
  role: string;
  completed: boolean;
  categoryId: CategoryId;
  impactBadge: string;
  notes?: string;
  sourceRecommendationId?: string;
}

export interface NextBestAction {
  title: string;
  impactBadge: string;
  effortBadge: string;
  description: string;
  recommendationId: string;
}

export interface AnalysisResult {
  overallScore: number; // Deterministic 0 - 100
  scoreGrade: 'Critical Attention' | 'Needs Improvement' | 'Moderate' | 'Good' | 'Exemplary';
  summarySentence: string;
  categoryScores: CategoryScore[];
  hotspots: Hotspot[];
  recommendations: Recommendation[];
  nextBestAction: NextBestAction;
  dataCompleteness: number; // 0 - 100%
  completenessNote: string;
  
  // Optimization & Projections
  optimizedEvent: EventData;
  optimizedScore: number;
  projectedBoost: number;
  variableChanges: OptimizedVariableChange[];
  
  // Scenarios & Plan
  actionTasks: ActionTask[];
  scenarioOptions: ScenarioOption[];
}
