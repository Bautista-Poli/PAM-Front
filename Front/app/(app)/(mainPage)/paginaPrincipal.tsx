import React from "react";
import { View, Text, StyleSheet, SectionList, Pressable } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import PartidoCard from "@/components/partido";
import { obtenerJugadores } from "@/components/info";
import PlayerItem from "@/components/equipoCard";
import { MatchRow } from "@/components/apiConnections/types";
export default function PaginaPrincipal() {
  const { partido } = useLocalSearchParams();
  const router = useRouter();
  const partidoData: MatchRow | null = partido ? JSON.parse(partido as string) : null;

  if (!partidoData) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>No se recibieron datos del partido.</Text>
      </View>
    );
  }

  const equipoLocal = partidoData.home_team ?? 'Local';
  const equipoVisitante = partidoData.away_team ?? 'Visitante';

  const sections = [
    {
      title: `Jugadores — ${equipoLocal}`,
      teamName: equipoLocal,
      data: obtenerJugadores(equipoLocal),
    },
    {
      title: `Jugadores — ${equipoVisitante}`,
      teamName: equipoVisitante,
      data: obtenerJugadores(equipoVisitante),
    },
  ];

  return (
    <View style={styles.view}>
      <Stack.Screen
        options={{
          title: "Partido",
          headerShown: true,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <Text style={styles.btnVolver}>← Volver</Text>
            </Pressable>
          ),
        }}
      />

      <SectionList
        sections={sections}
        keyExtractor={(item, index) => `${item}-${index}`}
        style={styles.list}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        ListHeaderComponent={<PartidoCard data={partidoData} />}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionTitle}>{section.title}</Text>
        )}
        renderItem={({ item }) => <PlayerItem name={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  view: { flex: 1, backgroundColor: "#0b1220" },
  container: { flex: 1, padding: 16, backgroundColor: "#0b1220", justifyContent: "center" },
  btnVolver: { color: "#93c5fd", fontWeight: "600", fontSize: 15 },
  list: { backgroundColor: "transparent" },
  content: { padding: 16, paddingBottom: 40 },
  empty: { color: "#e5e7eb", textAlign: "center", marginTop: 32 },
  sectionTitle: {
    color: "#cbd5e1",
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
    fontSize: 16,
  },
});