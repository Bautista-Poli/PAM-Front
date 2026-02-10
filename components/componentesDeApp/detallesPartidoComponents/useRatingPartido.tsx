import { useEffect, useState, useMemo } from "react";
import { obtenerJugadores } from "../../../apiConnections/info";
import { MatchRow, Player } from "../../../apiConnections/types";
import { useAuthUser } from "@/auth/authContext";

export type SectionJugadores = { title: string; teamName: string; data: Player[] };

export function useRatingPartido(originalPartidoParam: unknown) {
  const user = useAuthUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sections, setSections] = useState<SectionJugadores[]>([]);

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
          obtenerJugadores(partidoData.home_team ?? ""), 
          obtenerJugadores(partidoData.away_team ?? ""),
        ]);

        setSections([
          { title: `Jugadores — ${partidoData.home_team}`, teamName: partidoData.home_team ?? "Local", data: loc || [] },
          { title: `Jugadores — ${partidoData.away_team}`, teamName: partidoData.away_team ?? "Visitante", data: vis || [] },
        ]);
      } catch (e: any) {
        setError(e?.message ?? "Error cargando jugadores");
      } finally {
        setLoading(false);
      }
    })();
  }, [partidoData]);

  return { 
    partidoData, 
    userId: user.id, 
    sections, 
    loading, 
    error 
  };
}

