// hooks/useRatingPartido.ts
import { useEffect, useMemo, useReducer } from "react";
import { checkUserVoted } from "../apiConnections/apileagues";
import { obtenerJugadores } from "../apiConnections/info";
import { MatchRow, Player, UserData } from "../apiConnections/types";
import { useAuthUser } from "@/auth/authContext";

export type SectionJugadores = { title: string; teamName: string; data: Player[] };

type State =
  | { status: "idle" | "loading"; partidoData: MatchRow | null }
  | { status: "error"; error: string; partidoData: MatchRow | null }
  | { status: "voted"; partidoData: MatchRow; userId: number }
  | { status: "ready"; partidoData: MatchRow; userId: number; sections: SectionJugadores[] };

type Action =
  | { type: "SET_PARTIDO"; partidoData: MatchRow | null }
  | { type: "LOADING" }
  | { type: "ERROR"; error: string }
  | { type: "VOTED"; userId: number }
  | { type: "READY"; userId: number; sections: SectionJugadores[] };


function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_PARTIDO":
      return { status: "idle", partidoData: action.partidoData };
    case "LOADING":
      return { status: "loading", partidoData: state.partidoData };
    case "ERROR":
      return { status: "error", error: action.error, partidoData: state.partidoData };
    case "VOTED":
      if (!state.partidoData) return state;
      return { status: "voted", partidoData: state.partidoData, userId: action.userId };
    case "READY":
      if (!state.partidoData) return state;
      return {
        status: "ready",
        partidoData: state.partidoData,
        userId: action.userId,
        sections: action.sections,
      };
    default:
      return state;
  }
}

export function useRatingPartido(originalPartidoParam: unknown) {
  // 1. Obtener el usuario autenticado
  let user: UserData;
  try {
      user = useAuthUser(); 
  } catch (e) {
      console.error("Error al obtener usuario en useRatingPartido:", e);
      return { status: "error", error: "Usuario no autenticado", partidoData: null };
  }

  const partidoData: MatchRow | null = useMemo(() => {
    try {
      return originalPartidoParam ? (JSON.parse(originalPartidoParam as string) as MatchRow) : null;
    } catch {
      return null;
    }
  }, [originalPartidoParam]);

  const [state, dispatch] = useReducer(reducer, { status: "idle", partidoData });

  useEffect(() => {
    dispatch({ type: "SET_PARTIDO", partidoData });
  }, [partidoData]);

  useEffect(() => {
    const userId: number = user.id;

    (async () => {
      if (!partidoData) return;
      dispatch({ type: "LOADING" });

      try {        
        const matchId = parseInt(partidoData.id);
        const result = await checkUserVoted(userId, matchId);
        if (result?.hasVoted) {
          dispatch({ type: "VOTED", userId });
          return;
        }

        const equipoLocal = partidoData.home_team ?? "Local";
        const equipoVisitante = partidoData.away_team ?? "Visitante";

        const [loc, vis] = await Promise.all([
          obtenerJugadores(equipoLocal), 
          obtenerJugadores(equipoVisitante),
        ]);

        const sections: SectionJugadores[] = [
          { title: `Jugadores — ${equipoLocal}`, teamName: equipoLocal, data: loc || [] },
          { title: `Jugadores — ${equipoVisitante}`, teamName: equipoVisitante, data: vis || [] },
        ];

        dispatch({ type: "READY", userId, sections });
      } catch (e: any) {
        dispatch({ type: "ERROR", error: e?.message ?? "Error cargando datos" });
      }
    })();
  }, [partidoData, user.id]); // Asegúrate de incluir 'user.id' como dependencia

  return state;
}