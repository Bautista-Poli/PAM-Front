export type EquipoTabla = {
  nombre: string;
  puntos: number;
  pj: number;
  gf: number;
  gc: number;
  dg: number;
};

export type LigaData = {
  key: string;
  nombre: string;
  tabla: EquipoTabla[];
};

const tablaLigaArgentina: EquipoTabla[] = [
  { nombre: "Vélez Sarsfield", puntos: 51, pj: 27, gf: 38, gc: 16, dg: 22 },
  { nombre: "Talleres", puntos: 48, pj: 27, gf: 34, gc: 27, dg: 7 },
  { nombre: "Racing Club", puntos: 46, pj: 27, gf: 42, gc: 30, dg: 12 },
  { nombre: "Huracán", puntos: 46, pj: 27, gf: 28, gc: 18, dg: 10 },
  { nombre: "River Plate", puntos: 43, pj: 27, gf: 38, gc: 21, dg: 17 },
  { nombre: "Boca Juniors", puntos: 42, pj: 27, gf: 30, gc: 23, dg: 7 },
  { nombre: "Independiente", puntos: 40, pj: 27, gf: 25, gc: 17, dg: 8 },
  { nombre: "Atlético Tucumán", puntos: 40, pj: 27, gf: 28, gc: 27, dg: 1 },
  { nombre: "Unión", puntos: 40, pj: 27, gf: 27, gc: 26, dg: 1 },
  { nombre: "Platense", puntos: 39, pj: 27, gf: 20, gc: 18, dg: 2 },
  { nombre: "Independiente Rivadavia", puntos: 38, pj: 27, gf: 23, gc: 25, dg: -2 },
  { nombre: "Estudiantes (LP)", puntos: 36, pj: 27, gf: 36, gc: 34, dg: 2 },
  { nombre: "Instituto", puntos: 36, pj: 27, gf: 32, gc: 31, dg: 1 },
  { nombre: "Lanús", puntos: 36, pj: 27, gf: 28, gc: 31, dg: -3 },
  { nombre: "Godoy Cruz", puntos: 35, pj: 27, gf: 31, gc: 28, dg: 3 },
  { nombre: "Belgrano", puntos: 35, pj: 27, gf: 33, gc: 32, dg: 1 },
  { nombre: "Deportivo Riestra", puntos: 35, pj: 27, gf: 26, gc: 27, dg: -1 },
  { nombre: "Tigre", puntos: 34, pj: 27, gf: 27, gc: 30, dg: -3 },
  { nombre: "Gimnasia y Esgrima (LP)", puntos: 32, pj: 27, gf: 21, gc: 23, dg: -2 },
  { nombre: "Rosario Central", puntos: 32, pj: 27, gf: 27, gc: 30, dg: -3 },
  { nombre: "Defensa y Justicia", puntos: 32, pj: 27, gf: 27, gc: 33, dg: -6 },
  { nombre: "Central Córdoba (SdE)", puntos: 31, pj: 27, gf: 29, gc: 36, dg: -7 },
  { nombre: "Argentinos Juniors", puntos: 30, pj: 27, gf: 22, gc: 28, dg: -6 },
  { nombre: "San Lorenzo", puntos: 29, pj: 27, gf: 20, gc: 26, dg: -6 },
  { nombre: "Newell's Old Boys", puntos: 28, pj: 27, gf: 22, gc: 35, dg: -13 },
  { nombre: "Sarmiento (J)", puntos: 26, pj: 27, gf: 18, gc: 28, dg: -10 },
  { nombre: "Banfield", puntos: 24, pj: 27, gf: 22, gc: 36, dg: -14 },
  { nombre: "Barracas Central", puntos: 23, pj: 27, gf: 15, gc: 33, dg: -18 },
];

