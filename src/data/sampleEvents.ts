import { EventData } from '../types';

export const SAMPLE_EVENTS: Record<string, EventData> = {
  college_fest: {
    id: 'college_fest',
    name: 'College Cultural Fest',
    type: 'Cultural & Music Festival',
    attendees: 1500,
    durationHours: 8,
    venueType: 'hybrid',
    locationSetting: 'campus',
    budgetTier: 'standard',
    
    // Food & Catering
    servingType: 'buffet',
    mealCount: 1500,
    expectedLeftoverPercent: 22,
    isLeftoverEstimated: true,
    plantBasedRatio: 30,
    surplusDonationPlanned: false,
    
    // Waste & Single Use
    disposableCupsCount: 2000,
    isCupsEstimated: true,
    cutleryType: 'single_use_plastic',
    wasteSegregation: 'partial',
    compostingPlanned: false,
    
    // Water Provisioning
    waterProvision: 'bottled',
    refillStationsCount: 2,
    packagedBottlesCount: 1800,
    isBottlesEstimated: true,
    byobEncouraged: false,
    
    // Energy & Power
    powerSource: 'generators_diesel',
    stageLightingIntensity: 'high',
    hvacActive: false,
    soundScreenRig: 'high_output',
    generatorHours: 6,
    
    // Transport & Commute
    publicTransitPercent: 40,
    carpoolPercent: 20,
    privateCarPercent: 40,
    venueNearTransit: true,
    shuttleProvided: false,
    
    // Materials & Décor
    bannerType: 'pvc_flex',
    bannerCount: 18,
    badgeType: 'plastic_single',
    printedPrograms: true
  },

  metro_summit: {
    id: 'metro_summit',
    name: 'Metropolis Tech Summit',
    type: 'Conference & Exhibition',
    attendees: 750,
    durationHours: 9,
    venueType: 'indoor',
    locationSetting: 'metro',
    budgetTier: 'premium',
    
    // Food & Catering
    servingType: 'buffet',
    mealCount: 750,
    expectedLeftoverPercent: 14,
    isLeftoverEstimated: false,
    plantBasedRatio: 45,
    surplusDonationPlanned: true,
    
    // Waste & Single Use
    disposableCupsCount: 800,
    isCupsEstimated: false,
    cutleryType: 'compostable',
    wasteSegregation: 'good',
    compostingPlanned: true,
    
    // Water Provisioning
    waterProvision: 'dispensers',
    refillStationsCount: 6,
    packagedBottlesCount: 350,
    isBottlesEstimated: false,
    byobEncouraged: true,
    
    // Energy & Power
    powerSource: 'grid_standard',
    stageLightingIntensity: 'medium',
    hvacActive: true,
    soundScreenRig: 'standard',
    generatorHours: 0,
    
    // Transport & Commute
    publicTransitPercent: 60,
    carpoolPercent: 15,
    privateCarPercent: 25,
    venueNearTransit: true,
    shuttleProvided: true,
    
    // Materials & Décor
    bannerType: 'fabric_reusable',
    bannerCount: 6,
    badgeType: 'lanyards_returned',
    printedPrograms: false
  }
};
