// tournamentTransform.ts
import { MatchRow } from "@/apiConnections/types";
import { Group, GroupTableRow, KnockoutMatch, TournamentData } from "@/components/componentesDeApp/tablaTorneo/types";


const GROUP_PHASE_KEYWORDS = ['league', 'group', 'fase', 'liga', 'matchday', 'jornada'];


function classifyRound(round: string): 'group' | 'knockout' {
  const r = round?.toLowerCase().trim() ?? '';
  if (GROUP_PHASE_KEYWORDS.some(key => r.includes(key))) return 'group';
  return 'knockout';
}

// ─── Fase de grupos / liga ────────────────────────────────────────────────────

function buildGroupTables(matches: MatchRow[]): Group[] {
  const groupMatches = matches.filter(m => classifyRound(m.round) === 'group');
  const livMatches = groupMatches.filter(m => m.home_team === "Liverpool" || m.away_team === "Liverpool");
  
  livMatches.forEach(m => {
    if (m.score_home == null || m.score_away == null) {
      console.log(`⚠️ Partido saltado por score NULL: ${m.home_team} vs ${m.away_team} | Round: ${m.round}`);
    }
  });
  if (groupMatches.length === 0) return [];

  const groupMap = new Map<string, Map<string, GroupTableRow>>();

  for (const m of groupMatches) {
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
  const VALID_ROUNDS = new Set(['round of 16', 'quarterfinals', 'semifinals', 'final']);

  return matches
    .filter(m => VALID_ROUNDS.has(m.round?.toLowerCase().trim()))
    .map((m, idx) => ({
      id: m.espn_id ? Number(m.espn_id) : idx,
      home_team: m.home_team,
      away_team: m.away_team,
      home_score: m.score_home ?? undefined,
      away_score: m.score_away ?? undefined,
      date: m.match_date ?? '',
      leg: (m.leg === 2 ? 2 : 1) as 1 | 2,
      round: m.round.toLowerCase().trim() as KnockoutMatch['round'],
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