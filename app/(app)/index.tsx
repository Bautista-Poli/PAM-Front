import { Link } from "expo-router";
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import Partido from '@/components/partido';
import { getPartidos } from '@/components/info';

type Dia = 'ayer' | 'hoy' | 'mañana';

export default function Index() {
  const [day, setDay] = useState<Dia>('hoy');

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
        <Text style={[styles.dayChipText, selected && styles.dayChipTextSelected]}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {day === 'hoy' ? 'Partidos de hoy' : day === 'ayer' ? 'Partidos de ayer' : 'Partidos de mañana'}
      </Text>

      <View style={styles.buttonRow}>
        <DayChip label="Ayer" value="ayer" />
        <DayChip label="Hoy" value="hoy" />
        <DayChip label="Mañana" value="mañana" />
      </View>

      <View style={{ alignItems: "center", marginVertical: 12 }}>
        <Link href="/ligas" asChild>
          <Pressable
            style={({ pressed }) => [
              styles.ligaBtn,
              pressed && styles.ligaBtnPressed,
            ]}
          >
            <Text style={styles.ligaBtnText}>Tabla Liga Profesional</Text>
          </Pressable>
        </Link>
      </View>

      <FlatList
        data={getPartidos(day)}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.card}
        renderItem={({ item }) => <Partido data={item} />}
        ListEmptyComponent={<Text style={styles.empty}>Sin partidos para este día</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#112336ff', paddingTop: 20, gap: 12 },
  card: { gap: 8, paddingBottom: 24, marginHorizontal: 7 },
  buttonRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 4 },
  title: { color: '#e9ebeeff', textAlign: 'center', fontSize: 18, fontWeight: '600', marginBottom: 12, marginTop: 37 },
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
    backgroundColor: '#1E6091',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A9D6E5',
  },
  ligaBtnPressed: {
    opacity: 0.75,
  },
  ligaBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
