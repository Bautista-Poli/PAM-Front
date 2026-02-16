import Copa from "@/components/componentesDeApp/tablaTorneo/copa";
import Ligas from "@/components/componentesDeApp/tablaTorneo/ligas";
import { useLocalSearchParams, Redirect } from "expo-router";

export default function Competicion() {
  const { type } = useLocalSearchParams<{ type: 'copa' | 'liga' }>();

  if (type === 'copa') {
    return <Copa />;
  }
  return   <Ligas/>;
}