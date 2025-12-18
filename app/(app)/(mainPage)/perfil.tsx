import { useState, useEffect } from 'react';
import { View, Text, Image, Pressable, StyleSheet, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '@/auth/authContext';
import { Club } from '@/components/apiConnections/types';
import { updateUserProfile, getClubsArgentinos } from '@/components/apiConnections/apileagues';
import LoaderBall from '@/components/animations/animacionCarga';

export default function EditarPerfil() {
  const router = useRouter();
  const { user, setUser } = useAuth();

  const [nombre, setNombre] = useState(user?.usuario || '');
  const [selectedClub, setSelectedClub] = useState<Club | null>(
    user?.club ? { id: user.club_id, nombre: user.club.nombre, crest_url: user.club.crest_url } : null
  );
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadClubs();
  }, []);

  const loadClubs = async () => {
    try {
      setLoading(true);
      const clubsList = await getClubsArgentinos();
      setClubs(clubsList);
    } catch (error) {
      console.error('Error al cargar clubes:', error);
      Alert.alert('Error', 'No se pudieron cargar los clubes');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre no puede estar vacío');
      return;
    }

    if (!selectedClub) {
      Alert.alert('Error', 'Debes seleccionar un club');
      return;
    }

    try {
      setSaving(true);
      const updatedUser = await updateUserProfile(user.id, nombre.trim(), selectedClub.id);
      
      // Actualizar el contexto de auth
      await setUser(updatedUser);
      
      Alert.alert('Éxito', 'Perfil actualizado correctamente', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <LoaderBall message="Cargando información..." fullScreen />
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Editar Perfil',
          headerShown: true,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <Text style={styles.btnVolver}>← Volver</Text>
            </Pressable>
          ),
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          {selectedClub?.crest_url ? (
            <Image source={{ uri: selectedClub.crest_url }} style={styles.avatar} resizeMode="cover"/>
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarPlaceholderText}>
                {nombre.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Text style={styles.avatarLabel}>Tu equipo</Text>
        </View>

        {/* Nombre Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Nombre de usuario</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Tu nombre de usuario"
            placeholderTextColor="#64748b"
            editable={!saving}
          />
          <Text style={styles.hint}>
            Este nombre aparecerá en tus evaluaciones
          </Text>
        </View>

        {/* Club Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Club favorito</Text>
          <Text style={styles.description}>
            Seleccioná tu equipo favorito. Podés cambiarlo cuando quieras.
          </Text>
          
          <View style={styles.clubsGrid}>
            {clubs.map((club) => {
              const isSelected = selectedClub?.id === club.id;
              return (
                <Pressable
                  key={club.id}
                  style={[
                    styles.clubCard,
                    isSelected && styles.clubCardSelected,
                  ]}
                  onPress={() => setSelectedClub(club)}
                  disabled={saving}
                >
                  <Image
                    source={{ uri: club.crest_url }}
                    style={styles.clubCrest}
                    resizeMode="contain"
                  />
                  <Text
                    style={[
                      styles.clubName,
                      isSelected && styles.clubNameSelected,
                    ]}
                    numberOfLines={2}
                  >
                    {club.nombre}
                  </Text>
                  {isSelected && (
                    <View style={styles.selectedBadge}>
                      <Text style={styles.selectedBadgeText}>✓</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Footer con botones */}
      <View style={styles.footer}>
        <Pressable
          style={[styles.button, styles.buttonCancel]}
          onPress={() => router.back()}
          disabled={saving}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </Pressable>
        
        <Pressable
          style={[
            styles.button,
            styles.buttonSave,
            saving && styles.buttonDisabled,
          ]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.buttonText}>Guardar cambios</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1220',
  },
  btnVolver: {
    color: '#93c5fd',
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1f2937',
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarPlaceholderText: {
    color: 'white',
    fontSize: 48,
    fontWeight: '700',
  },
  avatarLabel: {
    color: '#94a3b8',
    fontSize: 14,
  },
  section: {
    marginBottom: 32,
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 16,
    lineHeight: 20,
  },
  input: {
    backgroundColor: '#1f2937',
    color: 'white',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  hint: {
    fontSize: 13,
    color: '#64748bce',
    marginTop: 10,
    fontStyle: 'italic',
  },
  clubsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  clubCard: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#374151',
    position: 'relative',
  },
  clubCardSelected: {
    borderColor: '#3b82f6',
    backgroundColor: '#1e3a8a',
  },
  clubCrest: {
    width: '70%',
    height: '50%',
    marginBottom: 8,
  },
  clubName: {
    color: '#94a3b8',
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '500',
  },
  clubNameSelected: {
    color: '#93c5fd',
    fontWeight: '700',
  },
  selectedBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#3b82f6',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBadgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    backgroundColor: '#0b1220',
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonCancel: {
    backgroundColor: '#374151',
  },
  buttonSave: {
    backgroundColor: '#1e6091',
  },
  buttonDisabled: {
    backgroundColor: '#64748b',
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});