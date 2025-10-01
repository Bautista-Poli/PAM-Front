// src/data/info.ts
import { PartidoData } from '../components/partido';

const partidosHoy: PartidoData[] = [
  {
    equipoLocal: 'River Plate',
    equipoVisitante: 'Boca Juniors',
    logoLocal: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/png/river.png',
    logoVisitante: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/png/boca.png',
    golesLocal: 2,
    golesVisitante: 1,
    competicion: 'Liga Profesional',
    dia: 'Finalizado',
  },
  {
    equipoLocal: 'Lanús',
    equipoVisitante: 'Vélez Sarsfield',
    logoLocal: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/png/lanus.png',
    logoVisitante: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/png/velez.png',
    golesLocal: 0,
    golesVisitante: 1,
    competicion: 'Liga Profesional',
    dia: 'Finalizado',
  },
  {
    equipoLocal: 'Riestra',
    equipoVisitante: 'Racing',
    logoLocal: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/png/riestra.png',
    logoVisitante: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/png/racing.png',
    golesLocal: 0,
    golesVisitante: 2,
    competicion: 'Liga Profesional',
    dia: 'Finalizado',
  },
  {
    equipoLocal: "Newell's",
    equipoVisitante: 'Rosario Central',
    logoLocal: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/png/newells.png',
    logoVisitante: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/png/rosariocentral.png',
    competicion: 'Liga Profesional',
    dia: '20:30',
  },
  {
    equipoLocal: 'Platense',
    equipoVisitante: 'Gimnasia',
    logoLocal: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/png/platense.png',
    logoVisitante: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/png/gimnasia.png',
    competicion: 'Liga Profesional',
    dia: '21:00',
  },
];

const partidosAyer: PartidoData[] = [
  {
  equipoLocal: 'Independiente',
  equipoVisitante: 'San Lorenzo',
  logoLocal: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/png/independiente.png',
  logoVisitante: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/png/sanlorenzo.png',
  golesLocal: 1,
  golesVisitante: 0,
  competicion: 'Liga Profesional',
  dia: 'Finalizado',
},
{
  equipoLocal: 'Huracán',
  equipoVisitante: 'Argentinos Juniors',
  logoLocal: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/png/huracan.png',
  logoVisitante: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/png/argentinos.png',
  golesLocal: 2,
  golesVisitante: 2,
  competicion: 'Liga Profesional',
  dia: 'Finalizado',
},
{
  equipoLocal: 'Estudiantes ',
  equipoVisitante: 'Talleres',
  logoLocal: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/png/estudiantes.png',
  logoVisitante: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/png/talleres.png',
  golesLocal: 0,
  golesVisitante: 1,
  competicion: 'Liga Profesional',
  dia: 'Finalizado',
},
{
  equipoLocal: 'Godoy Cruz',
  equipoVisitante: 'Unión',
  logoLocal: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/png/godoycruz.png',
  logoVisitante: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/png/union.png',
  golesLocal: 1,
  golesVisitante: 1,
  competicion: 'Liga Profesional',
  dia: 'Finalizado',
},
{
  equipoLocal: 'Banfield',
  equipoVisitante: 'Defensa y Justicia',
  logoLocal: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/png/banfield.png',
  logoVisitante: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/png/defensa.png',
  golesLocal: 3,
  golesVisitante: 2,
  competicion: 'Liga Profesional',
  dia: 'Finalizado',
},

];

const partidosMañana: PartidoData[] = [
  {
  equipoLocal: 'Belgrano',
  equipoVisitante: 'Instituto',
  logoLocal: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/png/belgrano.png',
  logoVisitante: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/png/instituto.png',
  competicion: 'Liga Profesional',
  dia: '15:30',
},
{
  equipoLocal: 'Central Córdoba',
  equipoVisitante: 'Atlético Tucumán',
  logoLocal: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/png/centralcordoba.png',
  logoVisitante: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/png/atleticotucuman.png',
  competicion: 'Liga Profesional',
  dia: '17:45',
},
{
  equipoLocal: 'Sarmiento',
  equipoVisitante: 'Barracas Central',
  logoLocal: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/png/sarmiento.png',
  logoVisitante: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/png/barracas.png',
  competicion: 'Liga Profesional',
  dia: '19:00',
},

];

export const getPartidos = (day: string): PartidoData[] => {
    if (day === 'hoy') return partidosHoy;
    if (day === 'ayer') return partidosAyer;
    if (day === 'mañana') return partidosMañana;
    return [];
};

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
