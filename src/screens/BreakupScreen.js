import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import api from "../config/api";
import { useAuth } from "../context/AuthContext";

const REASONS = [
  { key: "distance", label: "Distance" },
  { key: "trust_issue", label: "Trust Issue" },
  { key: "mutual_decision", label: "Mutual Decision" },
  { key: "fight", label: "Fight / Misunderstanding" },
  { key: "other", label: "Other" },
];

export default function BreakupScreen({ navigation }) {
  const { setUser } = useAuth();
  const [selectedReason, setSelectedReason] = useState(null);
  const [confirmTap, setConfirmTap] = useState(false);

  async function handleConfirm() {
    if (!selectedReason) return Alert.alert("Select a reason first");
    if (!confirmTap) {
      setConfirmTap(true);
      return; // require a second tap, to avoid accidental breakup
    }
    try {
      const res = await api.post("/connection/breakup", { reason: selectedReason });
      Alert.alert("Done", res.data.message);
      setUser((prev) => ({ ...prev, partnerId: null }));
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Are you sure?</Text>
      <Text style={styles.subtitle}>This will end your connection. Choose a reason:</Text>

      {REASONS.map((r) => (
        <TouchableOpacity
          key={r.key}
          style={[styles.reasonRow, selectedReason === r.key && styles.reasonRowActive]}
          onPress={() => setSelectedReason(r.key)}
        >
          <Text style={selectedReason === r.key ? styles.reasonTextActive : styles.reasonText}>
            {r.label}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
        <Text style={styles.confirmText}>
          {confirmTap ? "Tap again to confirm" : "Confirm Breakup"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFE3EC", padding: 24, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "bold", color: "#E03131", textAlign: "center" },
  subtitle: { textAlign: "center", color: "#666", marginBottom: 20 },
  reasonRow: { backgroundColor: "white", padding: 14, borderRadius: 10, marginBottom: 8 },
  reasonRowActive: { backgroundColor: "#E03131" },
  reasonText: { color: "#333" },
  reasonTextActive: { color: "white", fontWeight: "bold" },
  cancelBtn: { padding: 16, borderRadius: 12, backgroundColor: "white", marginTop: 20, alignItems: "center" },
  cancelText: { color: "#333", fontWeight: "bold" },
  confirmBtn: { padding: 16, borderRadius: 12, backgroundColor: "#E03131", marginTop: 10, alignItems: "center" },
  confirmText: { color: "white", fontWeight: "bold" },
});
