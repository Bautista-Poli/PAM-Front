import { View, Text, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import LoaderBall from "@/components/animations/animacionCarga";
import { useRatingPartido } from "@/components/componentesDeApp/ratingComponents/useRatingPartido";
import PlayerVotingSectionList from "@/components/componentesDeApp/ratingComponents/playerVotingSection";
import AnimatedTabMenu from "@/components/animations/animacionMenuPartido";
import InfoPartido from "@/components/componentesDeApp/ratingComponents/InfoPartido";
import PartidoCard from "@/components/componentesDeApp/partido";

export default function RatingPartido() {
  const { partido } = useLocalSearchParams();
  const { partidoData, sections, loading, error, userId } = useRatingPartido(partido);

  if (!partidoData) return <Text>Error: No hay datos</Text>;

  return (
    <View style={styles.view}>
      <View style={styles.partido}>
        <PartidoCard data={partidoData}  ></PartidoCard>
      </View>
      <Stack.Screen options={{ title: "Calificar Partido", headerShown: true }} />
      
      {loading ? (
        <LoaderBall message="Cargando jugadores..." fullScreen />
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <AnimatedTabMenu 
          tabs={["Info Partido", "Calificar Jugadores"]}
          onTabChange={(index) => console.log("Tab activo:", index)}
        >
          {(activeTab) => (
            activeTab === 0 ? (
              <InfoPartido />
            ) : (
              <PlayerVotingSectionList
                sections={sections}
                partidoData={partidoData}
                userId={userId}
              />
            )
          )}
        </AnimatedTabMenu>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  view: { flex: 1, backgroundColor: "#0b1220" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "#ef4444", fontSize: 16 },
  partido: { marginBottom:20 },
});
