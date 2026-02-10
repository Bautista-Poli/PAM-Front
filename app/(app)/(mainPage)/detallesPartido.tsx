import { View, Text, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import LoaderBall from "@/components/animations/animacionCarga";
import { useRatingPartido } from "@/components/componentesDeApp/detallesPartidoComponents/useRatingPartido";
import PlayerVotingSectionList from "@/components/componentesDeApp/detallesPartidoComponents/playerVotingSection";
import AnimatedTabMenu from "@/components/animations/animacionMenuPartido";
import InfoPartido from "@/components/componentesDeApp/detallesPartidoComponents/InfoPartido";
import PartidoCard from "@/components/componentesDeApp/partidoCard";
import ForoPartido from "@/components/componentesDeApp/detallesPartidoComponents/foroDelPartido";

export default function RatingPartido() {
  const { partido } = useLocalSearchParams();
  const { partidoData, sections, loading, error, userId } = useRatingPartido(partido);

  // 1. Manejo temprano de errores o falta de datos
  if (!partidoData) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No se encontró la información del partido.</Text>
      </View>
    );
  }

  // 2. Lógica de negocio extraída: ¿Se puede votar?
  const matchDate = new Date(partidoData.match_date);
  const now = new Date();
  const DURACION_PARTIDO_MS = 2 * 60 * 60 * 1000; // 2 horas
  const isVotable = now.getTime() > matchDate.getTime() + DURACION_PARTIDO_MS;

  // 3. Definición dinámica de pestañas
  const tabs = isVotable ? ["Info", "Calificar", "Foro"] : ["Info", "Foro"];

  // 4. Renderizado condicional del contenido
  const renderTabContent = (activeTab: number) => {
    const currentTabName = tabs[activeTab];

    switch (currentTabName) {
      case "Info":
        return <InfoPartido />;
      
      case "Calificar":
        return (
          <PlayerVotingSectionList
            sections={sections}
            partidoData={partidoData}
            userId={userId}
          />
        );

      case "Foro":
        return (
          // Pasamos matchId (desde partidoData) y userId (desde useRatingPartido)
          <ForoPartido 
            matchId={Number(partidoData.id)} 
            userId={userId} 
          />
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.view}>
      <Stack.Screen options={{ title: "Detalles del Partido", headerShown: true }} />

      <View style={styles.partidoHeader}>
        <PartidoCard data={partidoData} />
      </View>

      {loading ? (
        <LoaderBall message="Cargando información..." fullScreen />
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <AnimatedTabMenu 
          tabs={tabs}
        >
          {(activeTab) => renderTabContent(activeTab)}
        </AnimatedTabMenu>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  view: { 
    flex: 1, 
    backgroundColor: "#0b1220" 
  },
  partidoHeader: { 
    paddingHorizontal: 10, 
    marginBottom: 5 
  },
  center: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    padding: 20 
  },
  errorText: { 
    color: "#ef4444", 
    fontSize: 16, 
    textAlign: 'center' 
  },
  placeholderText: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: '500'
  }
});
