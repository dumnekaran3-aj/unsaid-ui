import React from "react";
import { View, Text, FlatList, Image, StyleSheet, Dimensions } from "react-native";

const numColumns = 3;
const size = Dimensions.get("window").width / numColumns;

export default function MemoriesScreen() {
  // TODO: fetch from GET /api/media (paginated, by connectionId)
  const [media] = React.useState([]);

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
