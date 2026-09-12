import React, { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { getSocket } from "../config/socket";
import { useAuth } from "../context/AuthContext";

export default function ChatroomScreen() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const socket = getSocket();

  useEffect(() => {
    if (!socket) return;
    socket.on("receive_message", (msg) => {
      setMessages((prev) => [msg, ...prev]);
    });
    return () => socket.off("receive_message");
  }, [socket]);

  function sendMessage() {
    if (!text.trim() || !socket) return;
    socket.emit("send_message", { type: "text", content: text.trim() });
    setText("");
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        inverted
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.sender === user?.id ? styles.bubbleMine : styles.bubbleTheirs,
            ]}
          >
            <Text style={item.sender === user?.id ? styles.textMine : styles.textTheirs}>
              {item.content}
            </Text>
          </View>
        )}
      />

      <View style={styles.inputRow}>
        {/* TODO: gift icon, image/video attach icon, mic icon */}
        <TextInput
          style={styles.input}
          placeholder="Type something sweet..."
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Text style={styles.sendBtnText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF0F5" },
  bubble: { maxWidth: "75%", padding: 12, borderRadius: 16, marginVertical: 4 },
  bubbleMine: { backgroundColor: "#D6336C", alignSelf: "flex-end" },
  bubbleTheirs: { backgroundColor: "white", alignSelf: "flex-start" },
  textMine: { color: "white" },
  textTheirs: { color: "#333" },
  inputRow: { flexDirection: "row", padding: 10, backgroundColor: "white", alignItems: "center" },
  input: { flex: 1, backgroundColor: "#F4F4F4", borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10 },
  sendBtn: { marginLeft: 10, backgroundColor: "#D6336C", borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10 },
  sendBtnText: { color: "white", fontWeight: "bold" },
});
