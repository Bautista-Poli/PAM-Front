import { Pressable, Text, StyleSheet } from "react-native";

interface TabButtonProps {
  label: string;
  value: "grupos" | "eliminatorias";
  selected: boolean;
  onPress: (value: "grupos" | "eliminatorias") => void;
}

export function TabButton({ label, value, selected, onPress }: TabButtonProps) {
  return (
    <Pressable
      onPress={() => onPress(value)}
      style={({ pressed }) => [
        styles.tabButton,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.text, selected && styles.textSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1E6091",
    backgroundColor: "#12263A",
  },
  selected: {
    backgroundColor: "#1E6091",
    borderColor: "#A9D6E5",
  },
  pressed: {
    opacity: 0.75,
  },
  text: {
    color: "#E5F6FF",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 14,
  },
  textSelected: {
    color: "#FFFFFF",
  },
});