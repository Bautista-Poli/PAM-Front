// components/LigaSelector.tsx
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
        <Ionicons name="caret-down-outline" color={"white"} size={14}/>
      </Pressable>

      <Modal transparent visible={visible} animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.dropdown}>
            <FlatList
              data={ligas}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable onPress={() => handleSelect(item)} style={styles.option}>
                  <Text style={styles.optionText}>{item}</Text>
                </Pressable>
              )}
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
  triggerText: {
    color: 'white',
    fontWeight: '600',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dropdown: {
    backgroundColor: '#fff',
    marginHorizontal: 40,
    borderRadius: 10,
    padding: 12,
  },
  option: {
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#1E6091',
    textAlign: 'center',
  },
});
