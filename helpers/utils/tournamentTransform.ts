// tournamentTransform.ts
import { MatchRow } from "@/apiConnections/types";
import { Group, GroupTableRow, KnockoutMatch, TournamentData } from "@/components/tablaTorneo/types";

// ─── Mapeo de rondas ──────────────────────────────────────────────────────────
const KNOCKOUT_ROUND_MAP: Record<string, KnockoutMatch['round']> = {
  'knockout playoffs - 1st leg':  'round_of_16',
  'knockout playoffs - 2nd leg':  'round_of_16',
  'knockout playoffs':            'round_of_16',
  'round of 16 - 1st leg':        'round_of_16',
  'round of 16 - 2nd leg':        'round_of_16',
  'round of 16':                  'round_of_16',
  'last 16':                      'round_of_16',
  'octavos de final':             'round_of_16',
  'quarterfinals - 1st leg':      'quarterfinals',
  'quarterfinals - 2nd leg':      'quarterfinals',
  'quarterfinals':                'quarterfinals',
  'quarter-finals - 1st leg':     'quarterfinals',
  'quarter-finals - 2nd leg':     'quarterfinals',
  'quarter-finals':               'quarterfinals',
  'cuartos de final':             'quarterfinals',
  'semifinals - 1st leg':         'semifinals',
  'semifinals - 2nd leg':         'semifinals',
  'semifinals':                   'semifinals',
  'semi-finals - 1st leg':        'semifinals',
  'semi-finals - 2nd leg':        'semifinals',
  'semi-finals':                  'semifinals',
  'semifinales':                  'semifinals',
  'final':                        'final',
};

const GROUP_PHASE_KEYWORDS = ['league', 'group', 'fase', 'liga', 'matchday', 'jornada'];

function classifyRound(round: string): 'group' | 'knockout' {
  const r = round?.toLowerCase().trim() ?? '';
  
  // 1. Prioridad absoluta: El mapa definido
  if (KNOCKOUT_ROUND_MAP[r]) return 'knockout';

  // 2. Prioridad de Fase de Liga: Si contiene palabras de liga, es "group" 
  // incluso si contiene la palabra "final" (ej: "Final Matchday")
  if (GROUP_PHASE_KEYWORDS.some(key => r.includes(key))) return 'group';

  // 3. Fallback para eliminatorias por palabras clave
  if (
    r.includes('final') ||
    r.includes('round of') ||
    r.includes('knockout') ||
    r.includes('playoff')
  ) return 'knockout';

  return 'group';
}

function getLeg(m: MatchRow): 1 | 2 {
  if (m.leg === 1 || m.leg === 2) return m.leg as 1 | 2;
  const r = m.round?.toLowerCase() ?? '';
  if (r.includes('2nd leg') || r.includes('second leg') || r.includes('vuelta')) return 2;
  return 1;
}

// ─── Fase de grupos / liga ────────────────────────────────────────────────────

function buildGroupTables(matches: MatchRow[]): Group[] {
  const groupMatches = matches.filter(m => classifyRound(m.round) === 'group');
  const livMatches = groupMatches.filter(m => m.home_team === "Liverpool" || m.away_team === "Liverpool");
  console.log(`Partidos de Liverpool clasificados como 'group': ${livMatches.length}`);
  
  livMatches.forEach(m => {
    if (m.score_home == null || m.score_away == null) {
      console.log(`⚠️ Partido saltado por score NULL: ${m.home_team} vs ${m.away_team} | Round: ${m.round}`);
    }
  });
  if (groupMatches.length === 0) return [];

  const groupMap = new Map<string, Map<string, GroupTableRow>>();

  for (const m of groupMatches) {
    // NORMALIZACIÓN: Evita que la tabla se divida si group_name varía o es null
    const gName = m.group_name || 'Fase de Liga';

    if (!groupMap.has(gName)) groupMap.set(gName, new Map());
    const group = groupMap.get(gName)!;

    for (const teamName of [m.home_team, m.away_team]) {
      if (!group.has(teamName)) {
        group.set(teamName, {
          team: teamName,
          played: 0, won: 0, drawn: 0, lost: 0,
          gf: 0, ga: 0, pts: 0,
        });
      }
    }

    // Solo sumar si hay resultado (score 0 es válido, por eso checkeamos contra null)
    if (m.score_home == null || m.score_away == null) continue;

    const home = group.get(m.home_team)!;
    const away = group.get(m.away_team)!;

    home.played++; away.played++;
    home.gf += m.score_home; home.ga += m.score_away;
    away.gf += m.score_away; away.ga += m.score_home;

    if (m.score_home > m.score_away) {
      home.won++; home.pts += 3; away.lost++;
    } else if (m.score_home < m.score_away) {
      away.won++; away.pts += 3; home.lost++;
    } else {
      home.drawn++; home.pts++;
      away.drawn++; away.pts++;
    }
  }

  return Array.from(groupMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, teamsMap]) => ({
      name,
      teams: Array.from(teamsMap.values()).sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        const diffA = a.gf - a.ga;
        const diffB = b.gf - b.ga;
        if (diffB !== diffA) return diffB - diffA;
        return b.gf - a.gf;
      }),
    }));
}

// ─── Eliminatorias ────────────────────────────────────────────────────────────

function buildKnockoutMatches(matches: MatchRow[]): KnockoutMatch[] {
  return matches
    .filter(m => classifyRound(m.round) === 'knockout')
    .map((m, idx) => ({
      id: m.espn_id ? Number(m.espn_id) : idx,
      home_team: m.home_team,
      away_team: m.away_team,
      home_score: m.score_home ?? undefined,
      away_score: m.score_away ?? undefined,
      date: m.match_date ?? '',
      leg: getLeg(m),
      round: KNOCKOUT_ROUND_MAP[m.round?.toLowerCase().trim()] ?? 'round_of_16',
    }));
}

// ─── Entrada pública ──────────────────────────────────────────────────────────

export function transformTournamentData(
  tournamentName: string,
  matches: MatchRow[],
): TournamentData {
  return {
    tournament_name: tournamentName,
    groups: buildGroupTables(matches),
    knockout_matches: buildKnockoutMatches(matches),
  };
}