import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { MatchRow } from '../../apiConnections/types';
import Marcador from './marcador';

type PartidoProps = {
  data: MatchRow;
};

const fallbackLogo = 'https://ligafutbolcity.com/img/logo/equipos/equipo_default.png';

function getLocalDateFromApi(isoDate: string): Date {
  const localIsoDate = isoDate.endsWith('Z') ? isoDate.slice(0, -1) : isoDate;
  return new Date(localIsoDate);
}

function formatHourTime(isoDate: string): string {
  const date = getLocalDateFromApi(isoDate);

  return date.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function getMatchStatus(isoDate: string): string {
  const matchDate = getLocalDateFromApi(isoDate);
  const now = new Date();
  const twoHoursAfter = new Date(matchDate.getTime() + 2 * 60 * 60 * 1000);
  
  if (now > twoHoursAfter) {
    return "Final";
  }
  
  return formatHourTime(isoDate);
}

export default function PartidoCard({ data }: PartidoProps) {
  const router = useRouter();
  const matchDate = getLocalDateFromApi(data.match_date);
  const now = new Date();
  const dosHorasDespues = new Date(matchDate.getTime() + 2 * 60 * 60 * 1000);

  const partidoNoComenzado = now < matchDate;
  const partidoFinalizado = now > dosHorasDespues;

  const handleTeamPress = (teamName: string) => {
    router.push({
      pathname: '/equipo',
      params: { nombre: teamName }
    });
  };

  const handleCardPress = () => {
    if (partidoFinalizado) {
      router.push({
        pathname: "/detallesPartido",
        params: { partido: JSON.stringify(data) },
      });
    }
  };

  return (
    <Pressable onPress={handleCardPress}>
      <View style={styles.card}>
        {(data.league || data.match_date) && (
          <View style={styles.cardHeader}>
            {data.league ? <Text style={styles.comp}>{data.league}</Text> : null}
            {data.match_date ? <Text style={styles.date}>{getMatchStatus(data.match_date)}</Text> : null}
          </View>
        )}

        <View style={styles.row}>
          
          <View style={styles.teamBlock}>
            <Pressable
              onPress={() => handleTeamPress(data.home_team ?? "Local")}
              style={styles.logoContainer}
            >
              <Image
                source={{ uri: data.home_crest ?? fallbackLogo }}
                style={styles.logo}
                resizeMode="contain"
              />
            </Pressable>
            <Text style={styles.teamName} numberOfLines={1}>
              {data.home_team ?? "Local"}
            </Text>
          </View>

          <View style={styles.scoreBlock}>
            {partidoNoComenzado ? (
              <Text style={styles.scoreText}>-</Text>
            ) : (
              <Marcador
                golesLocal={data.score_home ?? 0}
                golesVisitante={data.score_away ?? 0}
              />
            )}
          </View>

          <View style={styles.teamBlock}>
            <Pressable
              onPress={() => handleTeamPress(data.away_team ?? "Visitante")}
              style={styles.logoContainer}
            >
              <Image
                source={{ uri: data.away_crest ?? fallbackLogo }}
                style={styles.logo}
                resizeMode="contain"
              />
            </Pressable>
            <Text style={styles.teamName} numberOfLines={1}>
              {data.away_team ?? "Visitante"}
            </Text>
          </View>
        </View>

        {!partidoFinalizado && (
          <View style={styles.lockOverlay}>
            <Text style={styles.lockText}>🔒 Evaluación disponible al finalizar</Text>
          </View>
        )}

      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0a84e21f',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  comp: { color: '#93c5fd', fontSize: 14, fontWeight: '700' },
  date: { color: '#cbd5e1', fontSize: 13, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  teamBlock: { flex: 1, alignItems: 'center', gap: 8 },
  logoContainer: { 
    width: 80, 
    height: 80,
    borderRadius: 45, 
    backgroundColor: '#1e293b', 
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#334155', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  logo: { width: 66, height: 66 },
  teamName: { color: '#e5e7eb', fontSize: 14, fontWeight: '600', textAlign: 'center' },
  scoreBlock: { minWidth: 120, alignItems: 'center', justifyContent: 'center', gap: 4 },
  scoreText: { fontSize: 28, fontWeight: '800', color: '#f8fafc', letterSpacing: 1 },
  dash: { opacity: 0.7 },
  status: { fontSize: 12, color: '#9ca3af' },
  lockOverlay: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#2c4769ff',
    alignItems: 'center',
  },
  lockText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '400',
  },
});