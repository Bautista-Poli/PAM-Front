// MenuUsuario.tsx (Versión Limpia)

import { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import { UserData } from '../apiConnections/types';
import { useRouter } from 'expo-router';
import { useAuth } from '@/auth/authContext';

export default function MenuUsuario( { usuario }: { usuario: UserData }) {
  const [visible, setVisible] = useState(false);
  const crest = usuario.club.crest_url;
  const club = usuario.club.nombre;
  const name = usuario.usuario;
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      setVisible(false);
      router.replace('/login');
    }
    catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert('Error', 'No se pudo cerrar sesión correctamente');
    }
  };

  const handleGoToTeam = () => {
    setVisible(false);
    router.push({
      pathname: '/equipo',
      params: { nombre: club }
    });
  };

  return (
    <View style={styles.wrap}>
      
      <Pressable onPress={() => setVisible(true)} style={styles.avatarBtn}>
        {crest ? (
          <Image source={{ uri: crest }} style={styles.avatarImg} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarTxt}>{name.charAt(0).toUpperCase()}</Text>
          </View>
        )}
      </Pressable>

      <Modal
        transparent={true}
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.modalBackdrop}>
            
            <TouchableWithoutFeedback>
              <View style={styles.menuBox}>
                <View style={styles.menuHeader}>
                  {crest ? (
                    <Image source={{ uri: crest }} style={styles.menuCrest} />
                  ) : (
                    <View style={[styles.avatarFallback, { width: 45, height: 45, borderRadius: 22.5 }]}>
                      <Text style={styles.avatarTxt}>{name.charAt(0).toUpperCase()}</Text>
                    </View>
                  )}
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.menuUser}>{name}</Text>
                    <Text style={styles.menuClub}>{club}</Text>
                  </View>
                </View>

                
                <Pressable onPress={handleGoToTeam} style={styles.menuItem}>
                  <Text style={styles.menuItemTxt}>Ver mi equipo</Text>
                </Pressable>
                <Pressable onPress={handleLogout} style={styles.menuItem}>
                  <Text style={styles.menuItemTxt}>Cerrar sesión</Text>
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'relative', zIndex: 100 },
  avatarBtn: {
    width: 36, height: 36, borderRadius: 18, overflow: 'hidden',
    backgroundColor: '#1f2937', justifyContent: 'center',
    marginLeft: 100,
    zIndex: 100,
  },
  avatarImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  avatarFallback: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#334155',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarTxt: { color: 'white', fontWeight: '700' },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'flex-end',
  },
  menuBox: {
    marginTop: 80,
    marginRight: 20,
    width: 270,
    backgroundColor: '#0b1220',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  menuHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  menuCrest: { width: 45, height: 45, resizeMode: 'contain' },
  menuUser: { color: 'white', fontSize: 18, fontWeight: '700' },
  menuClub: { color: '#93c5fd', fontSize: 13, marginTop: 2 },
  menuItem: { paddingVertical: 10, borderRadius: 6 },
  menuItemTxt: { color: 'white', fontSize: 15 },
  separador: { color: 'white', marginBottom: 10, marginTop: 5}
});