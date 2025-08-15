import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image } from 'expo-image';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  RefreshControl,
  SectionList,
  StyleSheet,
  View,
} from 'react-native';

// ⛔️ Ya no usamos ParallaxScrollView
// import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// ===== Tipos =====
interface MatchItem {
  id: string;
  utcDate: string; // ISO
  status: 'SCHEDULED' | 'LIVE' | 'IN_PLAY' | 'PAUSED' | 'FINISHED' | 'POSTPONED' | 'CANCELED' | 'TIMED';
  league: string;
  homeTeam: string;
  awayTeam: string;
  score: {
    home: number | null;
    away: number | null;
  };
  minute?: number | null; // si está en vivo
}

// ===== Utilidades =====
const todayISO = () => new Date().toISOString().slice(0, 10);
const shiftDate = (iso: string, days: number) => {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

function formatKickoff(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

function statusBadge(m: MatchItem) {
  if (m.status === 'FINISHED') return 'FT';
  if (m.status === 'LIVE' || m.status === 'IN_PLAY' || m.status === 'PAUSED') {
    return m.minute ? `${m.minute}'` : 'LIVE';
  }
  return formatKickoff(m.utcDate);
}

// ===== API / Datos =====
async function fetchMatchesForDate(_dateISO: string): Promise<MatchItem[]> {
  const BASE =
    process.env.EXPO_PUBLIC_API_BASE?.replace(/\/+$/, '') || 'http://localhost:3000';

  const url = `${BASE}/api/matches?day=hoy&liveOnly=false`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${res.statusText} ${text || ''}`.trim());
  }
  const json = await res.json();

  const nowISO = new Date().toISOString();

  const items: MatchItem[] = (json.data || []).map((m: any, idx: number) => {
    const minuteNum =
      typeof m.minute === 'string'
        ? Number((m.minute || '').replace(/[^\d]/g, '')) || null
        : (m.minute ?? null);

    return {
      id: String(m.url || idx),
      utcDate: nowISO,
      status: 'LIVE',
      league: m.league ?? '—',
      homeTeam: m.home ?? 'Home',
      awayTeam: m.away ?? 'Away',
      score: {
        home: m.scoreHome ?? null,
        away: m.scoreAway ?? null,
      },
      minute: minuteNum,
    } as MatchItem;
  });

  return items;
}

// ===== UI =====
export default function HomeScreen() {
  const [dateISO, setDateISO] = useState<string>(todayISO());
  const [data, setData] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const map = new Map<string, MatchItem[]>();
    for (const m of data) {
      const k = m.league || '—';
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(m);
    }
    return Array.from(map.entries()).map(([league, matches]) => ({ league, matches }));
  }, [data]);

  const sections = useMemo(
    () => grouped.map(g => ({ title: g.league, data: g.matches })),
    [grouped]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await fetchMatchesForDate(dateISO);
      items.sort((a, b) => {
        const order = (m: MatchItem) =>
          m.status === 'LIVE' || m.status === 'IN_PLAY' || m.status === 'PAUSED'
            ? 0
            : m.status === 'SCHEDULED' || m.status === 'TIMED'
            ? 1
            : 2;
        const oa = order(a);
        const ob = order(b);
        if (oa !== ob) return oa - ob;
        return new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime();
      });
      setData(items);
    } catch (e: any) {
      setError(e?.message ?? 'Error cargando partidos');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [dateISO]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(() => {
    load();
  }, [load]);

  // Header de la lista (lo que estaba antes arriba del FlatList)
  const ListHeader = (
    <>
      <View style={{ height: 178, marginBottom: 8 }}>
        <Image
          source={require('@/assets/images/promiedos.jpg')}
          style={styles.reactLogo}
        />
      </View>

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Resultados de Fútbol</ThemedText>
        <ThemedText type="default">{new Date(dateISO).toLocaleDateString()}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.chipsRow}>
        <Pressable style={styles.chip} onPress={() => setDateISO(shiftDate(dateISO, -1))}>
          <ThemedText type="defaultSemiBold">Ayer</ThemedText>
        </Pressable>
        <Pressable style={[styles.chip, styles.chipPrimary]} onPress={() => setDateISO(todayISO())}>
          <ThemedText type="defaultSemiBold">Hoy</ThemedText>
        </Pressable>
        <Pressable style={styles.chip} onPress={() => setDateISO(shiftDate(dateISO, 1))}>
          <ThemedText type="defaultSemiBold">Mañana</ThemedText>
        </Pressable>
      </ThemedView>

      {loading && (
        <ThemedView style={styles.center}>
          <ActivityIndicator />
          <ThemedText>Cargando partidos…</ThemedText>
        </ThemedView>
      )}

      {!!error && !loading && (
        <ThemedView style={styles.errorBox}>
          <ThemedText type="defaultSemiBold">No se pudieron cargar los partidos</ThemedText>
          <ThemedText>{error}</ThemedText>
          <Pressable style={[styles.chip, styles.chipPrimary]} onPress={load}>
            <ThemedText type="defaultSemiBold">Reintentar</ThemedText>
          </Pressable>
        </ThemedView>
      )}
    </>
  );

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <MatchRow item={item} />}
      renderSectionHeader={({ section }) => (
        <ThemedView style={styles.leagueSection}>
          <ThemedText type="subtitle" style={styles.leagueTitle}>
            {section.title}
          </ThemedText>
        </ThemedView>
      )}
      ListHeaderComponent={ListHeader}
      ListEmptyComponent={
        !loading ? (
          <ThemedView style={styles.center}>
            <ThemedText>No hay partidos para esta fecha.</ThemedText>
          </ThemedView>
        ) : null
      }
      ListFooterComponent={
        <ThemedView style={styles.footerHint}>
          <ThemedText>
            {`DevTools → `}
            <ThemedText type="defaultSemiBold">
              {Platform.select({ ios: 'cmd + d', android: 'cmd + m', web: 'F12' })}
            </ThemedText>
          </ThemedText>
        </ThemedView>
      }
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
      stickySectionHeadersEnabled
      contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
    />
  );
}

function MatchRow({ item }: { item: MatchItem }) {
  const live = item.status === 'LIVE' || item.status === 'IN_PLAY' || item.status === 'PAUSED';
  const finished = item.status === 'FINISHED';
  return (
    <ThemedView style={[styles.card, live && styles.cardLive, finished && styles.cardFinished]}>
      <View style={styles.rowHeader}>
        <View
          style={[
            styles.badge,
            live ? styles.badgeLive : finished ? styles.badgeFinished : styles.badgeDefault,
          ]}
        >
          <ThemedText type="defaultSemiBold">{statusBadge(item)}</ThemedText>
        </View>
      </View>

      <View style={styles.teamsRow}>
        <TeamScore name={item.homeTeam} score={item.score.home} align="right" />
        <ThemedText style={styles.vs}>vs</ThemedText>
        <TeamScore name={item.awayTeam} score={item.score.away} align="left" />
      </View>
    </ThemedView>
  );
}

function TeamScore({ name, score, align }: { name: string; score: number | null; align: 'left' | 'right' }) {
  return (
    <View style={[styles.teamCol, align === 'right' ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' }]}>
      <ThemedText type="defaultSemiBold" style={styles.teamName}>
        {name}
      </ThemedText>
      <ThemedText type="title" style={styles.score}>
        {score ?? '—'}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#e6e6e6',
  },
  chipPrimary: {
    backgroundColor: '#ffb366',
  },
  leagueSection: {
    marginTop: 10,
    marginBottom: 6,
  },
  leagueTitle: {
    marginBottom: 6,
  },
  card: {
    backgroundColor: '#ffffff12',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ffffff22',
  },
  cardLive: {
    borderColor: '#ff3b30',
  },
  cardFinished: {
    opacity: 0.9,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeLive: { backgroundColor: '#ff3b3033' },
  badgeFinished: { backgroundColor: '#34c75933' },
  badgeDefault: { backgroundColor: '#ffffff22' },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  teamCol: {
    flex: 1,
  },
  teamName: {
    fontSize: 16,
  },
  score: {
    fontVariant: ['tabular-nums'],
  },
  vs: {
    width: 32,
    textAlign: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 8,
  },
  errorBox: {
    padding: 16,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ff3b30',
    gap: 10,
    marginBottom: 12,
  },
  footerHint: {
    marginTop: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});




