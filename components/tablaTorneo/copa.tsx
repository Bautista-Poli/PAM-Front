import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import LoaderBall from "@/components/animations/animacionCarga";
import BracketVisualizer from "@/components/tablaTorneo/bracket";
import { getTournamentMatches } from "@/apiConnections/matches";
import { transformTournamentData } from "@/helpers/utils/tournamentTransform";
import { TournamentData } from "@/components/tablaTorneo/types";
import { toBracketMatches } from "@/components/tablaTorneo/bracketHelper";
import { TabButton } from "@/components/tablaTorneo/tabButtom";
import { GrupoTable } from "@/components/tablaTorneo/groupTable";

export default function TorneoCopa() {
  const router = useRouter();
  const { torneoNombre } = useLocalSearchParams<{ torneoNombre: string  }>();

  const [tab, setTab] = useState<"grupos" | "eliminatorias">("grupos");
  const [tournamentData, setTournamentData] = useState<TournamentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log(torneoNombre)

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);
        const matches = await getTournamentMatches(torneoNombre);
        setTournamentData(transformTournamentData(torneoNombre, matches));
      } catch (e: any) {
        setError(e.message ?? "Error al cargar el torneo");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [torneoNombre]);

  const isLeagueFormat = useMemo(
    () => tournamentData?.groups.length === 1 && tournamentData.groups[0].name === "Fase de Liga",
    [tournamentData]
  );

  const bracketMatches = useMemo(
    () => tournamentData ? toBracketMatches(tournamentData.knockout_matches) : [],
    [tournamentData]
  );


  if (loading) return <LoaderBall message="Cargando información del torneo..." fullScreen />;

  if (error || !tournamentData) {
    return (
      <View style={styles.center}>
        <Text style={styles.statusText}>{error ?? "No se encontró información"}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: torneoNombre,
          headerShown: true,
          headerStyle: { backgroundColor: "#112336ff" },
          headerTintColor: "#fff",
          headerLeft: () => (
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <Text style={styles.btnVolver}>← Volver</Text>
            </Pressable>
          ),
        }}
      />

      <View style={styles.tabContainer}>
        <TabButton
          label={isLeagueFormat ? "Tabla de Liga" : "Fase de Grupos"}
          value="grupos"
          selected={tab === "grupos"}
          onPress={setTab}
        />
        <TabButton
          label="Eliminatorias"
          value="eliminatorias"
          selected={tab === "eliminatorias"}
          onPress={setTab}
        />
      </View>

      {tab === "grupos" ? (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {tournamentData.groups.map(group => (
            <GrupoTable
              key={group.name}
              group={group}
              isLeagueFormat={!!isLeagueFormat}
            />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.bracketWrapper}>
          {bracketMatches.length > 0 ? (
            <BracketVisualizer matches={bracketMatches} />
          ) : (
            <View style={styles.center}>
              <Text style={styles.statusText}>Las eliminatorias aún no han comenzado</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: "#112336ff" },
  center:       { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
  statusText:   { fontSize: 16, color: "#e9ebeeff", textAlign: "center" },
  btnVolver:    { color: "#A9D6E5", fontSize: 16, fontWeight: "600" },
  tabContainer: { flexDirection: "row", padding: 12, gap: 8 },
  scroll:       { flex: 1 },
  scrollContent:{ paddingBottom: 24 },
  bracketWrapper: { flex: 1 },
});