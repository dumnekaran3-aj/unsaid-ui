import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) return Alert.alert("Missing info", "Enter email and password");
    setLoading(true);
    try {
      await login(email, password);
      // Navigation to Home / ConnectionKey happens automatically via RootNavigator
      // based on whether user.partnerId exists.
    } catch (err) {
      Alert.alert("Login failed", err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unsaid 💌</Text>
      <Text style={styles.subtitle}>Welcome back</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Logging in..." : "Login"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.link}>New here? Create an account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#FFE3EC" },
  title: { fontSize: 32, fontWeight: "bold", color: "#D6336C", textAlign: "center" },
  subtitle: { fontSize: 16, color: "#555", textAlign: "center", marginBottom: 30 },
  input: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
    fontSize: 15,
  },
  button: { backgroundColor: "#D6336C", padding: 16, borderRadius: 12, marginTop: 10 },
  buttonText: { color: "white", textAlign: "center", fontWeight: "bold", fontSize: 16 },
  link: { color: "#D6336C", textAlign: "center", marginTop: 18 },
});
