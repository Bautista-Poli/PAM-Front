import { Link } from "expo-router"
import { useState } from "react";
import { View , Text , StyleSheet, TextInput, Pressable} from "react-native"

export default function CreateAccount() {
  const [secureEntry, setSecureEntry] = useState(true);
  const [repeatSecureEntry, setRepeatSecureEntry] = useState(true);

  return (
    <View>
      <Text style={[styles.titleStyle, styles.textStyle]}>Crear cuenta</Text>

      <Text style={styles.labelStyle}>Nombre:</Text>
      <TextInput style={styles.textInputBoxStyle} placeholder="Nombre de usuario" />

      <Text style={styles.labelStyle}>Contraseña:</Text>
      <View>
        <TextInput
          style={styles.textInputBoxStyle}
          placeholder="Contraseña"
          secureTextEntry={secureEntry}
        />
        <Pressable onPress={() => setSecureEntry(!secureEntry)}>
          <Text style={styles.toggleStyle}>
            {secureEntry ? "Mostrar" : "Ocultar"}
          </Text>
        </Pressable>
      </View>

      <Text style={styles.labelStyle}>Repetir Contraseña:</Text>
      <View>
        <TextInput
          style={styles.textInputBoxStyle}
          placeholder="Repetir Contraseña"
          secureTextEntry={repeatSecureEntry}
        />
        <Pressable onPress={() => setRepeatSecureEntry(!repeatSecureEntry)}>
          <Text style={styles.toggleStyle}>
            {repeatSecureEntry ? "Mostrar" : "Ocultar"}
          </Text>
        </Pressable>
      </View>

      <Text style={styles.labelStyle}>Mail:</Text>
      <TextInput style={styles.textInputBoxStyle} placeholder="ejemplo@email.com" />

      <Link style={styles.continueButtonStyle} href={"/(app)"}>
        <Text style={styles.buttonTextStyle}>Continuar</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 1,
  },
  labelStyle: {
    color: "white",
    fontSize: 14,
    marginLeft: 30,
    marginTop: 10,
    marginBottom: 4,
  },
  toggleStyle: {
    color: "#1e6091",
    textAlign: "right",
    marginRight: 30,
    marginTop: -35,
    marginBottom: 15,
    fontSize: 14,
  },
  titleStyle: {
    fontSize: 30,
    marginTop: 45,
    marginBottom: 20,
    textAlign: "center",
  },
  textInputBoxStyle: {
    backgroundColor: "#e7e7e7",
    alignSelf: "center",
    padding: 20,
    height: 55,
    width: 350,
    marginVertical: 5,
    borderRadius: 6,
  },
  continueButtonStyle: {
    backgroundColor: "#1e6091",
    alignSelf: "center",
    padding: 20,
    borderRadius: 6,
    width: 370,
    marginTop: 30,
  },
  buttonTextStyle: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
});


