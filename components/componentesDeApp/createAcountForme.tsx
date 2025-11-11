import { Link } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, Image } from "react-native";
import { Club } from "@/components/apiConnections/types";

export type FormValues = {
  nombre: string;
  email: string;
  contrasena: string;
  repetirContrasena: string;
};

type Props = {
  onSubmit: (form: FormValues, showError: (msg: string) => void) => void;
  submitting: boolean;
  selectedClub: Club | null;
  onPressSelectClub: () => void;
};

export default function CreateAccountForm({
  onSubmit,
  submitting,
  selectedClub,
  onPressSelectClub,
}: Props) {
  const [secureEntry, setSecureEntry] = useState(true);
  const [repeatSecureEntry, setRepeatSecureEntry] = useState(true);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [repetirContrasena, setRepetirContrasena] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validate = (): boolean => {
    if (!nombre || !email || !contrasena || !repetirContrasena) {
      setErrorMessage("Por favor completá todos los campos");
      return false;
    }
    if (!email.includes("@")) {
      setErrorMessage("La dirección de email no es válida");
      return false;
    }
    if (!contrasena.match(/\d/m)) {
      setErrorMessage("La contraseña debe contener al menos un número");
      return false;
    }
    if (contrasena.length < 8) {
      setErrorMessage("La contraseña debe tener al menos 8 caracteres");
      return false;
    }
    if (contrasena !== repetirContrasena) {
      setErrorMessage("Las contraseñas no coinciden");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const handlePress = () => {
    if (validate()) {
      onSubmit({ nombre, email, contrasena, repetirContrasena }, setErrorMessage);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
      <View style={styles.content}>
        <Text style={styles.titleStyle}>Crear cuenta</Text>
        <Text style={styles.subtitleStyle}>Completá tus datos para comenzar</Text>

        <View style={styles.formContainer}>
          {errorMessage !== "" && <Text style={styles.errorText}>{errorMessage}</Text>}

          {/* Nombre */}
          <View style={styles.inputGroup}>
            <Text style={styles.labelStyle}>Nombre</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre de usuario"
              placeholderTextColor="#9999997e"
              value={nombre}
              onChangeText={setNombre}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.labelStyle}>Correo Electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="ejemplo@email.com"
              placeholderTextColor="#9999997e"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.labelStyle}>Contraseña</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Contraseña"
                placeholderTextColor="#9999997e"
                secureTextEntry={secureEntry}
                value={contrasena}
                onChangeText={setContrasena}
              />
              <Pressable onPress={() => setSecureEntry(!secureEntry)} style={styles.toggleButton}>
                <Text style={styles.toggleStyle}>{secureEntry ? "Mostrar" : "Ocultar"}</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.labelStyle}>Repetir Contraseña</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Repetir Contraseña"
                placeholderTextColor="#9999997e"
                secureTextEntry={repeatSecureEntry}
                value={repetirContrasena}
                onChangeText={setRepetirContrasena}
              />
              <Pressable
                onPress={() => setRepeatSecureEntry(!repeatSecureEntry)}
                style={styles.toggleButton}
              >
                <Text style={styles.toggleStyle}>
                  {repeatSecureEntry ? "Mostrar" : "Ocultar"}
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.labelStyle}>Tu Club</Text>
            <Pressable style={styles.clubSelectorButton} onPress={onPressSelectClub}>
              {selectedClub ? (
                <View style={styles.clubRow}>
                  <Image source={{ uri: selectedClub.crest_url }} style={styles.clubLogo} />
                  <Text style={styles.clubName}>{selectedClub.nombre}</Text>
                </View>
              ) : (
                <Text style={styles.placeholderText}>Seleccioná tu club</Text>
              )}
            </Pressable>
          </View>

          <Pressable style={styles.continueButton} onPress={handlePress} disabled={submitting}>
            <Text style={styles.continueText}>
              {submitting ? "Creando cuenta..." : "Continuar"}
            </Text>
          </Pressable>

          <Text style={styles.footerText}>
            ¿Ya tenés cuenta?{" "}
            <Link href="/login">
              <Text style={styles.linkText}>Inicia sesión</Text>
            </Link>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, paddingVertical: 10 },
  content: { paddingHorizontal: 20, paddingTop: 70 },
  formContainer: { marginBottom: 30 },
  inputGroup: { marginBottom: 20 },
  labelStyle: { color: "white", marginBottom: 8 },
  input: {
    backgroundColor: "#1f2937",
    color: "white",
    padding: 16,
    borderRadius: 10,
    borderColor: "#374151",
    borderWidth: 1,
  },
  passwordContainer: { position: "relative" },
  passwordInput: {
    backgroundColor: "#1f2937",
    color: "white",
    padding: 16,
    paddingRight: 80,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#374151",
  },
  toggleButton: { position: "absolute", right: 0, top: 0, bottom: 0, justifyContent: "center", paddingHorizontal: 16 },
  toggleStyle: { color: "#3b82f6", fontWeight: "600" },
  clubSelectorButton: {
    backgroundColor: "#1f2937",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#374151",
  },
  clubRow: { flexDirection: "row", alignItems: "center" },
  clubLogo: { width: 24, height: 24, marginRight: 8 },
  clubName: { color: "white" },
  placeholderText: { color: "#9999997e" },
  continueButton: {
    backgroundColor: "#1e6091",
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 10,
  },
  continueText: { color: "white", textAlign: "center", fontWeight: "700" },
  footerText: { color: "#9ca3af", textAlign: "center", marginTop: 24 },
  linkText: { color: "#3b82f6", fontWeight: "600" },
  errorText: { color: "#f54040ff", textAlign: "center", marginBottom: 10 },
  titleStyle: {
  color: "white",
  fontSize: 32,
  fontWeight: "700",
  textAlign: "center",
  marginBottom: 8,
},
subtitleStyle: {
  color: "#9ca3af",
  fontSize: 15,
  textAlign: "center",
  marginBottom: 40,
},
});

