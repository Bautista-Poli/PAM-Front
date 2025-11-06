import { View, Text, StyleSheet, ScrollView, Pressable, Image, ActivityIndicator } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { obtenerEquipoInfo } from "@/components/apiConnections/info";
import { getPlayerRatingsByClub } from "@/components/apiConnections/apileagues";
import { PlayerWithRating, EquipoInfo } from "@/components/apiConnections/types";

export default function EquipoDetalle() {
  const { nombre } = useLocalSearchParams();
  const router = useRouter();

  const [jugadores, setJugadores] = useState<PlayerWithRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [equipoInfo, setEquipoInfo] = useState<EquipoInfo | null>(null);

  useEffect(() => {
    let isMounted = true;
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [info, players] = await Promise.all([
          obtenerEquipoInfo(nombre as string),
          getPlayerRatingsByClub(nombre as string)
        ]);

        if (!isMounted) return;

        setEquipoInfo(info);
        setJugadores(players);

      } catch (e: any) {
        if (isMounted) setError(e?.message ?? 'Error al cargar los datos');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    if (nombre) {
      cargarDatos();
    }
    
    return () => { isMounted = false; };
  }, [nombre]);

  
  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#93c5fd" />
        <Text style={styles.loadingText}>Cargando información del equipo...</Text>
      </View>
    );
  }

  if (error || !equipoInfo) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Stack.Screen options={{ title: "Error" }} />
        <Text style={styles.errorText}>{error || "Información del equipo no disponible."}</Text>
         <Pressable onPress={() => router.back()} hitSlop={8}>
            <Text style={[styles.btnVolver, {marginTop: 20}]}>← Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: equipoInfo.nombre,
          headerShown: true,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <Text style={styles.btnVolver}>← Volver</Text>
            </Pressable>
          ),
        }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Image
            source={{ uri: equipoInfo.escudo }}
            style={styles.escudo}
            resizeMode="contain"
          />
          <Text style={styles.teamName}>{equipoInfo.nombre}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{equipoInfo.titulosNacionales}</Text>
            <Text style={styles.statLabel}>Títulos Nacionales</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{equipoInfo.titulosInternacionales}</Text>
            <Text style={styles.statLabel}>Títulos Internac.</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Información General</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📅  Fundación</Text>
              <Text style={styles.infoValue}>{equipoInfo.añoFundacion}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>🏟️  Estadio</Text>
              <Text style={styles.infoValue}>{equipoInfo.nombreEstadio}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>👥  Capacidad</Text>
              <Text style={styles.infoValue}>{equipoInfo.capacidadEstadio}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📍  Ciudad</Text>
              <Text style={styles.infoValue}>{equipoInfo.ciudad}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>🎨  Colores</Text>
              <Text style={styles.infoValue}>{equipoInfo.colores}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>👔  Entrenador</Text>
              <Text style={styles.infoValue}>{equipoInfo.entrenador}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Plantel</Text>
          
          {jugadores.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay jugadores cargados en la base de datos para este equipo.</Text>
            </View>
          ) : (
            <View style={styles.playersCard}>
              {jugadores.map((jugador, index) => (
                <View key={jugador.id}>
                  <View style={styles.playerRow}>
                    <View style={styles.playerInfo}>
                      <Text style={styles.playerBullet}>•</Text>
                      <Text style={styles.playerName}>{jugador.full_name}</Text>
                    </View>
                    <View style={styles.ratingInfo}>
                      {jugador.totalVotes > 0 ? (
                        <>
                          <Text style={styles.ratingStars}>
                            {'★'.repeat(Math.round(jugador.averageRating))}
                            {'☆'.repeat(5 - Math.round(jugador.averageRating))}
                          </Text>
                          <Text style={styles.ratingNumber}>
                            {jugador.averageRating.toFixed(1)} ({jugador.totalVotes})
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
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: "#0D1B2A",
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  btnVolver: {
    color: "#93c5fd",
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 8,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
    paddingTop: 10,
  },
  escudo: {
    width: 150,
    height: 150,
  },
  teamName: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 32,
    gap: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#1E3A5F",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2A4A6F",
  },
  statNumber: {
    color: "#A9D6E5",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 4,
  },
  apodo: {  //me lo olvide de poner en la BD (rip)
    color: "#94a3b8",
    fontSize: 16,
    fontStyle: "italic",
  },
  statLabel: {
    color: "#cbd5e1",
    fontSize: 14,
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: "#112336",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1E3A5F",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoLabel: {
    color: "#94a3b8",
    fontSize: 15,
    flex: 1,
  },
  infoValue: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: "#1E3A5F",
  },
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
    fontSize: 14,
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
  loadingText: {
    color: "#94a3b8",
    marginTop: 12,
    fontSize: 14,
  },
  errorText: {
    color: "#f87171",
    fontSize: 16,
    textAlign: "center",
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