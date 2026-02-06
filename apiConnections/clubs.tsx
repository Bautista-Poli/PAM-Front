import { API_BASE, handleResponse } from './config';
import { Club, LeagueTableRow, Player } from './types';

export async function getClubsArgentinos(): Promise<Club[]> {
  const res = await fetch(`${API_BASE}/user/clubs`);
  return handleResponse(res, 'Error al obtener los clubes');
}

export async function getLeagueTableByName(leagueName: string): Promise<LeagueTableRow[]> {
  const res = await fetch(`${API_BASE}/league-table?leagueName=${leagueName}`);
  return handleResponse(res, 'Error al obtener la tabla de la liga');
}

export async function getPlayers(club: string): Promise<Player[]> {
  const res = await fetch(`${API_BASE}/players?club=${club}`);
  return handleResponse(res, 'Error al obtener los jugadores');
}