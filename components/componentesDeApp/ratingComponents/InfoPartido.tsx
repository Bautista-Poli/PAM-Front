import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { getMatchEvents } from "../../apiConnections/apileagues";

interface MatchEvent {
  id: number;
  type: string;
  minute: number;
  clock_display: string;
  player_name: string;
  team_name: string;
  description: string;
}

export default function InfoPartido() {
  const { partido } = useLocalSearchParams(); // Obtenemos el ID del partido de la URL
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (partido) {
          let matchId: string | number;
          try {
            const partidoObj = JSON.parse(partido as string);
            matchId = partidoObj.id; 
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

  const yellows = events.filter(e => e.type === 'yellow-card').length;
  const reds = events.filter(e => e.type === 'red-card').length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      <View style={styles.statsRow}>
        <View style={[styles.statBox, { borderColor: "#fbbf2440" }]}>
          <Ionicons name="square" size={14} color="#fbbf24" />
          <Text style={[styles.statValue, { color: "#fbbf24" }]}>{yellows}</Text>
          <Text style={styles.statLabel}>Amarillas</Text>
        </View>
        <View style={[styles.statBox, { borderColor: "#ef444440" }]}>
          <Ionicons name="square" size={14} color="#ef4444" />
          <Text style={[styles.statValue, { color: "#ef4444" }]}>{reds}</Text>
          <Text style={styles.statLabel}>Rojas</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Cronología del Partido</Text>
        
        {events.length > 0 ? (
          events.sort((a, b) => a.minute - b.minute).map((event) => (
            <View key={event.id} style={styles.eventItem}>
              <Text style={styles.eventMinute}>{event.clock_display}</Text>
              <View style={styles.iconCircle}>
                <Ionicons 
                  name="square" 
                  size={14} 
                  color={event.type === 'yellow-card' ? "#fbbf24" : "#ef4444"} 
                />
              </View>
              <View style={styles.eventTextContainer}>
                <Text style={styles.playerName}>{event.player_name}</Text>
                <Text style={styles.teamName}>{event.team_name}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No se registraron incidencias en este partido.</Text>
        )}
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  statBox: { 
    flex: 1, 
    backgroundColor: "#162236", 
    padding: 16, 
    borderRadius: 16, 
    alignItems: "center",
    borderWidth: 1
  },
  statValue: { fontSize: 24, fontWeight: "bold", marginVertical: 4 },
  statLabel: { fontSize: 11, color: "#94a3b8", textTransform: "uppercase" },
  
  card: { backgroundColor: "#162236", borderRadius: 20, padding: 20 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#f1f5f9", marginBottom: 20 },
  
  eventItem: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  eventMinute: { width: 40, color: "#3b82f6", fontWeight: "bold", fontSize: 14 },
  iconCircle: { width: 30, alignItems: "center" },
  eventTextContainer: { flex: 1, marginLeft: 10 },
  playerName: { color: "#f1f5f9", fontSize: 15, fontWeight: "500" },
  teamName: { color: "#64748b", fontSize: 12, marginTop: 2 },
  emptyText: { color: "#64748b", textAlign: "center", paddingVertical: 20 }
});