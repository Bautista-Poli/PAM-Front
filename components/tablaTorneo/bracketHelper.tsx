import { KnockoutMatch } from "./types";

// bracketHelper.tsx
export function toBracketMatches(knockoutMatches: KnockoutMatch[]) {
  const pairMap = new Map<string, { leg1?: KnockoutMatch; leg2?: KnockoutMatch }>();

  for (const m of knockoutMatches) {
    // LLAVE ÚNICA: Para la final usamos el ID, para el resto agrupamos por equipos
    const key = m.round === 'final' 
      ? `final-${m.id}` 
      : [m.home_team, m.away_team].sort().join("|") + "|" + m.round;

    if (!pairMap.has(key)) pairMap.set(key, {});
    const pair = pairMap.get(key)!;
    
    // En la final siempre lo tomamos como leg1 (partido único)
    if (m.leg === 1 || m.round === 'final') pair.leg1 = m;
    else pair.leg2 = m;
  }

  return Array.from(pairMap.values()).map(({ leg1, leg2 }, idx) => {
    // Referencia segura: si no hay leg1, usamos leg2
    const ref = (leg1 || leg2) as KnockoutMatch;
    const isFinal = ref.round === 'final';

    // Para la final, el global es simplemente el score del partido único
    const total1 = isFinal ? (leg1?.home_score ?? 0) : (leg1?.home_score ?? 0) + (leg2?.away_score ?? 0);
    const total2 = isFinal ? (leg1?.away_score ?? 0) : (leg1?.away_score ?? 0) + (leg2?.home_score ?? 0);
    
    // Un partido se considera "jugado" si tiene score
    const played = isFinal ? leg1?.home_score != null : (leg1?.home_score != null && leg2?.home_score != null);

    return {
      id: `${ref.round}-${idx}`,
      team1: {
        name: leg1?.home_team || leg2?.away_team || 'TBD', // Prioridad al nombre real
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

