// components/componentesDeApp/historialPartidos.tsx
import { View, Text, StyleSheet } from "react-native";

interface HistorialPartidosProps {
  equipoNombre: string;
}

export default function HistorialPartidos({ equipoNombre }: HistorialPartidosProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Historial de partidos de {equipoNombre}
      </Text>
      <Text style={styles.subtext}>Próximamente...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#112336",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1E3A5F",
  },
  text: {
    color: "#e5e7eb",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },
  subtext: {
    color: "#94a3b8",
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
  },
});