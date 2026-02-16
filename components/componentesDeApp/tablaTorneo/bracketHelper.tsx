
import { BracketTeamResult, KnockoutMatch } from "./types";

//Hardcodeo el sorteo
const R16_SLOTS: Record<string, number> = {
  'arsenal|psv eindhoven':              1,
  'atlético madrid|real madrid':        2,
  'aston villa|club brugge':            3,
  'liverpool|paris saint-germain':      4,
  'borussia dortmund|lille':            8,
  'feyenoord rotterdam|internazionale': 5,
  'bayer leverkusen|bayern munich':     6,
  'barcelona|benfica':                  7,
};

interface BracketMatchResult {
  id: string;
  team1: BracketTeamResult;
  team2: BracketTeamResult;
  round: KnockoutMatch['round'];
  slot: number;
}

function buildPairs(knockoutMatches: KnockoutMatch[]): BracketMatchResult[] {
  const pairMap = new Map<string, { leg1?: KnockoutMatch; leg2?: KnockoutMatch }>();

  //Junta los dos partidos en uno
  for (const m of knockoutMatches) {
    const key = [m.home_team, m.away_team].sort().join('|');

    const pair = pairMap.get(key) ?? {};
    pairMap.set(key, pair);

    if (m.leg === 1 || m.round === 'final') pair.leg1 = m;
    else pair.leg2 = m;
  }

  return Array.from(pairMap.values()).map(({ leg1, leg2 }, idx) => {
    const ref = (leg1 || leg2) as KnockoutMatch;

    const total1 =  (leg1?.home_score ?? 0) + (leg2?.away_score ?? 0);
    const total2 =  (leg1?.away_score ?? 0) + (leg2?.home_score ?? 0);

    return {
      id: `${ref.round}-${idx}`,
      team1: {
        name: leg1?.home_team || leg2?.away_team || 'TBD',
        scoreLeg1: leg1?.home_score,
        scoreLeg2:  leg2?.away_score,
        isWinner: total1 > total2,
      },
      team2: {
        name: leg1?.away_team || leg2?.home_team || 'TBD',
        scoreLeg1: leg1?.away_score,
        scoreLeg2: leg2?.home_score,
        isWinner:  total2 > total1,
      },
      round: ref.round,
      slot: 999,
    };
  });
}

function resolveSlot(teamName: string, allMatches: BracketMatchResult[]): number {
  const name = teamName.toLowerCase();

  for (const m of allMatches) {
    const t1 = m.team1.name.toLowerCase();
    const t2 = m.team2.name.toLowerCase();
    if (t1 !== name && t2 !== name) continue;

    const r16Key = [t1, t2].sort().join('|');
    if (R16_SLOTS[r16Key] !== undefined) return R16_SLOTS[r16Key];

    // Como no es partido de octavos, hay que ver su orden
    const winner = m.team1.isWinner ? t1 : m.team2.isWinner ? t2 : null;
    if (winner && winner !== name) return resolveSlot(winner, allMatches);
  }

  return 999;
}

export function toBracketMatches(knockoutMatches: KnockoutMatch[]) {
  const pairs = buildPairs(knockoutMatches);
  
  return pairs
    .map(m => ({
      ...m,
      slot: Math.min(
        resolveSlot(m.team1.name, pairs),
        resolveSlot(m.team2.name, pairs),
      ),
    }))
    .sort((a, b) => a.slot - b.slot)
    .map(({ slot, ...rest }) => rest);
}