const tablaPremierLeague: EquipoTabla[] = [
  { nombre: "Liverpool", puntos: 28, pj: 11, gf: 24, gc: 8, dg: 16 },
  { nombre: "Manchester City", puntos: 23, pj: 11, gf: 22, gc: 13, dg: 9 },
  { nombre: "Nottingham Forest", puntos: 19, pj: 11, gf: 15, gc: 10, dg: 5 },
  { nombre: "Chelsea", puntos: 18, pj: 11, gf: 21, gc: 13, dg: 8 },
  { nombre: "Arsenal", puntos: 18, pj: 11, gf: 18, gc: 12, dg: 6 },
  { nombre: "Brighton", puntos: 17, pj: 11, gf: 17, gc: 14, dg: 3 },
  { nombre: "Fulham", puntos: 16, pj: 11, gf: 16, gc: 13, dg: 3 },
  { nombre: "Newcastle", puntos: 15, pj: 11, gf: 13, gc: 11, dg: 2 },
  { nombre: "Aston Villa", puntos: 15, pj: 11, gf: 17, gc: 17, dg: 0 },
  { nombre: "Tottenham", puntos: 13, pj: 11, gf: 23, gc: 13, dg: 10 },
  { nombre: "Brentford", puntos: 13, pj: 11, gf: 22, gc: 22, dg: 0 },
  { nombre: "Bournemouth", puntos: 12, pj: 11, gf: 15, gc: 15, dg: 0 },
  { nombre: "Manchester United", puntos: 12, pj: 11, gf: 12, gc: 12, dg: 0 },
  { nombre: "West Ham", puntos: 12, pj: 11, gf: 13, gc: 19, dg: -6 },
  { nombre: "Leicester", puntos: 10, pj: 11, gf: 14, gc: 21, dg: -7 },
  { nombre: "Everton", puntos: 10, pj: 11, gf: 10, gc: 17, dg: -7 },
  { nombre: "Ipswich", puntos: 8, pj: 11, gf: 12, gc: 22, dg: -10 },
  { nombre: "Crystal Palace", puntos: 7, pj: 11, gf: 8, gc: 15, dg: -7 },
  { nombre: "Wolves", puntos: 6, pj: 11, gf: 16, gc: 27, dg: -11 },
  { nombre: "Southampton", puntos: 4, pj: 11, gf: 7, gc: 21, dg: -14 },
];

const tablaLaLiga: EquipoTabla[] = [
  { nombre: "Barcelona", puntos: 33, pj: 13, gf: 40, gc: 12, dg: 28 },
  { nombre: "Real Madrid", puntos: 27, pj: 12, gf: 25, gc: 11, dg: 14 },
  { nombre: "Atlético Madrid", puntos: 26, pj: 13, gf: 19, gc: 7, dg: 12 },
  { nombre: "Villarreal", puntos: 24, pj: 12, gf: 23, gc: 19, dg: 4 },
  { nombre: "Osasuna", puntos: 21, pj: 13, gf: 17, gc: 20, dg: -3 },
  { nombre: "Athletic Bilbao", puntos: 20, pj: 13, gf: 19, gc: 13, dg: 6 },
  { nombre: "Real Betis", puntos: 20, pj: 13, gf: 13, gc: 12, dg: 1 },
  { nombre: "Real Sociedad", puntos: 18, pj: 13, gf: 9, gc: 7, dg: 2 },
  { nombre: "Mallorca", puntos: 18, pj: 13, gf: 10, gc: 10, dg: 0 },
  { nombre: "Girona", puntos: 18, pj: 13, gf: 16, gc: 17, dg: -1 },
  { nombre: "Celta Vigo", puntos: 17, pj: 13, gf: 20, gc: 22, dg: -2 },
  { nombre: "Rayo Vallecano", puntos: 16, pj: 12, gf: 13, gc: 13, dg: 0 },
  { nombre: "Sevilla", puntos: 15, pj: 13, gf: 12, gc: 16, dg: -4 },
  { nombre: "Real Oviedo", puntos: 14, pj: 13, gf: 13, gc: 16, dg: -3 },
  { nombre: "Alavés", puntos: 13, pj: 13, gf: 14, gc: 21, dg: -7 },
  { nombre: "Levante", puntos: 12, pj: 13, gf: 16, gc: 22, dg: -6 },
  { nombre: "Getafe", puntos: 10, pj: 13, gf: 8, gc: 11, dg: -3 },
  { nombre: "Espanyol", puntos: 10, pj: 12, gf: 11, gc: 22, dg: -11 },
  { nombre: "Elche", puntos: 9, pj: 13, gf: 9, gc: 25, dg: -16 },
  { nombre: "Valencia", puntos: 7, pj: 11, gf: 8, gc: 17, dg: -9 },
];

export const LIGAS_DATA: LigaData[] = [
  {
    key: "liga_profesional_argentina",
    nombre: "Liga Profesional Argentina",
    tabla: tablaLigaArgentina,
  },
  {
    key: "premier_league",
    nombre: "Premier League",
    tabla: tablaPremierLeague,
  },
  {
    key: "la_liga",
    nombre: "LaLiga",
    tabla: tablaLaLiga,
  },
];

export const getLigaByKey = (key: string): LigaData | undefined => {
  return LIGAS_DATA.find(liga => liga.key === key);
};

export const getLigaByName = (nombre: string): LigaData | undefined => {
  return LIGAS_DATA.find(liga => liga.nombre === nombre);
};