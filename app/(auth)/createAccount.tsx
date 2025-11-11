import { Link, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, Modal, FlatList, Image, Alert } from "react-native";
import { getClubsArgentinos, postCreateUser } from "@/components/apiConnections/apileagues";
import { Club } from "@/components/apiConnections/types";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateAccount() {
  const [secureEntry, setSecureEntry] = useState(true);
  const [repeatSecureEntry, setRepeatSecureEntry] = useState(true);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [showClubModal, setShowClubModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [repetirContrasena, setRepetirContrasena] = useState("");
  const [errorMessage,setErrorMessage] = useState('');

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const data = await getClubsArgentinos();
      setClubs(data);
    } catch (error) {
      console.error('Error al cargar clubes:', error);
      Alert.alert('No se pudieron cargar los clubes. Intentá nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const isUserInputValid = () => {
    if (!nombre || !email || !contrasena || !repetirContrasena) {
      setErrorMessage('Por favor completá todos los campos');
      return false;
    }
    if(!email.includes('@')){
      setErrorMessage('La dirección de email no es valida');
      return false;
    }
    if(!(contrasena.match(/\d/m))){
      setErrorMessage('La contraseña debe contener al menos un número');
      return false;
    }
    if(contrasena.length < 8){
      setErrorMessage('La contraseñas debe contener al menos 8 caracteres');
      return false;
    }
    
    if (contrasena !== repetirContrasena) {
      setErrorMessage('Las contraseñas no coinciden');
      return false;
    }


    return true;
  }

  const handleCreateAccount = async () => {
    if(!isUserInputValid()){
      return;
    }
    if (!selectedClub) {
      setErrorMessage('Por favor seleccioná tu club')
      return;
    }
    setSubmitting(true);

    try {

      const result = await postCreateUser(
        nombre,
        email,
        contrasena,
        selectedClub.id
      );

      if (result.success && result.user) {
        await AsyncStorage.setItem('user', JSON.stringify(result.user));
        
        router.push({
          pathname: '/(app)/(mainPage)',
          params: { usuario: JSON.stringify(result.user) }
        });
      } else {
        Alert.alert('Error', result.error || 'No se pudo crear la cuenta');
      }
    }
    catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Error de conexión al crear la cuenta');
    } finally {
      setSubmitting(false)
    }
  };

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
              <Text style={[styles.errorMessageText, (errorMessage == "") ? {display:"none"} : {display:"flex"}]}>{errorMessage}</Text>
              <Text style={styles.labelStyle}>Nombre</Text>
              <TextInput
                style={styles.textInputBoxStyle}
                placeholder="Nombre de usuario"
                placeholderTextColor="#9999997e"
                value={nombre}
                onChangeText={setNombre}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.labelStyle}>Correo Electrónico</Text>
              <TextInput
                style={styles.textInputBoxStyle}
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
              <Pressable
                style={styles.clubSelectorButton}
                onPress={() => setShowClubModal(true)}
              >
                {selectedClub ? (
                  <View style={styles.selectedClubContainer}>
                    <Image
                      source={{ uri: selectedClub.crest_url }}
                      style={styles.clubCrest}
                    />
                    <Text style={styles.selectedClubText}>
                      {selectedClub.nombre}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.placeholderText}>
                    Seleccioná tu club
                  </Text>
                )}
              </Pressable>
            </View>
          </View>

          <Pressable
            style={[
              styles.continueButtonStyle,
              (loading || submitting) && styles.buttonDisabled
            ]}
            onPress={handleCreateAccount}
            disabled={loading || submitting}
          >
            <Text style={styles.buttonTextStyle}>
              {submitting ? 'Creando cuenta...' : 'Continuar'}
            </Text>
          </Pressable>

          <Text style={styles.footerText}>
            ¿Ya tenés cuenta?{" "}
            <Link href="/login">
              <Text style={styles.linkText}>Inicia sesión</Text>
            </Link>
          </Text>
        </View>
      </ScrollView>

      <Modal
        visible={showClubModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowClubModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccioná tu club</Text>
              <Pressable onPress={() => setShowClubModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </Pressable>
            </View>

            {loading ? (
              <Text style={styles.loadingText}>Cargando clubes...</Text>
            ) : (
              <FlatList
                data={clubs}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <Pressable
                    style={[
                      styles.clubItem,
                      selectedClub?.id === item.id && styles.clubItemSelected
                    ]}
                    onPress={() => {
                      setSelectedClub(item);
                      setShowClubModal(false);
                    }}
                  >
                    <Image
                      source={{ uri: item.crest_url }}
                      style={styles.clubCrestModal}
                    />
                    <Text style={styles.clubNameModal}>{item.nombre}</Text>
                  </Pressable>
                )}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </Modal>
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
  clubSelectorButton: {
    backgroundColor: "#1f2937",
    padding: 16,
    height: 52,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#374151",
    justifyContent: "center",
  },
  selectedClubContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  clubCrest: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  selectedClubText: {
    color: "white",
    fontSize: 16,
  },
  placeholderText: {
    color: "#9999997e",
    fontSize: 16,
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1f2937",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  modalTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
  closeButton: {
    color: "#9ca3af",
    fontSize: 24,
    fontWeight: "600",
  },
  loadingText: {
    color: "#9ca3af",
    textAlign: "center",
    padding: 20,
  },
  clubItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  clubItemSelected: {
    backgroundColor: "#374151",
  },
  clubCrestModal: {
    width: 32,
    height: 32,
    marginRight: 16,
  },
  clubNameModal: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },

  buttonDisabled: {
    backgroundColor: "#64748b",
    shadowOpacity: 0.1,
  },
  errorMessageText:{
    color: "#f54040ff",
    fontSize:16,
    textAlign:"center",
  }
});