import React, { useEffect, useState } from 'react';
import { LeagueTableRow, MatchRow, Player } from './types';

const IP_ADDR = process.env.EXPO_PUBLIC_IP_ADDR;

const API_BASE = `http://${IP_ADDR}:3000`;

export async function getLeague(): Promise<LeagueTableRow[]> {
  const res = await fetch(`${API_BASE}/table`);
  if (!res.ok) throw new Error('Error al obtener la tabla');
  return await res.json();
}

export async function getMatches(url: string): Promise<MatchRow[]> {
  const res = await fetch(`${API_BASE}/matches/by-date${url}`);
  if (!res.ok) throw new Error('Error al obtener los partidos');
  return await res.json();
}

export async function getEscudo(club:string): Promise<MatchRow[]> {
  const res = await fetch(`${API_BASE}/escudos?club=${club}`);
  if (!res.ok) throw new Error('Error al obtener los escudos');
  return await res.json();
}

export async function getPlayers(club: string): Promise<Player[]> {
  const res = await fetch(`${API_BASE}/players?club=${club}`);
  if (!res.ok) throw new Error('Error al obtener los jugadores de ' + club);
  return await res.json();
}