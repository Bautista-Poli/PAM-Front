import { View, Text, StyleSheet, ScrollView, Pressable, Image, ActivityIndicator } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { obtenerJugadores } from "@/components/apiConnections/info";
import { Player } from "@/components/apiConnections/types";

type EquipoInfo = {
  nombre: string;
  ciudad: string;
  estadio: string;
  capacidad: string;
  fundacion: string;
  titulos: number;
  apodo: string;
  colores: string;
  entrenador: string;
  escudo: string;
};

// Base de datos de equipos
const equiposInfo: { [key: string]: EquipoInfo } = {
  "Vélez Sarsfield": {
    nombre: "Vélez Sarsfield",
    ciudad: "Buenos Aires",
    estadio: "José Amalfitani",
    capacidad: "49.540",
    fundacion: "1910",
    titulos: 19,
    apodo: "El Fortín",
    colores: "Blanco y Azul",
    entrenador: "Guillermo Barros Schelotto",
    escudo: "https://paladarnegro.net/escudoteca/argentina/primeradivision/png/velez.png"
  },
  
}


export default function EquipoDetalle() {
  const { nombre } = useLocalSearchParams();
  const router = useRouter();
  const [jugadores, setJugadores] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const equipoInfo = equiposInfo[nombre as string];

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const players = await obtenerJugadores(nombre as string);

        if (!isMounted) return;
        setJugadores(players);

      } catch (e: any) {
        if (isMounted) setError(e?.message ?? 'Error al cargar jugadores');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, [nombre]);

  if (!equipoInfo) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: "Equipo",
            headerShown: true,
            headerLeft: () => (
              <Pressable onPress={() => router.back()} hitSlop={8}>
                <Text style={styles.btnVolver}>← Volver</Text>
              </Pressable>
            ),
          }}
        />
        <Text style={styles.errorText}>Información no disponible</Text>
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
          <Text style={styles.apodo}>{equipoInfo.apodo}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{equipoInfo.titulos}</Text>
            <Text style={styles.statLabel}>Títulos</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{equipoInfo.fundacion}</Text>
            <Text style={styles.statLabel}>Fundación</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Información General</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>🏟️  Estadio</Text>
              <Text style={styles.infoValue}>{equipoInfo.estadio}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>👥  Capacidad</Text>
              <Text style={styles.infoValue}>{equipoInfo.capacidad}</Text>
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
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#93c5fd" />
              <Text style={styles.loadingText}>Cargando jugadores...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorMessage}>Error: {error}</Text>
            </View>
          ) : jugadores.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No hay jugadores cargados en la base de datos para este equipo.
              </Text>
            </View>
          ) : (
            <View style={styles.playersCard}>
              {jugadores.map((jugador, index) => (
                <View key={jugador.id}>
                  <View style={styles.playerRow}>
                    <Text style={styles.playerBullet}>•</Text>
                    <Text style={styles.playerName}>{jugador.full_name}</Text>
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
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  teamName: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  apodo: {
    color: "#94a3b8",
    fontSize: 16,
    fontStyle: "italic",
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
    alignItems: "center",
    paddingVertical: 10,
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
  playerDivider: {
    height: 1,
    backgroundColor: "#1E3A5F",
    marginLeft: 24,
  },
  loadingContainer: {
    backgroundColor: "#112336",
    borderRadius: 12,
    padding: 32,
    borderWidth: 1,
    borderColor: "#1E3A5F",
    alignItems: "center",
  },
  loadingText: {
    color: "#94a3b8",
    marginTop: 12,
    fontSize: 14,
  },
  errorContainer: {
    backgroundColor: "#112336",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1E3A5F",
  },
  errorMessage: {
    color: "#f87171",
    fontSize: 14,
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
  errorText: {
    color: "#e5e7eb",
    fontSize: 16,
    textAlign: "center",
    marginTop: 32,
  },
});