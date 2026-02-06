export interface LeagueTableRow {
  id: string | number;
  league_preset: string;
  table_index: number;
  table_title?: string | null;
  team: string;
  pts: number;
  played: number;
  wins: number | null;
  draws: number | null;
  losses: number | null;
  gf: number;
  ga: number;
  diff: number | null;

  updated_at: string;
}

export interface MatchRow {
  id: string;
  match_date: string;
  league?: string | null;
  home_team?: string | null;
  away_team?: string | null;
  score_home?: number | null;
  score_away?: number | null;
  status?: string | null;
  minute?: number | null;
  source_url?: string | null;
  last_hash?: string | null;
  first_seen?: string | null;
  updated_at?: string | null;

  home_crest: string | null;
  away_crest: string | null;
}


export type RatingInput = {
  playerId: number;
  rating: number;
};


export interface Player {
  id: number;
  full_name: string;
  team_id: number;
}

export interface PlayerWithRating extends Player {
  averageRating: number;
  totalVotes: number;
}

export type UserData = {
  id: number;
  usuario: string;
  mail: string;
  club_id: number;
  club: {
    nombre: string;
    crest_url: string;
  }
}

export interface Club {
  id: number;
  nombre: string;
  crest_url: string;
}

export interface EquipoInfo {
  nombre: string;
  escudo: string;
  titulosNacionales: number;
  titulosInternacionales: number;
  nombreEstadio: string;
  capacidadEstadio: number;
  ciudad: string;
  colores: string;
  añoFundacion: number;
  entrenador: string;
}
