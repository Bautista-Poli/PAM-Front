// app/(app)/rating-partido.tsx
import { View, Text, Modal, Pressable, StyleSheet } from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { useRatingPartido } from "@/components/componentesDeApp/useRatingPartido";
import PlayersSectionList from "@/components/componentesDeApp/playerSelection";
import AlreadyVotedModal from "@/components/animations/votedAnimation";
import LoaderBall from "@/components/animations/animacionCarga";


export default function RatingPartido() {
  const router = useRouter();
  const { partido } = useLocalSearchParams();
  const state = useRatingPartido(partido);

  if (!state.partidoData) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: "Error" }} />
        <Text style={styles.empty}>No se recibieron datos del partido.</Text>
      </View>
    );
  }

  switch (state.status) {
    case "idle":
    case "loading":
      return <LoaderBall message="Cargando..." fullScreen />;

    case "error":
      return (
        <View style={styles.view}>
          <Header onBack={() => router.back()} />
          <View style={styles.centerContent}>
            <Text style={styles.message}>Error: {state.error}</Text>
          </View>
        </View>
      );

    case "voted":
      return (
        <View>
          <Header onBack={() => router.back()} />
          <AlreadyVotedModal isVisible={true} onClose={() => router.back()} />
        </View>
      );

    case "ready": {
      const { sections, partidoData, userId } = state;
      return (
        <View style={styles.view}>
          <Header onBack={() => router.back()} />
          <PlayersSectionList
            sections={sections}
            loading={false}
            partidoData={partidoData}
            userId={userId}
          />
        </View>
      );
    }
  }
}

function Header({ onBack }: { onBack: () => void }) {
  return (
    <Stack.Screen
      options={{
        title: "Partido",
        headerShown: true,
        headerLeft: () => (
          <Pressable onPress={onBack} hitSlop={8}>
            <Text style={{ fontSize: 16, color: "#007AFF" }}>← Volver</Text>
          </Pressable>
        ),
      }}
    />
  );
}

const styles = StyleSheet.create({
  view: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  empty: { fontSize: 16, color: "#333" },
  centerContent: { flex: 1, alignItems: "center", justifyContent: "center" },
  message: { fontSize: 16, color: "#e11d48" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalContainer: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#fff",
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "600", marginBottom: 8, textAlign: "center" },
  modalMessage: { fontSize: 14, color: "#444", textAlign: "center", marginBottom: 16 },
  modalButton: {
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#007AFF",
  },
  modalButtonText: { color: "#fff", fontWeight: "600" },
});
