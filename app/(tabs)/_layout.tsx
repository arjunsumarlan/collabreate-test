import { Tabs } from "expo-router";
import React from "react";
import { Platform, Pressable } from "react-native";
import { AuthGuard } from '@/components/AuthGuard';

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { triggerHaptic } from "@/utils/haptics";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthGuard>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          tabBarInactiveTintColor: '#999',
          headerShown: false,
          tabBarStyle: {
            position: "absolute",
            bottom: Platform.OS === "ios" ? 20 : 0,
            left: 16,
            right: 16,
            height: 48,
            backgroundColor: "#fff",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 5,
            borderTopWidth: 0,
          },
          tabBarLabelStyle: {
            fontSize: 16,
            fontWeight: "500",
            paddingBottom: 0,
            marginTop: -18,
          },
          tabBarIcon: () => null,
          tabBarButton: (props: { onPress?: (e: any) => void }) => (
            <Pressable
              {...props}
              onPress={async (e) => {
                await triggerHaptic();
                props.onPress?.(e);
              }}
            />
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
          }}
        />
        <Tabs.Screen
          name="transactions"
          options={{
            title: "Transactions",
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: "Account",
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}

