import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';

import { HapticTab } from '../../components/haptic-tab';
import { IconSymbol } from '../../components/ui/icon-symbol';
import { Colors } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { globalStore } from '../../constants/store';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [lang, setLang] = useState(globalStore.getLanguage());

  useEffect(() => {
    return globalStore.subscribe(() => {
      setLang(globalStore.getLanguage());
    });
  }, []);

  const t = {
    hi: {
      home: 'होम (Home)',
      requests: 'मदद (Requests)',
      trusted: 'भरोसेमंद (Trusted)',
      profile: 'मेरी प्रोफ़ाइल',
      explore: 'एक्सप्लोर (Explore)',
    },
    en: {
      home: 'Home',
      requests: 'Requests',
      trusted: 'Trusted',
      profile: 'Profile',
      explore: 'Explore',
    },
  }[lang];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2E7D32', // Deep reassure green for high contrast & senior-friendly
        tabBarInactiveTintColor: '#666',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          height: 80,
          paddingBottom: 15,
          paddingTop: 8,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 2,
          borderTopColor: '#E0E0E0',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t.home,
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: t.requests,
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="list.clipboard.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="trusted"
        options={{
          title: t.trusted,
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.2.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t.profile,
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: t.explore,
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
