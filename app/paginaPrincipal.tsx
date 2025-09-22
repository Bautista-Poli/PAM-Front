import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Platform,
  StatusBar,
} from "react-native";

export default function paginaPrincipal() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <Contador />
      </View>
    </SafeAreaView>
  );
}

function Contador() {
  const [contador, setContador] = useState(0);

  const increment = () => setContador((p) => p + 1);
  const decrement = () => setContador((p) => p - 1);

  return (
    <>
      <Text style={styles.title}>Contador: {contador}</Text>

      <View style={styles.row}>
        <Pressable onPress={increment} style={[styles.btnBase, styles.btnGreen]}>
          <Text style={styles.btnText}>Incrementar</Text>
        </Pressable>

        <Pressable onPress={decrement} style={[styles.btnBase, styles.btnRed]}>
          <Text style={styles.btnText}>Disminuir</Text>
        </Pressable>
      </View>
    </>
  );
}


const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    gap: 15, // solo funciona en RN 0.71+, si no usar margin
  },
  btnBase: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 3,
  },
  btnGreen: {
    backgroundColor: "#4CAF50",
  },
  btnRed: {
    backgroundColor: "#E53935",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
