import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getSocket } from "../config/socket";
import { useAuth } from "../context/AuthContext";
import api from "../config/api";
import ChatPinLockScreen from "./ChatPinLockScreen";
import GiftBubble from "../components/GiftBubble";
import GiftPickerModal from "../components/GiftPickerModal";

export default function ChatroomScreen() {
  const { user, chatUnlocked } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [giftPickerVisible, setGiftPickerVisible] = useState(false);
  const socket = getSocket();

  // All hooks must run on every render — the PIN-lock early return
  // happens AFTER them, never before (React Hooks rule).
  useEffect(() => {
    if (!socket) return;

    socket.on("receive_message", (msg) => {
      setMessages((prev) => [msg, ...prev]);
    });

    socket.on("message_deleted", ({ messageId, forEveryone }) => {
      setMessages((prev) =>
        prev.map((m) => {
          if (m._id !== messageId) return m;
          return forEveryone
            ? { ...m, deletedForEveryone: true }
            : { ...m, deletedForSender: true };
        })
      );
    });

    socket.on("error_message", (err) => {
      console.log("Chat error:", err.message);
      Alert.alert("Error", err.message);
    });

    return () => {
      socket.off("receive_message");
      socket.off("message_deleted");
      socket.off("error_message");
    };
  }, [socket]);

  // Gate the chatroom behind the PIN lock screen if enabled and not yet unlocked this session
  if (user?.chatPinEnabled && !chatUnlocked) {
    return <ChatPinLockScreen />;
  }

  function sendMessage() {
    if (!text.trim() || !socket) return;
    socket.emit("send_message", { type: "text", content: text.trim() });
    setText("");
  }

  function sendGift(giftOption) {
    if (!socket) return;
    socket.emit("send_message", {
      type: "gift",
      giftType: giftOption.key,
      content: giftOption.emoji,
    });
  }

  async function pickAndSendImage(fromCamera) {
    const permission = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      return Alert.alert("Permission needed", "Please allow access to continue");
    }

    const pickerFn = fromCamera
      ? ImagePicker.launchCameraAsync
      : ImagePicker.launchImageLibraryAsync;

    const result = await pickerFn({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", {
        uri: asset.uri,
        name: `chat-${Date.now()}.jpg`,
        type: "image/jpeg",
      });
      formData.append("folder", "chat-media");

      const uploadRes = await api.post("/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = uploadRes.data.url;
      socket.emit("send_message", { type: "image", content: imageUrl });
    } catch (err) {
      console.log(err);
      Alert.alert("Upload failed", err.response?.data?.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  }

  function showAttachOptions() {
    Alert.alert("Send a photo", "Choose an option", [
      { text: "Camera", onPress: () => pickAndSendImage(true) },
      { text: "Gallery", onPress: () => pickAndSendImage(false) },
      { text: "Cancel", style: "cancel" },
    ]);
  }

  function handleLongPress(item) {
    const isMine = item.sender === user?.id;

    if (isMine) {
      Alert.alert("Message options", "", [
        {
          text: "Delete for me",
          onPress: () => socket.emit("delete_message", { messageId: item._id, forEveryone: false }),
        },
        {
          text: "Delete for everyone",
          style: "destructive",
          onPress: () => socket.emit("delete_message", { messageId: item._id, forEveryone: true }),
        },
        { text: "Cancel", style: "cancel" },
      ]);
    } else {
      Alert.alert("Message options", "", [
        {
          text: "Delete for me",
          onPress: () => setMessages((prev) => prev.filter((m) => m._id !== item._id)),
        },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages.filter((m) => {
          if (m.deletedForEveryone) return false;
          if (m.deletedForSender && m.sender === user?.id) return false;
          return true;
        })}
        keyExtractor={(item) => item._id}
        inverted
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => {
          const isMine = item.sender === user?.id;

          if (item.type === "gift") {
            return (
              <View style={[styles.giftWrapper, isMine ? styles.alignRight : styles.alignLeft]}>
                <TouchableOpacity onLongPress={() => handleLongPress(item)} activeOpacity={0.8}>
                  <GiftBubble giftType={item.giftType} emoji={item.content} />
                </TouchableOpacity>
              </View>
            );
          }

          return (
            <TouchableOpacity
              onLongPress={() => handleLongPress(item)}
              activeOpacity={0.8}
              style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleTheirs]}
            >
              {item.type === "image" ? (
                <TouchableOpacity onPress={() => setPreviewImage(item.content)}>
                  <Image source={{ uri: item.content }} style={styles.chatImage} />
                </TouchableOpacity>
              ) : (
                <Text style={isMine ? styles.textMine : styles.textTheirs}>{item.content}</Text>
              )}
            </TouchableOpacity>
          );
        }}
      />

      {uploading && (
        <View style={styles.uploadingBar}>
          <ActivityIndicator size="small" color="#D6336C" />
          <Text style={styles.uploadingText}>Sending photo...</Text>
        </View>
      )}

      <View style={styles.inputRow}>
        <TouchableOpacity onPress={showAttachOptions} style={styles.attachBtn}>
          <Text style={styles.attachIcon}>📷</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setGiftPickerVisible(true)} style={styles.attachBtn}>
          <Text style={styles.attachIcon}>🎁</Text>
        </TouchableOpacity>

        {/* TODO: mic icon for voice notes */}
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

      <GiftPickerModal
        visible={giftPickerVisible}
        onClose={() => setGiftPickerVisible(false)}
        onSelect={sendGift}
      />

      <Modal visible={!!previewImage} transparent animationType="fade">
        <TouchableOpacity
          style={styles.previewOverlay}
          activeOpacity={1}
          onPress={() => setPreviewImage(null)}
        >
          <Image source={{ uri: previewImage }} style={styles.previewImage} resizeMode="contain" />
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF0F5" },
  bubble: { maxWidth: "75%", padding: 6, borderRadius: 16, marginVertical: 4 },
  bubbleMine: { backgroundColor: "#D6336C", alignSelf: "flex-end", padding: 12 },
  bubbleTheirs: { backgroundColor: "white", alignSelf: "flex-start", padding: 12 },
  textMine: { color: "white" },
  textTheirs: { color: "#333" },
  chatImage: { width: 180, height: 180, borderRadius: 12 },
  giftWrapper: { marginVertical: 4 },
  alignRight: { alignItems: "flex-end" },
  alignLeft: { alignItems: "flex-start" },
  inputRow: { flexDirection: "row", padding: 10, backgroundColor: "white", alignItems: "center" },
  attachBtn: { marginRight: 8, padding: 6 },
  attachIcon: { fontSize: 22 },
  input: { flex: 1, backgroundColor: "#F4F4F4", borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10 },
  sendBtn: { marginLeft: 10, backgroundColor: "#D6336C", borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10 },
  sendBtnText: { color: "white", fontWeight: "bold" },
  uploadingBar: { flexDirection: "row", alignItems: "center", padding: 8, justifyContent: "center" },
  uploadingText: { marginLeft: 8, color: "#888", fontSize: 12 },
  previewOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.9)", alignItems: "center", justifyContent: "center" },
  previewImage: { width: "100%", height: "80%" },
});