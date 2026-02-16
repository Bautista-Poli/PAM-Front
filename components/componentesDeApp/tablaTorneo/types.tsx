export interface GroupTableRow {
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  pts: number;
}

export interface Group {
  name: string;
  teams: GroupTableRow[];
}

export interface KnockoutMatch {
  id: number;
  home_team: string;
  away_team: string;
  home_score?: number;
  away_score?: number;
  date: string;
  leg: 1 | 2;
  round: "round of 16" | "quarterfinals" | "semifinals" | "final";
}

export interface TournamentData {
  tournament_name: string;
  groups: Group[];
  knockout_matches: KnockoutMatch[];
}

export interface BracketTeamResult {
  name: string;
  scoreLeg1?: number;
  scoreLeg2?: number;
  isWinner: boolean;
}