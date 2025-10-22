import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet } from "react-native";



export default function EvaluarFooter({ onPress }: {onPress: () => void}) {
  return (
    <View style={{ paddingBottom: 24 }}>
      <Pressable onPress={onPress} style={styles.btnEvaluar}>
        <Text style={styles.btnEvaluarTxt}>Evaluar</Text>
      </Pressable>
    </View>
  );
}


const styles = StyleSheet.create({
btnEvaluar: {
  backgroundColor: '#2563eb',       // azul brillante
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
  elevation: 6,                      // efecto de sombra en Android
},

btnEvaluarTxt: {
  color: '#f8fafc',                  // blanco suave
  fontWeight: '700',
  fontSize: 17,
  letterSpacing: 0.8,
  textTransform: 'uppercase',
},
})
