// components/componentesDeApp/HistorialPartidos.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated } from 'react-native';
import { MatchRow } from '@/apiConnections/types'; // Importa tu tipo real

interface HistorialPartidosProps {
  equipoNombre: string;
  partidos: MatchRow[];
}

const PartidoCard = ({ 
  partido, 
  tipo,
  index,
  equipoNombre 
}: { 
  partido: MatchRow; 
  tipo: 'proximo' | 'resultado';
  index: number;
  equipoNombre: string;
}) => {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // Lógica para determinar rol y rival
  const esLocal = partido.home_team === equipoNombre;
  const rival = esLocal ? partido.away_team : partido.home_team;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 400, delay: index * 50, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 400, delay: index * 50, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, delay: index * 50, useNativeDriver: true, tension: 50, friction: 7 }),
    ]).start();
  }, []);

  const formatearFecha = (fechaStr: Date | string) => {
    const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    const dias = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
    const date = new Date(fechaStr);
    return {
      diaSemana: dias[date.getDay()],
      dia: date.getDate().toString().padStart(2, '0'),
      mes: meses[date.getMonth()],
      hora: date.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' })
    };
  };

  const getResultadoInfo = () => {
    const gLocal = partido.score_home ?? 0;
    const gVisit = partido.score_away ?? 0;
    const gEquipo = esLocal ? gLocal : gVisit;
    const gRival = esLocal ? gVisit : gLocal;
    
    if (gEquipo > gRival) return { color: '#22c55e', texto: `${gLocal}-${gVisit}`, badge: 'V' };
    if (gEquipo < gRival) return { color: '#ef4444', texto: `${gLocal}-${gVisit}`, badge: 'D' };
    return { color: '#f59e0b', texto: `${gLocal}-${gVisit}`, badge: 'E' };
  };

  const infoFecha = formatearFecha(partido.match_date);
  const resultadoInfo = getResultadoInfo();

  return (
    <Animated.View style={[styles.partidoCard, { opacity: opacityAnim, transform: [{ translateX: slideAnim }, { scale: scaleAnim }] }]}>
      {tipo === 'resultado' && <View style={[styles.barraLateral, { backgroundColor: resultadoInfo.color }]} />}
      <View style={styles.cardContent}>
        <View style={styles.fechaBox}>
          <Text style={styles.diaSemana}>{infoFecha.diaSemana}</Text>
          <Text style={styles.diaNumero}>{infoFecha.dia}</Text>
          <Text style={styles.mesTexto}>{infoFecha.mes}</Text>
        </View>

        <View style={styles.partidoInfo}>
          <View style={styles.matchupContainer}>
            <View style={[styles.localVisitanteBadge, esLocal ? styles.localBg : styles.visitanteBg]}>
              <Text style={styles.lvText}>{esLocal ? 'LOCAL' : 'VISITANTE'}</Text>
            </View>
          </View>
          <View style={styles.equiposRow}>
            <Text style={styles.equipoNombre} numberOfLines={1}>{esLocal ? equipoNombre : rival}</Text>
            <View style={styles.vsSeparator}>
                <View style={styles.vsLine} /><Text style={styles.vsText}>VS</Text><View style={styles.vsLine} />
            </View>
            <Text style={styles.equipoNombre} numberOfLines={1}>{esLocal ? rival : equipoNombre}</Text>
          </View>
        </View>

        <View style={styles.resultadoSection}>
          {tipo === 'proximo' ? (
            <View style={styles.horaBox}>
              <Text style={styles.horaLabel}>HORA</Text>
              <Text style={styles.horaValor}>{infoFecha.hora}</Text>
            </View>
          ) : (
            <View style={styles.resultadoBox}>
              <View style={[styles.badgeResultado, { backgroundColor: resultadoInfo.color }]}>
                <Text style={styles.badgeLetra}>{resultadoInfo.badge}</Text>
              </View>
              <Text style={[styles.resultadoNumeros, { color: resultadoInfo.color }]}>{resultadoInfo.texto}</Text>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

export default function HistorialPartidos({ equipoNombre, partidos }: HistorialPartidosProps) {
  const [mostrarTodosProximos, setMostrarTodosProximos] = useState(false);
  const [mostrarTodosResultados, setMostrarTodosResultados] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState<'proximos' | 'resultados'>('proximos');
  
  const hoy = new Date();

  // Separar partidos usando la fecha y el score (si es 0-0 y la fecha pasó, asumimos que se jugó o está por jugarse)
  // Nota: En una app real, podrías chequear un campo 'status' si lo tienes en tu DB
  const proximosPartidos = partidos
    .filter(p => new Date(p.match_date) >= hoy)
    .sort((a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime());
  
  const resultados = partidos
    .filter(p => new Date(p.match_date) < hoy)
    .sort((a, b) => new Date(b.match_date).getTime() - new Date(a.match_date).getTime());

  const proximosAMostrar = mostrarTodosProximos ? proximosPartidos : proximosPartidos.slice(0, 4);
  const resultadosAMostrar = mostrarTodosResultados ? resultados : resultados.slice(0, 4);

  // Estadísticas
  const stats = resultados.reduce((acc, p) => {
    const esLocal = p.home_team === equipoNombre;
    const gE = esLocal ? (p.score_home ?? 0) : (p.score_away ?? 0);
    const gR = esLocal ? (p.score_away ?? 0) : (p.score_home ?? 0);
    if (gE > gR) acc.v++; else if (gE < gR) acc.d++; else acc.e++;
    return acc;
  }, { v: 0, e: 0, d: 0 });

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <Pressable style={[styles.tab, seccionActiva === 'proximos' && styles.tabActiva]} onPress={() => setSeccionActiva('proximos')}>
          <Text style={[styles.tabText, seccionActiva === 'proximos' && styles.tabTextActiva]}>Próximos ({proximosPartidos.length})</Text>
        </Pressable>
        <Pressable style={[styles.tab, seccionActiva === 'resultados' && styles.tabActiva]} onPress={() => setSeccionActiva('resultados')}>
          <Text style={[styles.tabText, seccionActiva === 'resultados' && styles.tabTextActiva]}>Resultados ({resultados.length})</Text>
        </Pressable>
      </View>

      {seccionActiva === 'resultados' && resultados.length > 0 && (
        <View style={styles.statsContainer}>
          <View style={[styles.statBox, { borderColor: '#22c55e' }]}><Text style={styles.statNumero}>{stats.v}</Text><Text style={styles.statLabel}>Victorias</Text></View>
          <View style={[styles.statBox, { borderColor: '#f59e0b' }]}><Text style={styles.statNumero}>{stats.e}</Text><Text style={styles.statLabel}>Empates</Text></View>
          <View style={[styles.statBox, { borderColor: '#ef4444' }]}><Text style={styles.statNumero}>{stats.d}</Text><Text style={styles.statLabel}>Derrotas</Text></View>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {seccionActiva === 'proximos' ? (
          <View style={styles.seccion}>
            {proximosAMostrar.map((p, i) => <PartidoCard key={p.id} partido={p} tipo="proximo" index={i} equipoNombre={equipoNombre} />)}
            {proximosPartidos.length > 4 && (
              <Pressable style={styles.verMasBtn} onPress={() => setMostrarTodosProximos(!mostrarTodosProximos)}>
                <Text style={styles.verMasText}>{mostrarTodosProximos ? '▲ MENOS' : `▼ TODOS (${proximosPartidos.length})`}</Text>
              </Pressable>
            )}
          </View>
        ) : (
          <View style={styles.seccion}>
            {resultadosAMostrar.map((p, i) => <PartidoCard key={p.id} partido={p} tipo="resultado" index={i} equipoNombre={equipoNombre} />)}
            {resultados.length > 4 && (
              <Pressable style={styles.verMasBtn} onPress={() => setMostrarTodosResultados(!mostrarTodosResultados)}>
                <Text style={styles.verMasText}>{mostrarTodosResultados ? '▲ MENOS' : `▼ TODOS (${resultados.length})`}</Text>
              </Pressable>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#0D1B2A',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActiva: {
    backgroundColor: '#2b71c2ff',
  },
  tabText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '700',
  },
  tabTextActiva: {
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#112336',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderLeftWidth: 3,
  },
  statNumero: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  seccion: {
    gap: 12,
  },
  partidoCard: {
    backgroundColor: '#112336',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E3A5F',
    overflow: 'hidden',
    position: 'relative',
  },
  barraLateral: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
  },
  fechaBox: {
    backgroundColor: '#0D1B2A',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  diaSemana: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  diaNumero: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 28,
  },
  mesTexto: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  partidoInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  matchupContainer: {
    marginBottom: 6,
  },
  localVisitanteBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  localBg: {
    backgroundColor: '#22c55e20',
  },
  visitanteBg: {
    backgroundColor: '#3b82f620',
  },
  lvText: {
    color: '#e5e7eb',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  equiposRow: {
    gap: 6,
  },
  equipoNombre: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  vsSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 2,
  },
  vsLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1E3A5F',
  },
  vsText: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  resultadoSection: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 70,
  },
  horaBox: {
    alignItems: 'center',
    backgroundColor: '#1E3A5F',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  horaLabel: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  horaValor: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  resultadoBox: {
    alignItems: 'center',
    gap: 6,
  },
  badgeResultado: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeLetra: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
  resultadoNumeros: {
    fontSize: 16,
    fontWeight: '800',
  },
  verMasBtn: {
    backgroundColor: '#112336',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2b71c2ff',
    alignItems: 'center',
    marginTop: 4,
  },
  verMasText: {
    color: '#2b71c2ff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  emptyContainer: {
    backgroundColor: '#112336',
    borderRadius: 12,
    padding: 32,
    borderWidth: 1,
    borderColor: '#1E3A5F',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
  },
});