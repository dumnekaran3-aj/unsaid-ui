import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Share } from "react-native";
import { useAuth } from "../context/AuthContext";
import api from "../config/api";

export default function ConnectionKeyScreen() {
  const { user, setUser } = useAuth();
  const [partnerKey, setPartnerKey] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleConnect() {
    if (!partnerKey) return Alert.alert("Enter a key", "Paste your partner's connection key");
    setLoading(true);
    try {
      const res = await api.post("/connection/link", { partnerKey: partnerKey.trim() });
      Alert.alert("Connected! 💕", res.data.message);
      // Update local user state so RootNavigator switches to the main app
      setUser((prev) => ({ ...prev, partnerId: res.data.connection.id }));
    } catch (err) {
      Alert.alert("Couldn't connect", err.response?.data?.message || "Invalid key");
    } finally {
      setLoading(false);
    }
  }

  function shareKey() {
    Share.share({ message: `Connect with me on Unsaid 💌: ${user?.connectionKey}` });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect with your partner</Text>

      <View style={styles.keyBox}>
        <Text style={styles.keyLabel}>Your Connection Key</Text>
        <Text style={styles.keyValue}>{user?.connectionKey}</Text>
        <TouchableOpacity style={styles.shareBtn} onPress={shareKey}>
          <Text style={styles.shareBtnText}>Share Key</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.orText}>— or enter their key below —</Text>

      <TextInput
        style={styles.input}
        placeholder="Paste partner's connection key"
        autoCapitalize="characters"
        value={partnerKey}
        onChangeText={setPartnerKey}
      />

      <TouchableOpacity style={styles.button} onPress={handleConnect} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Connecting..." : "Connect"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#FFE3EC" },
  title: { fontSize: 22, fontWeight: "bold", color: "#D6336C", textAlign: "center", marginBottom: 24 },
  keyBox: { backgroundColor: "white", borderRadius: 16, padding: 20, alignItems: "center", marginBottom: 20 },
  keyLabel: { color: "#888", marginBottom: 6 },
  keyValue: { fontSize: 20, fontWeight: "bold", color: "#D6336C", letterSpacing: 1 },
  shareBtn: { marginTop: 12, backgroundColor: "#FFE3EC", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 10 },
  shareBtnText: { color: "#D6336C", fontWeight: "600" },
  orText: { textAlign: "center", color: "#999", marginBottom: 16 },
  input: { backgroundColor: "white", padding: 14, borderRadius: 12, marginBottom: 14, fontSize: 15 },
  button: { backgroundColor: "#D6336C", padding: 16, borderRadius: 12 },
  buttonText: { color: "white", textAlign: "center", fontWeight: "bold", fontSize: 16 },
});
