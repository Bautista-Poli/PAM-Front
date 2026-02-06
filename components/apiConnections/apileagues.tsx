import { LeagueTableRow, MatchRow, Player, UserData, Club } from './types';

const IP_ADDR = process.env.EXPO_PUBLIC_IP_ADDR;

const API_BASE = `http://${IP_ADDR}:3000`;



export async function getLeagueTableByName(leagueName:string): Promise<LeagueTableRow[]>{
  const res = await fetch(`${API_BASE}/league-table?leagueName=${leagueName}`);
  if (!res.ok) throw new Error('Error al obtener la tabla de la liga: '+leagueName);
  return res.json()
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

export async function getClubsArgentinos(): Promise<Club[]> {
  try {
    const response = await fetch(`${API_BASE}/user/clubs`);
    if (!response.ok) throw new Error('Error al obtener los clubes');
    return await response.json();
  } catch (err) {
    console.error('Error al obtener clubes argentinos:', err);
    throw err;
  }
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

export async function postCreateUser(
  nombre: string,
  mail: string,
  contrasena: string,
  clubId: number
): Promise<{ success: boolean; user?: UserData; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/user/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre, mail, contrasena, clubId }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Error al crear la cuenta'
      };
    }

    return { success: true, user: data };
  } catch (err) {
    console.error('Error al crear usuario:', err);
    return {
      success: false,
      error: 'Error de conexión al crear la cuenta'
    };
  }
}

export type RatingInput = {
  playerId: number;
  rating: number;
};

export async function postRatings(userId: number, matchId: number, ratings: RatingInput[]): Promise<{ success: boolean; ratingsCreated: number } | null> {
  try {
    const response = await fetch(`${API_BASE}/ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, matchId, ratings }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al guardar las evaluaciones');
    }

    return await response.json();
  }
  catch (err) {
    throw err;
  }
}

export async function updateRatings(userId: number, matchId: number, ratings: RatingInput[]) {
  try {
    const response = await fetch(`${API_BASE}/ratings`, {
      method: 'PUT', // Usamos PUT para actualizar
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, matchId, ratings }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al actualizar');
    }

    return await response.json();
  } catch (err) {
    throw err;
  }
}

export async function checkUserVoted(userId: number, matchId: number): Promise<{ hasVoted: boolean }> {
  try {
    const response = await fetch(`${API_BASE}/ratings/check?userId=${userId}&matchId=${matchId}`);

    if (!response.ok) {
      throw new Error('Error al verificar voto');
    }

    return await response.json();
  }
  catch (err) {
    console.error('Error al verificar voto:', err);
    throw err;
  }
}

export async function getUserMatchRatings(userId: number, matchId: number) {
  const response = await fetch(`${API_BASE}/ratings/user-match?userId=${userId}&matchId=${matchId}`);
  if (!response.ok) throw new Error('Error al obtener calificaciones previas');
  return await response.json();
}

export async function getPlayerRatingsByClub(clubName: string): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE}/ratings/club/${encodeURIComponent(clubName)}`);

    if (!response.ok) {
      throw new Error('Error al obtener ratings del club');
    }

    return await response.json();
  }
  catch (err) {
    console.error('Error al obtener ratings:', err);
    throw err;
  }
}

// Agrega esto a tu archivo de conexiones de API
export const getMatchEvents = async (matchId: string) => {
  try {
    // Ajusta la URL según tu endpoint de Nest/Express
    const response = await fetch(`${API_BASE}/matches/${matchId}/events`);
    if (!response.ok) throw new Error("Error al obtener eventos");
    return await response.json();
  } catch (error) {
    console.error("Error getMatchEvents:", error);
    return [];
  }
};

export async function updateUserProfile(
  userId: number,
  nombre: string,
  clubId: number
): Promise<UserData> {
  try {
    const response = await fetch(`${API_BASE}/user/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre, clubId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al actualizar perfil');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error al actualizar perfil:', error);
    throw error;
  }
}