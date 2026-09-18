import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info,
  Check,
  Utensils,
  Trash2,
  Droplets,
  Zap,
  Bus,
  Palette,
  Calendar,
  HelpCircle
} from 'lucide-react';
import {
  EventData,
  ServingType,
  WasteSegregationLevel,
  CutleryType,
  WaterProvision,
  PowerSource,
  BannerType,
  BadgeType,
  VenueType,
  LocationSetting,
  BudgetTier
} from '../types';

interface EventCreationWizardProps {
  initialData?: EventData | null;
  onComplete: (data: EventData) => void;
  onCancel: () => void;
}

const STEP_LABELS = [
  { step: 1, label: 'Event', icon: Calendar },
  { step: 2, label: 'Food', icon: Utensils },
  { step: 3, label: 'Waste', icon: Trash2 },
  { step: 4, label: 'Water', icon: Droplets },
  { step: 5, label: 'Energy', icon: Zap },
  { step: 6, label: 'Transport', icon: Bus },
  { step: 7, label: 'Materials', icon: Palette }
];

export const EventCreationWizard: React.FC<EventCreationWizardProps> = ({
  initialData,
  onComplete,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const [formData, setFormData] = useState<EventData>(() => {
    if (initialData) return { ...initialData };
    
    // Check localStorage for autosaved draft
    try {
      const saved = localStorage.getItem('ecovia_event_draft');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // Fallback
    }

    return {
      id: 'event_' + Date.now(),
      name: 'College Cultural Fest',
      type: 'Cultural & Music Festival',
      attendees: 1500,
      durationHours: 8,
      venueType: 'hybrid',
      locationSetting: 'campus',
      budgetTier: 'standard',
      
      // Step 2: Food & Catering
      servingType: 'buffet',
      mealCount: 1500,
      expectedLeftoverPercent: 20,
      isLeftoverEstimated: true,
      plantBasedRatio: 35,
      surplusDonationPlanned: false,
      
      // Step 3: Waste
      disposableCupsCount: 2000,
      isCupsEstimated: true,
      cutleryType: 'single_use_plastic',
      wasteSegregation: 'partial',
      compostingPlanned: false,
      
      // Step 4: Water
      waterProvision: 'bottled',
      refillStationsCount: 2,
      packagedBottlesCount: 1800,
      isBottlesEstimated: true,
      byobEncouraged: false,
      
      // Step 5: Energy
      powerSource: 'generators_diesel',
      stageLightingIntensity: 'high',
      hvacActive: false,
      soundScreenRig: 'high_output',
      generatorHours: 6,
      
      // Step 6: Transport
      publicTransitPercent: 40,
      carpoolPercent: 20,
      privateCarPercent: 40,
      venueNearTransit: true,
      shuttleProvided: false,
      
      // Step 7: Materials
      bannerType: 'pvc_flex',
      bannerCount: 18,
      badgeType: 'plastic_single',
      printedPrograms: true
    };
  });

  // Autosave to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem('ecovia_event_draft', JSON.stringify(formData));
    } catch (e) {
      // Ignore
    }
  }, [formData]);

  const updateField = <K extends keyof EventData>(key: K, value: EventData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (currentStep < 7) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onComplete(formData);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onCancel();
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      
      {/* Top Header & Step Tracker */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A6860] hover:text-[#132E20] transition-colors p-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{currentStep === 1 ? 'Cancel' : 'Back'}</span>
          </button>
          
          <div className="text-right">
            <span className="text-xs font-bold text-[#132E20]">
              Step {currentStep} of 7
            </span>
            <span className="text-xs text-[#526359] ml-2 font-medium">
              ({currentStep} / 7 completed)
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-[#EAE8E3] h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#15803D] h-full transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / 7) * 100}%` }}
          />
        </div>

        {/* Persistent 7-step Progress Indicators */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {STEP_LABELS.map((s) => {
            const Icon = s.icon;
            const isCurrent = s.step === currentStep;
            const isCompleted = s.step < currentStep;
            return (
              <button
                key={s.step}
                type="button"
                onClick={() => setCurrentStep(s.step)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                  isCurrent
                    ? 'bg-[#132E20] text-white font-semibold'
                    : isCompleted
                    ? 'bg-[#E2E8E4] text-[#15803D] font-medium'
                    : 'bg-[#F3F2EE] text-[#718096]'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Icon className="w-3 h-3" />
                )}
                <span>{s.step} {s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Card Container */}
      <div className="bg-white rounded-3xl border border-[#EAE8E3] p-5 sm:p-8 shadow-xs space-y-6">
        
        {/* STEP 1: EVENT BASICS */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-[#132E20]">
                Step 1 — Event Basics
              </h2>
              <p className="text-xs sm:text-sm text-[#526359]">
                Basic scale, venue, and operating context to calibrate baseline benchmarks.
              </p>
            </div>

            <div className="space-y-4">
              {/* Event Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1E2522]">
                  Event Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="e.g. College Cultural Fest"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D6CE] text-sm text-[#1E2522] focus:outline-none focus:ring-2 focus:ring-[#15803D]/20 focus:border-[#15803D]"
                />
              </div>

              {/* Event Type & Venue Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1E2522]">
                    Event Type
                  </label>
                  <input
                    type="text"
                    value={formData.type}
                    onChange={(e) => updateField('type', e.target.value)}
                    placeholder="e.g. Cultural Fest / Conference"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D6CE] text-sm text-[#1E2522] focus:outline-none focus:ring-2 focus:ring-[#15803D]/20 focus:border-[#15803D]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1E2522]">
                    Venue Type
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#F3F2EE] rounded-xl">
                    {(['indoor', 'outdoor', 'hybrid'] as VenueType[]).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => updateField('venueType', v)}
                        className={`py-1.5 text-xs font-semibold capitalize rounded-lg transition-all ${
                          formData.venueType === v
                            ? 'bg-white text-[#132E20] shadow-xs'
                            : 'text-[#64748B] hover:text-[#132E20]'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Location Type & Budget Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1E2522]">
                    Location Setting
                  </label>
                  <div className="grid grid-cols-4 gap-1 p-1 bg-[#F3F2EE] rounded-xl">
                    {(['campus', 'metro', 'suburban', 'rural'] as LocationSetting[]).map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => updateField('locationSetting', loc)}
                        className={`py-1.5 text-[11px] font-semibold capitalize rounded-lg transition-all ${
                          formData.locationSetting === loc
                            ? 'bg-white text-[#132E20] shadow-xs'
                            : 'text-[#64748B] hover:text-[#132E20]'
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1E2522]">
                    Budget Category
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#F3F2EE] rounded-xl">
                    {(['lean', 'standard', 'premium'] as BudgetTier[]).map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => updateField('budgetTier', b)}
                        className={`py-1.5 text-xs font-semibold capitalize rounded-lg transition-all ${
                          formData.budgetTier === b
                            ? 'bg-white text-[#132E20] shadow-xs'
                            : 'text-[#64748B] hover:text-[#132E20]'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Attendees & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#1E2522]">
                      Expected Attendees
                    </label>
                    <span className="text-xs font-bold text-[#15803D]">
                      {formData.attendees.toLocaleString()} attendees
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="5000"
                    step="50"
                    value={formData.attendees}
                    onChange={(e) => updateField('attendees', parseInt(e.target.value) || 50)}
                    className="w-full accent-[#15803D]"
                  />
                  <div className="flex justify-between text-[10px] text-[#718096]">
                    <span>50</span>
                    <span>1,500</span>
                    <span>5,000+</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#1E2522]">
                      Duration (Hours)
                    </label>
                    <span className="text-xs font-bold text-[#15803D]">
                      {formData.durationHours} hrs
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="24"
                    step="1"
                    value={formData.durationHours}
                    onChange={(e) => updateField('durationHours', parseInt(e.target.value) || 2)}
                    className="w-full accent-[#15803D]"
                  />
                  <div className="flex justify-between text-[10px] text-[#718096]">
                    <span>2 hrs</span>
                    <span>8 hrs</span>
                    <span>24 hrs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: FOOD & CATERING */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-[#132E20] flex items-center gap-2">
                <span>🍽️</span> Step 2 — Food & Catering
              </h2>
              <p className="text-xs sm:text-sm text-[#526359]">
                Serving format, leftover margins, and plant-based ratios.
              </p>
            </div>

            <div className="space-y-5">
              {/* Serving Format */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1E2522]">
                  Serving Format
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'buffet', label: 'Buffet' },
                    { id: 'individual', label: 'Boxed / Plated' },
                    { id: 'food_trucks', label: 'Food Trucks' },
                    { id: 'finger_food', label: 'Finger Food' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => updateField('servingType', f.id as ServingType)}
                      className={`py-2 text-xs font-semibold rounded-xl border transition-all text-center ${
                        formData.servingType === f.id
                          ? 'bg-[#132E20] text-white border-[#132E20] shadow-xs'
                          : 'bg-white text-[#4A5568] border-[#D9D6CE] hover:border-[#8DA393]'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Expected Leftover Percentage with Estimate Toggle */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <label className="text-xs font-semibold text-[#1E2522]">
                      Expected Leftover Margin
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveTooltip(activeTooltip === 'leftover' ? null : 'leftover')
                      }
                      className="text-[#64748B] hover:text-[#132E20]"
                      title="Contextual explanation"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {formData.isLeftoverEstimated && (
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        Estimated
                      </span>
                    )}
                    <span className="text-xs font-bold text-[#15803D]">
                      {formData.expectedLeftoverPercent}%
                    </span>
                  </div>
                </div>

                {activeTooltip === 'leftover' && (
                  <div className="p-3 rounded-xl bg-[#E2E8E4]/70 border border-[#CBD5E1] text-xs text-[#2C4A38] leading-relaxed">
                    <strong>Expected leftover percentage:</strong> Approximate share of prepared catering volume likely to go unconsumed. High buffer margins often end up in waste containers.
                  </div>
                )}

                <input
                  type="range"
                  min="5"
                  max="40"
                  step="1"
                  value={formData.expectedLeftoverPercent}
                  onChange={(e) =>
                    updateField('expectedLeftoverPercent', parseInt(e.target.value) || 5)
                  }
                  className="w-full accent-[#15803D]"
                />

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[10px] text-[#718096]">5% (Tight buffer) - 40% (High surplus)</span>
                  <button
                    type="button"
                    onClick={() => updateField('isLeftoverEstimated', !formData.isLeftoverEstimated)}
                    className="text-[11px] text-[#15803D] hover:underline font-medium"
                  >
                    {formData.isLeftoverEstimated ? 'Enter exact number' : 'Use an estimate'}
                  </button>
                </div>
              </div>

              {/* Plant-Based Ratio */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#1E2522]">
                    Plant-Based / Vegetarian Ratio
                  </label>
                  <span className="text-xs font-bold text-[#15803D]">
                    {formData.plantBasedRatio}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={formData.plantBasedRatio}
                  onChange={(e) =>
                    updateField('plantBasedRatio', parseInt(e.target.value) || 0)
                  }
                  className="w-full accent-[#15803D]"
                />
                <div className="flex justify-between text-[10px] text-[#718096]">
                  <span>0% (Meat centric)</span>
                  <span>50% (Balanced)</span>
                  <span>100% (All Plant)</span>
                </div>
              </div>

              {/* Surplus Food Recovery Plan */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#EAE8E3]">
                <div>
                  <div className="text-xs font-semibold text-[#132E20]">
                    Food Surplus Donation / Recovery Plan
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    Arrangement with local charity or community pantry for unserved food
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => updateField('surplusDonationPlanned', !formData.surplusDonationPlanned)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    formData.surplusDonationPlanned ? 'bg-[#15803D]' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      formData.surplusDonationPlanned ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: WASTE & SINGLE-USE */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-[#132E20] flex items-center gap-2">
                <span>♻️</span> Step 3 — Waste & Single-Use
              </h2>
              <p className="text-xs sm:text-sm text-[#526359]">
                Single-use items scheduled, segregation stream, and composting plan.
              </p>
            </div>

            <div className="space-y-5">
              {/* Disposable Cups Count with Estimate Toggle */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <label className="text-xs font-semibold text-[#1E2522]">
                      Disposable Cups Planned
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveTooltip(activeTooltip === 'cups' ? null : 'cups')}
                      className="text-[#64748B] hover:text-[#132E20]"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {formData.isCupsEstimated && (
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        Estimated
                      </span>
                    )}
                    <span className="text-xs font-bold text-[#15803D]">
                      {formData.disposableCupsCount.toLocaleString()} cups
                    </span>
                  </div>
                </div>

                {activeTooltip === 'cups' && (
                  <div className="p-3 rounded-xl bg-[#E2E8E4]/70 border border-[#CBD5E1] text-xs text-[#2C4A38] leading-relaxed">
                    <strong>Disposable cups:</strong> Approximate number of single-use disposable cups expected during the event for water, hot drinks, or refreshments.
                  </div>
                )}

                <input
                  type="range"
                  min="0"
                  max="4000"
                  step="100"
                  value={formData.disposableCupsCount}
                  onChange={(e) =>
                    updateField('disposableCupsCount', parseInt(e.target.value) || 0)
                  }
                  className="w-full accent-[#15803D]"
                />

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] text-[#718096]">0 (Reusable only) - 4,000+</span>
                  <button
                    type="button"
                    onClick={() => updateField('isCupsEstimated', !formData.isCupsEstimated)}
                    className="text-[11px] text-[#15803D] hover:underline font-medium"
                  >
                    {formData.isCupsEstimated ? 'Enter exact number' : 'Use an estimate'}
                  </button>
                </div>
              </div>

              {/* Tableware Cutlery */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1E2522]">
                  Cutlery & Tableware
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'single_use_plastic', label: 'Single-use Plastic' },
                    { id: 'compostable', label: 'Compostable (Bagasse/Wood)' },
                    { id: 'reusable', label: 'Washable Reusables' }
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => updateField('cutleryType', c.id as CutleryType)}
                      className={`p-2.5 text-xs font-semibold rounded-xl border transition-all text-center ${
                        formData.cutleryType === c.id
                          ? 'bg-[#132E20] text-white border-[#132E20] shadow-xs'
                          : 'bg-white text-[#4A5568] border-[#D9D6CE] hover:border-[#8DA393]'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Waste Segregation Level (Chips) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1E2522]">
                  Waste Segregation Quality
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                  {(['excellent', 'good', 'partial', 'limited', 'none'] as WasteSegregationLevel[]).map(
                    (lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => updateField('wasteSegregation', lvl)}
                        className={`py-2 px-2 rounded-xl text-xs font-semibold capitalize border transition-all text-center ${
                          formData.wasteSegregation === lvl
                            ? 'bg-[#132E20] text-white border-[#132E20]'
                            : 'bg-white text-[#4A5568] border-[#D9D6CE] hover:border-[#8DA393]'
                        }`}
                      >
                        {lvl}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Composting Planned */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#EAE8E3]">
                <div>
                  <div className="text-xs font-semibold text-[#132E20]">
                    Dedicated Organic Composting Planned
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    Separate collection stream for wet plate waste and compostable tableware
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => updateField('compostingPlanned', !formData.compostingPlanned)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    formData.compostingPlanned ? 'bg-[#15803D]' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      formData.compostingPlanned ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: WATER PROVISIONING */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-[#132E20] flex items-center gap-2">
                <span>💧</span> Step 4 — Water Management
              </h2>
              <p className="text-xs sm:text-sm text-[#526359]">
                Attendee hydration methods, packaged water bottles, and refill stations.
              </p>
            </div>

            <div className="space-y-5">
              {/* Primary Provision Mode */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1E2522]">
                  Water Provisioning Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'bottled', label: 'Packaged PET Bottles', note: 'Single-use bottles' },
                    { id: 'dispensers', label: 'Bulk Refill Dispensers', note: '20L bubble top units' },
                    { id: 'bring_own_bottle', label: 'BYOB + Refill Points', note: 'Bring your own bottle' }
                  ].map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => updateField('waterProvision', w.id as WaterProvision)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        formData.waterProvision === w.id
                          ? 'bg-[#E2E8E4]/60 border-[#15803D] text-[#132E20]'
                          : 'bg-white border-[#D9D6CE] text-[#4A5568] hover:border-[#8DA393]'
                      }`}
                    >
                      <div className="font-semibold text-xs">{w.label}</div>
                      <div className="text-[10px] text-[#64748B] mt-0.5">{w.note}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Packaged Bottles Planned with Estimate */}
              {formData.waterProvision === 'bottled' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#1E2522]">
                      Packaged Bottles Scheduled
                    </label>
                    <div className="flex items-center gap-2">
                      {formData.isBottlesEstimated && (
                        <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                          Estimated
                        </span>
                      )}
                      <span className="text-xs font-bold text-[#15803D]">
                        {formData.packagedBottlesCount.toLocaleString()} bottles
                      </span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="4000"
                    step="100"
                    value={formData.packagedBottlesCount}
                    onChange={(e) =>
                      updateField('packagedBottlesCount', parseInt(e.target.value) || 0)
                    }
                    className="w-full accent-[#15803D]"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] text-[#718096]">100 - 4,000</span>
                    <button
                      type="button"
                      onClick={() => updateField('isBottlesEstimated', !formData.isBottlesEstimated)}
                      className="text-[11px] text-[#15803D] hover:underline font-medium"
                    >
                      {formData.isBottlesEstimated ? 'Enter exact count' : 'Use an estimate'}
                    </button>
                  </div>
                </div>
              )}

              {/* Refill Stations */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#1E2522]">
                    Refill Stations Deployed
                  </label>
                  <span className="text-xs font-bold text-[#15803D]">
                    {formData.refillStationsCount} stations
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      updateField('refillStationsCount', Math.max(0, formData.refillStationsCount - 1))
                    }
                    className="w-10 h-10 rounded-xl border border-[#D9D6CE] flex items-center justify-center text-lg font-bold hover:bg-[#F3F2EE]"
                  >
                    -
                  </button>
                  <span className="font-bold text-base w-8 text-center text-[#132E20]">
                    {formData.refillStationsCount}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      updateField('refillStationsCount', formData.refillStationsCount + 1)
                    }
                    className="w-10 h-10 rounded-xl border border-[#D9D6CE] flex items-center justify-center text-lg font-bold hover:bg-[#F3F2EE]"
                  >
                    +
                  </button>
                  <span className="text-xs text-[#64748B] ml-2">
                    Rule of thumb: 1 station per 250 attendees
                  </span>
                </div>
              </div>

              {/* BYOB Encouraged */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#EAE8E3]">
                <div>
                  <div className="text-xs font-semibold text-[#132E20]">
                    Attendee BYOB Prompted in Communications
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    Ask attendees in confirmation messages to bring personal reusable bottles
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => updateField('byobEncouraged', !formData.byobEncouraged)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    formData.byobEncouraged ? 'bg-[#15803D]' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      formData.byobEncouraged ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: ENERGY & POWER */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-[#132E20] flex items-center gap-2">
                <span>⚡</span> Step 5 — Energy & Power
              </h2>
              <p className="text-xs sm:text-sm text-[#526359]">
                Power generation, stage lighting intensity, HVAC, and generator hours.
              </p>
            </div>

            <div className="space-y-5">
              {/* Power Source */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1E2522]">
                  Primary Electrical Power Source
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'generators_diesel', label: 'Diesel Generators', note: 'Heavy local combustion & emissions' },
                    { id: 'grid_standard', label: 'Standard Building Grid', note: 'Direct municipal grid supply' },
                    { id: 'grid_renewable', label: 'Renewable Power Tariff', note: 'Green tariff or REC offsets' },
                    { id: 'hybrid_solar', label: 'Solar Hybrid / Battery', note: 'Clean mobile storage' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => updateField('powerSource', p.id as PowerSource)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        formData.powerSource === p.id
                          ? 'bg-[#E2E8E4]/60 border-[#15803D] text-[#132E20]'
                          : 'bg-white border-[#D9D6CE] text-[#4A5568] hover:border-[#8DA393]'
                      }`}
                    >
                      <div className="font-semibold text-xs">{p.label}</div>
                      <div className="text-[10px] text-[#64748B] mt-0.5">{p.note}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generator Hours if diesel */}
              {formData.powerSource === 'generators_diesel' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#1E2522]">
                      Generator Operating Time
                    </label>
                    <span className="text-xs font-bold text-[#15803D]">
                      {formData.generatorHours} hours
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="16"
                    step="1"
                    value={formData.generatorHours}
                    onChange={(e) =>
                      updateField('generatorHours', parseInt(e.target.value) || 1)
                    }
                    className="w-full accent-[#15803D]"
                  />
                  <div className="flex justify-between text-[10px] text-[#718096]">
                    <span>1 hr</span>
                    <span>6 hrs</span>
                    <span>16 hrs</span>
                  </div>
                </div>
              )}

              {/* Stage Lighting & Sound Rig */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1E2522]">
                    Lighting Intensity
                  </label>
                  <div className="grid grid-cols-3 gap-1 p-1 bg-[#F3F2EE] rounded-xl">
                    {[
                      { id: 'low', label: 'Low' },
                      { id: 'medium', label: 'Standard' },
                      { id: 'high', label: 'Concert' }
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => updateField('stageLightingIntensity', s.id as 'low' | 'medium' | 'high')}
                        className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                          formData.stageLightingIntensity === s.id
                            ? 'bg-white text-[#132E20] shadow-xs'
                            : 'text-[#64748B] hover:text-[#132E20]'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1E2522]">
                    Audio & Video Screens Rig
                  </label>
                  <div className="grid grid-cols-3 gap-1 p-1 bg-[#F3F2EE] rounded-xl">
                    {[
                      { id: 'minimal', label: 'Minimal' },
                      { id: 'standard', label: 'Standard' },
                      { id: 'high_output', label: 'Large Rig' }
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => updateField('soundScreenRig', s.id as any)}
                        className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                          formData.soundScreenRig === s.id
                            ? 'bg-white text-[#132E20] shadow-xs'
                            : 'text-[#64748B] hover:text-[#132E20]'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* HVAC Active */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#EAE8E3]">
                <div>
                  <div className="text-xs font-semibold text-[#132E20]">
                    Continuous Air Conditioning / HVAC Active
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    Full hall chillers running throughout event duration
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => updateField('hvacActive', !formData.hvacActive)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    formData.hvacActive ? 'bg-[#15803D]' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      formData.hvacActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: TRANSPORT & COMMUTE */}
        {currentStep === 6 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-[#132E20] flex items-center gap-2">
                <span>🚌</span> Step 6 — Transport & Transit
              </h2>
              <p className="text-xs sm:text-sm text-[#526359]">
                Attendee travel split, venue proximity to transit, and charter shuttles.
              </p>
            </div>

            <div className="space-y-5">
              {/* Public Transit % */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#1E2522]">
                    Public Transit & Shuttles Share
                  </label>
                  <span className="text-xs font-bold text-[#15803D]">
                    {formData.publicTransitPercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={formData.publicTransitPercent}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    const remaining = 100 - val;
                    const carpool = Math.min(formData.carpoolPercent, remaining);
                    const privateCar = remaining - carpool;
                    setFormData((prev) => ({
                      ...prev,
                      publicTransitPercent: val,
                      carpoolPercent: carpool,
                      privateCarPercent: privateCar
                    }));
                  }}
                  className="w-full accent-[#15803D]"
                />
              </div>

              {/* Private Solo Car % */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#1E2522]">
                    Solo Private Car / Cab Share
                  </label>
                  <span className="text-xs font-bold text-amber-700">
                    {formData.privateCarPercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={formData.privateCarPercent}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    const remaining = 100 - val;
                    const transit = Math.min(formData.publicTransitPercent, remaining);
                    const carpool = remaining - transit;
                    setFormData((prev) => ({
                      ...prev,
                      privateCarPercent: val,
                      publicTransitPercent: transit,
                      carpoolPercent: carpool
                    }));
                  }}
                  className="w-full accent-amber-600"
                />
              </div>

              {/* Toggles: Proximity & Shuttle */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#EAE8E3]">
                  <div>
                    <div className="text-xs font-semibold text-[#132E20]">
                      Venue Located &lt;500m from Metro / Rail Hub
                    </div>
                    <div className="text-[11px] text-[#64748B]">
                      Direct pedestrian connection to mass transit stations
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateField('venueNearTransit', !formData.venueNearTransit)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      formData.venueNearTransit ? 'bg-[#15803D]' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        formData.venueNearTransit ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#EAE8E3]">
                  <div>
                    <div className="text-xs font-semibold text-[#132E20]">
                      Dedicated Group Loop Shuttles Provided
                    </div>
                    <div className="text-[11px] text-[#64748B]">
                      Charter buses picking up attendees from transit junctions
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateField('shuttleProvided', !formData.shuttleProvided)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      formData.shuttleProvided ? 'bg-[#15803D]' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        formData.shuttleProvided ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: MATERIALS, SIGNAGE & DÉCOR */}
        {currentStep === 7 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-[#132E20] flex items-center gap-2">
                <span>🎨</span> Step 7 — Materials & Décor
              </h2>
              <p className="text-xs sm:text-sm text-[#526359]">
                Stage banners, printed pamphlets, and credential recycling protocols.
              </p>
            </div>

            <div className="space-y-5">
              {/* Signage Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1E2522]">
                  Stage & Wayfinding Signage Format
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'pvc_flex', label: 'PVC Flex Banners', note: 'Single-use chlorinated vinyl' },
                    { id: 'fabric_reusable', label: 'Reusable Tension Fabric', note: 'Washable fabric framing' },
                    { id: 'digital_only', label: 'Digital LED & Projection', note: 'Zero physical backdrop scrap' }
                  ].map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => updateField('bannerType', b.id as BannerType)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        formData.bannerType === b.id
                          ? 'bg-[#E2E8E4]/60 border-[#15803D] text-[#132E20]'
                          : 'bg-white border-[#D9D6CE] text-[#4A5568] hover:border-[#8DA393]'
                      }`}
                    >
                      <div className="font-semibold text-xs">{b.label}</div>
                      <div className="text-[10px] text-[#64748B] mt-0.5">{b.note}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Physical Banners */}
              {formData.bannerType !== 'digital_only' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#1E2522]">
                      Printed Banners Scheduled
                    </label>
                    <span className="text-xs font-bold text-[#15803D]">
                      {formData.bannerCount} banners
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    step="1"
                    value={formData.bannerCount}
                    onChange={(e) =>
                      updateField('bannerCount', parseInt(e.target.value) || 1)
                    }
                    className="w-full accent-[#15803D]"
                  />
                  <div className="flex justify-between text-[10px] text-[#718096]">
                    <span>1</span>
                    <span>18</span>
                    <span>40</span>
                  </div>
                </div>
              )}

              {/* Badges & Credentials */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1E2522]">
                  Attendee Badges & Credentials
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'plastic_single', label: 'Single-use Plastic' },
                    { id: 'lanyards_returned', label: 'Returnable Lanyards' },
                    { id: 'digital_qr', label: 'Digital Mobile QR' }
                  ].map((bg) => (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => updateField('badgeType', bg.id as BadgeType)}
                      className={`p-2.5 text-xs font-semibold rounded-xl border transition-all text-center ${
                        formData.badgeType === bg.id
                          ? 'bg-[#132E20] text-white border-[#132E20] shadow-xs'
                          : 'bg-white text-[#4A5568] border-[#D9D6CE] hover:border-[#8DA393]'
                      }`}
                    >
                      {bg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Printed Programs */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#EAE8E3]">
                <div>
                  <div className="text-xs font-semibold text-[#132E20]">
                    Physical Printed Program Booklets
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    Distributing paper agenda brochures to all attendees
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => updateField('printedPrograms', !formData.printedPrograms)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    formData.printedPrograms ? 'bg-[#15803D]' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      formData.printedPrograms ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Form Navigation Controls */}
        <div className="pt-4 border-t border-[#EAE8E3] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={prevStep}
            className="px-5 py-2.5 rounded-xl border border-[#D9D6CE] text-xs font-semibold text-[#1E2522] hover:bg-[#F3F2EE] transition-colors"
          >
            {currentStep === 1 ? 'Cancel' : '← Previous'}
          </button>

          <button
            type="button"
            onClick={nextStep}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#132E20] text-white text-xs font-semibold hover:bg-[#1D4430] active:scale-[0.98] transition-all shadow-sm"
          >
            {currentStep === 7 ? (
              <>
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>Calculate Green Score</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
