import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import Estadisticas from "@/components/componentesDeApp/estadisticas";
import { useEffect, useState } from "react";
import LoaderBall from "@/components/animations/animacionCarga";
import { getLeagueTableByName } from "@/apiConnections/clubs";
import { LeagueTableRow } from "@/apiConnections/types";

export default function Ligas() {
  const router = useRouter();
  const { torneoNombre } = useLocalSearchParams<{ torneoNombre: string }>();
  
  const [tableEntries,setTableEntries] = useState<LeagueTableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const cargar = async () => {
      try {
        setLoading(true);
        const entries = await getLeagueTableByName(torneoNombre as string);
        setTableEntries(entries.sort((a,b) => b.pts - a.pts));
      } catch (e: any) {
        setError(e.message ?? "Error al cargar la tabla");
      } finally {
        setLoading(false);
      }
    };

    cargar()

  },[torneoNombre]);


  if (loading) {
      return (
        <LoaderBall
          message="Cargando información del equipo..." fullScreen
        />
      );
  }
  
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.statusText}>Error: {error}</Text>
      </View>
    );
  }


  
  const totalGF = tableEntries.reduce((sum, t) => sum + t.gf, 0);
  const totalGC = tableEntries.reduce((sum, t) => sum + t.ga, 0);
  const totalPJ = tableEntries.reduce((sum, t) => sum + t.played, 0);

  const promGoles = ((totalGF + totalGC) / totalPJ).toFixed(2);
  const maxGF = tableEntries.reduce((max, t) => (t.gf > max.gf ? t : max), tableEntries[0]);
  const minGC = tableEntries.reduce((min, t) => (t.ga < min.ga ? t : min), tableEntries[0]);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: `Tabla ${torneoNombre}`,
          headerShown: true,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <Text style={styles.btnVolver}>← Volver</Text>
            </Pressable>
          ),
        }}
      />

      <FlatList
        data={tableEntries}
        keyExtractor={(item) => item.team}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => router.push({
              pathname: '/detallesEquipo',
              params: { nombre: item.team }
            })}
          >
            <View style={[styles.row, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
              <Text style={styles.pos}>{index + 1}</Text>
              <Text style={styles.nombre}>{item.team}</Text>
              <Text style={styles.stat}>{item.played}</Text>
              <Text style={styles.stat}>{item.gf}:{item.ga}</Text>
              <Text style={(item.gf - item.ga)>0 ? styles.positiveDiff : styles.negativeDiff}>{(item.gf - item.ga)>0 ? '+'+(item.gf - item.ga) : (item.gf - item.ga)}</Text>
              <Text style={styles.puntos}>{item.pts}</Text>
            </View>
          </Pressable>
        )}
        ListHeaderComponent={
          <View style={[styles.row, styles.header]}>
            <Text style={styles.pos}>#</Text>
            <Text style={styles.nombre}>Equipo</Text>
            <Text style={styles.stat}>PJ</Text>
            <Text style={styles.stat}>Gol</Text>
            <Text style={styles.stat}>DG</Text>
            <Text style={styles.puntos}>Pts</Text>
          </View>
        }
        ListFooterComponent={<Estadisticas promGoles={promGoles} maxGF={{nombre:maxGF.team,gf:maxGF.gf}} minGC={{nombre:minGC.team,gc:minGC.ga}}/>}
      />

      <Pressable
        style={styles.btnEquipos}
        onPress={() => router.push({
          pathname: '/equipos',
          params: { leagueKey: torneoNombre }
        })}
      >
        <Text style={styles.btnEquiposText}>Ver todos los equipos</Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#0D1B2A" },
    btnVolver: { color: "#93c5fd", fontWeight: "600", fontSize: 15, marginLeft: 8 },
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#1E3A5F",
    },
    header: { backgroundColor: "#1E6091", borderRadius: 4 },
    pos: { width: 24, color: "#fff", textAlign: "center" },
    nombre: { flex: 1, color: "#fff", marginLeft: 4 },
    stat: { width: 40, textAlign: "center", color: "#cbd5e1" },
    puntos: { width: 50, textAlign: "center", fontWeight: "700", color: "#A9D6E5" },

    rowEven: { backgroundColor: "#0D1B2A" },
    rowOdd:  { backgroundColor: "#112336" },

    footer: { marginTop: 20, padding: 16, backgroundColor: "#112336", borderRadius: 8 },
    footerTitle: { color: "#fff", fontWeight: "500", marginBottom: 8, fontSize: 16 },
    footerText: { color: "#cbd5e1", marginBottom: 4 },
    btnEquipos: {
      backgroundColor: "#1e6091",
      marginTop: 8,
      marginHorizontal: 22,
      marginBottom: 8,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
      shadowColor: "#1e6091",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
  },
  btnEquiposText: {
    color: "#f7f7f7ff",
    fontSize: 15,
    fontWeight: "400",
  },
  statusText: {
    fontSize: 16,
    color: '#555',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  positiveDiff: {
    width: 40,
    textAlign: "center",
    color: "#3ac921ff"
  },
  negativeDiff: {
    width: 40,
    textAlign: "center",
    color: "#c31414ff"
  }
});