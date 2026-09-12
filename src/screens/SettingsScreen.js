import React from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity } from "react-native";

export default function SettingsScreen() {
  const [pinEnabled, setPinEnabled] = React.useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Chat PIN Lock</Text>
        <Switch value={pinEnabled} onValueChange={setPinEnabled} />
      </View>

      {/* TODO: PIN set screen navigation when enabled */}

      <Text style={styles.sectionTitle}>Theme</Text>
      <View style={styles.themeRow}>
        {["Romantic Pink", "Dark", "Normal"].map((t) => (
          <TouchableOpacity key={t} style={styles.themeChip}>
            <Text style={styles.themeChipText}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* TODO: Archived chats, notification preferences, delete account */}
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
  themeChipText: { color: "#333" },
});
