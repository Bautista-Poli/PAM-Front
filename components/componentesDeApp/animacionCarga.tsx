// components/LoaderBall.tsx
import { View, Text, Animated, Easing, StyleSheet } from "react-native";
import { useEffect, useRef } from "react";

const BALL_URL =
  "https://png.pngtree.com/png-clipart/20220530/original/pngtree-ball-blue-png-image_7767430.png";

type Props = {
  message?: string;
  size?: number;        // px
  speedMs?: number;     // duración de la vuelta
  fullScreen?: boolean; // ocupa toda la vista o solo inline
};

export default function LoaderBall({
  message = "Cargando...",
  size = 96,
  speedMs = 1200,
  fullScreen = true,
}: Props) {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: speedMs,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [spin, speedMs]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const scale = spin.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.08, 1],
  });

  return (
    <View style={fullScreen ? styles.center : styles.inline}>
      <Animated.Image
        source={{ uri: BALL_URL }}
        style={{
          width: size,
          height: size,
          transform: [{ rotate }, { scale }],
        }}
      />
      {!!message && <Text style={styles.text}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#0b1220" },
  inline: { alignItems: "center", justifyContent: "center" },
  text: { marginTop: 12, color: "#93c5fd", fontSize: 16, fontWeight: "600" },
});
