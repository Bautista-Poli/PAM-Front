import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Group, GroupTableRow } from "./types";

interface GrupoTableProps {
  group: Group;
  isLeagueFormat: boolean;
}

function getBorderStyle(index: number, isLeagueFormat: boolean) {
  if (isLeagueFormat) {
    if (index < 8)  return styles.clasificado;
    if (index < 24) return styles.playoff;
    return null;
  }
  return index < 2 ? styles.clasificado : null;
}

function sortTeams(teams: GroupTableRow[]) {
  return teams.slice().sort((a, b) => {
    if (b.pts !== a.pts)                   return b.pts - a.pts;
    if ((b.gf - b.ga) !== (a.gf - a.ga))  return (b.gf - b.ga) - (a.gf - a.ga);
    return b.gf - a.gf;
  });
}

export function GrupoTable({ group, isLeagueFormat }: GrupoTableProps) {
  const router = useRouter();
  const sorted = sortTeams(group.teams);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{group.name}</Text>

      {/* Header */}
      <View style={[styles.row, styles.header]}>
        <Text style={styles.pos}>#</Text>
        <Text style={styles.nombre}>Equipo</Text>
        <Text style={styles.stat}>PJ</Text>
        <Text style={styles.stat}>G</Text>
        <Text style={styles.stat}>E</Text>
        <Text style={styles.stat}>P</Text>
        <Text style={styles.stat}>GF</Text>
        <Text style={styles.stat}>GC</Text>
        <Text style={styles.stat}>DG</Text>
        <Text style={styles.pts}>Pts</Text>
      </View>

      {/* Filas */}
      {sorted.map((team, index) => {
        const diff = team.gf - team.ga;
        return (
          <Pressable
            key={team.team}
            onPress={() =>
              router.push({ pathname: "/detallesEquipo", params: { nombre: team.team } })
            }
          >
            <View style={[
              styles.row,
              index % 2 === 0 ? styles.rowEven : styles.rowOdd,
              getBorderStyle(index, isLeagueFormat),
            ]}>
              <Text style={styles.pos}>{index + 1}</Text>
              <Text style={styles.nombre} numberOfLines={1}>{team.team}</Text>
              <Text style={styles.stat}>{team.played}</Text>
              <Text style={styles.stat}>{team.won}</Text>
              <Text style={styles.stat}>{team.drawn}</Text>
              <Text style={styles.stat}>{team.lost}</Text>
              <Text style={styles.stat}>{team.gf}</Text>
              <Text style={styles.stat}>{team.ga}</Text>
              <Text style={diff > 0 ? styles.pos_ : diff < 0 ? styles.neg : styles.stat}>
                {diff > 0 ? `+${diff}` : diff}
              </Text>
              <Text style={styles.pts}>{team.pts}</Text>
            </View>
          </Pressable>
        );
      })}

      {isLeagueFormat && (
        <View style={styles.leyenda}>
          <LeyendaItem color="#4ade80" label="Clasificado a octavos (1–8)" />
          <LeyendaItem color="#facc15" label="Playoff eliminatorio (9–24)" />
        </View>
      )}
    </View>
  );
}

function LeyendaItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.leyendaRow}>
      <View style={[styles.leyendaDot, { backgroundColor: color }]} />
      <Text style={styles.leyendaText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 12,
    backgroundColor: "#1a2f42",
    borderRadius: 12,
    padding: 12,
  },
  title: {
    color: "#A9D6E5",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  header: {
    backgroundColor: "#0d1b2a",
    borderRadius: 6,
    marginBottom: 4,
  },
  rowEven: { backgroundColor: "#1a2f4280" },
  rowOdd:  { backgroundColor: "#12263a80" },
  clasificado: {
    borderLeftWidth: 3,
    borderLeftColor: "#4ade80",
  },
  playoff: {
    borderLeftWidth: 3,
    borderLeftColor: "#facc15",
  },
  pos: {
    color: "#94a3b8",
    fontSize: 12,
    width: 25,
    textAlign: "center",
  },
  nombre: {
    color: "#e9ebeeff",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  stat: {
    color: "#cbd5e1",
    fontSize: 11,
    width: 28,
    textAlign: "center",
  },
  pts: {
    color: "#A9D6E5",
    fontSize: 13,
    fontWeight: "700",
    width: 35,
    textAlign: "center",
  },
  // "pos_" porque "pos" ya está usado para la posición (#)
  pos_: {
    color: "#4ade80",
    fontSize: 11,
    width: 32,
    textAlign: "center",
  },
  neg: {
    color: "#f87171",
    fontSize: 11,
    width: 32,
    textAlign: "center",
  },
  leyenda: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#1E6091",
    gap: 4,
  },
  leyendaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  leyendaDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  leyendaText: {
    color: "#94a3b8",
    fontSize: 11,
  },
});