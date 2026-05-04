import { Tabs } from "expo-router";
import React from "react";

const colors = {
  background: "#050507",
  tabBar: "#0d0d12",
  border: "#24202b",
  red: "#ff304f",
  muted: "#77717f",
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
          height: 68,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: colors.red,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "800",
        },
        sceneStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Chat",
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Core",
        }}
      />
    </Tabs>
  );
}
