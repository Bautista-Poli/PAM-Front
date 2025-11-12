// authClean.tsx
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { View, Text } from "react-native";

export default function AuthClean() {
  useEffect(() => {
    (async () => {
      await SecureStore.deleteItemAsync("user");
      await SecureStore.deleteItemAsync("token");
      console.log(" SecureStore limpiado ");
    })();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Limpiando datos de sesión...</Text>
    </View>
  );
}

