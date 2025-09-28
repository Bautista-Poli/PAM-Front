import { Link } from "expo-router"
import { View , Text , StyleSheet, TextInput} from "react-native"


export default function Login(){
    return(
        <View>
            <Text style={[styles.titleStyle,styles.textStyle]}>Iniciar sesión</Text>

            <TextInput style={styles.textInputBoxStyle} placeholder="Nombre de usuario"></TextInput>
            <TextInput style={styles.textInputBoxStyle} placeholder="Contraseña" secureTextEntry={true}></TextInput>

            <Link href={"/(app)"}>
                <Text style={styles.textStyle}>Recuperar contraseña</Text>
            </Link>

            <Link style={styles.continueButtonStyle} href={"/(app)"}>
                <Text style={styles.textStyle}>Continuar</Text>
            </Link>
            
        </View>

    )
}

const styles = StyleSheet.create({

    textStyle:{
        color:"white",
        textAlign:"center"
    },
    titleStyle:{
        fontSize: 30,
        marginTop:45,
        marginBottom:20
    },
    textInputBoxStyle:{
        backgroundColor:"#e7e7e7",
        alignSelf:"center",
        padding:20,
        height:55,
        width:400,
        marginVertical:10,
        borderRadius:6
    },
    continueButtonStyle:{
        backgroundColor: "#1e6091",
        alignSelf:"center",
        padding:20,
        borderRadius:6,
        width: 370,
        marginTop:520

    }


})

