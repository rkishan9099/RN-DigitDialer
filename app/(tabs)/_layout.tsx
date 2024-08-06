import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Iconify } from 'react-native-iconify';
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
            <Iconify icon="material-symbols:dialpad" size={28} color={color} />

          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <Iconify icon="flat-color-icons:settings" size={28} color={color} />
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
