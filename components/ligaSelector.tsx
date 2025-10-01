import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Modal, FlatList } from 'react-native';

type LigaSelectorProps = {
  onSelect: (liga: string) => void;
  selectedLiga: string;
  ligas: string[];
};

export default function LigaSelector({ onSelect, selectedLiga, ligas }: LigaSelectorProps) {
  const [visible, setVisible] = useState(false);

  const handleSelect = (liga: string) => {
    onSelect(liga);
    setVisible(false);
  };

  return (
    <View>
      <Pressable style={styles.dropdownTrigger} onPress={() => setVisible(true)}>
        <Ionicons name="caret-down-outline" color="white" size={14} />
      </Pressable>

      <Modal transparent visible={visible} animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.dropdown}>
            <FlatList
              data={ligas}
              keyExtractor={(item) => item}
              renderItem={({ item, index }) => {
                const isSelected = item === selectedLiga;
                return (
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => handleSelect(item)}
                    style={({ pressed }) => [
                      styles.option,
                      isSelected && styles.optionSelected,  // resalta la seleccionada
                      pressed && styles.optionPressed,       // feedback al presionar
                    ]}
                    hitSlop={8}
                  >
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                      {item}
                    </Text>
                  </Pressable>
                );
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownTrigger: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: '#1E6091',
    borderRadius: 8,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: '#A9D6E5',
  },

  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 40,
    borderRadius: 10,
    padding: 12,
  },

  option: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionSelected: {
    backgroundColor: '#ffffffff',
    borderWidth: 0.4,
    borderColor: '#1e5f91ff',
  },
  optionPressed: {
    opacity: 0.85,
  },

  optionText: {
    fontSize: 16,
    color: '#185585',
    textAlign: 'center',
    fontWeight: '500',
  },
  optionTextSelected: {
    fontWeight: '600',
    color: '#0E3E6C',
  },
});
