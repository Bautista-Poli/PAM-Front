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