
import { getPlayers } from './clubs';
import { getMatches } from './matches';
import { MatchRow, Player, Club, EquipoInfo } from './types';

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

export const getEquipos = async (leagueKey?: string): Promise<Club[]> => {
  const IP_ADDR = process.env.EXPO_PUBLIC_IP_ADDR;
  
  let API_URL = `http://${IP_ADDR}:3000/clubs`;
  if (leagueKey) {
    API_URL += `?league_key=${encodeURIComponent(leagueKey)}`;
  }

  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('No se pudieron cargar los equipos desde el servidor.');
  }

  return response.json();
};

export const obtenerEquipoInfo = async (nombre: string): Promise<EquipoInfo> => {
  const IP_ADDR = process.env.EXPO_PUBLIC_IP_ADDR;
  
  const API_URL = `http://${IP_ADDR}:3000/clubs/${nombre}`;

  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`No se pudo cargar la información para ${nombre}.`);
  }

  return response.json();
};
