// src/data/info.ts
import { getMatches, getPlayers } from './apileagues';
import { MatchRow, Player } from './types';

function getFechaPorDia(day: string): string {
  const hoy = new Date();

  if (day === 'mañana') {
    hoy.setDate(hoy.getDate() + 1);
  } else if (day === 'ayer') {
    hoy.setDate(hoy.getDate() - 1);
  }

  // Formatear como YYYY-MM-DD
  const year = hoy.getFullYear();
  const month = String(hoy.getMonth() + 1).padStart(2, '0');
  const dayNum = String(hoy.getDate()).padStart(2, '0');

  return `${year}-${month}-${dayNum}`;
}

export async function getPartidos(day: string): Promise<MatchRow[]> {
  const fecha = getFechaPorDia(day);
  const url = `?date=${fecha}`;
  return await getMatches(url);
}

export async function obtenerJugadores(equipo: string): Promise<Player[]>{
  return await getPlayers(equipo)
};
