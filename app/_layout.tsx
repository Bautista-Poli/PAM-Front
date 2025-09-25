// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTitle: "",
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "#111827",
        },
        contentStyle: {
          backgroundColor: "#0b1220",
        },
      }}
    />
  );
}

