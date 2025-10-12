import { Link } from "expo-router"
import { View , Text , StyleSheet, Image} from "react-native"


export default function Index(){

    return(
        <View>
            <Text style={[styles.textStyle,styles.titleStyle]}>GolData</Text>

            <Image source={require("../assets/images/iconico-del-campeonato-de-futbol.png")} style={styles.logoStyle}/>
            <Link style={styles.ButtonStyle} href={"/(auth)/login"}>
                <Text style={styles.textStyle}>Iniciar sesión</Text>
            </Link>
            <Link style={[styles.ButtonStyle,{backgroundColor:"#102f4a"}]} href={"/(auth)/createAccount"}>
                <Text style={styles.textStyle}>Crear Cuenta</Text>
            </Link>
            
        </View>

    )

}

const styles = StyleSheet.create({
    textStyle:{
        color:"white",
        textAlign:"center",
        fontSize:15
    },
    titleStyle:{
        fontSize: 35,
        marginTop:85,
        marginBottom:60
    },
    ButtonStyle:{
        backgroundColor: "#1e6091",
        alignSelf:"center",
        padding:20,
        borderRadius:6,
        width: 370,
        marginTop:30

    },logoStyle:{
        resizeMode: "center",
        alignSelf: "center",
        height:400
    }


})