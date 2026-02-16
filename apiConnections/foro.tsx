export interface ForoComment {
  id: number;
  match_id: number;
  user_id: number;
  text: string;
  created_at: string;
  user: {
    usuario: string;
    club: {
      crest_url: string;
    };
  };
}

import { API_BASE, handleResponse } from './config';

export async function getMatchComments(matchId: number): Promise<ForoComment[]> {
  const res = await fetch(`${API_BASE}/foro/${matchId}`);
  return handleResponse(res, 'Error al obtener comentarios del foro');
}

export async function postComment(matchId: number, userId: number, text: string): Promise<ForoComment> {
  const res = await fetch(`${API_BASE}/foro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ matchId, userId, text }),
  });
  return handleResponse(res, 'Error al publicar en el foro');
}