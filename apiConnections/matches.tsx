import { API_BASE, handleResponse } from './config';
import { MatchRow } from './types';

export async function getMatches(url: string): Promise<MatchRow[]> {
  const res = await fetch(`${API_BASE}/matches/by-date${url}`);
  return handleResponse(res, 'Error al obtener los partidos');
}

export const getMatchEvents = async (matchId: string) => {
  try {
    const res = await fetch(`${API_BASE}/matches/${matchId}/events`);
    return await handleResponse(res, "Error al obtener eventos");
  } catch (error) {
    console.error("Error getMatchEvents:", error);
    return [];
  }
};

export async function getMatchesByTeam(teamName: string): Promise<MatchRow[]> {
  const res = await fetch(`${API_BASE}/matches/team/${encodeURIComponent(teamName)}`);
  return handleResponse(res, 'Error al obtener el historial del equipo');
}

export async function getTournamentMatches(leagueName: string): Promise<MatchRow[]> {
  const res = await fetch(`${API_BASE}/matches/by-league/${encodeURIComponent(leagueName)}`);
  return handleResponse(res, 'Error al obtener los partidos del torneo');
}