import {
  EventData,
  AnalysisResult,
  CategoryScore,
  Hotspot,
  Recommendation,
  OptimizedVariableChange,
  ScenarioOption,
  ActionTask,
  CategoryId
} from '../types';

export interface CategoryBreakdown {
  waste: number;
  food: number;
  water: number;
  energy: number;
  transport: number;
  materials: number;
  overallScore: number;
}

/**
 * PURE DETERMINISTIC SCORING ENGINE
 *
 * Strictly adheres to predefined weights:
 * Waste = 25%
 * Food = 20%
 * Water = 15%
 * Energy = 15%
 * Transport = 15%
 * Materials = 10%
 *
 * Green Score = 0.25(Waste) + 0.20(Food) + 0.15(Water) + 0.15(Energy) + 0.15(Transport) + 0.10(Materials)
 */
export function calculateScores(event: EventData): CategoryBreakdown {
  const attendees = Math.max(1, event.attendees);

  // 1. WASTE SCORE (Weight: 25%)
  let waste = 50;
  const cupsPerAttendee = event.disposableCupsCount / attendees;
  if (cupsPerAttendee > 1.2) waste -= 22;
  else if (cupsPerAttendee > 0.5) waste -= 12;
  else if (cupsPerAttendee === 0) waste += 20;
  else waste += 6;

  if (event.cutleryType === 'single_use_plastic') waste -= 18;
  else if (event.cutleryType === 'compostable') waste += 6;
  else if (event.cutleryType === 'reusable') waste += 20;

  if (event.wasteSegregation === 'excellent') waste += 20;
  else if (event.wasteSegregation === 'good') waste += 10;
  else if (event.wasteSegregation === 'partial') waste -= 5;
  else if (event.wasteSegregation === 'limited') waste -= 15;
  else if (event.wasteSegregation === 'none') waste -= 25;

  if (event.compostingPlanned) waste += 12;
  else waste -= 6;
  waste = Math.max(15, Math.min(98, Math.round(waste)));

  // 2. FOOD SCORE (Weight: 20%)
  let food = 60;
  if (event.expectedLeftoverPercent > 25) food -= 25;
  else if (event.expectedLeftoverPercent > 18) food -= 15;
  else if (event.expectedLeftoverPercent < 10) food += 16;

  if (event.servingType === 'buffet') food -= 6;
  else if (event.servingType === 'individual') food += 6;
  else if (event.servingType === 'food_trucks') food += 2;

  // Plant based ratio bonus
  const plantDiff = (event.plantBasedRatio - 30) * 0.28;
  food += plantDiff;

  if (event.surplusDonationPlanned) food += 12;
  else food -= 6;
  food = Math.max(20, Math.min(98, Math.round(food)));

  // 3. WATER SCORE (Weight: 15%)
  let water = 65;
  if (event.waterProvision === 'bottled') {
    const bottlesPerAttendee = event.packagedBottlesCount / attendees;
    if (bottlesPerAttendee >= 1) water -= 24;
    else water -= 14;
  } else if (event.waterProvision === 'dispensers') {
    water += 14;
  } else if (event.waterProvision === 'bring_own_bottle') {
    water += 25;
  }

  if (event.byobEncouraged) water += 10;
  else water -= 5;

  const targetStations = Math.ceil(attendees / 250);
  if (event.refillStationsCount >= targetStations && targetStations > 0) {
    water += 10;
  }
  water = Math.max(20, Math.min(98, Math.round(water)));

  // 4. ENERGY SCORE (Weight: 15%)
  let energy = 70;
  if (event.powerSource === 'generators_diesel') {
    energy -= 24;
    energy -= Math.min(20, event.generatorHours * 3);
  } else if (event.powerSource === 'grid_standard') {
    energy -= 4;
  } else if (event.powerSource === 'grid_renewable') {
    energy += 18;
  } else if (event.powerSource === 'hybrid_solar') {
    energy += 22;
  }

  if (event.stageLightingIntensity === 'high') energy -= 8;
  if (event.soundScreenRig === 'high_output') energy -= 6;
  if (event.hvacActive) energy -= 4;
  energy = Math.max(20, Math.min(98, Math.round(energy)));

  // 5. TRANSPORT SCORE (Weight: 15%)
  let transport = 50;
  const sustainableShare = event.publicTransitPercent + event.carpoolPercent * 0.5;
  transport = Math.round(sustainableShare * 0.72 + (event.venueNearTransit ? 14 : -10));
  if (event.shuttleProvided) transport += 8;
  if (event.privateCarPercent > 40) transport -= 10;
  transport = Math.max(20, Math.min(98, Math.round(transport)));

  // 6. MATERIALS SCORE (Weight: 10%)
  let materials = 55;
  if (event.bannerType === 'pvc_flex') {
    materials -= Math.min(26, event.bannerCount * 1.5);
  } else if (event.bannerType === 'fabric_reusable') {
    materials += 18;
  } else if (event.bannerType === 'digital_only') {
    materials += 26;
  }

  if (event.badgeType === 'plastic_single') materials -= 14;
  else if (event.badgeType === 'lanyards_returned') materials += 10;
  else if (event.badgeType === 'digital_qr') materials += 18;

  if (event.printedPrograms) materials -= 8;
  else materials += 6;
  materials = Math.max(20, Math.min(98, Math.round(materials)));

  // Deterministic Overall Weighted Score
  const overallScore = Math.round(
    0.25 * waste +
    0.20 * food +
    0.15 * water +
    0.15 * energy +
    0.15 * transport +
    0.10 * materials
  );

  return {
    waste,
    food,
    water,
    energy,
    transport,
    materials,
    overallScore
  };
}

