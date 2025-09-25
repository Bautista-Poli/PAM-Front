import { Link } from 'expo-router';
import { useState } from 'react';
import { View, Text, Button, StyleSheet, Image, ImageSourcePropType, Pressable } from 'react-native';
import Marcador from './marcador';

/** ------------------ Componente Partido ------------------ **/
export type PartidoData = {
  equipoLocal: string;
  equipoVisitante: string;
  logoLocal: ImageSourcePropType | string;
  logoVisitante: ImageSourcePropType | string;
  golesLocal?: number;
  golesVisitante?: number;
  competicion: string;
  dia: string;
};

type PartidoProps = {
  data: PartidoData;
};

const toSource = (src: ImageSourcePropType | string): ImageSourcePropType =>
  typeof src === 'string' ? { uri: src } : src;

export default function PartidoCard({ data }: PartidoProps) {
  return (
    <Link
      href={{
        pathname: "/paginaPrincipal",
        params: { partido: JSON.stringify(data) }, // se pasa como string
      }}
      asChild
    >
      <Pressable>
        <View style={styles.card}>
          {(data.competicion || data.dia) && (
            <View style={styles.cardHeader}>
              {data.competicion ? <Text style={styles.comp}>{data.competicion}</Text> : null}
              {data.dia ? <Text style={styles.date}>{data.dia}</Text> : null}
            </View>
          )}

          <View style={styles.row}>
            {/* Local */}
            <View style={styles.teamBlock}>
              <Image source={toSource(data.logoLocal)} style={styles.logo} resizeMode="contain" />
              <Text style={styles.teamName} numberOfLines={1}>{data.equipoLocal}</Text>
            </View>

            <View style={styles.scoreBlock}>
              <Marcador
                golesLocal={data.golesLocal}
                golesVisitante={data.golesVisitante}
              />
            </View>

            {/* Visitante */}
            <View style={styles.teamBlock}>
              <Image source={toSource(data.logoVisitante)} style={styles.logo} resizeMode="contain" />
              <Text style={styles.teamName} numberOfLines={1}>{data.equipoVisitante}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0a84e21f',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  comp: { color: '#93c5fd', fontSize: 14, fontWeight: '700' },
  date: { color: '#cbd5e1', fontSize: 13, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  teamBlock: { flex: 1, alignItems: 'center', gap: 8 },
  logo: { width: 56, height: 56 },
  teamName: { color: '#e5e7eb', fontSize: 14, fontWeight: '600', textAlign: 'center' },
  scoreBlock: { minWidth: 120, alignItems: 'center', justifyContent: 'center', gap: 4 },
  scoreText: { fontSize: 28, fontWeight: '800', color: '#f8fafc', letterSpacing: 1 },
  dash: { opacity: 0.7 },
  status: { fontSize: 12, color: '#9ca3af' },
});
