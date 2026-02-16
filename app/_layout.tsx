import { Slot } from "expo-router";
import { AuthProvider } from "../auth/authContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}


