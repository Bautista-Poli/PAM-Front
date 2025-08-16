// ClubScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import HeaderBanner from '@/components/Index components/HeaderBanner';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type RouteParams = { clubId: number; clubName: string };

type Match = {
  id: number;
  date: string;            // ISO
  localTeam: string;
  awayTeam: string;
  scoreLocal: number | null;
  scoreAway: number | null;
  isLocal: boolean;        // true si el clubId es local
  opponent: string;
};

type Player = { id: number; name: string; position: string };

const API_BASE = 'https://tu-backend.example.com'; // <-- ajustá si tenés backend

export default function ClubScreen() {
  
  const clubId = 1;
  const clubName = "Bosta Juniors";

  const [crestUrl, setCrestUrl] = useState<string | null>(null);
  const [lastMatch, setLastMatch] = useState<Match | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // --- Cargar datos (real + fallback mock) ---
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {

        // --- MOCK de ejemplo (borra si usás API real) ---
        const matchJson: Match = {
          id: 9991,
          date: new Date().toISOString(),
          localTeam: 'Boca Juniors',
          awayTeam: 'Ind. Rivadavia',
          scoreLocal: 2,
          scoreAway: 1,
          isLocal: true,
          opponent: 'Ind. Rivadavia',
        };
        const playersJson: Player[] = [
          { id: 1, name: 'Romero', position: 'GK' },
          { id: 2, name: 'Advíncula', position: 'RB' },
          { id: 3, name: 'Figal', position: 'CB' },
          { id: 4, name: 'Valentini', position: 'CB' },
          { id: 5, name: 'Blondel', position: 'LB' },
          { id: 6, name: 'Medina', position: 'CM' },
          { id: 7, name: 'Equi Fernández', position: 'CM' },
          { id: 8, name: 'Zenón', position: 'CM' },
          { id: 9, name: 'Merentiel', position: 'FW' },
          { id: 10, name: 'Cavani', position: 'FW' },
          { id: 11, name: 'Langoni', position: 'FW' },
        ];
        const crest = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Boca_Juniors_logo18.svg/240px-Boca_Juniors_logo18.svg.png';
        // ---

        if (!cancelled) {
          setLastMatch(matchJson);
          setPlayers(playersJson);
          setCrestUrl(crest);
          // precargar ratings en 0
          const init: Record<number, number> = {};
          playersJson.forEach(p => (init[p.id] = 0));
          setRatings(init);
        }
      } catch (err) {
        if (!cancelled) Alert.alert('Error', 'No pudimos cargar datos');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [clubId]);

  const canSubmit = useMemo(
    () =>
      players.length > 0 &&
      players.every(p => (ratings[p.id] ?? 0) > 0) &&
      !!lastMatch,
    [players, ratings, lastMatch]
  );

  const handleRate = (playerId: number, value: number) =>
    setRatings(prev => ({ ...prev, [playerId]: value }));

  const submitVotes = async () => {
    if (!lastMatch) return;
    try {
      setSending(true);
      const payload = {
        matchId: lastMatch.id,
        clubId,
        votes: players.map(p => ({
          playerId: p.id,
          rating: ratings[p.id],
        })),
      };
      // Si tenés backend real:
      // await fetch(`${API_BASE}/votes`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload),
      // });

      // Mock “ok”
      await new Promise(r => setTimeout(r, 800));
      Alert.alert('¡Gracias!', 'Tus votos fueron enviados.');
    } catch (e) {
      Alert.alert('Error', 'No se pudieron enviar los votos.');
    } finally {
      setSending(false);
    }
  };

  if (loading || !lastMatch) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  const title = `${clubName}`;
  const subtitle = lastMatch.isLocal
    ? `${lastMatch.localTeam} ${safeScore(lastMatch.scoreLocal)} - ${safeScore(lastMatch.scoreAway)} ${lastMatch.awayTeam}`
    : `${lastMatch.localTeam} ${safeScore(lastMatch.scoreLocal)} - ${safeScore(lastMatch.scoreAway)} ${lastMatch.awayTeam}`;

  return (
    <FlatList
      data={players}
      keyExtractor={(p) => String(p.id)}
      style={{ backgroundColor: 'red' }}
      ListHeaderComponent={
        <>
          {/* Banner */}
          <HeaderBanner />

          {/* Resto del header */}
          <View style={styles.container}>
            <View style={styles.header}>
              {crestUrl ? (
                <Image
                  source={{
                    uri: 'https://image.spreadshirtmedia.net/image-server/v1/products/T1459A839PA4459PT28D314893739W10000H8355/views/1,width=378,height=378,appearanceId=839,backgroundColor=F2F2F2/stelle-del-mucchio-di-merda-della-corona-dalloro.jpg'
                  }}
                  style={{ width: 60, height: 60, resizeMode: 'contain' }}
                />
              ) : null}
              <View style={{ flex: 1 }}>
                <Text style={styles.clubName}>{title}</Text>
                <Text style={styles.breadcrumb}>
                  Liga Profesional Argentina ▸ {clubName}
                </Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Último partido</Text>
              <Text style={styles.matchLine}>{subtitle}</Text>
              <Text style={styles.matchMeta}>
                Rival: {lastMatch.opponent} • {new Date(lastMatch.date).toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Votá a los jugadores</Text>
            </View>
          </View>
        </>
      }
      ItemSeparatorComponent={() => <View style={styles.sep} />}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.playerName}>{item.name}</Text>
            <Text style={styles.playerPos}>{item.position}</Text>
          </View>
          <Stars
            value={ratings[item.id] ?? 0}
            onChange={(v) => handleRate(item.id, v)}
          />
        </View>
      )}
      ListFooterComponent={
        <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
          <Pressable
            style={[styles.btn, !canSubmit && styles.btnDisabled]}
            onPress={submitVotes}
            disabled={!canSubmit || sending}
          >
            <Text style={styles.btnText}>
              {sending ? 'Enviando…' : 'Enviar votos'}
            </Text>
          </Pressable>
        </View>
      }
    />
  );
}

function Stars({
  value,
  onChange,
  max = 10,
}: {
  value: number;
  onChange: (v: number) => void;
  max?: number;
}) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <Pressable key={n} onPress={() => onChange(n)} hitSlop={8}>
          <Text style={[styles.star, value >= n && styles.starActive]}>
            ★
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function safeScore(s: number | null) {
  return typeof s === 'number' ? s : '-';
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16 , backgroundColor: 'white'},
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'white',
    marginTop: 20,
  },
  crest: { width: 44, height: 44, resizeMode: 'contain' },
  clubName: { fontSize: 20, fontWeight: '700', color: 'black' },
  breadcrumb: { color: 'black' },

  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
  },
  cardTitle: { color: 'black', marginBottom: 8, fontWeight: '600' },
  matchLine: { color: 'black', fontSize: 16, fontWeight: '700' },
  matchMeta: { color: 'black', marginTop: 4 },

  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, marginLeft:10, marginRight:10 },
  playerName: { color: 'white', fontWeight: '600' },
  playerPos: { color: '#9fc3bb', fontSize: 12 },
  sep: { height: 1, backgroundColor: 'red', marginVertical: 4 },

  star: { fontSize: 22, color: '#557e76', marginHorizontal: 2 },
  starActive: { color: '#ffd60a' },

  btn: {
    marginTop: 12,
    backgroundColor: '#1db954',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: 'black', fontWeight: '700' },
});
