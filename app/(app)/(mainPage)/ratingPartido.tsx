import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { obtenerJugadores } from '@/components/apiConnections/info';
import { checkUserVoted } from '@/components/apiConnections/apileagues';
import { MatchRow, Player } from '@/components/apiConnections/types';
import PlayersSectionList from '@/components/componentesDeApp/playerSelection';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SectionJugadores = { title: string; teamName: string; data: Player[] };

export default function RatingPartido() {
  const router = useRouter();

  const { partido } = useLocalSearchParams();
  const partidoData: MatchRow | null = useMemo(() => {
    return partido ? JSON.parse(partido as string) : null;
  }, [partido]);

  const [sections, setSections] = useState<SectionJugadores[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [checkingVote, setCheckingVote] = useState(true);

  const equipoLocal = partidoData?.home_team ?? 'Local';
  const equipoVisitante = partidoData?.away_team ?? 'Visitante';

  // Obtener el usuario logueado
  useEffect(() => {
    async function loadUser() {
      try {
        const userStr = await AsyncStorage.getItem('user');
        
        if (userStr) {
          const user = JSON.parse(userStr);
          setUserId(user.id);
        } else {
          Alert.alert('Error', 'Debes iniciar sesión para evaluar jugadores', [
            { text: 'OK', onPress: () => router.back() }
          ]);
        }
      } catch (e) {
        console.error('Error al cargar usuario:', e);
        Alert.alert('Error', 'Error al cargar usuario', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
    }
    loadUser();
  }, []);

  // Verificar si el usuario ya votó en este partido
  useEffect(() => {
    async function verificarVoto() {
      if (!userId || !partidoData) {
        setCheckingVote(false);
        return;
      }

      try {
        setCheckingVote(true);
        const matchId = parseInt(partidoData.id);
        const result = await checkUserVoted(userId, matchId);

        if (result.hasVoted) {
          Alert.alert(
            'Ya evaluaste este partido',
            'No puedes evaluar el mismo partido dos veces.',
            [{ text: 'OK', onPress: () => router.back() }]
          );
        }
      } catch (e: any) {
        console.error('Error al verificar voto:', e);
      } finally {
        setCheckingVote(false);
      }
    }

    verificarVoto();
  }, [userId, partidoData]);

  // Cargar jugadores de ambos equipos
  useEffect(() => {
    if (!partidoData) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const [loc, vis] = await Promise.all([
          obtenerJugadores(equipoLocal),
          obtenerJugadores(equipoVisitante),
        ]);

        if (!isMounted) return;
        setSections([
          { title: `Jugadores — ${equipoLocal}`, teamName: equipoLocal, data: loc },
          { title: `Jugadores — ${equipoVisitante}`, teamName: equipoVisitante, data: vis },
        ]);

      } catch (e: any) {
        if (isMounted) setError(e?.message ?? 'Error al cargar jugadores');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    
    return () => { isMounted = false; };
  }, [equipoLocal, equipoVisitante, partidoData]);

  if (!partidoData) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: "Error" }} />
        <Text style={styles.empty}>No se recibieron datos del partido.</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.view}>
        <Stack.Screen
          options={{
            title: 'Partido',
            headerShown: true,
            headerLeft: () => (
              <Pressable onPress={() => router.back()} hitSlop={8}>
                <Text style={styles.btnVolver}>← Volver</Text>
              </Pressable>
            ),
          }}
        />
        <View style={styles.centerContent}>
          <Text style={styles.message}>Error: {error}</Text>
        </View>
      </View>
    );
  }

  // Solo bloqueamos si NO tiene userId, pero dejamos continuar aunque checkingVote sea true
  if (!userId) {
    return (
      <View style={styles.view}>
        <Stack.Screen
          options={{
            title: 'Partido',
            headerShown: true,
            headerLeft: () => (
              <Pressable onPress={() => router.back()} hitSlop={8}>
                <Text style={styles.btnVolver}>← Volver</Text>
              </Pressable>
            ),
          }}
        />
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Cargando usuario...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.view}>
      <Stack.Screen
        options={{
          title: 'Partido',
          headerShown: true,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <Text style={styles.btnVolver}>← Volver</Text>
            </Pressable>
          ),
        }}
      />

      <PlayersSectionList
        sections={sections}
        loading={loading}
        partidoData={partidoData}
        userId={userId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  view: { flex: 1, backgroundColor: "#0b1220" },
  message: { color: '#e5e7eb', fontSize: 16, textAlign: 'center' },
  container: { flex: 1, padding: 16, backgroundColor: "#0b1220", justifyContent: "center" },
  btnVolver: { color: "#93c5fd", fontWeight: "600", fontSize: 15 },
  empty: { color: "#e5e7eb", textAlign: "center", marginTop: 32, fontSize: 16 },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: 16,
  },
});