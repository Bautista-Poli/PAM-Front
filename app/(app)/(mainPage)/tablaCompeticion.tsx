import { useLocalSearchParams, Redirect } from "expo-router";
import Copa from "../../../components/tablaTorneo/copa";
import Ligas from "../../../components/tablaTorneo/ligas";

export default function Competicion() {
  const { type } = useLocalSearchParams<{ type: 'copa' | 'liga' }>();

  if (type === 'copa') {
    return <Copa />;
  }
  return   <Ligas/>;
}