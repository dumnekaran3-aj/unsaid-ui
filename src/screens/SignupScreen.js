import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function SignupScreen({ navigation }) {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("male");
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (!name || !email || !password) return Alert.alert("Missing info", "Fill all fields");
    setLoading(true);
    try {
      await signup(name, email, password, gender);
    } catch (err) {
      Alert.alert("Signup failed", err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create your account</Text>

      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <View style={styles.genderRow}>
        {["male", "female", "other"].map((g) => (
          <TouchableOpacity
            key={g}
            style={[styles.genderChip, gender === g && styles.genderChipActive]}
            onPress={() => setGender(g)}
          >
            <Text style={gender === g ? styles.genderTextActive : styles.genderText}>{g}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Creating..." : "Sign Up"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#FFE3EC" },
  title: { fontSize: 24, fontWeight: "bold", color: "#D6336C", textAlign: "center", marginBottom: 24 },
  input: { backgroundColor: "white", padding: 14, borderRadius: 12, marginBottom: 14, fontSize: 15 },
  genderRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  genderChip: {
    flex: 1,
    marginHorizontal: 4,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "white",
    alignItems: "center",
  },
  genderChipActive: { backgroundColor: "#D6336C" },
  genderText: { color: "#555" },
  genderTextActive: { color: "white", fontWeight: "bold" },
  button: { backgroundColor: "#D6336C", padding: 16, borderRadius: 12 },
  buttonText: { color: "white", textAlign: "center", fontWeight: "bold", fontSize: 16 },
  link: { color: "#D6336C", textAlign: "center", marginTop: 18 },
});
