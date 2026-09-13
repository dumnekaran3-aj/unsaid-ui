import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../context/AuthContext";
import api from "../config/api";

export default function ProfileScreen({ navigation }) {
  const { user, updateUser, logout } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || "");

  async function pickAndUploadImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return Alert.alert("Permission needed", "Please allow photo access to set a profile picture");
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", {
        uri: asset.uri,
        name: `profile-${Date.now()}.jpg`,
        type: "image/jpeg",
      });
      formData.append("folder", "profile-images");

      const uploadRes = await api.post("/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = uploadRes.data.url;

      const profileRes = await api.put("/user/profile", { profileImage: imageUrl });
      await updateUser({ profileImage: profileRes.data.user.profileImage });

      Alert.alert("Done", "Profile picture updated 💕");
    } catch (err) {
      console.log(err);
      Alert.alert("Upload failed", err.response?.data?.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  }

  async function saveName() {
    if (!nameInput.trim()) return;
    try {
      const res = await api.put("/user/profile", { name: nameInput.trim() });
      await updateUser({ name: res.data.user.name });
      setEditingName(false);
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "Failed to update name");
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickAndUploadImage} disabled={uploading}>
        {user?.profileImage ? (
          <Image source={{ uri: user.profileImage }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>{user?.name?.[0]?.toUpperCase()}</Text>
          </View>
        )}
        {uploading && (
          <View style={styles.uploadOverlay}>
            <ActivityIndicator color="white" />
          </View>
        )}
        <Text style={styles.changePhotoText}>Tap to change photo</Text>
      </TouchableOpacity>

      {editingName ? (
        <View style={styles.editNameRow}>
          <TextInput
            style={styles.nameInput}
            value={nameInput}
            onChangeText={setNameInput}
            autoFocus
          />
          <TouchableOpacity onPress={saveName} style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={() => setEditingName(true)}>
          <Text style={styles.name}>{user?.name} ✏️</Text>
        </TouchableOpacity>
      )}

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
  avatar: { width: 90, height: 90, borderRadius: 45, marginTop: 30 },
  avatarPlaceholder: {
    width: 90, height: 90, borderRadius: 45, backgroundColor: "#D6336C",
    alignItems: "center", justifyContent: "center", marginTop: 30,
  },
  avatarInitial: { color: "white", fontSize: 32, fontWeight: "bold" },
  uploadOverlay: {
    position: "absolute", top: 30, left: 0, width: 90, height: 90,
    borderRadius: 45, backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center", justifyContent: "center",
  },
  changePhotoText: { fontSize: 11, color: "#D6336C", textAlign: "center", marginTop: 6 },
  name: { fontSize: 20, fontWeight: "bold", color: "#333", marginTop: 12 },
  editNameRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  nameInput: {
    borderBottomWidth: 1, borderBottomColor: "#D6336C", fontSize: 18,
    paddingHorizontal: 8, minWidth: 140, textAlign: "center",
  },
  saveBtn: { marginLeft: 8, backgroundColor: "#D6336C", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  saveBtnText: { color: "white", fontWeight: "bold" },
  key: { color: "#888", marginTop: 6, marginBottom: 30 },
  row: { width: "100%", backgroundColor: "white", padding: 16, borderRadius: 12, marginBottom: 10 },
  rowText: { fontSize: 15, color: "#333" },
  breakupRow: { width: "100%", padding: 16, borderRadius: 12, marginTop: 30, alignItems: "center" },
  breakupText: { color: "#E03131", fontWeight: "bold" },
});