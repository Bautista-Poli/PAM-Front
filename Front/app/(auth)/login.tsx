import { postLogin } from "@/components/apiConnections/apileagues";
import { Link, useRouter } from "expo-router"
import { useState } from "react";
import { View , Text , StyleSheet, TextInput, Image, Alert} from "react-native"

export default function Login() {
  const [mail, setMail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const user = await postLogin(mail, contrasena);
    if (user) {
      router.push({
        pathname: '/(app)',
        params: { usuario: JSON.stringify(user) } // le pasás el nombre al index
      });
    } else {
      Alert.alert('Error', 'Mail o contraseña incorrectos');
    }
  };

  return (
    <View>
      <Text style={[styles.titleStyle, styles.textStyle]}>Iniciar sesión</Text>
      <Text style={styles.enterStyle}>Mail</Text>
      <TextInput
        style={styles.textInputBoxStyle}
        placeholder="Correo electrónico"
        autoCapitalize="none"
        keyboardType="email-address"
        value={mail}
        onChangeText={setMail}
      />

      <Text style={styles.enterStyle}>Contraseña</Text>
      <TextInput
        style={styles.textInputBoxStyle}
        placeholder="Contraseña"
        secureTextEntry={true}
        value={contrasena}
        onChangeText={setContrasena}
      />

      <Link href="/(app)">
        <View> 
          <Text style={styles.enterStyle}>Recuperar contraseña</Text>
        </View>
      </Link>

      <Image source={require('../../assets/images/iconico-del-campeonato-de-futbol.png')} style={styles.logoStyle}/>

      <Text onPress={handleLogin} style={styles.continueButtonStyle}>
        <Text style={styles.textStyle}>Continuar</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({

    textStyle:{
      color:"white",
      textAlign:"center",
      fontSize: 20,
    },
    enterStyle:{
      color:"white",
      marginLeft: 30,
      marginTop: 20,
      fontSize: 17,
    },
    titleStyle:{
        fontSize: 30,
        marginTop:75,
        marginBottom:20
    },
    textInputBoxStyle:{
        backgroundColor:"#e7e7e7",
        alignSelf:"center",
        fontSize: 17,
        padding:20,
        height:55,
        width:350,
        marginVertical:10,
        borderRadius:6,
    },
    continueButtonStyle:{
        backgroundColor: "#1e6091",
        alignSelf:"center",
        padding:20,
        borderRadius:6,
        width: 370,
        marginTop:20

    },logoStyle:{
        resizeMode: "center",
        alignSelf: "center",
        height: 300,
    },

})

