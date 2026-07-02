export interface FoodItem {
  name: string;
  volume: number;
  weight: number;
  area: number;
  height: number;
  confidence: number;
  components: string[];
}

export interface AnalysisResult {
  id: string;
  date: string;
  imageUrl: string;
  foods: FoodItem[];
  totalVolume: number;
  totalWeight: number;
  totalItems: number;
  avgConfidence: number;
}

export const mockAnalysis: AnalysisResult = {
  id: "analysis-001",
  date: "2026-02-14",
  imageUrl: "",
  foods: [
    { name: "Grilled Chicken", volume: 180, weight: 150, area: 45.2, height: 3.8, confidence: 94.5, components: ["Protein", "Fat"] },
    { name: "Brown Rice", volume: 120, weight: 95, area: 38.1, height: 2.5, confidence: 91.2, components: ["Carbs", "Fiber"] },
    { name: "Broccoli", volume: 85, weight: 65, area: 28.7, height: 4.2, confidence: 88.7, components: ["Fiber", "Vitamins"] },
    { name: "Cherry Tomatoes", volume: 42, weight: 35, area: 15.3, height: 2.1, confidence: 96.1, components: ["Vitamins", "Lycopene"] },
  ],
  totalVolume: 427,
  totalWeight: 345,
  totalItems: 4,
  avgConfidence: 92.6,
};

export const mockWeeklyData = [
  { day: "Mon", volume: 850, weight: 680 },
  { day: "Tue", volume: 920, weight: 740 },
  { day: "Wed", volume: 780, weight: 620 },
  { day: "Thu", volume: 1050, weight: 840 },
  { day: "Fri", volume: 690, weight: 550 },
  { day: "Sat", volume: 1100, weight: 890 },
  { day: "Sun", volume: 960, weight: 770 },
];

export const mockRecentAnalyses: AnalysisResult[] = [
  { ...mockAnalysis, id: "a1", date: "2026-02-14" },
  {
    id: "a2", date: "2026-02-13", imageUrl: "",
    foods: [
      { name: "Pasta", volume: 200, weight: 180, area: 52.0, height: 3.0, confidence: 90.3, components: ["Carbs"] },
      { name: "Marinara Sauce", volume: 80, weight: 90, area: 40.0, height: 1.5, confidence: 87.5, components: ["Vitamins"] },
    ],
    totalVolume: 280, totalWeight: 270, totalItems: 2, avgConfidence: 88.9,
  },
  {
    id: "a3", date: "2026-02-12", imageUrl: "",
    foods: [
      { name: "Salmon Fillet", volume: 160, weight: 140, area: 48.0, height: 3.5, confidence: 93.2, components: ["Omega-3", "Protein"] },
    ],
    totalVolume: 160, totalWeight: 140, totalItems: 1, avgConfidence: 93.2,
  },
];
