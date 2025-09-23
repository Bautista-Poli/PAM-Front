// src/data/info.ts
import { PartidoData } from '../components/partido';

const partidosHoy: PartidoData[] = [
  {
    equipoLocal: 'River Plate',
    equipoVisitante: 'Boca Juniors',
    logoLocal:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Escudo_del_C_A_River_Plate.svg/826px-Escudo_del_C_A_River_Plate.svg.png',
    logoVisitante:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Boca_Juniors_logo18.svg/865px-Boca_Juniors_logo18.svg.png',
    golesLocal: 2,
    golesVisitante: 1,
    competicion: 'Liga Profesional',
    dia: 'Hoy 12:00',
  },
  {
    equipoLocal: 'Lanús',
    equipoVisitante: 'Belez',
    logoLocal: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Escudo_de_Lan%C3%BAs_2025.png',
    logoVisitante:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Escudo_del_Club_Atl%C3%A9tico_V%C3%A9lez_Sarsfield.svg/896px-Escudo_del_Club_Atl%C3%A9tico_V%C3%A9lez_Sarsfield.svg.png',
    golesLocal: 0,
    golesVisitante: 1,
    competicion: 'Liga Profesional',
    dia: 'Hoy 19:00',
  },
  {
    equipoLocal: 'Lanús',
    equipoVisitante: 'Velez',
    logoLocal: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Escudo_de_Lan%C3%BAs_2025.png',
    logoVisitante:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Escudo_del_Club_Atl%C3%A9tico_V%C3%A9lez_Sarsfield.svg/896px-Escudo_del_Club_Atl%C3%A9tico_V%C3%A9lez_Sarsfield.svg.png',
    golesLocal: 0,
    golesVisitante: 2,
    competicion: 'Liga Profesional',
    dia: 'Hoy 19:00',
  },
  {
    equipoLocal: 'Lanús',
    equipoVisitante: 'Velez',
    logoLocal: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Escudo_de_Lan%C3%BAs_2025.png',
    logoVisitante:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Escudo_del_Club_Atl%C3%A9tico_V%C3%A9lez_Sarsfield.svg/896px-Escudo_del_Club_Atl%C3%A9tico_V%C3%A9lez_Sarsfield.svg.png',
    golesLocal: 9,
    golesVisitante: 2,
    competicion: 'Liga Profesional',
    dia: 'Hoy 19:00',
  },
  {
    equipoLocal: 'Racing',
    equipoVisitante: 'Velez',
    logoLocal: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Escudo_de_Racing_Club_%282014%29.svg/632px-Escudo_de_Racing_Club_%282014%29.svg.png',
    logoVisitante:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Escudo_del_Club_Atl%C3%A9tico_V%C3%A9lez_Sarsfield.svg/896px-Escudo_del_Club_Atl%C3%A9tico_V%C3%A9lez_Sarsfield.svg.png',
    competicion: 'Liga Profesional',
    dia: 'Hoy 23:00',
  },
];

const partidosAyer: PartidoData[] = [
  {
    equipoLocal: 'River Plate',
    equipoVisitante: 'Boca Juniors',
    logoLocal:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Escudo_del_C_A_River_Plate.svg/826px-Escudo_del_C_A_River_Plate.svg.png',
    logoVisitante:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Boca_Juniors_logo18.svg/865px-Boca_Juniors_logo18.svg.png',
    golesLocal: 2,
    golesVisitante: 1,
    competicion: 'Liga Profesional',
    dia: 'Ayer 21:00',
  },
];

const partidosMañana: PartidoData[] = [
  {
    equipoLocal: 'Liverpool',
    equipoVisitante: 'Southhampton',
    logoLocal:
      'https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Liverpool_FC.svg/879px-Liverpool_FC.svg.png',
    logoVisitante:
    'https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/376.png',
    competicion: 'Liga Profesional',
    dia: 'Mañana 15:00',
  },
];

export const getPartidos = (day: string): PartidoData[] => {
    if (day === 'hoy') return partidosHoy;
    if (day === 'ayer') return partidosAyer;
    if (day === 'mañana') return partidosMañana;
    return [];
};




export const obtenerJugadores = (equipo: string): string[] => {
  if(equipo == "River Plate"){

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
    ];
  }

  if(equipo == "Lanús"){
    return [
      `Lautaro Morales`,
      `Nahuel Losada`,
      `Carlos Izquierdoz`,
      `José Canale`,
      `Sasha Marcich`,
      `Gonzalo Pérez`,
      `Felipe Peña Biafore`,
      `Agustín Cardozo`,
      `Raúl Loaiza`,
      `Marcelino Moreno`,
      `Eduardo Salvio`,
      `Walter Bou`,
      `Rodrigo Castillo`,
      `Alexis Segovia`,
      `Lautaro Acosta`,
    ];
  }
  else{
    return [
      `Arquero`,
      `Defensor`,
      `Volante`,
      `Delantero`,
    ];
  }
};
