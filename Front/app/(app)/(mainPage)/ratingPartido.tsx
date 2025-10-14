import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { obtenerJugadores } from '@/components/apiConnections/info';
import { MatchRow, Player } from '@/components/apiConnections/types';
import PlayersSectionList from '@/components/componentesDeApp/playerSelection';
import { StyleSheet } from "react-native";

type SectionJugadores = { title: string; teamName: string; data: Player[] };

export default function RatingPartido() {
  const { partido } = useLocalSearchParams();
  const router = useRouter();
  const partidoData: MatchRow | null = partido ? JSON.parse(partido as string) : null;

  const [sections, setSections] = useState<SectionJugadores[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  if (!partidoData) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>No se recibieron datos del partido.</Text>
      </View>
    );
  }

  const equipoLocal = partidoData.home_team ?? 'Local';
  const equipoVisitante = partidoData.away_team ?? 'Visitante';

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const [loc, vis] = await Promise.all([
          obtenerJugadores(equipoLocal),
          obtenerJugadores(equipoVisitante),
        ]);

        if (!isMounted) return;

        setSections([
          { title: `Jugadores — ${equipoLocal}`, teamName: equipoLocal, data: loc },
          { title: `Jugadores — ${equipoVisitante}`, teamName: equipoVisitante, data: vis },
        ]);

      } catch (e: any) {
        if (isMounted) setError(e?.message ?? 'Error al cargar jugadores');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  

  if (error) {
    return (
      <View style={styles.view}>
        <Stack.Screen
          options={{
            title: 'Partido',
            headerShown: true,
            headerLeft: () => (
              <Pressable onPress={() => router.back()} hitSlop={8}>
                <Text style={styles.btnVolver}>← Volver</Text>
              </Pressable>
            ),
          }}
        />
        <Text style={styles.message}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.view}>
      <Stack.Screen
        options={{
          title: 'Partido',
          headerShown: true,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <Text style={styles.btnVolver}>← Volver</Text>
            </Pressable>
          ),
        }}
      />

      <PlayersSectionList
        sections={sections}
        loading={loading}
        partidoData={partidoData}
        
      />
    </View>
  );
}



const styles = StyleSheet.create({
  view: { flex: 1, backgroundColor: "#0b1220" },
  message: { color: 'white', justifyContent: "center", fontSize: 50},
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