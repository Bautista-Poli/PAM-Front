// app/_layout.tsx
import AppLayout from "./(app)/_layout"
import { Stack } from "expo-router";

export default function RootLayout() {
    
    const user  = false;

    
    if(!user){
        return(
            <Stack screenOptions={{headerShown: false ,headerStyle: {backgroundColor: "#111827", },contentStyle:{backgroundColor:"#0b1220"}}}>
                <Stack.Screen name="index"/>
            </Stack>
        )
    }else{
        return (<AppLayout/>)
    }
    

}