/**
 * Full Analysis Engine:
 * Generates Category Breakdown, Hotspots (max 3), Actionable Recommendations,
 * 2x2 Priority Matrix assignments, and creates an optimized event twin.
 */
export function analyzeEventSustainability(event: EventData): AnalysisResult {
  const scores = calculateScores(event);
  const attendees = Math.max(1, event.attendees);

  let scoreGrade: 'Critical Attention' | 'Needs Improvement' | 'Moderate' | 'Good' | 'Exemplary' = 'Moderate';
  if (scores.overallScore >= 80) scoreGrade = 'Exemplary';
  else if (scores.overallScore >= 70) scoreGrade = 'Good';
  else if (scores.overallScore >= 58) scoreGrade = 'Moderate';
  else if (scores.overallScore >= 45) scoreGrade = 'Needs Improvement';
  else scoreGrade = 'Critical Attention';

  // Category objects
  const categoryScores: CategoryScore[] = [
    {
      id: 'waste',
      name: 'Waste',
      emoji: '♻️',
      score: scores.waste,
      weight: 25,
      label: scores.waste < 55 ? 'High Volume' : scores.waste < 75 ? 'Moderate' : 'Low Impact',
      summary: `${event.disposableCupsCount.toLocaleString()} cups planned. Segregation: ${event.wasteSegregation}.`,
      keyDriver: `${(event.disposableCupsCount / attendees).toFixed(1)} disposable items per attendee with ${event.wasteSegregation} segregation.`,
      positiveAspect: event.compostingPlanned ? 'Organic composting in place.' : 'Segregation stream can be upgraded.'
    },
    {
      id: 'food',
      name: 'Food',
      emoji: '🍽️',
      score: scores.food,
      weight: 20,
      label: scores.food < 55 ? 'High Surplus' : scores.food < 75 ? 'Moderate' : 'Calibrated',
      summary: `${event.expectedLeftoverPercent}% surplus expected in ${event.servingType} format.`,
      keyDriver: `${event.expectedLeftoverPercent}% anticipated leftover margin without complete recovery.`,
      positiveAspect: `${event.plantBasedRatio}% plant-based meals planned.`
    },
    {
      id: 'water',
      name: 'Water',
      emoji: '💧',
      score: scores.water,
      weight: 15,
      label: scores.water < 55 ? 'Bottled Heavy' : scores.water < 80 ? 'Moderate' : 'Refill-first',
      summary: event.waterProvision === 'bottled' ? `${event.packagedBottlesCount.toLocaleString()} PET bottles scheduled.` : `${event.refillStationsCount} bulk refill stations.`,
      keyDriver: event.waterProvision === 'bottled' ? 'Dependence on single-use bottled drinking water.' : 'Dispensers deployed.',
      positiveAspect: event.byobEncouraged ? 'BYOB flasks prompted in communications.' : 'Refill stations available.'
    },
    {
      id: 'energy',
      name: 'Energy',
      emoji: '⚡',
      score: scores.energy,
      weight: 15,
      label: scores.energy < 55 ? 'Emissions Heavy' : scores.energy < 75 ? 'Standard Grid' : 'Clean Grid',
      summary: event.powerSource === 'generators_diesel' ? `Diesel generators running for ${event.generatorHours}h.` : `Grid electricity profile.`,
      keyDriver: event.powerSource === 'generators_diesel' ? `On-site fuel combustion over ${event.generatorHours} operating hours.` : 'Standard grid distribution.',
      positiveAspect: event.powerSource === 'grid_renewable' ? 'Certified renewable energy tariff.' : 'Stage rig can be optimized.'
    },
    {
      id: 'transport',
      name: 'Transport',
      emoji: '🚌',
      score: scores.transport,
      weight: 15,
      label: scores.transport < 55 ? 'High Solo Car Share' : scores.transport < 75 ? 'Balanced' : 'Transit-First',
      summary: `${event.publicTransitPercent}% transit, ${event.privateCarPercent}% private vehicles.`,
      keyDriver: `${event.privateCarPercent}% solo personal vehicle travel creates heavy scope 3 travel emissions.`,
      positiveAspect: event.venueNearTransit ? 'Venue has direct transit connectivity.' : 'Carpooling incentives can be added.'
    },
    {
      id: 'materials',
      name: 'Materials',
      emoji: '🎨',
      score: scores.materials,
      weight: 10,
      label: scores.materials < 55 ? 'Single-use Vinyl' : scores.materials < 75 ? 'Moderate' : 'Circular / Reusable',
      summary: event.bannerType === 'pvc_flex' ? `${event.bannerCount} non-recyclable PVC flex banners.` : `Fabric or digital displays.`,
      keyDriver: event.bannerType === 'pvc_flex' ? `${event.bannerCount} PVC flex backdrops will enter municipal landfill.` : 'Reusable signage in place.',
      positiveAspect: event.badgeType === 'lanyards_returned' ? 'Lanyard return protocol enabled.' : 'Digital ticketing used.'
    }
  ];

  // Identify lowest scoring categories for summary sentence & hotspots
  const sortedCategories = [...categoryScores].sort((a, b) => a.score - b.score);
  const lowestCat1 = sortedCategories[0];
  const lowestCat2 = sortedCategories[1];

  let summarySentence = '';
  if (scores.overallScore >= 75) {
    summarySentence = `Your event demonstrates strong sustainability fundamentals, with ${lowestCat1.name.toLowerCase()} offering the most actionable area for further score gains.`;
  } else if (scores.overallScore >= 60) {
    summarySentence = `Your event has several strong sustainability choices, but ${lowestCat1.name.toLowerCase()} and ${lowestCat2.name.toLowerCase()} offer the biggest opportunities for improvement.`;
  } else {
    summarySentence = `Significant resource bottlenecks exist in ${lowestCat1.name.toLowerCase()} and ${lowestCat2.name.toLowerCase()}, where targeted operational shifts can substantially boost your Green Score.`;
  }

  // Generate strictly 3 Hotspots initially (Rank, Problem, Severity, Evidence, Short explanation, Recommended action)
  const hotspots: Hotspot[] = [];
  const hotspotTemplates: Record<CategoryId, { problem: string; severity: 'High impact' | 'Medium impact'; getEvidence: (e: EventData) => string; getExplanation: (e: EventData) => string; recommendedAction: string; recId: string }> = {
    waste: {
      problem: 'Single-use serving materials',
      severity: 'High impact',
      getEvidence: (e) => `Your event relies heavily on disposable items (${e.disposableCupsCount.toLocaleString()} disposable cups planned for ${e.attendees.toLocaleString()} attendees).`,
      getExplanation: () => 'Single-use serving items drive rapid container bin overflow and cannot be economically recycled through standard municipal channels.',
      recommendedAction: 'Replace disposable cups with deposit-return reusables or certified compostables.',
      recId: 'rec-cups'
    },
    water: {
      problem: 'Packaged water reliance',
      severity: 'High impact',
      getEvidence: (e) => `${e.packagedBottlesCount.toLocaleString()} packaged PET water bottles scheduled for distribution.`,
      getExplanation: () => 'Packaged single-use bottles generate high logistics weight, uncollected litter, and avoidable virgin PET plastic production.',
      recommendedAction: 'Install bulk filtered refill stations and prompt attendee BYOB.',
      recId: 'rec-water-refill'
    },
    transport: {
      problem: 'Individual private transport',
      severity: 'Medium impact',
      getEvidence: (e) => `${e.privateCarPercent}% of attendees are projected to commute using solo personal vehicles.`,
      getExplanation: () => 'Travel constitutes the single largest Scope 3 emission category for gathered audiences.',
      recommendedAction: 'Introduce charter shuttle lines from nearest metro station or offer carpool parking priority.',
      recId: 'rec-transit-pass'
    },
    food: {
      problem: 'Food surplus margin',
      severity: 'Medium impact',
      getEvidence: (e) => `Estimated leftover margin is ${e.expectedLeftoverPercent}%, creating significant edible surplus risk.`,
      getExplanation: () => 'Food surplus that ends in landfill decomposes anaerobically, generating methane emissions while wasting preparation resources.',
      recommendedAction: 'Calibrate headcount buffer to 10% and establish a food recovery NGO collection pact.',
      recId: 'rec-food-recovery'
    },
    energy: {
      problem: 'Diesel generator combustion',
      severity: 'High impact',
      getEvidence: (e) => `Diesel generators running for ${e.generatorHours} hours on-site.`,
      getExplanation: () => 'Mobile diesel generation emits nitrous oxides, fine particulates, and high carbon intensity per kilowatt-hour.',
      recommendedAction: 'Transition stage and sound power to direct building electrical grid line drops.',
      recId: 'rec-grid-power'
    },
    materials: {
      problem: 'Non-recyclable PVC flex banners',
      severity: 'Medium impact',
      getEvidence: (e) => `${e.bannerCount} disposable PVC flex printed backdrops scheduled for installation.`,
      getExplanation: () => 'Polyvinyl chloride (PVC) coated flex contains toxic plasticizers and cannot be processed by municipal dry waste centers.',
      recommendedAction: 'Switch to modular reusable tension fabric or digital LED backdrops.',
      recId: 'rec-signage-digital'
    }
  };

  sortedCategories.slice(0, 3).forEach((cat, idx) => {
    const tmpl = hotspotTemplates[cat.id];
    hotspots.push({
      id: `hotspot-${cat.id}`,
      rank: `0${idx + 1}`,
      problem: tmpl.problem,
      severity: tmpl.severity,
      evidence: tmpl.getEvidence(event),
      explanation: tmpl.getExplanation(event),
      recommendedAction: tmpl.recommendedAction,
      recommendationId: tmpl.recId,
      categoryId: cat.id
    });
  });

  // Actionable Recommendations mapped into 2x2 Priority Matrix
  const recommendations: Recommendation[] = [
    {
      id: 'rec-cups',
      title: 'Replace disposable cups with reusables or compostables',
      emoji: '♻️',
      whyItMatters: 'Reduces landfill-bound plastic scrap and eliminates visible venue litter.',
      potentialEffect: '+8 points projected',
      effort: 'Medium',
      cost: '₹₹',
      priority: 'DO_FIRST',
      description: 'Switch to managed steel/polycarbonate deposit cups or certified biodegradable bagasse drinkware with dedicated collection bins.',
      whyEcoviaRecommendsThis: `Your event plans ${event.disposableCupsCount.toLocaleString()} single-use cups for ${attendees.toLocaleString()} attendees. Switching to reusables directly addresses your #1 waste bottleneck and prevents ~${Math.round(event.disposableCupsCount * 0.015)} kg of discarded plastic.`,
      categoryId: 'waste',
      scoreBoost: 8
    },
    {
      id: 'rec-water-refill',
      title: 'Install chilled water refill stations & prompt BYOB',
      emoji: '💧',
      whyItMatters: 'Reduces single-use packaged bottle inventory and attendee hydration friction.',
      potentialEffect: '+7 points projected',
      effort: 'Low',
      cost: '₹',
      priority: 'DO_FIRST',
      description: 'Replace PET water cases with 20L sanitized water dispensers and pre-event attendee hydration reminders.',
      whyEcoviaRecommendsThis: 'Filtered dispenser hubs cut single-use plastic bottles to zero, lower event supply logistics costs, and improve attendee hydration accessibility.',
      categoryId: 'water',
      scoreBoost: 7
    },
    {
      id: 'rec-food-recovery',
      title: 'Calibrate catering margins & arrange surplus donation',
      emoji: '🍽️',
      whyItMatters: 'Prevents edible food waste and directs nutritious meals to local hunger relief programs.',
      potentialEffect: '+6 points projected',
      effort: 'Medium',
      cost: '₹',
      priority: 'PLAN',
      description: 'Tighten catering buffer to 10% and sign a scheduled surplus collection agreement with a local hunger relief charity.',
      whyEcoviaRecommendsThis: `Your ${event.expectedLeftoverPercent}% expected surplus means dozens of untouched meal portions could be discarded. Partnering with a food bank recovers this value seamlessly post-event.`,
      categoryId: 'food',
      scoreBoost: 6
    },
    {
      id: 'rec-transit-pass',
      title: 'Coordinate metro shuttle links or transit discount passes',
      emoji: '🚌',
      whyItMatters: 'Reduces private vehicle congestion, parking stress, and Scope 3 transport carbon.',
      potentialEffect: '+6 points projected',
      effort: 'Medium',
      cost: '₹₹',
      priority: 'PLAN',
      description: 'Provide low-cost charter loop shuttles connecting the nearest metro/bus hub or incentivize carpooling with reserved parking.',
      whyEcoviaRecommendsThis: `With ${event.privateCarPercent}% private vehicle commuting, transit incentives offer the largest potential lever to cut attendee travel carbon.`,
      categoryId: 'transport',
      scoreBoost: 6
    },
    {
      id: 'rec-signage-digital',
      title: 'Swap PVC flex banners for reusable fabric & digital displays',
      emoji: '🎨',
      whyItMatters: 'Replaces toxic chlorinated vinyl with reusable framing and digital versatility.',
      potentialEffect: '+4 points projected',
      effort: 'Low',
      cost: '₹',
      priority: 'QUICK_WIN',
      description: 'Utilize venue LED screens, projector displays, and timeless reusable fabric backdrops without date-stamped vinyl.',
      whyEcoviaRecommendsThis: `${event.bannerCount} single-use flex banners create unrecyclable landfill waste. Canvas frames or venue digital screens eliminate this footprint entirely.`,
      categoryId: 'materials',
      scoreBoost: 4
    },
    {
      id: 'rec-grid-power',
      title: 'Connect stage audiovisuals to direct electrical grid lines',
      emoji: '⚡',
      whyItMatters: 'Eliminates localized exhaust fumes, acoustic generator noise, and fuel combustion.',
      potentialEffect: '+6 points projected',
      effort: 'High',
      cost: '₹₹₹',
      priority: 'DEPRIORITIZE',
      description: 'Coordinate with facility engineers for dedicated high-voltage distribution drops rather than running diesel generators.',
      whyEcoviaRecommendsThis: `Running diesel generators for ${event.generatorHours} hours produces significant particulate matter and diesel carbon that can be avoided with utility line drops.`,
      categoryId: 'energy',
      scoreBoost: 6
    }
  ];

  // REALISTIC OPTIMIZED EVENT TWIN (Focuses on 5 high-value changes respecting event constraints)
  const optimizedEvent: EventData = {
    ...event,
    disposableCupsCount: 0,
    cutleryType: 'reusable',
    wasteSegregation: 'good',
    compostingPlanned: true,
    waterProvision: 'dispensers',
    packagedBottlesCount: 0,
    refillStationsCount: Math.max(event.refillStationsCount, Math.ceil(attendees / 250)),
    byobEncouraged: true,
    expectedLeftoverPercent: 10,
    surplusDonationPlanned: true,
    publicTransitPercent: Math.min(80, event.publicTransitPercent + 25),
    privateCarPercent: Math.max(10, event.privateCarPercent - 25),
    shuttleProvided: true,
    bannerType: 'fabric_reusable',
    printedPrograms: false,
    badgeType: event.badgeType === 'plastic_single' ? 'lanyards_returned' : event.badgeType,
    powerSource: event.powerSource === 'generators_diesel' ? 'grid_standard' : event.powerSource,
    generatorHours: 0
  };

  // Run the EXACT SAME deterministic scoring engine on the optimized twin
  const optimizedScores = calculateScores(optimizedEvent);
  const projectedBoost = optimizedScores.overallScore - scores.overallScore;

  // Variable Changes (What changed)
  const variableChanges: OptimizedVariableChange[] = [
    {
      categoryId: 'waste',
      parameter: 'Drinkware & Tableware',
      currentValue: event.disposableCupsCount > 0 ? `${event.disposableCupsCount.toLocaleString()} disposable cups` : 'Single-use items',
      optimizedValue: 'Deposit-return reusable tumblers & washable cutlery',
      rationale: 'Eliminates single-use plastic waste generation at the source.',
      confidenceNote: 'Projected ~95% diversion from landfill'
    },
    {
      categoryId: 'water',
      parameter: 'Drinking Water Supply',
      currentValue: event.waterProvision === 'bottled' ? `${event.packagedBottlesCount.toLocaleString()} single-use PET bottles` : 'Packaged bottles',
      optimizedValue: 'Filtered bulk refill stations + attendee BYOB flasks',
      rationale: 'Replaces packaged plastic bottles with sanitary 20L dispenser stations.',
      confidenceNote: 'Projected zero single-use bottle waste'
    },
    {
      categoryId: 'food',
      parameter: 'Catering Surplus & Recovery',
      currentValue: `${event.expectedLeftoverPercent}% expected surplus (unrecovered)`,
      optimizedValue: '10% calibrated buffer + food bank pickup pact',
      rationale: 'Right-sizes portions and captures edible surplus for community distribution.',
      confidenceNote: 'Projected 100% edible surplus redistributed'
    },
    {
      categoryId: 'transport',
      parameter: 'Attendee Transit Mode Split',
      currentValue: `${event.publicTransitPercent}% transit, ${event.privateCarPercent}% private solo cars`,
      optimizedValue: `${optimizedEvent.publicTransitPercent}% transit & group shuttles, ${optimizedEvent.privateCarPercent}% private cars`,
      rationale: 'Shifts solo drivers via venue shuttle loops and metro incentives.',
      confidenceNote: 'Projected significant Scope 3 travel emission reduction'
    },
    {
      categoryId: 'materials',
      parameter: 'Stage & Signage Materials',
      currentValue: event.bannerType === 'pvc_flex' ? `${event.bannerCount} non-recyclable PVC flex banners` : 'Disposable signage',
      optimizedValue: 'Modular reusable fabric framing & venue digital screens',
      rationale: 'Stops single-use vinyl from going to municipal dump.',
      confidenceNote: 'Projected 100% signage reusability for future editions'
    }
  ];

  // Default Action Tasks structured into 5 Timeline Groups with Roles
  const actionTasks: ActionTask[] = [
    {
      id: 'task-1',
      title: 'Confirm bulk water dispensers & plumbing with facility management',
      phase: 'before',
      timelineGroup: '4_weeks_before',
      role: 'Venue Coordinator',
      completed: true,
      categoryId: 'water',
      impactBadge: 'High Impact',
      notes: 'Station dispensers in reception foyer, stage wing, and auditorium lobby.'
    },
    {
      id: 'task-2',
      title: 'Contract reusable dishware & deposit-return cup service',
      phase: 'before',
      timelineGroup: '4_weeks_before',
      role: 'Catering Vendor',
      completed: true,
      categoryId: 'waste',
      impactBadge: 'High Impact',
      notes: 'Sanitized deposit cups with wash crates and token checkout counter.'
    },
    {
      id: 'task-3',
      title: 'Sign food surplus recovery protocol with local community pantry',
      phase: 'before',
      timelineGroup: '2_weeks_before',
      role: 'Catering Vendor',
      completed: false,
      categoryId: 'food',
      impactBadge: 'High Impact',
      notes: 'Refrigerated van scheduled for pickup 30 minutes after dinner wrap.'
    },
    {
      id: 'task-4',
      title: 'Order modular tension fabric backdrops instead of single-use PVC flex',
      phase: 'before',
      timelineGroup: '2_weeks_before',
      role: 'AV Production',
      completed: true,
      categoryId: 'materials',
      impactBadge: 'Medium Impact',
      notes: 'Reusable aluminum extrusion framing with washable canvas prints.'
    },
    {
      id: 'task-5',
      title: 'Broadcast transit options & BYOB flask prompt in attendee email updates',
      phase: 'before',
      timelineGroup: '1_week_before',
      role: 'Logistics Coordinator',
      completed: true,
      categoryId: 'transport',
      impactBadge: 'Medium Impact',
      notes: 'Highlight nearest metro exit, walking path, and personal bottle refill points.'
    },
    {
      id: 'task-6',
      title: 'Stage 3-stream waste stations with student volunteer marshals',
      phase: 'during',
      timelineGroup: 'event_day',
      role: 'Logistics Coordinator',
      completed: false,
      categoryId: 'waste',
      impactBadge: 'High Impact',
      notes: 'Distinct visual color coding: Compostable food, Recyclable, Non-recyclable.'
    },
    {
      id: 'task-7',
      title: 'Verify dispenser water levels and maintain clean sanitation trays',
      phase: 'during',
      timelineGroup: 'event_day',
      role: 'Venue Coordinator',
      completed: false,
      categoryId: 'water',
      impactBadge: 'Medium Impact',
      notes: 'Hourly check during peak registration and session breaks.'
    },
    {
      id: 'task-8',
      title: 'Log unserved catering weight and pack into insulated donation crates',
      phase: 'after',
      timelineGroup: 'post_event',
      role: 'Catering Vendor',
      completed: false,
      categoryId: 'food',
      impactBadge: 'High Impact',
      notes: 'Weigh trays, sign food safety custody log, and hand over to NGO courier.'
    },
    {
      id: 'task-9',
      title: 'Pack reusable fabric backdrops and inventory returnable lanyards',
      phase: 'after',
      timelineGroup: 'post_event',
      role: 'AV Production',
      completed: false,
      categoryId: 'materials',
      impactBadge: 'Medium Impact',
      notes: 'Returnable credential box collected at exit turnstiles for future editions.'
    }
  ];

  // Interactive Scenario Options for What-If Simulator
  const scenarioOptions: ScenarioOption[] = [
    {
      id: 'scenario-cups',
      label: 'Replace disposable cups',
      emoji: '♻️',
      scoreBoost: 8,
      explanation: 'Eliminates single-use cups in favor of managed reusable deposit cups.',
      categoryId: 'waste',
      overrideDelta: {
        disposableCupsCount: 0,
        cutleryType: 'reusable'
      }
    },
    {
      id: 'scenario-water',
      label: 'Add refill stations',
      emoji: '💧',
      scoreBoost: 7,
      explanation: 'Replaces packaged PET bottles with bulk filtered dispensers and BYOB flask prompts.',
      categoryId: 'water',
      overrideDelta: {
        waterProvision: 'dispensers',
        packagedBottlesCount: 0,
        byobEncouraged: true,
        refillStationsCount: Math.max(event.refillStationsCount, Math.ceil(attendees / 250))
      }
    },
    {
      id: 'scenario-transit',
      label: 'Increase public transport',
      emoji: '🚌',
      scoreBoost: 6,
      explanation: 'Shifts attendees to public transit via charter shuttles and metro passes.',
      categoryId: 'transport',
      overrideDelta: {
        publicTransitPercent: Math.min(85, event.publicTransitPercent + 25),
        privateCarPercent: Math.max(10, event.privateCarPercent - 25),
        shuttleProvided: true
      }
    },
    {
      id: 'scenario-food',
      label: 'Reduce food surplus',
      emoji: '🍽️',
      scoreBoost: 6,
      explanation: 'Calibrates headcount buffer to 10% and establishes food bank collection.',
      categoryId: 'food',
      overrideDelta: {
        expectedLeftoverPercent: 10,
        surplusDonationPlanned: true
      }
    },
    {
      id: 'scenario-materials',
      label: 'Use reusable décor',
      emoji: '🎨',
      scoreBoost: 4,
      explanation: 'Replaces PVC flex banners with reusable fabric backdrops and digital signage.',
      categoryId: 'materials',
      overrideDelta: {
        bannerType: 'fabric_reusable',
        printedPrograms: false
      }
    },
    {
      id: 'scenario-waste-seg',
      label: 'Improve waste segregation',
      emoji: '♻️',
      scoreBoost: 5,
      explanation: 'Deploys 3-stream colored bins with active volunteer marshaling.',
      categoryId: 'waste',
      overrideDelta: {
        wasteSegregation: 'excellent',
        compostingPlanned: true
      }
    }
  ];

  // Data completeness assessment
  let completenessPoints = 0;
  const totalPoints = 10;
  if (event.name && event.name.trim().length > 0) completenessPoints += 1;
  if (event.attendees > 0) completenessPoints += 1;
  if (event.durationHours > 0) completenessPoints += 1;
  if (!event.isLeftoverEstimated) completenessPoints += 1; else completenessPoints += 0.6;
  if (!event.isCupsEstimated) completenessPoints += 1; else completenessPoints += 0.6;
  if (!event.isBottlesEstimated) completenessPoints += 1; else completenessPoints += 0.6;
  if (event.servingType) completenessPoints += 1;
  if (event.powerSource) completenessPoints += 1;
  if (event.publicTransitPercent >= 0) completenessPoints += 1;
  if (event.bannerType) completenessPoints += 1;

  const dataCompleteness = Math.min(100, Math.round((completenessPoints / totalPoints) * 100));
  const completenessNote =
    dataCompleteness >= 85
      ? 'Most key event inputs are available.'
      : 'Some recommendations use estimates.';

  // Next Best Action derived from highest-priority recommendation
  const topRec =
    recommendations.find((r) => r.priority === 'DO_FIRST') || recommendations[0];
  const nextBestAction = {
    title: topRec ? topRec.title : 'Replace disposable serving ware',
    impactBadge: topRec ? `+${topRec.scoreBoost} projected points` : 'High projected impact',
    effortBadge: topRec ? `${topRec.effort} effort` : 'Medium effort',
    description: topRec ? topRec.whyItMatters : 'Replaces single-use plastics with circular reusables.',
    recommendationId: topRec ? topRec.id : 'rec-1'
  };

  return {
    overallScore: scores.overallScore,
    scoreGrade,
    summarySentence,
    categoryScores,
    hotspots,
    recommendations,
    nextBestAction,
    dataCompleteness,
    completenessNote,
    optimizedEvent,
    optimizedScore: optimizedScores.overallScore,
    projectedBoost,
    variableChanges,
    actionTasks,
    scenarioOptions
  };
}
