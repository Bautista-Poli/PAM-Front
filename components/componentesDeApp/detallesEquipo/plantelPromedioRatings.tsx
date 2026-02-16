import { View, Text, StyleSheet, Pressable } from "react-native";
import { PlayerWithRating } from "@/apiConnections/types";
import { useRouter } from "expo-router";

interface PlantelConRatingsProps {
  jugadores: PlayerWithRating[],
  equipoNombre: string
}

export default function PlantelConRatings({ jugadores, equipoNombre }: PlantelConRatingsProps) {
  const router = useRouter();
  const navegarARating = (jugadorId: number, nombreCompleto: string) => {
    router.push({
      pathname: "/ratingJugador",
      params: {
        id: jugadorId,
        nombre: nombreCompleto,
        equipoNombre : equipoNombre
      }
    });
  };

  if (jugadores.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No hay jugadores cargados en la base de datos para este equipo.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.playersCard}>
      {jugadores.map((jugador, index) => (
        <View key={jugador.id}>
          <View style={styles.playerRow}>
            <Pressable
              onPress={() => navegarARating(jugador.id, jugador.full_name)}
              style={({ pressed }) => [
                styles.playerInfo,
                {
                  opacity: pressed ? 0.6 : 1,
                  backgroundColor: pressed ? "#1E3A5F50" : "transparent"
                }
              ]}
            >
              <Text style={styles.playerBullet}>•</Text>
              <Text style={styles.playerName}>{jugador.full_name}</Text>
            </Pressable>
            <View style={styles.ratingInfo}>
              {jugador.totalVotes > 0 ? (
                <>
                  <Text style={styles.ratingStars}>
                    {'★'.repeat(Math.round(jugador.averageRating))}
                    {'☆'.repeat(5 - Math.round(jugador.averageRating))}
                  </Text>
                  <Text style={styles.ratingNumber}>
                    {jugador.averageRating.toFixed(2)} ({jugador.totalVotes})
                  </Text>
                </>
              ) : (
                <Text style={styles.noRating}>Sin evaluaciones</Text>
              )}
            </View>
          </View>
          {index < jugadores.length - 1 && <View style={styles.playerDivider} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  playersCard: {
    backgroundColor: "#112336",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1E3A5F",
  },
  playerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  playerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  playerBullet: {
    color: "#2b71c2ff",
    fontSize: 18,
    marginRight: 12,
    fontWeight: "700",
  },
  playerName: {
    color: "#e5e7eb",
    fontSize: 15,
    flex: 1,
  },
  ratingInfo: {
    alignItems: "flex-end",
  },
  ratingStars: {
    color: "#facc15",
    fontSize: 16,
    marginBottom: 2,
  },
  ratingNumber: {
    color: "#94a3b8",
    fontSize: 12,
  },
  noRating: {
    color: "#64748b",
    fontSize: 12,
    fontStyle: "italic",
  },
  playerDivider: {
    height: 1,
    backgroundColor: "#1E3A5F",
    marginLeft: 24,
  },
  emptyContainer: {
    backgroundColor: "#112336",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1E3A5F",
  },
  emptyText: {
    color: "#9ca3af",
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
  },
});