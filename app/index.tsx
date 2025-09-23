import { getPartidos } from '@/components/info';
import Partido, {PartidoData } from '@/components/partido';
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ImageSourcePropType, FlatList } from 'react-native';



export default function Index() {
  const [day, setDay] = useState<string>('hoy');

  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {day === 'hoy' ? 'Partidos de hoy' : day === 'ayer' ? 'Partidos de ayer' : 'Partidos de mañana'}
      </Text>

      <View style={styles.buttonRow}>
        <View style={styles.buttonContainer}>
          <Button title="Hoy" onPress={() => setDay('hoy')} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Mañana" onPress={() => setDay('mañana')} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Ayer" onPress={() => setDay('ayer')} />
        </View>
      </View>

      <FlatList
        data={getPartidos(day)}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
        renderItem={({ item }) => <Partido data={item} />}
        ListEmptyComponent={
          <Text style={styles.empty}>Sin partidos para este día</Text>
        }
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 16,
    paddingTop: 92,
    gap: 16,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e2e8f0',
    textAlign: 'center',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 4,
  },
  buttonContainer: {
    width: 110,
  },
  empty: { color: '#94a3b8', textAlign: 'center', marginTop: 24 },
  title: { color: '#e2e8f0', textAlign: 'center', fontSize: 18, fontWeight: '600', marginBottom: 12 },
});