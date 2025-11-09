import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { getPartidos } from '@/components/apiConnections/info';
import LigaSelector from "@/components/componentesDeApp/ligaSelector";
import { MatchRow, UserData } from "@/components/apiConnections/types";
import Partido from "@/components/componentesDeApp/partido";
import MenuUsuario from "@/components/componentesDeApp/menuUsuario";
import LoaderBall from "@/components/componentesDeApp/animacionCarga";

type Dia = 'ayer' | 'hoy' | 'mañana';

const ligasDisponibles = [
  'Liga Profesional Argentina',
  'Premier League',
  'La Liga',
];

export default function Index() {
  const router = useRouter();
  const [day, setDay] = useState<Dia>('hoy');
  const [ligaSeleccionada, setLigaSeleccionada] = useState('Liga Profesional Argentina');
  const [partidos, setPartidos] = useState<MatchRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { usuario } = useLocalSearchParams();
  const userObj = JSON.parse(usuario as string) as UserData;


  useEffect(() => {
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
  }, [day]);

  if (loading) {
    return (
      <LoaderBall message="Cargando partidos..." fullScreen   />
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.statusText}>Error: {error}</Text>
      </View>
    );
  }


  // filtramos los partidos por liga seleccionada
  const partidosFiltrados = partidos.filter(p => p.league === ligaSeleccionada);

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
          {day === 'hoy' ? 'Partidos de hoy' :
          day === 'ayer' ? 'Partidos de ayer' : 'Partidos de mañana'}
        </Text>
        <MenuUsuario usuario={userObj} />
      </View>

      <View style={styles.buttonRow}>
        <DayChip label="Ayer" value="ayer" />
        <DayChip label="Hoy" value="hoy" />
        <DayChip label="Mañana" value="mañana" />
      </View>

      <View style={styles.ligaTitleText}>
        <Pressable
          style={({ pressed }) => [
            styles.ligaBtn,
            pressed && styles.ligaBtnPressed,
          ]}
          onPress={() => router.push({
            pathname: '/ligas',
            params: { ligaNombre: ligaSeleccionada }
          })}
        >
          <Text style={styles.ligaBtnText}>{ligaSeleccionada}</Text>
        </Pressable>
        <LigaSelector
          selectedLiga={ligaSeleccionada}
          ligas={ligasDisponibles}
          onSelect={setLigaSeleccionada}
        />
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
  dayChipSelected: {
    backgroundColor: '#1E6091',
    borderColor: '#A9D6E5',
  },
  dayChipPressed: {
    opacity: 0.75,
  },
  dayChipText: { color: '#E5F6FF', fontWeight: '600', textAlign: 'center' },
  dayChipTextSelected: { color: '#FFFFFF' },

  ligaBtn: {
    paddingVertical: 6,
    paddingHorizontal: 18,
  },
  ligaBtnPressed: {
    opacity: 0.75,
  },
  ligaBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 20 },

  ligaTitleText:{
    alignSelf: "center",
    marginVertical: 12,
    flexDirection:"row"
  },
  menuDeLigas:{
    marginLeft:13
  },
  center: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 16,
},

statusText: {
  fontSize: 16,
  color: '#555',
},

headerRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 8,
  marginTop: 60,
  zIndex: 100,
},
});