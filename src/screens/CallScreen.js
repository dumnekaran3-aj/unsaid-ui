import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

// TODO: Wire up react-native-webrtc here, using socket events:
// call_offer, call_answer, ice_candidate, call_end (already set up in backend/sockets/socketHandler.js)
export default function CallScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.timer}>00:00</Text>
      <Text style={styles.status}>Connecting...</Text>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlBtn}>
          <Text style={styles.controlText}>Mute</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.endBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.endText}>End</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlBtn}>
          <Text style={styles.controlText}>Speaker</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a1a1a", alignItems: "center", justifyContent: "space-between", paddingVertical: 60 },
  timer: { color: "white", fontSize: 20, marginTop: 40 },
  status: { color: "#aaa" },
  controls: { flexDirection: "row", alignItems: "center", gap: 20 },
  controlBtn: { backgroundColor: "#333", padding: 16, borderRadius: 40 },
  controlText: { color: "white" },
  endBtn: { backgroundColor: "#E03131", padding: 20, borderRadius: 50 },
  endText: { color: "white", fontWeight: "bold" },
});
