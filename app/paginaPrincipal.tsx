import React from "react";
import { View, Text, StyleSheet, SectionList } from "react-native";
import { useLocalSearchParams } from "expo-router";

import PartidoCard, { PartidoData } from "@/components/partido";
import { obtenerJugadores } from "@/components/info";
import PlayerItem from "@/components/equipoCard";



export default function PaginaPrincipal() {
  const { partido } = useLocalSearchParams();
  const partidoData: PartidoData | null = partido ? JSON.parse(partido as string) : null;

  if (!partidoData) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>No se recibieron datos del partido.</Text>
      </View>
    );
  }

  const sections = [
    {
      title: `Jugadores — ${partidoData.equipoLocal}`,
      teamName: partidoData.equipoLocal,
      data: obtenerJugadores(partidoData.equipoLocal),
    },
    {
      title: `Jugadores — ${partidoData.equipoVisitante}`,
      teamName: partidoData.equipoVisitante,
      data: obtenerJugadores(partidoData.equipoVisitante),
    },
  ];

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item, index) => `${item}-${index}`}
      style={styles.list}
      ListHeaderComponent={<PartidoCard data={partidoData} />}
      renderSectionHeader={({ section }) => (
        <Text style={styles.sectionTitle}>{section.title}</Text>
      )}
      renderItem={({ item }) => (
        <PlayerItem name={item} />
      )}
      contentContainerStyle={styles.content}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#0b1220", flexGrow: 1 },
  list: { backgroundColor: "#0b1220" },
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
