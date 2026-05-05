import { Tabs } from "expo-router";
import React from "react";

const colors = {
  background: "#070812",
  tabBar: "#11131c",
  border: "#272b3a",
  active: "#e85d75",
  inactive: "#7f7a8d",
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
        tabBarActiveTintColor: colors.active,
        tabBarInactiveTintColor: colors.inactive,
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
