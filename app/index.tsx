import { useAuth } from "@/auth/authContext";
import { Link, useRouter } from "expo-router"
import { useEffect } from "react";
import { View , Text , StyleSheet, Image} from "react-native"


export default function Index(){
    const { user, isBooting } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isBooting) return;

        if (user) {
        router.replace("/(app)/(mainPage)");
        }
    }, [isBooting, user]);

    if (isBooting || user) return null;

    return(
        <View style={styles.window}>
            <Text style={[styles.textStyle,styles.titleStyle]}>GolData</Text>

            <Image source={require("../assets/images/iconico-del-campeonato-de-futbol.png")} style={styles.logoStyle}/>
            <Link style={styles.ButtonStyle} href={"/(auth)/login"}>
                <Text style={styles.textStyle}>Iniciar sesión</Text>
            </Link>
            <Link style={[styles.ButtonStyle,{backgroundColor:"#102f4a"}]} href={"/(auth)/createAccount"}>
                <Text style={styles.textStyle}>Crear cuenta</Text>
            </Link>
            <Text style={styles.bottom}></Text>
            
        </View>
    )
}

const styles = StyleSheet.create({
    window:{
        backgroundColor: '#0b1220'
    },
    textStyle:{
        color:"white",
        textAlign:"center",
        fontSize:20
    },
    titleStyle:{
        fontSize: 40,
        marginTop: 125,
        marginBottom: 60,
        fontWeight: "400"
    },
    ButtonStyle:{
        backgroundColor: "#1e6091",
        alignSelf:"center",
        padding:20,
        borderRadius:6,
        width: 370,
        marginTop:20

    },logoStyle:{
        resizeMode: "center",
        alignSelf: "center",
        height:350
    },
    bottom:{
        marginTop:120
    }


})