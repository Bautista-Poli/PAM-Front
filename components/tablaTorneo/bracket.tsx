//bracket.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';


interface BracketTeam {
  name: string;
  scoreLeg1?: number;  
  scoreLeg2?: number;  
  isWinner?: boolean;
}
interface BracketMatch {
  id: string;
  team1: BracketTeam;
  team2: BracketTeam;
  round: 'round_of_16' | 'quarterfinals' | 'semifinals' | 'final';
}
interface BracketVisualizerProps {
  matches: BracketMatch[];
  onMatchPress?: (match: BracketMatch) => void;
}


const UNIT_HEIGHT = 100;
const COLUMN_WIDTH = 150; 
const CONNECTOR_WIDTH = 40; 

const BracketVisualizer: React.FC<BracketVisualizerProps> = ({ matches, onMatchPress }) => {
  const r16 = matches.filter(m => m.round === 'round_of_16');
  const qf = matches.filter(m => m.round === 'quarterfinals');
  const sf = matches.filter(m => m.round === 'semifinals');
  const f = matches.filter(m => m.round === 'final');

  // Componente de Línea Conectora
  const Connector = ({ type, height }: { type: 'left' | 'right', height: number }) => (
    <View style={{ width: CONNECTOR_WIDTH, height }}>
      <Svg height="100%" width="100%">
        {type === 'left' ? (
          <Path
            d={`M 0 ${height * 0.25} L ${CONNECTOR_WIDTH/2} ${height * 0.25} L ${CONNECTOR_WIDTH/2} ${height * 0.75} L 0 ${height * 0.75} M ${CONNECTOR_WIDTH/2} ${height * 0.5} L ${CONNECTOR_WIDTH} ${height * 0.5}`}
            stroke="#1E6091" strokeWidth="2" fill="none"
          />
        ) : (
          <Path
            d={`M ${CONNECTOR_WIDTH} ${height * 0.25} L ${CONNECTOR_WIDTH/2} ${height * 0.25} L ${CONNECTOR_WIDTH/2} ${height * 0.75} L ${CONNECTOR_WIDTH} ${height * 0.75} M ${CONNECTOR_WIDTH/2} ${height * 0.5} L 0 ${height * 0.5}`}
            stroke="#1E6091" strokeWidth="2" fill="none"
          />
        )}
      </Svg>
    </View>
  );

  // Reemplazar renderMatchCard completo
  const renderMatchCard = (match?: BracketMatch) => (
    <Pressable
      onPress={() => match && onMatchPress?.(match)}
      style={[styles.matchCard, !match && styles.emptyCard]}
    >
      {/* Fila equipo 1 */}
      <View style={[styles.teamRow, match?.team1?.isWinner && styles.winnerBg]}>
        <Text style={[styles.teamName, !match?.team1?.name && styles.placeholderText]}
              numberOfLines={1}>
          {match?.team1?.name || 'TBD'}
        </Text>
        <View style={styles.scoresContainer}>
          {match?.team1?.scoreLeg1 != null && (
            <Text style={styles.scoreLeg}>{match.team1.scoreLeg1}</Text>
          )}
          {match?.team1?.scoreLeg2 != null && (
            <Text style={[styles.scoreLeg, styles.scoreLeg2]}>{match.team1.scoreLeg2}</Text>
          )}
          {match?.team1?.scoreLeg1 == null && (
            <Text style={styles.scorePlaceholder}>-</Text>
          )}
        </View>
      </View>

      <View style={styles.divider} />

      {/* Fila equipo 2 */}
      <View style={[styles.teamRow, match?.team2?.isWinner && styles.winnerBg]}>
        <Text style={[styles.teamName, !match?.team2?.name && styles.placeholderText]}
              numberOfLines={1}>
          {match?.team2?.name || 'TBD'}
        </Text>
        <View style={styles.scoresContainer}>
          {match?.team2?.scoreLeg1 != null && (
            <Text style={styles.scoreLeg}>{match.team2.scoreLeg1}</Text>
          )}
          {match?.team2?.scoreLeg2 != null && (
            <Text style={[styles.scoreLeg, styles.scoreLeg2]}>{match.team2.scoreLeg2}</Text>
          )}
          {match?.team2?.scoreLeg1 == null && (
            <Text style={styles.scorePlaceholder}>-</Text>
          )}
        </View>
      </View>
    </Pressable>
  );

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      <View style={styles.bracketContainer}>
        
        {/* --- IZQUIERDA --- */}
        <View style={styles.column}>
          {Array.from({ length: 4 }).map((_, i) => (
            <View key={`r16-l-${i}`} style={{ height: UNIT_HEIGHT, justifyContent: 'center' }}>
              {renderMatchCard(r16[i])}
            </View>
          ))}
        </View>
        <View style={styles.connectorCol}>
          {[0, 1].map(i => <Connector key={i} type="left" height={UNIT_HEIGHT * 2} />)}
        </View>

        <View style={styles.column}>
          {Array.from({ length: 2 }).map((_, i) => (
            <View key={`qf-l-${i}`} style={{ height: UNIT_HEIGHT * 2, justifyContent: 'center' }}>
              {renderMatchCard(qf[i])}
            </View>
          ))}
        </View>
        <View style={styles.connectorCol}>
          <Connector type="left" height={UNIT_HEIGHT * 4} />
        </View>

        <View style={styles.column}>
           <View style={{ height: UNIT_HEIGHT * 4, justifyContent: 'center' }}>
             {renderMatchCard(sf[0])}
           </View>
        </View>

        <View style={styles.finalWrapper}>
          <View style={styles.finalColumn}>
            <Text style={styles.finalTitle}>GRAND FINAL</Text>
            {renderMatchCard(f[0])}
            <View style={styles.trophyContainer}>
              <Text style={styles.trophyIcon}>🏆</Text>
              <Text style={styles.trophyText}>CHAMPION</Text>
            </View>
          </View>
        </View>

        <View style={styles.column}>
           <View style={{ height: UNIT_HEIGHT * 4, justifyContent: 'center' }}>
             {renderMatchCard(sf[1])}
           </View>
        </View>
        <View style={styles.connectorCol}>
          <Connector type="right" height={UNIT_HEIGHT * 4} />
        </View>
        
        <View style={styles.column}>
          {Array.from({ length: 2 }).map((_, i) => (
            <View key={`qf-r-${i}`} style={{ height: UNIT_HEIGHT * 2, justifyContent: 'center' }}>
              {renderMatchCard(qf[i + 2])}
            </View>
          ))}
        </View>
        <View style={styles.connectorCol}>
          {[0, 1].map(i => <Connector key={i} type="right" height={UNIT_HEIGHT * 2} />)}
        </View>

        <View style={styles.column}>
          {Array.from({ length: 4 }).map((_, i) => (
            <View key={`r16-r-${i}`} style={{ height: UNIT_HEIGHT, justifyContent: 'center' }}>
              {renderMatchCard(r16[i + 4])}
            </View>
          ))}
        </View>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#112336ff' },
  bracketContainer: {
    flexDirection: 'row',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  column: { width: COLUMN_WIDTH },
  connectorCol: { width: CONNECTOR_WIDTH },
  matchCard: {
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
  emptyCard: { borderStyle: 'dashed', opacity: 0.6 },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    height: 40,
    alignItems: 'center',
  },
  winnerBg: { backgroundColor: 'rgba(74, 222, 128, 0.15)' },
  teamName: { color: '#e9ebeeff', fontSize: 11, fontWeight: '700', flex: 1 },
  placeholderText: { color: '#577399', fontWeight: '400' },
  scoreText: { color: '#A9D6E5', fontWeight: 'bold', fontSize: 13, marginLeft: 8 },
  divider: { height: 1, backgroundColor: '#1E6091' },
  
  // Final
  finalWrapper: {
    width: COLUMN_WIDTH + 90,
    alignItems: 'center',
    marginHorizontal: 15,
  },
  finalColumn: {
    width: '100%',
    alignItems: 'stretch', 
    padding: 15,
    backgroundColor: 'rgba(30, 96, 145, 0.2)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#A9D6E533',
  },
  finalTitle: {
    color: '#A9D6E5',
    fontWeight: '900',
    marginBottom: 15,
    fontSize: 16,
    letterSpacing: 2,
  },
  trophyContainer: { alignItems: 'center', marginTop: 20 },
  trophyIcon: { fontSize: 45 },
  trophyText: { color: '#A9D6E5', fontWeight: 'bold', fontSize: 10, marginTop: 5 },
  scoresContainer: {
  flexDirection: 'row',
  gap: 4,
  alignItems: 'center',
},
scoreLeg: {
  color: '#e2e8f0',
  fontSize: 13,
  fontWeight: '600',
  minWidth: 16,
  textAlign: 'center',
},
scoreLeg2: {
  color: '#A9D6E5',  // vuelta en color distinto para diferenciar
},
scorePlaceholder: {
  color: '#64748b',
  fontSize: 13,
  minWidth: 16,
  textAlign: 'center',
},
});

export default BracketVisualizer;