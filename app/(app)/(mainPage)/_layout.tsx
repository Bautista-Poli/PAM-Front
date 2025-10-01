import { Stack,Tabs} from "expo-router";

export default function mainPage() {

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTitle: "",
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "#111827",
        },
        contentStyle: {
          backgroundColor: "#0b1220",
        },
      }}
    />
      



  );
}

