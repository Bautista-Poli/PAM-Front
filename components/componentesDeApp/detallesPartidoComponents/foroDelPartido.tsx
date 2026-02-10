import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TextInput, Pressable, 
  KeyboardAvoidingView, Platform, Image, ActivityIndicator 
} from 'react-native';
import { ForoComment, getMatchComments, postComment } from '@/apiConnections/foro';

interface ForoProps {
  matchId: number;
  userId: number;
}

export default function ForoPartido({ matchId, userId }: ForoProps) {
  const [mensaje, setMensaje] = useState("");
  const [comentarios, setComentarios] = useState<ForoComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const cargarComentarios = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const data = await getMatchComments(matchId);
      setComentarios(data);
    } catch (error) {
      console.error("Error al cargar comentarios:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    cargarComentarios(true);

    const interval = setInterval(() => {
      cargarComentarios(false); 
    }, 50000);

    return () => clearInterval(interval); 
  }, [matchId]);

  const handleEnviar = async () => {
    if (!mensaje.trim() || isSending) return;

    setIsSending(true);
    try {
      const textoEnviar = mensaje.trim();
      setMensaje(""); 
      await postComment(matchId, userId, textoEnviar);
      await cargarComentarios(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 200);
    } catch (error) {
      alert("No se pudo enviar el mensaje");
    } finally {
      setIsSending(false);
    }
  };

  if (loading) return <ActivityIndicator color="#3b82f6" style={{ marginTop: 20 }} />;

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
        // Este valor es clave: si el teclado tapa el input, subí este número (ej. 120 o 140)
        keyboardVerticalOffset={Platform.OS === "ios" ? 360 : 0} 
      >
        <FlatList
          ref={flatListRef}
          data={comentarios}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          // Pull to refresh manual por si el usuario es ansioso
          onRefresh={() => cargarComentarios(false)}
          refreshing={false}
          renderItem={({ item }) => (
            <View style={styles.messageRow}>
              <Image 
                source={{ uri: item.user?.club?.crest_url || 'https://via.placeholder.com/40' }} 
                style={styles.miniLogo} 
              />
              <View style={styles.bubble}>
                <Text style={styles.username}>{item.user?.usuario}</Text>
                <Text style={styles.text}>{item.text}</Text>
                <Text style={styles.time}>
                  {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
          )}
        />

        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            placeholder="Escribe algo..."
            placeholderTextColor="#94a3b8"
            value={mensaje}
            onChangeText={setMensaje}
            multiline={false} 
            returnKeyType="send"
            onSubmitEditing={handleEnviar}
          />
          <Pressable onPress={handleEnviar} disabled={isSending}>
            <Text style={[styles.sendBtnText, isSending && { opacity: 0.5 }]}>
              {isSending ? "..." : "Enviar"}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1220' },
  listContent: { padding: 16, paddingBottom: 20 },
  messageRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-end' },
  miniLogo: { width: 24, height: 24, borderRadius: 12, marginRight: 8 },
  bubble: { 
    flex: 1, 
    backgroundColor: '#1e293b', 
    padding: 10, 
    borderRadius: 15, 
    borderBottomLeftRadius: 2 
  },
  username: { color: '#3b82f6', fontSize: 11, fontWeight: 'bold' },
  text: { color: '#f1f5f9', fontSize: 14 },
  time: { color: '#64748b', fontSize: 9, textAlign: 'right' },
  inputArea: { 
    flexDirection: 'row', 
    padding: 10, 
    backgroundColor: '#0f172a',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1e293b'
  },
  input: { 
    flex: 1, 
    backgroundColor: '#1e293b', 
    color: '#fff', 
    borderRadius: 20, 
    paddingHorizontal: 15, 
    height: 50 ,
    marginBottom: 10,
  },
  sendBtnText: { color: '#3b82f6', fontWeight: 'bold', marginLeft: 10 }
});