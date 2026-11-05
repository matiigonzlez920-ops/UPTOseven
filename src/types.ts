export type PageId = 'home' | 'productos' | 'historia' | 'juego' | 'contacto';

export type ProductVarietyId = 'original' | 'zero' | 'cherry' | 'tropical';

export interface NutritionRow {
  label: string;
  amount: string;
  percentDailyValue?: string;
}

export interface ProductVariety {
  id: ProductVarietyId;
  name: string;
  tagline: string;
  badge: string;
  description: string;
  imageSrc: string;
  dominantColor: string;
  secondaryColor: string;
  accentColor: string;
  bgGradient: string;
  canAuraColor: string;
  flavorNotes: string[];
  formats: string[];
  calories: string;
  caffeine: string;
  citrusLevel: number; // 1 - 5
  sweetnessLevel: number; // 1 - 5
  fizzLevel: number; // 1 - 5
  servingSize?: string;
  caloriesNumber?: number;
  nutritionRows?: NutritionRow[];
  ingredientsText?: string;
  nutritionNote?: string;
}

export interface HistoricalEra {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  aesthetic: string;
  themeColor: string;
  accentColor: string;
  textColor: string;
  bgClass: string;
  facts: string[];
  campaigns: string[];
  culturalContext: string;
  visualElements: {
    badge: string;
    icon: string;
    highlightWord?: string;
  };
  quote?: {
    text: string;
    author: string;
  };
}
