// app/createAccount.tsx (o tu ruta actual)
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Club } from "@/apiConnections/types";
import CreateAccountForm, { FormValues } from "@/components/componentesDeApp/createAcountForme";
import ClubPickerModal from "@/components/componentesDeApp/createAcountPickClub";
import { useAuth } from "@/auth/authContext";
import { postCreateUser } from "@/apiConnections/users";

export default function CreateAccountScreen() {
  const router = useRouter();
  const { setFromCreate } = useAuth(); // guarda en SecureStore y estado global
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [showClubModal, setShowClubModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (
    form: FormValues,
    showError: (msg: string) => void
  ) => {
    if (!selectedClub) {
      showError("Por favor seleccioná tu club");
      return;
    }

    try {
      setSubmitting(true);

      // tu API: { success: boolean; user?: UserData; error?: string }
      const result = await postCreateUser(
        form.nombre,
        form.email,
        form.contrasena,
        selectedClub.id
      );

      if (result?.success && result.user) {
        // Persistir sesión (no hay token)
        await setFromCreate({ user: result.user });

        // Ir al área protegida
        router.replace("/(app)/(mainPage)");
      } else {
        Alert.alert("Error", result?.error || "No se pudo crear la cuenta");
      }
    } catch (err) {
      console.error("Error al crear cuenta:", err);
      Alert.alert("Error", "Error de conexión al crear la cuenta");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <View style={{ flex: 1 }}>
        <CreateAccountForm
          onSubmit={handleCreate}
          submitting={submitting}
          selectedClub={selectedClub}
          onPressSelectClub={() => setShowClubModal(true)}
        />

        <ClubPickerModal
          visible={showClubModal}
          onClose={() => setShowClubModal(false)}
          selectedClub={selectedClub}
          onSelect={(club) => {
            setSelectedClub(club);
            setShowClubModal(false);
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1220",
  },
});


