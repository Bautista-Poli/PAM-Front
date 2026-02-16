import { useAuth } from "../../auth/authContext";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Image, Alert, Pressable, ScrollView, KeyboardAvoidingView, Platform } from "react-native";

export default function Login() {
  const [mail, setMail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [secureEntry, setSecureEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!mail || !contrasena) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }
    setLoading(true);
    try {
      await login({ email: mail, password: contrasena });
      router.replace("/(app)/(mainPage)");
    } catch (e) {
      Alert.alert("Error", "Mail o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.titleStyle}>Iniciar sesión</Text>
          <Text style={styles.subtitleStyle}>Ingresa tus datos para continuar</Text>

          <Image source={require("../../assets/images/iconico-del-campeonato-de-futbol.png")} style={styles.logoStyle} />

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.labelStyle}>Correo electrónico</Text>
              <TextInput
                style={styles.textInputBoxStyle}
                placeholder="ejemplo@email.com"
                placeholderTextColor="#9999997e"
                autoCapitalize="none"
                keyboardType="email-address"
                value={mail}
                onChangeText={setMail}
                editable={!loading}
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
                  editable={!loading}
                />
                <Pressable onPress={() => setSecureEntry(!secureEntry)} style={styles.toggleButton} disabled={loading}>
                  <Text style={styles.toggleStyle}>{secureEntry ? "Mostrar" : "Ocultar"}</Text>
                </Pressable>
              </View>
            </View>
          </View>

          <Pressable style={[styles.continueButtonStyle, loading && styles.buttonDisabled]} onPress={handleLogin} disabled={loading}>
            <Text style={styles.buttonTextStyle}>{loading ? "Ingresando..." : "Continuar"}</Text>
          </Pressable>

          <Text style={styles.footerText}>
            ¿No tenés cuenta?{" "}
            <Link href="/createAccount">
              <Text style={styles.linkText}>Regístrate</Text>
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
    paddingTop: 60,
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
    marginBottom: 30,
  },
  logoStyle: {
    resizeMode: "contain",
    alignSelf: "center",
    width: 200,
    height: 200,
    marginBottom: 30,
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
  buttonDisabled: {
    backgroundColor: "#64748b",
    shadowOpacity: 0.1,
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