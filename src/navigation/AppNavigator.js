import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";

import { useAuth } from "../context/AuthContext";

import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import ConnectionKeyScreen from "../screens/ConnectionKeyScreen";
import HomeScreen from "../screens/HomeScreen";
import ChatroomScreen from "../screens/ChatroomScreen";
import MemoriesScreen from "../screens/MemoriesScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import CallScreen from "../screens/CallScreen";
import BreakupScreen from "../screens/BreakupScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Bar — matches the architecture plan: Home / Chat / Memories / Profile
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#D6336C",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: () => <Text>🏠</Text> }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatroomScreen}
        options={{ tabBarIcon: () => <Text>💬</Text> }}
      />
      <Tab.Screen
        name="Memories"
        component={MemoriesScreen}
        options={{ tabBarIcon: () => <Text>📸</Text> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: () => <Text>👤</Text> }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) return null; // TODO: splash screen while checking stored session

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          // ---- Not logged in ----
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : !user.partnerId ? (
          // ---- Logged in, but not linked with a partner yet ----
          <Stack.Screen name="ConnectionKey" component={ConnectionKeyScreen} />
        ) : (
          // ---- Logged in AND connected: full app access ----
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="Chatroom" component={ChatroomScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Call" component={CallScreen} options={{ presentation: "fullScreenModal" }} />
            <Stack.Screen name="Breakup" component={BreakupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
