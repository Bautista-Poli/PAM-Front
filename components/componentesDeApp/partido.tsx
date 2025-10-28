import { Link } from 'expo-router';
import { useState } from 'react';
import { View, Text, Button, StyleSheet, Image, ImageSourcePropType, Pressable } from 'react-native';
import { MatchRow } from '../apiConnections/types';
import Marcador from './marcador';

type PartidoProps = {
  data: MatchRow;
};

const fallbackLogo = 'https://ligafutbolcity.com/img/logo/equipos/equipo_default.png';

function formatHourTime(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  });
}

function getMatchStatus(isoDate: string): string {
  const matchDate = new Date(isoDate);
  const now = new Date();
  const twoHoursAfter = new Date(matchDate.getTime() + 2 * 60 * 60 * 1000);
  
  if (now > twoHoursAfter) {
    return "Final";
  }
  
  return formatHourTime(isoDate);
}

export default function PartidoCard({ data }: PartidoProps) {
  return (
    <Link
      href={{
        pathname: "/ratingPartido",
        params: { partido: JSON.stringify(data) },
      }}
      asChild
    >
      <Pressable>
        <View style={styles.card}>
          {(data.league || data.match_date) && (
            <View style={styles.cardHeader}>
              {data.league ? <Text style={styles.comp}>{data.league}</Text> : null}
              {data.match_date ? <Text style={styles.date}>{getMatchStatus(data.match_date)}</Text> : null}
            </View>
          )}

          <View style={styles.row}>
            {/* Local */}
            <View style={styles.teamBlock}>
              <Image
                source={{ uri: data.home_crest ?? fallbackLogo }}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.teamName} numberOfLines={1}>
                {data.home_team ?? "Local"}
              </Text>
            </View>

            <View style={styles.scoreBlock}>
              <Marcador
                golesLocal={data.score_home ?? undefined}
                golesVisitante={data.score_away ?? undefined}
              />
            </View>

            {/* Visitante */}
            <View style={styles.teamBlock}>
              <Image
                source={{ uri: data.away_crest ?? fallbackLogo }}
                style={styles.logo}
                resizeMode="contain"
              /><Text style={styles.teamName} numberOfLines={1}>
                {data.away_team ?? "Visitante"}
              </Text>
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