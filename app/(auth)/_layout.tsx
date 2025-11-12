// app/(auth)/_layout.tsx
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "../../auth/authContext";

export default function AuthLayout() {
  const { isBooting, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isBooting) return;
    if (user) router.replace("/(app)/(mainPage)");
  }, [isBooting, user]);

  if (isBooting) return null;
  return <Stack screenOptions={{ headerShown: false }} />;
}
