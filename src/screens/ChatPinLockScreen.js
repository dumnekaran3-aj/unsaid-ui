import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import api from "../config/api";
import { useAuth } from "../context/AuthContext";

export default function ChatPinLockScreen() {
  const { setChatUnlocked } = useAuth();
  const [pin, setPin] = useState("");
  const [checking, setChecking] = useState(false);

  async function verifyPin() {
    if (!pin) return;
    setChecking(true);
    try {
      const res = await api.post("/user/verify-chat-pin", { pin });
      if (res.data.valid) {
        setChatUnlocked(true);
      } else {
        Alert.alert("Wrong PIN", "Try again");
        setPin("");
      }
    } catch (err) {
      Alert.alert("Error", "Failed to verify PIN");
    } finally {
      setChecking(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.lockIcon}>🔒</Text>
      <Text style={styles.title}>Enter your Chat PIN</Text>

      <TextInput
        style={styles.pinInput}
        value={pin}
        onChangeText={setPin}
        keyboardType="numeric"
        secureTextEntry
        maxLength={6}
        autoFocus
        placeholder="••••"
      />

      <TouchableOpacity style={styles.unlockBtn} onPress={verifyPin} disabled={checking}>
        <Text style={styles.unlockBtnText}>{checking ? "Checking..." : "Unlock"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFE3EC", alignItems: "center", justifyContent: "center", padding: 24 },
  lockIcon: { fontSize: 48, marginBottom: 10 },
  title: { fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 24 },
  pinInput: {
    backgroundColor: "white", borderRadius: 12, padding: 16, width: "60%",
    textAlign: "center", fontSize: 24, letterSpacing: 10, marginBottom: 20,
  },
  unlockBtn: { backgroundColor: "#D6336C", paddingHorizontal: 40, paddingVertical: 14, borderRadius: 12 },
  unlockBtnText: { color: "white", fontWeight: "bold", fontSize: 16 },
});