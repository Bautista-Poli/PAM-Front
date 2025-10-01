import { View, Text, StyleSheet } from "react-native";

type Props = {
  promGoles: string;
  maxGF: { nombre: string; gf: number };
  minGC: { nombre: string; gc: number };
};

export default function Estadisticas({ promGoles, maxGF, minGC }: Props) {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerTitle}>Resumen</Text>
      <Text style={styles.footerText}>⚽ Promedio de goles por partido: {promGoles}</Text>
      <Text style={styles.footerText}>🔥 Equipo más goleador: {maxGF.nombre} ({maxGF.gf} GF)</Text>
      <Text style={styles.footerText}>🛡️ Equipo menos goleado: {minGC.nombre} ({minGC.gc} GC)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#112336",
    borderRadius: 8,
  },
  footerTitle: { color: "#fff", fontWeight: "600", marginBottom: 8, fontSize: 16 },
  footerText: { color: "#cbd5e1", marginBottom: 4 },
});
