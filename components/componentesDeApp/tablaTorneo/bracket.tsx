import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BracketTeamResult } from './types';

interface BracketMatch {
  id: string;
  team1: BracketTeamResult;
  team2: BracketTeamResult;
  round: 'round of 16' | 'quarterfinals' | 'semifinals' | 'final';
}

interface BracketVisualizerProps {
  matches: BracketMatch[];
}

const COLUMN_WIDTH = 150;

const BracketVisualizer = ({ matches }: BracketVisualizerProps) => {
  const r16 = matches.filter(m => m.round === 'round of 16');
  const qf  = matches.filter(m => m.round === 'quarterfinals');
  const sf  = matches.filter(m => m.round === 'semifinals');
  const f   = matches.filter(m => m.round === 'final');

  const TeamRow = ({ team }: { team?: BracketTeamResult }) => (
    <View style={[styles.teamRow, team?.isWinner && styles.winnerBg]}>
      <Text style={[styles.teamName, !team?.name && styles.placeholder]} numberOfLines={1}>
        {team?.name || 'TBD'}
      </Text>
      <View style={styles.scores}>
        <Text style={styles.scoreLeg1}>{team?.scoreLeg1 ?? '-'}</Text>
        {team?.scoreLeg2 != null && (
          <Text style={styles.scoreLeg2}>{team.scoreLeg2}</Text>
        )}
      </View>
    </View>
  );

  const MatchCard = ({ match }: { match?: BracketMatch }) => (
    <View style={[styles.card, !match && styles.emptyCard]}>
      <TeamRow team={match?.team1} />
      <View style={styles.divider} />
      <TeamRow team={match?.team2} />
    </View>
  );

  const Column = ({ matches, height }: { matches: (BracketMatch | undefined)[], height: number }) => (
    <View style={styles.column}>
      {matches.map((m, i) => (
        <View key={i} style={{ height, justifyContent: 'center' }}>
          <MatchCard match={m} />
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      <View style={styles.bracket}>
        <Column matches={r16.slice(0, 4)} height={100} />
        <Column matches={qf.slice(0, 2)}  height={200} />
        <Column matches={[sf[0]]}         height={400} />

        <View style={styles.finalWrapper}>
          <View style={styles.finalBox}>
            <Text style={styles.finalTitle}>GRAND FINAL</Text>
            <MatchCard match={f[0]} />
            <View style={styles.trophy}>
              <Text style={styles.trophyIcon}>🏆</Text>
              <Text style={styles.trophyText}>CHAMPION</Text>
            </View>
          </View>
        </View>

        <Column matches={[sf[1]]}         height={400} />
        <Column matches={qf.slice(2, 4)}  height={200} />
        <Column matches={r16.slice(4, 8)} height={100} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container:   { backgroundColor: '#112336ff' },
  bracket:     { flexDirection: 'row', paddingVertical: 40, paddingHorizontal: 20, alignItems: 'center' },
  column:      { width: COLUMN_WIDTH },
  card: {
    backgroundColor: '#1a2f42',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E6091',
    marginHorizontal: 5,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  emptyCard:   { borderStyle: 'dashed', opacity: 0.6 },
  teamRow:     { flexDirection: 'row', justifyContent: 'space-between', padding: 10, height: 40, alignItems: 'center' },
  winnerBg:    { backgroundColor: 'rgba(74, 222, 128, 0.15)' },
  teamName:    { color: '#e9ebeeff', fontSize: 11, fontWeight: '700', flex: 1 },
  placeholder: { color: '#577399', fontWeight: '400' },
  divider:     { height: 1, backgroundColor: '#1E6091' },
  scores:      { flexDirection: 'row', gap: 4, alignItems: 'center' },
  scoreLeg1:   { color: '#e2e8f0', fontSize: 13, fontWeight: '600', minWidth: 16, textAlign: 'center' },
  scoreLeg2:   { color: '#A9D6E5', fontSize: 13, fontWeight: '600', minWidth: 16, textAlign: 'center' },
  finalWrapper:{ width: COLUMN_WIDTH + 90, alignItems: 'center', marginHorizontal: 15 },
  finalBox:    { width: '100%', alignItems: 'stretch', padding: 15, backgroundColor: 'rgba(30, 96, 145, 0.2)', borderRadius: 16, borderWidth: 1, borderColor: '#A9D6E533' },
  finalTitle:  { color: '#A9D6E5', fontWeight: '900', marginBottom: 15, fontSize: 16, letterSpacing: 2 },
  trophy:      { alignItems: 'center', marginTop: 20 },
  trophyIcon:  { fontSize: 45 },
  trophyText:  { color: '#A9D6E5', fontWeight: 'bold', fontSize: 10, marginTop: 5 },
});

export default BracketVisualizer;