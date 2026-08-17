export interface TrendPoint {
  date: string;
  value: number;
}

export interface PerformanceVsFatiguePoint {
  trainingRecordId: number;
  trainingSessionId: number;
  sessionDate: string;
  performanceRating: number;
  fatigueLevel: number;
}

export interface DomainCount {
  domainId: number;
  domainName: string;
  athleteCount: number;
}

export interface AdminDashboardData {
  totalAthletes: number;
  totalSessions: number;
  totalInjuries: number;
  performanceTrend: TrendPoint[];
  fatigueTrend: TrendPoint[];
  injuriesOverTime: TrendPoint[];
  performanceVsFatigue: PerformanceVsFatiguePoint[];
  athletesPerDomain: DomainCount[];
}

export interface CoachDashboardData {
  assignedAthletes: number;
  totalSessions: number;
  injuries: number;
  performanceTrend: TrendPoint[];
  fatigueTrend: TrendPoint[];
  injuriesOverTime: TrendPoint[];
  performanceVsFatigue: PerformanceVsFatiguePoint[];
}
