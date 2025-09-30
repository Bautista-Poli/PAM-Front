// app/(app)/_layout.tsx
import { Stack,Tabs} from "expo-router";
import { Ionicons } from "@expo/vector-icons";
export default function AppLayout() {

  return (
    <Tabs screenOptions={{headerShown:false}}>
        <Tabs.Screen name="(mainPage)" options={{title:"Home" , tabBarIcon:({color,size}) =>(
          <Ionicons name="home" color={color} size={20}/>
        )} }  />

    </Tabs>
      



  );
}

