import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import Estadisticas from "@/components/componentesDeApp/estadisticas";
import { LIGAS_DATA, getLigaByKey, getLigaByName, EquipoTabla } from "@/constants/ligasData";

export default function Ligas() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  let ligaActual = LIGAS_DATA[0];  //por defecto Liga Argentina
  
  if (params.leagueKey) {
    ligaActual = getLigaByKey(params.leagueKey as string) || LIGAS_DATA[0];
  } else if (params.ligaNombre) {
    ligaActual = getLigaByName(params.ligaNombre as string) || LIGAS_DATA[0];
  }

  const tabla = ligaActual.tabla;

  const totalGF = tabla.reduce((sum, t) => sum + t.gf, 0);
  const totalGC = tabla.reduce((sum, t) => sum + t.gc, 0);
  const totalPJ = tabla.reduce((sum, t) => sum + t.pj, 0);

  const promGoles = ((totalGF + totalGC) / totalPJ).toFixed(2);
  const maxGF = tabla.reduce((max, t) => (t.gf > max.gf ? t : max), tabla[0]);
  const minGC = tabla.reduce((min, t) => (t.gc < min.gc ? t : min), tabla[0]);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: `Tabla ${ligaActual.nombre}`,
          headerShown: true,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <Text style={styles.btnVolver}>← Volver</Text>
            </Pressable>
          ),
        }}
      />

      <FlatList
        data={tabla}
        keyExtractor={(item) => item.nombre}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => router.push({
              pathname: '/equipo',
              params: { nombre: item.nombre }
            })}
          >
            <View style={[styles.row, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
              <Text style={styles.pos}>{index + 1}</Text>
              <Text style={styles.nombre}>{item.nombre}</Text>
              <Text style={styles.stat}>{item.pj}</Text>
              <Text style={styles.stat}>{item.gf}:{item.gc}</Text>
              <Text style={styles.stat}>{item.dg}</Text>
              <Text style={styles.puntos}>{item.puntos}</Text>
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
        ListFooterComponent={<Estadisticas promGoles={promGoles} maxGF={maxGF} minGC={minGC}/>}
      />

      <Pressable
        style={styles.btnEquipos}
        onPress={() => router.push({
          pathname: '/equipos',
          params: { leagueKey: ligaActual.key }
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
});