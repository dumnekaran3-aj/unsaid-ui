import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";

const GIFT_LABELS = {
  rose: "Rose",
  heart: "Heart",
  teddy: "Teddy Bear",
  kiss: "Kiss",
  ring: "Ring",
};

export default function GiftBubble({ giftType, emoji }) {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.giftContainer, { transform: [{ scale }] }]}>
      <Text style={styles.giftEmoji}>{emoji}</Text>
      <Text style={styles.giftLabel}>{GIFT_LABELS[giftType] || "Gift"}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  giftContainer: { alignItems: "center", padding: 8, minWidth: 90 },
  giftEmoji: { fontSize: 48 },
  giftLabel: { fontSize: 12, color: "#D6336C", fontWeight: "bold", marginTop: 4 },
});