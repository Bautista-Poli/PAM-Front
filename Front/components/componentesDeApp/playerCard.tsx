import { View, Text, StyleSheet, Pressable } from "react-native";

type Props = {
  name: string;
  rating: number;
  onChangeRating: (newRating: number) => void;
};

export default function PlayerItem({ name, rating, onChangeRating }: Props) {
  return (
    <View style={styles.row}>
      <Pressable onPress={() => onChangeRating(0)} hitSlop={8} style={{ flex: 1 }}>
        <Text style={styles.name} numberOfLines={1}>• {name}</Text>
      </Pressable>

      <View style={styles.rowStar}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressable key={n} onPress={() => onChangeRating(n)} style={styles.btn} hitSlop={8}>
            <Text style={[styles.txt, rating >= n ? styles.on : styles.off]}>★</Text>
          </Pressable>
        ))}
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


