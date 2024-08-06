import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (

    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dialpad',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={"documents"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={"settings"} color={color} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="callscreen"
        options={{
          title: 'Call Screen',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={"settings"} color={color} />
          ),
        }}
      /> */}
    </Tabs>

  );
}
