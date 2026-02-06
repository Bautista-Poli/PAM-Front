import { API_BASE, handleResponse } from './config';
import { RatingInput } from './types';


export async function postRatings(userId: number, matchId: number, ratings: RatingInput[]) {
    const res = await fetch(`${API_BASE}/ratings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, matchId, ratings }),
    });
    return handleResponse(res, 'Error al guardar las evaluaciones');
}

export async function updateRatings(userId: number, matchId: number, ratings: RatingInput[]) {
    const res = await fetch(`${API_BASE}/ratings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, matchId, ratings }),
    });
    return handleResponse(res, 'Error al actualizar calificaciones');
}

export async function checkUserVoted(userId: number, matchId: number) {
    const res = await fetch(`${API_BASE}/ratings/check?userId=${userId}&matchId=${matchId}`);
    return handleResponse(res, 'Error al verificar voto');
}

export async function getUserMatchRatings(userId: number, matchId: number) {
  const res = await fetch(`${API_BASE}/ratings/user-match?userId=${userId}&matchId=${matchId}`);
  return handleResponse(res, 'Error al obtener calificaciones previas');
}