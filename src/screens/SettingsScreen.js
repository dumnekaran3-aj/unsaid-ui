import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity, Modal, TextInput, Alert } from "react-native";
import { useAuth } from "../context/AuthContext";
import api from "../config/api";

const THEMES = [
  { key: "romantic-pink", label: "Romantic Pink" },
  { key: "dark", label: "Dark" },
  { key: "normal", label: "Normal" },
];

export default function SettingsScreen() {
  const { user, updateUser } = useAuth();
  const [pinEnabled, setPinEnabled] = useState(user?.chatPinEnabled || false);
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [pinInput, setPinInput] = useState("");

  async function handleThemeSelect(themeKey) {
    try {
      const res = await api.put("/user/profile", { theme: themeKey });
      await updateUser({ theme: res.data.user.theme });
    } catch (err) {
      Alert.alert("Error", "Failed to update theme");
    }
  }

  async function handlePinToggle(value) {
    if (value) {
      // Turning ON — ask for a PIN first
      setPinModalVisible(true);
    } else {
      // Turning OFF — disable immediately
      try {
        await api.put("/user/chat-pin", { enabled: false });
        setPinEnabled(false);
        await updateUser({ chatPinEnabled: false });
      } catch (err) {
        Alert.alert("Error", "Failed to disable PIN");
      }
    }
  }

  async function savePin() {
    if (!/^\d{4,6}$/.test(pinInput)) {
      return Alert.alert("Invalid PIN", "PIN must be 4-6 digits, numbers only");
    }
    try {
      await api.put("/user/chat-pin", { pin: pinInput, enabled: true });
      setPinEnabled(true);
      await updateUser({ chatPinEnabled: true });
      setPinModalVisible(false);
      setPinInput("");
      Alert.alert("Done", "Chat PIN lock enabled 🔒");
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "Failed to set PIN");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Chat PIN Lock</Text>
        <Switch value={pinEnabled} onValueChange={handlePinToggle} />
      </View>

      <Text style={styles.sectionTitle}>Theme</Text>
      <View style={styles.themeRow}>
        {THEMES.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.themeChip, user?.theme === t.key && styles.themeChipActive]}
            onPress={() => handleThemeSelect(t.key)}
          >
            <Text style={user?.theme === t.key ? styles.themeChipTextActive : styles.themeChipText}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* TODO: Archived chats, notification preferences, delete account */}

      <Modal visible={pinModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Set a numeric PIN (4-6 digits)</Text>
            <TextInput
              style={styles.pinInput}
              value={pinInput}
              onChangeText={setPinInput}
              keyboardType="numeric"
              secureTextEntry
              maxLength={6}
              placeholder="••••"
            />
            <View style={styles.modalBtnRow}>
              <TouchableOpacity onPress={() => setPinModalVisible(false)} style={styles.modalCancelBtn}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={savePin} style={styles.modalSaveBtn}>
                <Text style={{ color: "white", fontWeight: "bold" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFE3EC", padding: 20 },
  row: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: "white", padding: 16, borderRadius: 12, marginBottom: 20,
  },
  label: { fontSize: 15, color: "#333" },
  sectionTitle: { fontWeight: "bold", color: "#D6336C", marginBottom: 10 },
  themeRow: { flexDirection: "row", flexWrap: "wrap" },
  themeChip: { backgroundColor: "white", padding: 10, borderRadius: 10, marginRight: 8, marginBottom: 8 },
  themeChipActive: { backgroundColor: "#D6336C" },
  themeChipText: { color: "#333" },
  themeChipTextActive: { color: "white", fontWeight: "bold" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalBox: { backgroundColor: "white", borderRadius: 16, padding: 24, width: "80%" },
  modalTitle: { fontSize: 15, marginBottom: 14, textAlign: "center" },
  pinInput: {
    borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12,
    textAlign: "center", fontSize: 20, letterSpacing: 8, marginBottom: 16,
  },
  modalBtnRow: { flexDirection: "row", justifyContent: "space-between" },
  modalCancelBtn: { padding: 10 },
  modalSaveBtn: { backgroundColor: "#D6336C", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
});