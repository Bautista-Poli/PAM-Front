import { MatchItem } from '@/helpers/interfaces/matches';
import { Platform } from 'react-native';
import { todayISO, shiftDate } from '@/helpers/utils/match'; // 👈 usar utilidades que ya tenés

export async function fetchMatches(
  day: 'hoy' | 'ayer' | 'man' | 'pasman' // 👈 incluir pasman en el tipo
): Promise<MatchItem[]> {
  const BASE =
    process.env.EXPO_PUBLIC_API_BASE?.replace(/\/+$/, '') ||
    (Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000');

  // Traducir "pasman" a day=date&date=YYYY-MM-DD (+1)
  const url =
    day === 'pasman'
      ? `${BASE}/api/matches?day=date&date=${encodeURIComponent(shiftDate(todayISO(), +1))}`
      : `${BASE}/api/matches?day=${day}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  const json = await res.json();
  return (json.data || []) as MatchItem[];
}

