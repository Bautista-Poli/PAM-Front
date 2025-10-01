import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { Stack, useRouter } from "expo-router";
import Estadisticas from "@/components/estadisticas";


type EquipoTabla = {
  nombre: string;
  puntos: number;
  pj: number;
  gf: number;
  gc: number;
  dg: number;
};

const tabla: EquipoTabla[] = [
  { nombre: "Vélez Sarsfield", puntos: 51, pj: 27, gf: 38, gc: 16, dg: 22 },
  { nombre: "Talleres", puntos: 48, pj: 27, gf: 34, gc: 27, dg: 7 },
  { nombre: "Racing Club", puntos: 46, pj: 27, gf: 42, gc: 30, dg: 12 },
  { nombre: "Huracán", puntos: 46, pj: 27, gf: 28, gc: 18, dg: 10 },
  { nombre: "River Plate", puntos: 43, pj: 27, gf: 38, gc: 21, dg: 17 },
  { nombre: "Boca Juniors", puntos: 42, pj: 27, gf: 30, gc: 23, dg: 7 },
  { nombre: "Independiente", puntos: 40, pj: 27, gf: 25, gc: 17, dg: 8 },
  { nombre: "Atlético Tucumán", puntos: 40, pj: 27, gf: 28, gc: 27, dg: 1 },
  { nombre: "Unión", puntos: 40, pj: 27, gf: 27, gc: 26, dg: 1 },
  { nombre: "Platense", puntos: 39, pj: 27, gf: 20, gc: 18, dg: 2 },
  { nombre: "Independiente Rivadavia", puntos: 38, pj: 27, gf: 23, gc: 25, dg: -2 },
  { nombre: "Estudiantes (LP)", puntos: 36, pj: 27, gf: 36, gc: 34, dg: 2 },
  { nombre: "Instituto", puntos: 36, pj: 27, gf: 32, gc: 31, dg: 1 },
  { nombre: "Lanús", puntos: 36, pj: 27, gf: 28, gc: 31, dg: -3 },
  { nombre: "Godoy Cruz", puntos: 35, pj: 27, gf: 31, gc: 28, dg: 3 },
  { nombre: "Belgrano", puntos: 35, pj: 27, gf: 33, gc: 32, dg: 1 },
  { nombre: "Deportivo Riestra", puntos: 35, pj: 27, gf: 26, gc: 27, dg: -1 },
  { nombre: "Tigre", puntos: 34, pj: 27, gf: 27, gc: 30, dg: -3 },
  { nombre: "Gimnasia y Esgrima (LP)", puntos: 32, pj: 27, gf: 21, gc: 23, dg: -2 },
  { nombre: "Rosario Central", puntos: 32, pj: 27, gf: 27, gc: 30, dg: -3 },
  { nombre: "Defensa y Justicia", puntos: 32, pj: 27, gf: 27, gc: 33, dg: -6 },
  { nombre: "Central Córdoba (SdE)", puntos: 31, pj: 27, gf: 29, gc: 36, dg: -7 },
  { nombre: "Argentinos Juniors", puntos: 30, pj: 27, gf: 22, gc: 28, dg: -6 },
  { nombre: "San Lorenzo", puntos: 29, pj: 27, gf: 20, gc: 26, dg: -6 },
  { nombre: "Newell's Old Boys", puntos: 28, pj: 27, gf: 22, gc: 35, dg: -13 },
  { nombre: "Sarmiento (J)", puntos: 26, pj: 27, gf: 18, gc: 28, dg: -10 },
  { nombre: "Banfield", puntos: 24, pj: 27, gf: 22, gc: 36, dg: -14 },
  { nombre: "Barracas Central", puntos: 23, pj: 27, gf: 15, gc: 33, dg: -18 },
];


export default function Ligas() {
  const router = useRouter();

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
          title: "Tabla Liga Profesional",
          headerShown: true,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <Text style={styles.btnVolver}>← Volver</Text>
            </Pressable>
          ),
        }}
      />

      <Text style={styles.tituloTabla}>Tabla Liga Profesional 🇦🇷</Text>

      <FlatList
        data={tabla}
        keyExtractor={(item) => item.nombre}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item, index }) => (
          <View style={[styles.row, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
            <Text style={styles.pos}>{index + 1}</Text>
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text style={styles.stat}>{item.pj}</Text>
            <Text style={styles.stat}>{item.gf}:{item.gc}</Text>
            <Text style={styles.stat}>{item.dg}</Text>
            <Text style={styles.puntos}>{item.puntos}</Text>
          </View>
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

    tituloTabla: {color: 'white', textAlign: "center", fontSize: 20, fontWeight: "600"}
});