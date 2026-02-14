import { View, Text, StyleSheet, ScrollView, Pressable, Image, Animated } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { EquipoInfo, MatchRow, PlayerWithRating } from "@/apiConnections/types";
import { obtenerEquipoInfo } from "@/apiConnections/info";
import LoaderBall from "@/components/animations/animacionCarga";
import EquipoInfoGeneral from "@/components/componentesDeApp/equipoInfoGeneral";
import { getPlayerRatingsByClub } from "@/apiConnections/ratings";
import PlantelConRatings from "@/components/componentesDeApp/detallesEquipo/plantelPromedioRatings";
import HistorialPartidos from "@/components/componentesDeApp/detallesEquipo/historialPartidos";
import { getMatchesByTeam } from "@/apiConnections/matches";

type TabType = "plantel" | "historial";

export default function EquipoDetalle() {
  const { nombre } = useLocalSearchParams();
  const router = useRouter();
  const [jugadores, setJugadores] = useState<PlayerWithRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [equipoInfo, setEquipoInfo] = useState<EquipoInfo | null>(null);
  const [partidosReal, setPartidosReal] = useState<MatchRow[]>([]);
  const [tabActiva, setTabActiva] = useState<TabType>("plantel");
  
  // Animaciones
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let isMounted = true;
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Ejecutamos las 3 llamadas en paralelo
        const [info, players, matches] = await Promise.all([
          obtenerEquipoInfo(nombre as string),
          getPlayerRatingsByClub(nombre as string),
          getMatchesByTeam(nombre as string) // Nueva llamada
        ]);

        if (!isMounted) return;

        setEquipoInfo(info);
        setJugadores(players);
        setPartidosReal(matches); // Guardamos los partidos reales
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

  const cambiarTab = (nuevaTab: TabType) => {
    if (nuevaTab === tabActiva) return;

    // Fade out del contenido actual
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setTabActiva(nuevaTab);
      
      // Slide del indicador
      Animated.spring(slideAnim, {
        toValue: nuevaTab === "plantel" ? 0 : 1,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();

      // Fade in del nuevo contenido
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };
  
  if (loading) {
    return (
      <LoaderBall
        message="Cargando información del equipo..." 
        fullScreen
      />
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

        <EquipoInfoGeneral info={equipoInfo} />

        {/* Sistema de Tabs con indicador animado */}
        <View style={styles.tabsWrapper}>
          <View style={styles.tabsContainer}>
            <Pressable
              style={styles.tab}
              onPress={() => cambiarTab("plantel")}
            >
              <Text style={[styles.tabText, tabActiva === "plantel" && styles.tabTextActiva]}>
                Plantel
              </Text>
            </Pressable>
            <Pressable
              style={styles.tab}
              onPress={() => cambiarTab("historial")}
            >
              <Text style={[styles.tabText, tabActiva === "historial" && styles.tabTextActiva]}>
                Historial
              </Text>
            </Pressable>
          </View>
          
          {/* Indicador deslizante */}
          <Animated.View
            style={[
              styles.indicator,
              {
                transform: [
                  {
                    translateX: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 180], // Ajusta según el ancho de tus tabs
                    }),
                  },
                ],
              },
            ]}
          />
        </View>

        <Animated.View style={[styles.infoSection, { opacity: fadeAnim }]}>
          {tabActiva === "plantel" ? (
            <PlantelConRatings jugadores={jugadores} equipoNombre={equipoInfo.nombre} />
          ) : (
            <HistorialPartidos equipoNombre={equipoInfo.nombre} partidos={partidosReal} />
          )}
        </Animated.View>
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
  tabsWrapper: {
    marginBottom: 16,
    position: 'relative',
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#112336",
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: "#1E3A5F",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    zIndex: 1,
  },
  tabText: {
    color: "#94a3b8",
    fontSize: 15,
    fontWeight: "600",
  },
  tabTextActiva: {
    color: "#fff",
  },
  indicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: '48%',
    height: 44,
    backgroundColor: "#2b71c2ff",
    borderRadius: 8,
    zIndex: 0,
  },
  infoSection: {
    marginBottom: 24,
  },
  errorText: {
    color: "#f87171",
    fontSize: 16,
    textAlign: "center",
  },
});