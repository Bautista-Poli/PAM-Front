import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MatchItem } from '@/helpers/interfaces/matches';
import { statusBadge } from '@/helpers/utils/match';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import type { ViewStyle } from 'react-native';

function Logo({
  uri,
  alt,
  size = 28,
}: {
  uri?: string | null;
  alt: string;
  size?: number;
}) {
  if (!uri) {
    // Fallback: círculo con iniciales
    const initials = alt?.trim()?.slice(0, 2)?.toUpperCase() || '—';
    return (
      <View style={[styles.fallbackLogo, { width: size, height: size, borderRadius: size / 2 }]}>
        <ThemedText style={styles.fallbackLogoText}>{initials}</ThemedText>
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={{ width: size, height: size, borderRadius: size / 2 }}
      contentFit="contain"
      accessible
      accessibilityLabel={alt}
      cachePolicy="memory-disk"
    />
  );
}

function TeamScore({name,logoUrl,score,align}: {name: string;logoUrl?: string | null;score: number | null;align: 'left' | 'right';}) {
  const alignStyle: ViewStyle = { alignItems: align === 'right' ? 'flex-end' : 'flex-start' };
  const rowDir: ViewStyle   = { flexDirection: align === 'right' ? 'row-reverse' : 'row' };
  return (
    <View style={[styles.teamCol, alignStyle]}>
      <View style={[styles.teamHeaderRow, rowDir]}>
        <Logo uri={logoUrl} alt={name} />
        <ThemedText type="defaultSemiBold" style={[styles.teamName, align === 'right' ? { textAlign: 'right' } : null]}>
          {name}
        </ThemedText>
      </View>
      <ThemedText type="title" style={[styles.score, align === 'right' ? { textAlign: 'right' } : null]}>
        {score ?? '—'}
      </ThemedText>
    </View>
  );
}

export default function MatchRow({ item }: { item: MatchItem }) {
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
        <TeamScore
          name={item.homeTeam}
          logoUrl={item.homeLogo}
          score={item.score.home}
          align="right"
        />
        <ThemedText style={styles.vs}>vs</ThemedText>
        <TeamScore
          name={item.awayTeam}
          logoUrl={item.awayLogo}
          score={item.score.away}
          align="left"
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#ffffff12', borderRadius: 14, padding: 12, marginBottom: 8, borderWidth: StyleSheet.hairlineWidth, borderColor: '#ffffff22' },
  cardLive: { borderColor: '#ff3b30' },
  cardFinished: { opacity: 0.9 },
  rowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  badgeLive: { backgroundColor: '#ff3b3033' },
  badgeFinished: { backgroundColor: '#34c75933' },
  badgeDefault: { backgroundColor: '#ffffff22' },

  teamsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },

  teamCol: { flex: 1 },
  teamHeaderRow: { alignItems: 'center', gap: 8 },
  teamName: { fontSize: 16, maxWidth: '90%' },
  score: { fontVariant: ['tabular-nums'], marginTop: 2 },
  vs: { width: 32, textAlign: 'center' },

  fallbackLogo: { backgroundColor: '#ffffff22', alignItems: 'center', justifyContent: 'center' },
  fallbackLogoText: { fontSize: 10 },
});

