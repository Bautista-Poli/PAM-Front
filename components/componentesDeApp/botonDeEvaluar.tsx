import React from 'react';
import { Pressable, Text, View, StyleSheet, ActivityIndicator } from 'react-native';

type Props = {
  onPress: () => void;
  disabled?: boolean;
};

export default function EvaluarFooter({ onPress, disabled = false}: Props) {
  return (
    <View style={{ paddingBottom: 24 }}>
      <Pressable
        onPress = {onPress}
        style = {[styles.btnEvaluar, disabled && styles.btnDisabled]}
        disabled = {disabled}
      >
        {disabled ? (<ActivityIndicator color="#f8fafc" size="small" />) : (
          <Text style={styles.btnEvaluarTxt}>Evaluar</Text>
        )}
      </Pressable>
    </View>
  );
}


const styles = StyleSheet.create({
  btnEvaluar: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 24,
    width: '70%',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  btnDisabled: {
    backgroundColor: '#64748b',
    shadowOpacity: 0.2,
  },
  btnEvaluarTxt: {
    color: '#f8fafc',
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
})
