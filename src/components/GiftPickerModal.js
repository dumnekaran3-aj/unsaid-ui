import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, FlatList } from "react-native";

export const GIFT_OPTIONS = [
  { key: "rose", emoji: "🌹", label: "Rose" },
  { key: "heart", emoji: "💝", label: "Heart" },
  { key: "teddy", emoji: "🧸", label: "Teddy Bear" },
  { key: "kiss", emoji: "💋", label: "Kiss" },
  { key: "ring", emoji: "💍", label: "Ring" },
];

export default function GiftPickerModal({ visible, onClose, onSelect }) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Send a Gift 🎁</Text>
          <FlatList
            data={GIFT_OPTIONS}
            numColumns={5}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.giftOption}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={styles.giftEmoji}>{item.emoji}</Text>
                <Text style={styles.giftLabel}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  sheet: { backgroundColor: "white", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  title: { fontSize: 16, fontWeight: "bold", color: "#D6336C", marginBottom: 16, textAlign: "center" },
  giftOption: { flex: 1, alignItems: "center", marginBottom: 12 },
  giftEmoji: { fontSize: 32 },
  giftLabel: { fontSize: 10, color: "#666", marginTop: 4, textAlign: "center" },
});