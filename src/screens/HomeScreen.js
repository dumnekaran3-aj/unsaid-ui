import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hey {user?.name} 💕</Text>
      <Text style={styles.status}>Your partner is online</Text>

      <TouchableOpacity style={styles.chatButton} onPress={() => navigation.navigate("Chatroom")}>
        <Text style={styles.chatButtonText}>Open Chat</Text>
      </TouchableOpacity>

      {/* TODO: connection streak counter, last message preview, Miss You banner */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#FFE3EC", padding: 24 },
  greeting: { fontSize: 24, fontWeight: "bold", color: "#D6336C", marginBottom: 8 },
  status: { color: "#666", marginBottom: 40 },
  chatButton: {
    backgroundColor: "#D6336C",
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  chatButtonText: { color: "white", fontWeight: "bold", fontSize: 18 },
});
