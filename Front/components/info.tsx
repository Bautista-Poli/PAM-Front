// src/data/info.ts
import { getMatches } from './apiConnections/apileagues';
import { MatchRow } from './apiConnections/types';

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

export const obtenerJugadores = (equipo: string): string[] => {
  if (equipo === "River Plate"){

    return [
      `Franco Armani`,
      `Jeremías Ledesma`,
      `Germán Pezzella`,
      `Paulo Díaz`,
      `Milton Casco`,
      `Gonzalo Montiel`,
      `Marcos Acuña`,
      `Enzo Pérez`,
      `Nacho Fernández`,
      `Manuel Lanzini`,
      `Juan Fernando Quintero`,
      `Kevin Castaño`,
      `Miguel Borja`,
      `Sebastián Driussi`,
      `Facundo Colidio`,
      `Leandro González Pirez`,
      `Ramiro Funes Mori`,
      `Enzo Díaz`,
      `Santiago Simón`,
      `Matías Kranevitter`,
    ];

  }

  if (equipo === "Boca Juniors"){
    return [
      `Sergio Romero`,
      `Leandro Brey`,
      `Marcos Rojo`,
      `Nicolás Figal`,
      `Luis Advíncula`,
      `Frank Fabra`,
      `Lautaro Blanco`,
      `Equi Fernández`,
      `Norberto Briasco`,
      `Exequiel Zeballos`,
      `Luca Langoni`,
      `Miguel Merentiel`,
      `Edinson Cavani`,
      `Darío Benedetto`,
      `Lucas Janson`,
      `Kevin Zenón`,
      `Ignacio Miramón`,
      `Ezequiel Fernández`,
    ];

  }
  else{
    return [
      `Arquero`,
      `Defensores`,
      `Volantes`,
      `Delanteros`,
    ];
  }
};
