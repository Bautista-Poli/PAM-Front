// components/Marcador.tsx
import React from "react";
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from "react-native";

export type MarcadorProps = {
  golesLocal?: number;
  golesVisitante?: number;
};

export default function Marcador({
  golesLocal,
  golesVisitante,
}: MarcadorProps) {
  const hayResultado = typeof golesLocal === "number" && typeof golesVisitante === "number";

  if (!hayResultado) {
    return (
      <View style={[styles.container]}>
        <Text style={[styles.sinResultado]}>-</Text>
      </View>
    );
  }

  const status =
    golesLocal === golesVisitante
      ? "Empate"
      : golesLocal! > golesVisitante!
      ? "Gana local"
      : "Gana visita";

  return (
    <View style={[styles.container]}>
      <Text style={[styles.scoreText]}>
        {golesLocal} <Text style={[styles.dash]}>—</Text> {golesVisitante}
      </Text>
      <Text style={[styles.status]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center", gap: 4 },
  scoreText: { fontSize: 28, fontWeight: "800", color: "#f8fafc", letterSpacing: 1 },
  dash: { opacity: 0.7 },
  status: { fontSize: 12, color: "#9ca3af" },
  sinResultado: {fontSize: 30, color: "#9ca3af"}
});
