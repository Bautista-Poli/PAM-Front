// components/componentesDeApp/EquipoInfoCard.tsx

import { View, Text, StyleSheet } from 'react-native';
import { EquipoInfo } from '@/apiConnections/types';

type Props = {
  info: EquipoInfo;
};

export default function EquipoInfoCard({ info }: Props) {
  return (
    <View>
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{info.titulosNacionales}</Text>
          <Text style={styles.statLabel}>Títulos Nacionales</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{info.titulosInternacionales}</Text>
          <Text style={styles.statLabel}>Títulos Internac.</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Información General</Text>
        
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📅  Fundación</Text>
            <Text style={styles.infoValue}>{info.añoFundacion}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>🏟️  Estadio</Text>
            <Text style={styles.infoValue}>{info.nombreEstadio}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>👥  Capacidad</Text>
            <Text style={styles.infoValue}>{info.capacidadEstadio}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📍  Ciudad</Text>
            <Text style={styles.infoValue}>{info.ciudad}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>🎨  Colores</Text>
            <Text style={styles.infoValue}>{info.colores}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>👔  Entrenador</Text>
            <Text style={styles.infoValue}>{info.entrenador}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 32,
    gap: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#1E3A5F",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2A4A6F",
  },
  statNumber: {
    color: "#A9D6E5",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    color: "#cbd5e1",
    fontSize: 14,
  },
  
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: "#112336",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1E3A5F",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoLabel: {
    color: "#94a3b8",
    fontSize: 15,
    flex: 1,
  },
  infoValue: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: "#1E3A5F",
  },
});