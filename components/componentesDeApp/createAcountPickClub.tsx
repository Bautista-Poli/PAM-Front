import { useEffect, useState } from "react";
import { FlatList, Image, Modal,Pressable, StyleSheet,Text,View} from "react-native";
import { Club } from "@/apiConnections/types";
import { getClubsArgentinos } from "../../apiConnections/clubs";

type Props = {
  visible: boolean;
  onClose: () => void;
  selectedClub: Club | null;
  onSelect: (club: Club) => void;
};

export default function ClubPickerModal({
  visible,
  onClose,
  selectedClub,
  onSelect,
}: Props) {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!visible) return;
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getClubsArgentinos();
        if (mounted) setClubs(data);
      } catch (e) {
        if (mounted) setClubs([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Seleccioná tu club</Text>
            <Pressable onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          {loading ? (
            <Text style={styles.loadingText}>Cargando clubes...</Text>
          ) : (
            <FlatList
              data={clubs}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.clubItem,
                    selectedClub?.id === item.id && styles.clubItemSelected,
                  ]}
                  onPress={() => onSelect(item)}
                >
                  <Image source={{ uri: item.crest_url }} style={styles.clubCrestModal} />
                  <Text style={styles.clubNameModal}>{item.nombre}</Text>
                </Pressable>
              )}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1f2937",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  modalTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
  closeButton: {
    color: "#9ca3af",
    fontSize: 24,
    fontWeight: "600",
  },
  loadingText: {
    color: "#9ca3af",
    textAlign: "center",
    padding: 20,
  },
  clubItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  clubItemSelected: {
    backgroundColor: "#374151",
  },
  clubCrestModal: {
    width: 32,
    height: 32,
    marginRight: 16,
  },
  clubNameModal: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
