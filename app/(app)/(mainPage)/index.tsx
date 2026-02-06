import { useRouter } from "expo-router";
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { getPartidos } from '@/components/apiConnections/info';
import { MatchRow } from "@/components/apiConnections/types";
import LoaderBall from "@/components/animations/animacionCarga";
import { useAuth } from "../../../auth/authContext"; 
import Partido from "@/components/componentesDeApp/partido";
import LigaSelector from "@/components/componentesDeApp/ligaSelector";
import MenuUsuario from "@/components/componentesDeApp/menuUsuario";
import HowToBegin from "@/components/componentesDeApp/indexComponents/howToBegin";

type Dia = 'ayer' | 'hoy' | 'mañana';
const ligasDisponibles = ['Liga Profesional Argentina', 'Premier League', 'La Liga'];

export default function Index() {
  const router = useRouter();
  const { user, isBooting } = useAuth();

  // Estados de la App
  const [day, setDay] = useState<Dia>("hoy");
  const [ligaSeleccionada, setLigaSeleccionada] = useState(ligasDisponibles[0]);
  const [partidos, setPartidos] = useState<MatchRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- LÓGICA DE LA GUÍA (Simplificada) ---
  const [showGuide, setShowGuide] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const pasosGuia = [
    { 
      title: "¡Bienvenido!", 
      description: "Aquí puedes ver los partidos de fútbol de tus ligas favoritas." 
    },
    { 
      title: "Filtra por fecha", 
      description: "Usa los botones de Ayer, Hoy y Mañana en la parte superior para cambiar la fecha." 
    },
    { 
      title: "Cambia de Liga", 
      description: "Toca el nombre de la liga para ver detalles o usa el selector para cambiar de torneo." 
    }
  ];

  const handleNextStep = () => {
    if (currentStep < pasosGuia.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowGuide(false);
      setCurrentStep(0); // Reiniciamos para la próxima vez
    }
  };

  const startGuide = () => {
    setCurrentStep(0);
    setShowGuide(true);
  };
  // ----------------------------------------

  useEffect(() => {
    if (isBooting) return; 
    if (!user) router.replace("/(auth)/login");
  }, [isBooting, user]);

  useEffect(() => {
    if (isBooting || !user) return;
    const cargar = async () => {
      try {
        setLoading(true); 
        const todos = await getPartidos(day);
        setPartidos(todos);
      } catch (e: any) {
        setError(e.message ?? "Error al cargar partidos");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [day, user, isBooting]); 

  if (isBooting || (!user && !error)) {
    return <LoaderBall message="Cargando aplicación..." fullScreen />;
  }
  
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.statusText}>Error: {error}</Text>
      </View>
    );
  }
  
  const partidosFiltrados = partidos.filter((p) => p.league === ligaSeleccionada);
  
  const DayChip = ({ label, value }: { label: string; value: Dia }) => {
    const selected = day === value;
    return (
      <Pressable
        onPress={() => setDay(value)}
        style={({ pressed }) => [
          styles.dayChip,
          selected && styles.dayChipSelected,
          pressed && styles.dayChipPressed,
        ]}
      >
        <Text style={[styles.dayChipText, selected && styles.dayChipTextSelected]}>
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>
          {day === 'hoy' ? 'Partidos de hoy' : day === 'ayer' ? 'Partidos de ayer' : 'Partidos de mañana'}
        </Text>
        <MenuUsuario usuario={user!} /> 
      </View>

      <View style={styles.buttonRow}>
        <DayChip label="Ayer" value="ayer" />
        <DayChip label="Hoy" value="hoy" />
        <DayChip label="Mañana" value="mañana" />
      </View>

      <View style={styles.ligaTitleText}>
        <Pressable
          style={({ pressed }) => [styles.ligaBtn, pressed && styles.ligaBtnPressed]}
          onPress={() =>
            router.push({ pathname: '/ligas', params: { ligaNombre: ligaSeleccionada } })
          }
        >
          <Text style={styles.ligaBtnText}>{ligaSeleccionada}</Text>
        </Pressable>
        <LigaSelector selectedLiga={ligaSeleccionada} ligas={ligasDisponibles} onSelect={setLigaSeleccionada} />
      </View>

      <FlatList
        data={partidosFiltrados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.card}
        renderItem={({ item }) => <Partido data={item} />}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Sin partidos para {day} en {ligaSeleccionada}
          </Text>
        }
      />

      <HowToBegin />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#112336ff', paddingTop: 20, gap: 12 },
  card: { gap: 8, paddingBottom: 24, marginHorizontal: 7 },
  buttonRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 4 },
  title: { color: '#e9ebeeff', fontSize: 18, fontWeight: '600', marginLeft:50 },
  empty: { color: '#94a3b8', textAlign: 'center', marginTop: 24 },
  dayChip: {
    width: '25%',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E6091',
    backgroundColor: '#12263A',
  },
  dayChipSelected: { backgroundColor: '#1E6091', borderColor: '#A9D6E5' },
  dayChipPressed: { opacity: 0.75 },
  dayChipText: { color: '#E5F6FF', fontWeight: '600', textAlign: 'center' },
  dayChipTextSelected: { color: '#FFFFFF' },
  ligaBtn: { paddingVertical: 6, paddingHorizontal: 18 },
  ligaBtnPressed: { opacity: 0.75 },
  ligaBtnText: { color: '#fff', fontWeight: '700', fontSize: 20 },
  ligaTitleText:{ alignSelf: "center", marginVertical: 12, flexDirection:"row" },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  statusText: { fontSize: 16, color: '#555' },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, marginTop: 60, zIndex: 100 },
  helpButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#A9D6E5',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  helpButtonText: { color: '#112336', fontSize: 24, fontWeight: 'bold' }
});