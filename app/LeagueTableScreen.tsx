import React, { useEffect, useState, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  SectionList,
} from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";

// ===== API base =====
const API_BASE =
  process.env.EXPO_PUBLIC_API_BASE?.replace(/\/+$/, "") ||
  (Platform.OS === "android" ? "http://10.0.2.2:3100" : "http://localhost:3100");

// ===== Helpers de normalización =====
const normalizeKey = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

// ===== Presets =====
// - preset: clave que entiende tu server2 (/tables/:preset)
// - table: número 1-based de la tabla a traer (si es 1 sola)
// - tables: array de tablas a traer (multi; 1-based). Si existe, ignora "table".
type PresetCfg = { preset: string; table?: number; tables?: number[]; title?: string };
const LEAGUE_PRESETS: Record<string, PresetCfg> = {
  // Premier League (1 tabla)
  "premier": { preset: "premier-league-h" },
  "premier-league": { preset: "premier-league-h" },
  "premier league": { preset: "premier-league-h" },
  "premierleague": { preset: "premier-league-h" },

  "la liga": { preset: "laliga-bb" },
  "laliga": { preset: "laliga-bb" },
  "liga espanola": { preset: "laliga-bb" },
  "espana": { preset: "laliga-bb" }, 

  // Liga Argentina (2 grupos en la página /liga-profesional/hc ⇒ tablas 1 y 2)
  "liga profesional argentina": { preset: "liga-profesional-hc", tables: [1, 2] },
  "liga profesional": { preset: "liga-profesional-hc", tables: [1, 2] },
  "liga argentina": { preset: "liga-profesional-hc", tables: [1, 2] },
  "argentina": { preset: "liga-profesional-hc", tables: [1, 2] },
};

type TeamRow = {
  id: number;
  position: number;
  name: string;
  crest?: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  gf: number;
  ga: number;
  pts: number;
};

type SectionData = { title: string; data: TeamRow[] };

