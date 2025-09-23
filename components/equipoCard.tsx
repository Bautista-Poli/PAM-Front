import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";


export default function PlayerItem({ name }: { name: string }) {
  const [rating, setRating] = useState<number>(0);

  return (
    <View style={styles.row}>
      <Text style={styles.name} numberOfLines={1}>• {name}</Text>
      <View style={styles.rowStar}>
      <Pressable onPress={() => setRating(0)} style={styles.btn} hitSlop={8}>
        <Text style={[styles.txt, rating === 0 ? styles.on : styles.off]}>0</Text>
      </Pressable>

      <Pressable onPress={() => setRating(1)} style={styles.btn} hitSlop={8}>
        <Text style={[styles.txt, rating >= 1 ? styles.on : styles.off]}>★</Text>
      </Pressable>
      <Pressable onPress={() => setRating(2)} style={styles.btn} hitSlop={8}>
        <Text style={[styles.txt, rating >= 2 ? styles.on : styles.off]}>★</Text>
      </Pressable>
      <Pressable onPress={() => setRating(3)} style={styles.btn} hitSlop={8}>
        <Text style={[styles.txt, rating >= 3 ? styles.on : styles.off]}>★</Text>
      </Pressable>
      <Pressable onPress={() => setRating(4)} style={styles.btn} hitSlop={8}>
        <Text style={[styles.txt, rating >= 4 ? styles.on : styles.off]}>★</Text>
      </Pressable>
      <Pressable onPress={() => setRating(5)} style={styles.btn} hitSlop={8}>
        <Text style={[styles.txt, rating >= 5 ? styles.on : styles.off]}>★</Text>
      </Pressable>
    </View>
    </View>
  );
}


const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: "#0f172a", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 8 },
  name: { color: "#e5e7eb", flex: 1, marginRight: 8 },
  rowStar: { flexDirection: "row", alignItems: "center" },
  btn: { paddingHorizontal: 4, paddingVertical: 2, borderRadius: 6, marginHorizontal: 2,
    backgroundColor: "rgba(255,255,255,0.04)" },
  txt: { fontSize: 16 },
  on: { color: "#facc15" },
  off: { color: "#94a3b8" },
});


