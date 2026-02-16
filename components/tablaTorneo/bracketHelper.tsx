import { KnockoutMatch } from "./types";

export function toBracketMatches(knockoutMatches: KnockoutMatch[]) {
  const pairMap = new Map<string, { leg1?: KnockoutMatch; leg2?: KnockoutMatch }>();

  for (const m of knockoutMatches) {
    const key = m.round === 'final' 
      ? `final-${m.id}` 
      : [m.home_team, m.away_team].sort().join("|") + "|" + m.round;

    if (!pairMap.has(key)) pairMap.set(key, {});
    const pair = pairMap.get(key)!;
    
    if (m.leg === 1 || m.round === 'final') pair.leg1 = m;
    else pair.leg2 = m;
  }

  return Array.from(pairMap.values()).map(({ leg1, leg2 }, idx) => {
    const ref = (leg1 || leg2) as KnockoutMatch;
    const isFinal = ref.round === 'final';

    const total1 = isFinal ? (leg1?.home_score ?? 0) : (leg1?.home_score ?? 0) + (leg2?.away_score ?? 0);
    const total2 = isFinal ? (leg1?.away_score ?? 0) : (leg1?.away_score ?? 0) + (leg2?.home_score ?? 0);

    const played = isFinal ? leg1?.home_score != null : (leg1?.home_score != null && leg2?.home_score != null);

    return {
      id: `${ref.round}-${idx}`,
      team1: {
        name: leg1?.home_team || leg2?.away_team || 'TBD',
        scoreLeg1: leg1?.home_score,
        scoreLeg2: isFinal ? undefined : leg2?.away_score,
        isWinner: played ? total1 > total2 : false,
      },
      team2: {
        name: leg1?.away_team || leg2?.home_team || 'TBD',
        scoreLeg1: leg1?.away_score,
        scoreLeg2: isFinal ? undefined : leg2?.home_score,
        isWinner: played ? total2 > total1 : false,
      },
      round: ref.round,
    };
  });
}

