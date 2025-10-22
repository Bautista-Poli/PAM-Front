import React, { useEffect, useState } from 'react';
import { LeagueTableRow, MatchRow, Player, UserData } from './types';

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


export async function getPlayers(club: string): Promise<Player[]> {
  const res = await fetch(`${API_BASE}/players?club=${club}`);
  if (!res.ok) throw new Error('Error al obtener los jugadores de ' + club);
  return await res.json();
}

export async function postLogin(mail: string, contrasena: string): Promise<UserData | null> {
  try {
    const response = await fetch(`${API_BASE}/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mail, contrasena }),
    });
    console.log("Mail:",mail," Contraseña:",contrasena)
    if (!response.ok) return null;

    const user: UserData = await response.json();
    return user;
  } catch (err) {
    console.error('Error en el login:', err);
    return null;
  }
}

