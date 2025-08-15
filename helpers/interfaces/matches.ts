export interface MatchItem {
  id: string;
  utcDate: string; // ISO
  status: 'SCHEDULED' | 'LIVE' | 'IN_PLAY' | 'PAUSED' | 'FINISHED' | 'POSTPONED' | 'CANCELED' | 'TIMED';
  league: string;
  homeTeam: string;
  awayTeam: string;

  // NUEVO: logos por equipo
  homeLogo?: string | null;
  awayLogo?: string | null;

  score: { home: number | null; away: number | null };
  minute?: number | null;
}
