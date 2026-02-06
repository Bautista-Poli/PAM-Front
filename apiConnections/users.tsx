import { API_BASE, handleResponse } from './config';
import { UserData, Club } from './types';

export async function postLogin(mail: string, contrasena: string): Promise<UserData | null> {
  try {
    const res = await fetch(`${API_BASE}/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mail, contrasena }),
    });
    return res.ok ? await res.json() : null;
  } catch (err) {
    return null;
  }
}

export async function postCreateUser(nombre: string, mail: string, contrasena: string, clubId: number) {
    const res = await fetch(`${API_BASE}/user/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, mail, contrasena, clubId }),
    });
    return handleResponse(res, 'Error al crear la cuenta');
}

export async function updateUserProfile(userId: number, nombre: string, clubId: number): Promise<UserData> {
    const res = await fetch(`${API_BASE}/user/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, clubId }),
    });
    return handleResponse(res, 'Error al actualizar perfil');
}