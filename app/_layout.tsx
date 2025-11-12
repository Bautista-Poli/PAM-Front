// app/_layout.tsx
import { Slot } from "expo-router";
import { AuthProvider } from "../auth/authContext"; // <- ruta relativa desde /app

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}


