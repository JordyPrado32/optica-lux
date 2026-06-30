import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import { HapticTab } from '@/components/haptic-tab';
import { palette } from '@/constants/palette';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: palette.accent,
        tabBarInactiveTintColor: palette.muted,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: '#101925',
          borderTopWidth: 0,
          height: 74,
          paddingTop: 10,
          paddingBottom: 12,
          position: 'absolute',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-circle" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
