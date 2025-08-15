import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface Props {
  selectedDay: 'hoy' | 'ayer' | 'man' | 'pasman';
  onAyer: () => void;
  onHoy: () => void;
  onManiana: () => void;
  onPasadoManiana: () => void;
}

export default function DateChips({ selectedDay, onAyer, onHoy, onManiana, onPasadoManiana }: Props) {
  return (
    <View style={styles.row}>
      <Pressable
        style={[styles.chip, selectedDay === 'ayer' && styles.chipPrimary]}
        onPress={onAyer}
      >
        <ThemedText type="defaultSemiBold">Ayer</ThemedText>
      </Pressable>

      <Pressable
        style={[styles.chip, selectedDay === 'hoy' && styles.chipPrimary]}
        onPress={onHoy}
      >
        <ThemedText type="defaultSemiBold">Hoy</ThemedText>
      </Pressable>

      <Pressable
        style={[styles.chip, selectedDay === 'man' && styles.chipPrimary]}
        onPress={onManiana}
      >
        <ThemedText type="defaultSemiBold">Mañana</ThemedText>
      </Pressable>

      <Pressable
        style={[styles.chip, selectedDay === 'pasman' && styles.chipPrimary]}
        onPress={onPasadoManiana}
      >
        <ThemedText type="defaultSemiBold">Pasado mañana</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#e6e6e6',
  },
  chipPrimary: {
    backgroundColor: '#ffb366',
  },
});

