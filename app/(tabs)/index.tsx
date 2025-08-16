// index.tsx
import DateChips from '@/components/Index components/Datechips';
import HeaderBanner from '@/components/Index components/HeaderBanner';
import MatchRow from '@/components/Index components/MatchRow';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MatchItem } from '@/helpers/interfaces/matches';
import { fetchMatches } from '@/helpers/service/matches'; // <-- antes: fetchMatchesForDate
import { shiftDate, sortMatches, todayISO } from '@/helpers/utils/match';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform, RefreshControl, SectionList, StyleSheet, View } from 'react-native';

type Day = 'hoy' | 'ayer' | 'man' | 'pasman';

export default function HomeScreen() {
  // Controla qué pedir al backend
  const [day, setDay] = useState<Day>('hoy');

  // Si más adelante agregás selector de fecha exacta, podés reutilizar estas utilidades.
  const [dateISO] = useState<string>(todayISO());

  const [data, setData] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fecha mostrada en el header (derivada del "day")
  const headerDateISO = useMemo(() => {
    if (day === 'hoy') return todayISO();
    if (day === 'ayer') return shiftDate(todayISO(), -1);
    if (day === 'man') return shiftDate(todayISO(), +1);
    if (day === 'pasman') return shiftDate(todayISO(), +1);
    return todayISO();
  }, [day]);

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
      // Ahora pedimos por día
      const items = await fetchMatches(day);
      items.sort(sortMatches);
      setData(items);
    } catch (e: any) {
      setError(e?.message ?? 'Error cargando partidos');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [day]);

  useEffect(() => { load(); }, [load]);

  const ListHeader = (
    <>
      <View style={{backgroundColor: 'red', marginTop: -20, marginLeft:-20, marginRight:-20}}>
      <HeaderBanner/>
      </View>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Resultados de Fútbol</ThemedText>
        <ThemedText type="default">
          {new Date(headerDateISO).toLocaleDateString()}
        </ThemedText>
      </ThemedView>

      <DateChips
        selectedDay={day}
        onAyer={() => setDay('ayer')}
        onHoy={() => setDay('hoy')}
        onManiana={() => setDay('man')}
        onPasadoManiana={() => setDay('pasman')}
      />


      {loading && (
        <ThemedView style={styles.center}>
          <ThemedText>Cargando partidos…</ThemedText>
        </ThemedView>
      )}

      {!!error && !loading && (
        <ThemedView style={styles.errorBox}>
          <ThemedText type="defaultSemiBold">No se pudieron cargar los partidos</ThemedText>
          <ThemedText>{error}</ThemedText>
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
          <ThemedText type="subtitle" style={styles.leagueTitle}>{section.title}</ThemedText>
        </ThemedView>
      )}
      ListHeaderComponent={ListHeader}
      ListEmptyComponent={
        !loading
          ? <ThemedView style={styles.center}><ThemedText>No hay partidos para esta fecha.</ThemedText></ThemedView>
          : null
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
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
      stickySectionHeadersEnabled
      contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
    />
  );
}

const styles = StyleSheet.create({
  titleContainer: { flexDirection: 'row', alignItems: 'baseline', gap: 12, marginBottom: 8 },
  leagueSection: { marginTop: 10, marginBottom: 6 },
  leagueTitle: { marginBottom: 6 },
  center: { alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 },
  errorBox: { padding: 16, borderRadius: 12, borderWidth: StyleSheet.hairlineWidth, borderColor: '#ff3b30', gap: 10, marginBottom: 12 },
  footerHint: { marginTop: 8 },
});

