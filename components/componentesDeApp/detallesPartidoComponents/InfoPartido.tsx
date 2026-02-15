import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { getMatchEvents } from "@/apiConnections/matches";

interface MatchEvent {
  id: number;
  type: string;
  minute: number;
  clock_display: string;
  player_name: string;
  team_name: string;
  description: string;
}

const getEventConfig = (type: string) => {
  switch (type) {
    case 'yellow-card': 
      return { icon: "square" as const, color: "#fbbf24", label: "Amarilla" };
    case 'red-card': 
      return { icon: "square" as const, color: "#ef4444", label: "Roja" };
    case 'goal': 
    case 'penalty-goal': 
      return { icon: "football" as const, color: "#10b981", label: "Gol" };
    case 'own-goal': 
      return { icon: "football" as const, color: "#ef4444", label: "Gol en contra" };
    case 'substitution': 
      return { icon: "swap-horizontal" as const, color: "#94a3b8", label: "Cambio" };
    default: 
      return { icon: "ellipse" as const, color: "#64748b", label: "Evento" };
  }
};

// Componente de Fila de Estadística
const StatRow = ({ label, homeValue, awayValue }: { label: string, homeValue: string | number, awayValue: string | number }) => (
  <View style={styles.statRowContainer}>
    <Text style={styles.statTeamValue}>{homeValue}</Text>
    <Text style={styles.statLabelCenter}>{label}</Text>
    <Text style={styles.statTeamValue}>{awayValue}</Text>
  </View>
);

export default function InfoPartido() {
  const { partido } = useLocalSearchParams();
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Variables para extraer la info del partido
  const [homeTeam, setHomeTeam] = useState("Local");
  const [awayTeam, setAwayTeam] = useState("Visita");
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (partido) {
          let matchId: string | number;
          try {
            const partidoObj = JSON.parse(partido as string);
            matchId = partidoObj.id; 
            
            // Extraemos los datos reales del partido para la cabecera
            if (partidoObj.home_team) setHomeTeam(partidoObj.home_team);
            if (partidoObj.away_team) setAwayTeam(partidoObj.away_team);
            if (partidoObj.score_home !== undefined) setHomeScore(partidoObj.score_home);
            if (partidoObj.score_away !== undefined) setAwayScore(partidoObj.score_away);

          } catch (e) {
            matchId = partido as string;
          }
          if (matchId) {
            const data = await getMatchEvents(matchId.toString());
            setEvents(data);
          }
        }
      } catch (error) {
        console.error("Error en fetchEvents:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [partido]);

  if (loading) {
    return <ActivityIndicator color="#3b82f6" style={{ marginTop: 20 }} />;
  }

  // --- CÁLCULO DE ESTADÍSTICAS REALES ---
  // Filtramos el arreglo events comparando el nombre del equipo con el nombre que vino del parámetro
  const homeYellows = events.filter(e => e.type === 'yellow-card' && e.team_name === homeTeam).length;
  const awayYellows = events.filter(e => e.type === 'yellow-card' && e.team_name === awayTeam).length;

  const homeReds = events.filter(e => e.type === 'red-card' && e.team_name === homeTeam).length;
  const awayReds = events.filter(e => e.type === 'red-card' && e.team_name === awayTeam).length;

  const homeSubs = events.filter(e => e.type === 'substitution' && e.team_name === homeTeam).length;
  const awaySubs = events.filter(e => e.type === 'substitution' && e.team_name === awayTeam).length;


  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* --- SECCIÓN DE ESTADÍSTICAS COMPARATIVAS --- */}
      <View style={styles.statsCard}>
        <Text style={styles.cardTitle}>Estadísticas</Text>
        
        {/* Cabecera con los nombres reales de los equipos */}
        <View style={styles.teamsHeader}>
          <Text style={styles.teamHeaderName} numberOfLines={1}>{homeTeam}</Text>
          <Text style={styles.teamHeaderName} numberOfLines={1}>{awayTeam}</Text>
        </View>

        {/* Filas con datos reales calculados en el momento */}
        <StatRow label="Tarjetas Amarillas" homeValue={homeYellows} awayValue={awayYellows} />
        <StatRow label="Tarjetas Rojas" homeValue={homeReds} awayValue={awayReds} />
        <StatRow label="Cambios Realizados" homeValue={homeSubs} awayValue={awaySubs} />
      </View>

      {/* --- CRONOLOGÍA --- */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Cronología</Text>
        
        {events.length > 0 ? (
          events.sort((a, b) => a.minute - b.minute).map((event) => {
            const config = getEventConfig(event.type);
            const isSub = event.type === 'substitution';

            return (
              <View key={event.id} style={styles.eventItem}>
                <Text style={styles.eventMinute}>{event.clock_display}</Text>
                
                <View style={styles.iconCircle}>
                  <Ionicons name={config.icon} size={18} color={config.color} />
                </View>
                
                <View style={styles.eventTextContainer}>
                  <Text style={styles.playerName}>
                    {event.player_name} {event.type === 'own-goal' && <Text style={{fontSize: 12, color: config.color}}>({config.label})</Text>}
                  </Text>
                  
                  {(isSub && event.description) ? (
                     <Text style={styles.eventDescription}>{event.description}</Text>
                  ) : (
                     <Text style={styles.teamName}>{event.team_name}</Text>
                  )}
                </View>
              </View>
            );
          })
        ) : (
          <Text style={styles.emptyText}>-</Text>
        )}
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  
  statsCard: { backgroundColor: "#162236", borderRadius: 20, padding: 20, marginBottom: 16 },
  teamsHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  
  // Limité el ancho del texto a 40% para que si el equipo se llama "Estudiantes de Río Cuarto" no rompa el diseño
  teamHeaderName: { color: "#3b82f6", fontSize: 13, fontWeight: "bold", textTransform: "uppercase", width: '40%', textAlign: 'center' },
  
  statRowContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#1e293b" },
  statTeamValue: { color: "#f1f5f9", fontSize: 18, fontWeight: "bold", width: 40, textAlign: "center" },
  statLabelCenter: { color: "#94a3b8", fontSize: 13, flex: 1, textAlign: "center" },
  
  card: { backgroundColor: "#162236", borderRadius: 20, padding: 20 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#f1f5f9", marginBottom: 20 },
  eventItem: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  eventMinute: { width: 45, color: "#3b82f6", fontWeight: "bold", fontSize: 14 },
  iconCircle: { width: 30, alignItems: "center", justifyContent: "center" },
  eventTextContainer: { flex: 1, marginLeft: 10 },
  playerName: { color: "#f1f5f9", fontSize: 15, fontWeight: "500" },
  teamName: { color: "#64748b", fontSize: 13, marginTop: 2 },
  eventDescription: { color: "#94a3b8", fontSize: 12, marginTop: 2, fontStyle: "italic" },
  emptyText: { color: "#64748b", textAlign: "center", paddingVertical: 20 }
});