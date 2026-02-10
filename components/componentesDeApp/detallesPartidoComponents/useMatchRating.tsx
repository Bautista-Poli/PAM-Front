import { useEffect, useState, useMemo } from "react";
import { obtenerJugadores } from "../../../apiConnections/info";
import { MatchRow, Player } from "../../../apiConnections/types";
import { useAuthUser } from "@/auth/authContext";
import { getUserMatchRatings } from "@/apiConnections/ratings";

export type SectionJugadores = { title: string; teamName: string; data: Player[] };

export function useMatchPlayers(originalPartidoParam: unknown, isEditMode: boolean = false) {
  const user = useAuthUser();
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<SectionJugadores[]>([]);
  const [initialRatings, setInitialRatings] = useState<Record<number, number>>({});

  const partidoData = useMemo(() => {
    try {
      return originalPartidoParam ? (JSON.parse(originalPartidoParam as string) as MatchRow) : null;
    } catch { return null; }
  }, [originalPartidoParam]);

  useEffect(() => {
    if (!partidoData) return;
    
    (async () => {
      setLoading(true);
      try {
        const [loc, vis] = await Promise.all([
          obtenerJugadores(partidoData.home_team ?? "Local"), 
          obtenerJugadores(partidoData.away_team ?? "Visitante"),
        ]);

        if (isEditMode) {
          const prev = await getUserMatchRatings(user.id, parseInt(partidoData.id));
          const map = prev.reduce((acc: any, curr: any) => {
            acc[curr.player_id] = curr.rating;
            return acc;
          }, {});
          setInitialRatings(map);
        }

        setSections([
          { title: `Jugadores — ${partidoData.home_team}`, teamName: partidoData.home_team ?? "", data: loc || [] },
          { title: `Jugadores — ${partidoData.away_team}`, teamName: partidoData.away_team ?? "", data: vis || [] },
        ]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [partidoData, isEditMode]);

  return { partidoData, userId: user.id, sections, initialRatings, loading };
}