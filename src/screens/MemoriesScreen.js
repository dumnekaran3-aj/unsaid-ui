import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import api from "../config/api";

const numColumns = 3;
const size = Dimensions.get("window").width / numColumns;

export default function MemoriesScreen() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMedia = useCallback(async () => {
    try {
      const res = await api.get("/media");
      setMedia(res.data.media);
    } catch (err) {
      console.log("Failed to load memories:", err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  function onRefresh() {
    setRefreshing(true);
    fetchMedia();
  }

  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator color="#D6336C" size="large" />
      </View>
    );
  }

  if (media.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No memories yet 💭</Text>
        <Text style={styles.emptySubtext}>Photos and videos you both share will appear here</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={media}
      numColumns={numColumns}
      keyExtractor={(item) => item._id}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      renderItem={({ item }) => (
        <Image source={{ uri: item.url }} style={{ width: size, height: size }} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#FFE3EC" },
  emptyText: { fontSize: 18, fontWeight: "bold", color: "#D6336C" },
  emptySubtext: { color: "#888", marginTop: 6 },
});