import { Link } from "expo-router";
import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from "react-native";

export default function CreateAccount() {
  const [secureEntry, setSecureEntry] = useState(true);
  const [repeatSecureEntry, setRepeatSecureEntry] = useState(true);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.titleStyle}>Crear cuenta</Text>
          <Text style={styles.subtitleStyle}>
            Completá tus datos para comenzar
          </Text>

          <View style={styles.formContainer}>
        
            <View style={styles.inputGroup}>
              <Text style={styles.labelStyle}>Nombre</Text>
              <TextInput
                style={styles.textInputBoxStyle}
                placeholder="Nombre de usuario"
                placeholderTextColor="#9999997e"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.labelStyle}>Correo electrónico</Text>
              <TextInput
                style={styles.textInputBoxStyle}
                placeholder="ejemplo@email.com"
                placeholderTextColor="#9999997e"
                keyboardType="email-address"
                autoCapitalize="none"
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
                />
                <Pressable
                  onPress={() => setSecureEntry(!secureEntry)}
                  style={styles.toggleButton}
                >
                  <Text style={styles.toggleStyle}>
                    {secureEntry ? "Mostrar" : "Ocultar"}
                  </Text>
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

            
          </View>

          <Link style={styles.continueButtonStyle} href={"/(app)"} asChild>
            <Pressable>
              <Text style={styles.buttonTextStyle}>Continuar</Text>
            </Pressable>
          </Link>

          <Text style={styles.footerText}>
            ¿Ya tenés cuenta?{" "}
            <Link href="/login">
              <Text style={styles.linkText}>Inicia sesión</Text>
            </Link>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1220",
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "flex-start",
    paddingTop: 70
  },
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
  formContainer: {
    width: "100%",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelStyle: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 8,
  },
  textInputBoxStyle: {
    backgroundColor: "#1f2937",
    color: "white",
    padding: 16,
    height: 52,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#374151",
  },
  passwordContainer: {
    position: "relative",
    justifyContent: "center",
  },
  passwordInput: {
    backgroundColor: "#1f2937",
    color: "white",
    padding: 16,
    paddingRight: 80,
    height: 52,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#374151",
  },
  toggleButton: {
    position: "absolute",
    right: 0,
    height: "100%",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  toggleStyle: {
    color: "#3b82f6",
    fontSize: 14,
    fontWeight: "600",
  },
  continueButtonStyle: {
    backgroundColor: "#1e6091",
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: "#1e6091",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonTextStyle: {
    color: "white",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  footerText: {
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 24,
    fontSize: 14,
  },
  linkText: {
    color: "#3b82f6",
    fontWeight: "600",
  },
});