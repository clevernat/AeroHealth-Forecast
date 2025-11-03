import { AQICategoryInfo, PollenCategoryInfo, PollutantInfo, AllergenInfo } from '@/types';

// AQI Categories based on US EPA standards
export const AQI_CATEGORIES: Record<string, AQICategoryInfo> = {
  good: {
    label: 'Good',
    color: '#00E400',
    textColor: '#000000',
    range: [0, 50],
    description: 'Air quality is satisfactory, and air pollution poses little or no risk.',
    healthImplications: 'Air quality is considered satisfactory, and air pollution poses little or no risk.',
  },
  moderate: {
    label: 'Moderate',
    color: '#FFFF00',
    textColor: '#000000',
    range: [51, 100],
    description: 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.',
    healthImplications: 'Unusually sensitive people should consider limiting prolonged outdoor exertion.',
  },
  unhealthy_sensitive: {
    label: 'Unhealthy for Sensitive Groups',
    color: '#FF7E00',
    textColor: '#000000',
    range: [101, 150],
    description: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.',
    healthImplications: 'People with respiratory or heart conditions, children, and older adults should limit prolonged outdoor exertion.',
  },
  unhealthy: {
    label: 'Unhealthy',
    color: '#FF0000',
    textColor: '#FFFFFF',
    range: [151, 200],
    description: 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.',
    healthImplications: 'Everyone should limit prolonged outdoor exertion. Sensitive groups should avoid prolonged outdoor exertion.',
  },
  very_unhealthy: {
    label: 'Very Unhealthy',
    color: '#8F3F97',
    textColor: '#FFFFFF',
    range: [201, 300],
    description: 'Health alert: The risk of health effects is increased for everyone.',
    healthImplications: 'Everyone should avoid prolonged outdoor exertion. Sensitive groups should remain indoors.',
  },
  hazardous: {
    label: 'Hazardous',
    color: '#7E0023',
    textColor: '#FFFFFF',
    range: [301, 500],
    description: 'Health warning of emergency conditions: everyone is more likely to be affected.',
    healthImplications: 'Everyone should avoid all outdoor exertion. Sensitive groups should remain indoors and keep activity levels low.',
  },
};

// Pollen Categories
export const POLLEN_CATEGORIES: Record<string, PollenCategoryInfo> = {
  low: {
    label: 'Low',
    color: '#00E400',
    textColor: '#000000',
    range: [0, 2.4],
    description: 'Low pollen levels. Most people will not experience symptoms.',
  },
  moderate: {
    label: 'Moderate',
    color: '#FFFF00',
    textColor: '#000000',
    range: [2.5, 4.8],
    description: 'Moderate pollen levels. Some people with allergies may experience symptoms.',
  },
  high: {
    label: 'High',
    color: '#FF7E00',
    textColor: '#000000',
    range: [4.9, 7.2],
    description: 'High pollen levels. Most people with allergies will experience symptoms.',
  },
  very_high: {
    label: 'Very High',
    color: '#FF0000',
    textColor: '#FFFFFF',
    range: [7.3, 12],
    description: 'Very high pollen levels. Almost all people with allergies will experience symptoms.',
  },
};

