export interface ABTest {
  id: string;
  name: string;
  urlA: string;
  urlB: string;
  visitsA: number;
  conversionsA: number;
  visitsB: number;
  conversionsB: number;
  events: Record<string, { A: number; B: number }>; // Custom funnel events
  status: 'active' | 'paused';
  createdAt: number;
}

export interface TestStats {
  conversionRateA: number;
  conversionRateB: number;
  totalVisits: number;
  totalConversions: number;
  uplift: number; // Percentage improvement of B over A (or vice versa)
  winner: 'A' | 'B' | 'Tie' | 'Inconclusive';
}

export enum AnalyticsViewMode {
  OVERVIEW = 'OVERVIEW',
  DETAILS = 'DETAILS'
}