export default function LeagueTableScreen() {
  const router = useRouter();
  const { league } = useLocalSearchParams<{ league?: string }>(); // viene de index.tsx (section.title)

  const [rows, setRows] = useState<TeamRow[]>([]);
  const [sections, setSections] = useState<SectionData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const mapApiRow = (r: any, idx: number): TeamRow => {
    const goalsStr = String(r.goals ?? r.gol ?? "0:0");
    const [gfStr, gaStr] = goalsStr.split(":");
    const gf = Number.parseInt(gfStr, 10);
    const ga = Number.parseInt(gaStr, 10);
    return {
      id: r.pos ?? idx + 1,
      position: r.pos ?? idx + 1,
      name: r.team ?? r.name ?? "",
      crest: r.crest || undefined,
      played: r.played ?? r.j ?? 0,
      wins: r.wins ?? r.g ?? 0,
      draws: r.draws ?? r.e ?? 0,
      losses: r.losses ?? r.po ?? 0,
      gf: Number.isFinite(r.gf) ? r.gf : Number.isFinite(gf) ? gf : 0,
      ga: Number.isFinite(r.ga) ? r.ga : Number.isFinite(ga) ? ga : 0,
      pts: r.pts ?? 0,
    };
  };

  const loadData = useCallback(async () => {
  setLoading(true);
  setSections(null);
  try {
    const rawKey = String(league ?? "");
    const key = normalizeKey(rawKey);
    const cfg = LEAGUE_PRESETS[key];
    if (!cfg) throw new Error(`Liga desconocida: "${rawKey}"`);

    // ✅ asegura que siempre sea un array
    const tables = cfg.tables ?? [];

    // -------- MULTI TABLA (Grupo A / B) --------
    if (tables.length > 0) {
      const url = `${API_BASE}/tables/${cfg.preset}?fields=nice`;
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || `HTTP ${res.status}`);
      }
      const allTables: Array<{ title?: string; rows: any[] }> = await res.json();

      const wanted = tables
        .map((n, idx) => {
          const t = allTables[n - 1];
          if (!t) return null;
          const data = (t.rows || [])
            .map(mapApiRow)
            .sort((a, b) => a.position - b.position);

          // nombre amigable; usa "Grupo A/B" si son exactamente dos
          const friendly =
            tables.length === 2 ? (idx === 0 ? "Grupo A" : "Grupo B") : t.title || `Tabla ${n}`;

          return { title: friendly, data };
        })
        .filter(Boolean) as SectionData[];

      setSections(wanted);
      setRows([]);
      return;
    }

    // -------- UNA SOLA TABLA --------
    const tableParam = cfg.table ?? undefined;
    const qpTable = tableParam ? `&table=${tableParam}` : "";
    const endpoint = `${API_BASE}/tables/${cfg.preset}?format=flat&fields=nice${qpTable}`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25000);
    const res = await fetch(endpoint, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timer);

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.error || `HTTP ${res.status}`);
    }

    const raw = (await res.json()) as any[];
    const mapped = raw.map(mapApiRow).sort((a, b) => a.position - b.position);
    setRows(mapped);
    setSections(null);
  } catch (e: any) {
    console.error("Error cargando tabla:", e?.message || e);
    setRows([]);
    setSections(null);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
}, [league]);


  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const HeaderCard = ({ title }: { title: string }) => (
    <View style={styles.headerCard}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.tableHeader}>
        <Text style={[styles.th, styles.colPos]}>#</Text>
        <Text style={[styles.th, styles.colTeam]}>Equipos</Text>
        <Text style={[styles.th, styles.colNum]}>PTS</Text>
        <Text style={[styles.th, styles.colNum]}>J</Text>
        <Text style={[styles.th, styles.colNum]}>GF</Text>
        <Text style={[styles.th, styles.colNum]}>GC</Text>
        <Text style={[styles.th, styles.colNum]}>+/-</Text>
      </View>
    </View>
  );

  const Row = ({ item }: { item: TeamRow }) => {
    const diff = item.gf - item.ga;
    return (
      <Pressable
        style={styles.row}
        onPress={() =>
          router.push({
            pathname: "/",
            params: { id: String(item.id), name: item.name },
          })
        }
      >
        <Text style={[styles.td, styles.colPos]}>{item.position}</Text>
        <View style={[styles.td, styles.colTeam, styles.teamCell]}>
          {item.crest ? (
            <Image source={{ uri: item.crest }} style={styles.crest} />
          ) : (
            <View style={styles.crestPlaceholder} />
          )}
          <Text style={styles.teamName} numberOfLines={1}>
            {item.name}
          </Text>
        </View>
        <Text style={[styles.tdNum, styles.colNum]}>{item.pts}</Text>
        <Text style={[styles.tdNum, styles.colNum]}>{item.played}</Text>
        <Text style={[styles.tdNum, styles.colNum]}>{item.gf}</Text>
        <Text style={[styles.tdNum, styles.colNum]}>{item.ga}</Text>
        <Text
          style={[
            styles.tdNum,
            styles.colNum,
            diff > 0 ? styles.positive : diff < 0 ? styles.negative : null,
          ]}
        >
          {diff}
        </Text>
      </Pressable>
    );
  };

  // ===== UI =====
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return sections && sections.length > 0 ? (
    // ------ MODO MULTI-TABLA (Grupo A / Grupo B) ------
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{ title: league ? String(league) : "Tablas" }}
      />
      <SectionList
        sections={sections}
        keyExtractor={(item) => String(item.id)}
        renderSectionHeader={({ section }) => (
          <HeaderCard title={`${league || "Liga Argentina"} • ${section.title}`} />
        )}
        renderItem={({ item }) => <Row item={item} />}
        SectionSeparatorComponent={() => <View style={{ height: 12 }} />}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  ) : (
    // ------ MODO UNA SOLA TABLA ------
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{ title: league ? String(league) : "Tabla" }}
      />
      <FlatList
        data={rows}
        keyExtractor={(r) => String(r.id)}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<HeaderCard title={league ? String(league) : "Tabla"} />}
        renderItem={({ item }) => <Row item={item} />}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: { backgroundColor: "#0c2520" },
  listContent: { padding: 12 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  headerCard: {
    backgroundColor: "#10352f",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  title: {
    color: "#e7f6f2",
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 8,
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#1a4740",
  },
  th: { color: "#b7d6cf", fontWeight: "600" },
  colPos: { width: 28, textAlign: "center" },
  colTeam: { flex: 1, paddingLeft: 4 },
  colNum: { width: 46, textAlign: "right" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#112c25",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  sep: { height: 8 },
  td: {},
  tdNum: { color: "#e7f6f2", textAlign: "right" },
  teamCell: { flexDirection: "row", alignItems: "center", gap: 8 },
  teamName: { color: "#e7f6f2", flexShrink: 1 },
  crest: { width: 20, height: 20, resizeMode: "contain" },
  crestPlaceholder: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#1a4740",
  },
  positive: { color: "#6ae36a" },
  negative: { color: "#ff6b6b" },
});