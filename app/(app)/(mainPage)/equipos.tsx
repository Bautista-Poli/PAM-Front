// app/equipos.tsx
import { View, Text, StyleSheet, Pressable, Image, FlatList, ActivityIndicator } from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from 'react';
import { getEquipos } from "@/components/apiConnections/info";
import { Club } from "@/components/apiConnections/types";

export default function Equipos() {
  const router = useRouter();

  const { leagueKey } = useLocalSearchParams<{ leagueKey?: string }>();

  const [equipos, setEquipos] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarEquipos = async () => {
      try {
        setLoading(true);
        const data = await getEquipos(leagueKey);
        setEquipos(data);
      } catch (e: any) {
        setError(e.message ?? "Error al cargar equipos");
      } finally {
        setLoading(false);
      }
    };

    cargarEquipos();
  }, [leagueKey]);

  const renderEquipo = ({ item }: { item: Club }) => (
    <Pressable
      style={styles.equipoCard}
      onPress={() => router.push({ pathname: '/equipo', params: { nombre: item.nombre }})}
    >
      <View style={styles.escudoContainer}>
        <Image source={{ uri: item.crest_url }} style={styles.escudo} resizeMode="contain" />
      </View>
      <Text style={styles.equipoNombre} numberOfLines={2}>{item.nombre}</Text>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.center}><ActivityIndicator size="large" color="#fff" /></View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}><Text style={styles.errorText}>Error: {error}</Text></View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Equipos",
          headerShown: true,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <Text style={styles.btnVolver}>← Volver</Text>
            </Pressable>
          ),
        }}
      />
      <Text style={styles.titulo}>EQUIPOS</Text>
      <Text style={styles.subtitle}>Pulsar en el equipo para ver su info detallada</Text>
      <FlatList
        data={equipos}
        renderItem={renderEquipo}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.errorText}>No se encontraron equipos.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D1B2A" },
  btnVolver: { color: "#93c5fd", fontWeight: "600", fontSize: 15, marginLeft: 8 },
  subtitle: { color: "#94a3b8", fontSize: 14, textAlign: "center", paddingHorizontal: 20, paddingVertical: 16 },
  gridContainer: { padding: 12 },
  row: { justifyContent: "space-between", marginBottom: 12 },
  equipoCard: { flex: 1, backgroundColor: "#112336", borderRadius: 12, padding: 16, marginHorizontal: 6, alignItems: "center", borderWidth: 1, borderColor: "#1E3A5F", maxWidth: "31%" },
  escudoContainer: { width: "100%", aspectRatio: 1, marginBottom: 8, justifyContent: "center", alignItems: "center" },
  escudo: { width: "80%", height: "80%" },
  equipoNombre: { color: "#fff", fontSize: 12, fontWeight: "600", textAlign: "center", lineHeight: 14 },
  titulo: { color: "#fff", fontSize: 28, fontWeight: "700", textAlign: "center", marginTop: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#0D1B2A", padding: 20 },
  errorText: { fontSize: 16, color: '#ff6b6b', textAlign: 'center' },
});