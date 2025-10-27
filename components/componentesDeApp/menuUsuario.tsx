import { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { UserData } from '../apiConnections/types';
import { useRouter } from 'expo-router';




export default function MenuUsuario( { usuario }: { usuario: UserData }) {
  const [visible, setVisible] = useState(false);
  const crest = usuario.club.crest_url;
  const club = usuario.club.nombre;
  const name = usuario.usuario;
  const router = useRouter();  

  const handleLogout = () => {
    setVisible(false);
    router.replace('/(auth)/');       // 👈 navega al login
  };

  return (
    <View style={styles.wrap}>
      
      <Pressable onPress={() => setVisible(!visible)} style={styles.avatarBtn}>
        {crest ? (
          <Image source={{ uri: crest }} style={styles.avatarImg} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarTxt}>{name.charAt(0).toUpperCase()}</Text>
          </View>
        )}
      </Pressable>

      {visible && (
        <View style={styles.menuBox}>
          <View style={styles.menuHeader}>
            {crest ? (
              <Image source={{ uri: crest }} style={styles.menuCrest} />
            ) : (
              <View style={[styles.avatarFallback, { width: 40, height: 40, borderRadius: 20 }]}>
                <Text style={styles.avatarTxt}>{name.charAt(0).toUpperCase()}</Text>
              </View>
            )}
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.menuUser}>{name}</Text>
              <Text style={styles.menuClub}>{club}</Text>
            </View>
          </View>

          <Pressable onPress={() => setVisible(false)} style={styles.menuItem}>
            <Text style={styles.menuItemTxt}>Cerrar</Text>
          </Pressable>
          <Pressable onPress={() => handleLogout()} style={styles.menuItem}>
            <Text style={styles.menuItemTxt}>Cerrar sesion</Text>
          </Pressable>
        </View>
      )}
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

  menuBox: {
    position: 'absolute', top: -100, right: -100, width: 270, height:1200,
    backgroundColor: '#0b1220', borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: '#1f2937', zIndex: 1000,

    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },

  menuHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, marginTop:100 },
  menuCrest: { width: 40, height: 40, resizeMode: 'contain' },
  menuUser: { color: 'white', fontSize: 16, fontWeight: '700' },
  menuClub: { color: '#93c5fd', fontSize: 13, marginTop: 2 },
  menuItem: { paddingVertical: 10, borderRadius: 6 },
  menuItemTxt: { color: 'white', fontSize: 15 },
});

