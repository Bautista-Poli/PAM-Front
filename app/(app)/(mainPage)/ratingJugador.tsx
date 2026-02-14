import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import LoaderBall from '@/components/animations/animacionCarga';
import { getPlayerRatingsHistory } from '@/apiConnections/ratings';

const datosEjemplo: MatchRating[] = [
    {
        date: '2024-02-10',
        opponent: 'Boca Juniors',
        competition: 'Liga Profesional',
        rating: 1.7,
        goals: 1,
        assists: 0,
        minutesPlayed: 90
    },
    {
        date: '2024-02-04',
        opponent: 'River Plate',
        competition: 'Copa de la Liga',
        rating: 2.2,
        goals: 0,
        assists: 1,
        minutesPlayed: 75
    },
    {
        date: '2024-01-28',
        opponent: 'Racing Club',
        competition: 'Liga Profesional',
        rating: 3.5,
        goals: 0,
        assists: 0,
        minutesPlayed: 90
    },
    {
        date: '2024-01-28',
        opponent: 'Racing Club',
        competition: 'Liga Profesional',
        rating: 4.5,
        goals: 0,
        assists: 0,
        minutesPlayed: 90
    },
    {
        date: '2024-01-28',
        opponent: 'Racing Club',
        competition: 'Liga Profesional',
        rating: 2.8,
        goals: 0,
        assists: 0,
        minutesPlayed: 90
    },
    {
        date: '2024-01-28',
        opponent: 'Racing Club',
        competition: 'Liga Profesional',
        rating: 3.3,
        goals: 0,
        assists: 0,
        minutesPlayed: 90
    },
    {
        date: '2024-01-28',
        opponent: 'Racing Club',
        competition: 'Liga Profesional',
        rating: 4.75,
        goals: 0,
        assists: 0,
        minutesPlayed: 90
    }
];

// Interfaz para los datos del backend
interface MatchRating {
  date: string;
  opponent: string;
  competition: string;
  rating: number;
  goals?: number;
  assists?: number;
  minutesPlayed?: number;
}

export default function RatingJugadorScreen() {
  const { id, nombre, equipoNombre } = useLocalSearchParams();
  const router = useRouter();
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [matchHistory, setMatchHistory] = useState<MatchRating[]>([]);

  const radarData = [
    { label: 'Ataque', value: 75 },
    { label: 'Defensa', value: 60 },
    { label: 'Físico', value: 85 },
    { label: 'Pases', value: 80 },
    { label: 'Técnica', value: 70 },
  ];

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        setLoading(true);
        const data = await getPlayerRatingsHistory(Number(id));
        setMatchHistory(data);
      } catch (error) {
        console.error("Error cargando datos del jugador:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPlayerData();
  }, [id]);

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return '#10b981';
    if (rating >= 3) return '#0bbbf5';
    if (rating >= 2.5) return '#f59e0b';
    return '#e80f0f';
  };

  const getRatingLabel = (rating: number) => {
    if (rating >= 4.5) return 'Excelente';
    if (rating >= 3) return 'Bueno';
    if (rating >= 2.5) return 'Regular';
    return 'Bajo';
  };

  if (loading) return <LoaderBall message="Cargando estadísticas..." fullScreen />;

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: "Detalle de Rendimiento",
          headerShown: true,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} hitSlop={10} style={{ marginLeft: 15 }}>
              <Text style={{ color: '#3b82f6', fontWeight: 'bold' }}>← Volver</Text>
            </Pressable>
          ),
        }}
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.playerInfo}>
            <Text style={styles.playerName}>{nombre}</Text>
            <Text style={styles.position}>{equipoNombre}</Text>
          </View>
        </View>

        

        <View style={styles.calendarSection}>
          <View style={styles.calendarHeader}>
            <Text style={styles.sectionTitle}>Historial de Partidos</Text>
            <Text style={styles.matchCount}>{matchHistory.length} partidos</Text>
          </View>

          <View style={styles.matchList}>
            {matchHistory.map((match, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.matchCard,
                  selectedMatch === index && styles.matchCardSelected,
                ]}
                onPress={() => setSelectedMatch(selectedMatch === index ? null : index)}
                activeOpacity={0.7}
              >
                <View style={styles.matchHeader}>
                  <Text style={styles.matchDate}>{new Date(match.date).toLocaleDateString()}</Text>
                  <View style={styles.competitionBadge}>
                    <Text style={styles.competitionText}>{match.competition}</Text>
                  </View>
                </View>

                <View style={styles.matchMain}>
                  <View style={styles.opponentContainer}>
                    <Text style={styles.vsText}>vs</Text>
                    <Text style={styles.opponentName}>{match.opponent}</Text>
                  </View>

                  <View style={[
                    styles.ratingBadge,
                    { backgroundColor: getRatingColor(match.rating) }
                  ]}>
                    <Text style={styles.ratingNumber}>{match.rating.toFixed(1)}</Text>
                    <Text style={styles.ratingLabel}>{getRatingLabel(match.rating)}</Text>
                  </View>
                </View>

                {selectedMatch === index && (
                  <View style={styles.matchDetails}>
                    <View style={styles.detailsGrid}>
                      <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Goles</Text>
                        <Text style={styles.statValue}>{match.goals || 0}</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Asistencias</Text>
                        <Text style={styles.statValue}>{match.assists || 0}</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Minutos</Text>
                        <Text style={styles.statValue}>{match.minutesPlayed || '--'}'</Text>
                      </View>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1e293b',
    borderBottomWidth: 2,
    borderBottomColor: '#334155',
  },
  
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f1f5f9',
    marginBottom: 4,
  },
  position: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '600',
  },
  averageRatingContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  averageLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginBottom: 4,
    fontWeight: '600',
  },
  averageRating: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  radarSection: {
    padding: 6,
    backgroundColor: '#1e293b',
    paddingTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f1f5f9',
    marginBottom: 20,
  },
  radarWrapper: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  calendarSection: {
    padding: 20,
    marginTop: 2,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  matchCount: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  matchList: {
    gap: 12,
  },
  matchCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#334155',
  },
  matchCardSelected: {
    borderColor: '#3b82f6',
    backgroundColor: '#1e3a5f',
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  matchDate: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '600',
  },
  competitionBadge: {
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  competitionText: {
    fontSize: 11,
    color: '#cbd5e1',
    fontWeight: '700',
  },
  matchMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  opponentContainer: {
    flex: 1,
  },
  vsText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 4,
  },
  opponentName: {
    fontSize: 18,
    color: '#f1f5f9',
    fontWeight: 'bold',
  },
  ratingBadge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 80,
  },
  ratingNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  ratingLabel: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
    opacity: 0.9,
  },
  matchDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 20,
    color: '#3b82f6',
    fontWeight: 'bold',
  },
});