// Pollutant Information
export const POLLUTANT_INFO: Record<string, PollutantInfo> = {
  pm2_5: {
    name: 'PM2.5 (Fine Particulate Matter)',
    description: 'Tiny particles or droplets in the air that are 2.5 micrometers or less in width.',
    sources: [
      'Vehicle exhaust',
      'Power plants',
      'Industrial facilities',
      'Residential wood burning',
      'Forest fires',
      'Agricultural burning',
    ],
    healthImpacts: [
      'Aggravated asthma',
      'Decreased lung function',
      'Increased respiratory symptoms (coughing, difficulty breathing)',
      'Chronic bronchitis',
      'Irregular heartbeat',
      'Heart attacks',
      'Premature death in people with heart or lung disease',
    ],
    unit: 'µg/m³',
  },
  pm10: {
    name: 'PM10 (Coarse Particulate Matter)',
    description: 'Inhalable particles with diameters of 10 micrometers or less.',
    sources: [
      'Dust from roads',
      'Construction sites',
      'Landfills',
      'Agriculture',
      'Wildfires',
      'Industrial sources',
    ],
    healthImpacts: [
      'Respiratory irritation',
      'Aggravated asthma',
      'Decreased lung function',
      'Increased hospital admissions for respiratory conditions',
    ],
    unit: 'µg/m³',
  },
  ozone: {
    name: 'Ozone (O₃)',
    description: 'A gas composed of three oxygen atoms, formed by chemical reactions between nitrogen oxides and volatile organic compounds in the presence of sunlight.',
    sources: [
      'Vehicle emissions',
      'Industrial facilities',
      'Chemical solvents',
      'Gasoline vapors',
      'Not directly emitted - forms in the atmosphere',
    ],
    healthImpacts: [
      'Chest pain and coughing',
      'Throat irritation',
      'Airway inflammation',
      'Reduced lung function',
      'Aggravated asthma',
      'Increased susceptibility to respiratory infections',
      'Permanent lung damage with long-term exposure',
    ],
    unit: 'ppb',
  },
  no2: {
    name: 'Nitrogen Dioxide (NO₂)',
    description: 'A reddish-brown gas with a sharp, harsh odor, part of a group of highly reactive gases known as nitrogen oxides.',
    sources: [
      'Vehicle emissions',
      'Power plants',
      'Industrial boilers',
      'Gas stoves',
      'Kerosene heaters',
    ],
    healthImpacts: [
      'Airway inflammation',
      'Reduced lung function',
      'Increased asthma symptoms',
      'Increased susceptibility to respiratory infections',
      'Emergency room visits for respiratory issues',
    ],
    unit: 'ppb',
  },
  so2: {
    name: 'Sulfur Dioxide (SO₂)',
    description: 'A colorless gas with a pungent odor, formed when fuel containing sulfur is burned.',
    sources: [
      'Coal and oil combustion at power plants',
      'Metal smelting',
      'Industrial processes',
      'Diesel engines',
      'Volcanic eruptions',
    ],
    healthImpacts: [
      'Respiratory problems',
      'Breathing difficulties',
      'Aggravated asthma',
      'Increased hospital admissions for heart disease',
      'Premature death',
    ],
    unit: 'ppb',
  },
  co: {
    name: 'Carbon Monoxide (CO)',
    description: 'A colorless, odorless gas formed when carbon in fuel is not burned completely.',
    sources: [
      'Vehicle exhaust',
      'Industrial processes',
      'Residential heating',
      'Wildfires',
      'Tobacco smoke',
    ],
    healthImpacts: [
      'Reduced oxygen delivery to organs and tissues',
      'Chest pain in people with heart disease',
      'Impaired vision and coordination',
      'Headaches and dizziness',
      'Confusion',
      'Death at very high concentrations',
    ],
    unit: 'ppm',
  },
};

// Allergen Information
export const ALLERGEN_INFO: Record<string, AllergenInfo> = {
  tree: {
    name: 'Tree Pollen',
    description: 'Pollen released by trees during their reproductive cycle.',
    commonSources: [
      'Oak',
      'Birch',
      'Cedar',
      'Maple',
      'Elm',
      'Ash',
      'Alder',
      'Willow',
    ],
    peakSeasons: [
      'Late winter to early summer (varies by tree species and region)',
      'Typically February through June in most of the US',
    ],
    healthImpacts: [
      'Allergic rhinitis (hay fever)',
      'Sneezing and runny nose',
      'Itchy, watery eyes',
      'Nasal congestion',
      'Sinus pressure',
      'Aggravated asthma symptoms',
      'Fatigue',
    ],
  },
  grass: {
    name: 'Grass Pollen',
    description: 'Pollen from various grass species, one of the most common allergens.',
    commonSources: [
      'Bermuda grass',
      'Timothy grass',
      'Kentucky bluegrass',
      'Ryegrass',
      'Orchard grass',
      'Sweet vernal grass',
    ],
    peakSeasons: [
      'Late spring through early fall',
      'Typically May through July in most of the US',
      'Can extend into September in warmer climates',
    ],
    healthImpacts: [
      'Allergic rhinitis',
      'Sneezing and runny nose',
      'Itchy eyes and throat',
      'Nasal congestion',
      'Coughing',
      'Asthma exacerbation',
      'Reduced quality of life during peak season',
    ],
  },
  weed: {
    name: 'Weed Pollen',
    description: 'Pollen from various weed species, particularly problematic in late summer and fall.',
    commonSources: [
      'Ragweed (most common)',
      'Mugwort',
      'Sagebrush',
      'Pigweed',
      'Tumbleweed',
      'Cocklebur',
    ],
    peakSeasons: [
      'Late summer through fall',
      'Typically August through October',
      'Ragweed season peaks in mid-September',
    ],
    healthImpacts: [
      'Severe allergic rhinitis',
      'Intense sneezing',
      'Itchy, watery eyes',
      'Nasal congestion and sinus pain',
      'Scratchy throat',
      'Asthma attacks',
      'Sleep disturbances',
      'Reduced productivity',
    ],
  },
};

