import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

// Cambiá el require a tu nueva imagen para “sacar/cambiar la foto”
export default function HeaderBanner() {
  return (
    <View style={{ height: 120, marginBottom: 28, marginTop: 28 }}>
      <Image source={require('@/assets/images/promiedos.jpg')} style={styles.img} />
    </View>
  );
}

const styles = StyleSheet.create({
  img: {
    height: 120,
    width: 390,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
