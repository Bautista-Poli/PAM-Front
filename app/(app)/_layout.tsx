// app/(app)/_layout.tsx
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "../../auth/authContext";

export default function AppLayout() {
  const { isBooting, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isBooting) return;
    if (!user) router.replace("/(auth)/login");
  }, [isBooting, user]);

  if (isBooting || !user) return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: "#111827" },
        contentStyle: { backgroundColor: "#0b1220" },
      }}
    />
  );
}

