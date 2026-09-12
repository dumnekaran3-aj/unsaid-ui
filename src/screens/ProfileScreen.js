import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.avatarPlaceholder}>
        <Text style={styles.avatarInitial}>{user?.name?.[0]?.toUpperCase()}</Text>
      </View>
      <Text style={styles.name}>{user?.name}</Text>
      <Text style={styles.key}>Key: {user?.connectionKey}</Text>

      <TouchableOpacity style={styles.row} onPress={() => navigation.navigate("Settings")}>
        <Text style={styles.rowText}>Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.row} onPress={logout}>
        <Text style={styles.rowText}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.breakupRow} onPress={() => navigation.navigate("Breakup")}>
        <Text style={styles.breakupText}>Breakup</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 24, backgroundColor: "#FFE3EC" },
  avatarPlaceholder: {
    width: 90, height: 90, borderRadius: 45, backgroundColor: "#D6336C",
    alignItems: "center", justifyContent: "center", marginTop: 30, marginBottom: 12,
  },
  avatarInitial: { color: "white", fontSize: 32, fontWeight: "bold" },
  name: { fontSize: 20, fontWeight: "bold", color: "#333" },
  key: { color: "#888", marginBottom: 30 },
  row: { width: "100%", backgroundColor: "white", padding: 16, borderRadius: 12, marginBottom: 10 },
  rowText: { fontSize: 15, color: "#333" },
  breakupRow: { width: "100%", padding: 16, borderRadius: 12, marginTop: 30, alignItems: "center" },
  breakupText: { color: "#E03131", fontWeight: "bold" },
});
