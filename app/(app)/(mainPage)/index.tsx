import { useRouter } from "expo-router";
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import LoaderBall from "@/components/animations/animacionCarga";
import { useAuth } from "../../../auth/authContext";
import LigaSelector from "@/components/componentesDeApp/ligaSelector";
import MenuUsuario from "@/components/componentesDeApp/menuUsuario";
import HowToBegin from "@/components/componentesDeApp/indexComponents/howToBegin";
import { MatchRow } from "@/apiConnections/types";
import { getMatches } from "@/apiConnections/matches";
import PartidoCard from "@/components/componentesDeApp/partidoCard";

type Dia = 'ayer' | 'hoy' | 'mañana';
const ligasDisponibles = ['Liga Profesional Argentina', 'Premier League', 'La Liga'];

export default function Index() {
  const router = useRouter();
  const { user, isBooting } = useAuth();

  const [day, setDay] = useState<Dia>("hoy");
  const [ligaSeleccionada, setLigaSeleccionada] = useState(ligasDisponibles[0]);
  const [partidos, setPartidos] = useState<MatchRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isBooting) return; 
    if (!user) router.replace("/(auth)/login");
  }, [isBooting, user]);

  useEffect(() => {
    if (isBooting || !user) return;
    const cargar = async () => {
      try {
        setLoading(true);
        const fechaBase = new Date();
        if (day === 'ayer') fechaBase.setDate(fechaBase.getDate() - 1);
        if (day === 'mañana') fechaBase.setDate(fechaBase.getDate() + 1);
        
        const fechaString = fechaBase.toISOString().split('T')[0];
        const todos = await getMatches(`?date=${fechaString}`); 
        setPartidos(todos);
      } catch (e: any) {
        setError(e.message ?? "Error al cargar partidos");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [day, user, isBooting]);


  const handlePressPartido = (item: MatchRow) => {
    router.push({
      pathname: "/detallesPartido",
      params: { partido: JSON.stringify(item) },
    });
  };

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
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.cardList}
        renderItem={({ item }) => (
          <Pressable 
            onPress={() => handlePressPartido(item)}
            style={({ pressed }) => [
              { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }
            ]}
          >
            <PartidoCard data={item} />
          </Pressable>
        )}
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
  cardList: { gap: 8, paddingBottom: 24, marginHorizontal: 7 },
  buttonRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 4 },
  title: { color: '#e9ebeeff', fontSize: 18, fontWeight: '600', marginLeft: 50 },
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
  ligaTitleText: { alignSelf: "center", marginVertical: 12, flexDirection: "row" },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  statusText: { fontSize: 16, color: '#555' },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, marginTop: 60, zIndex: 100 },
});