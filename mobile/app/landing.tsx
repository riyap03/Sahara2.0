import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useRole } from './context/RoleContext';
import { globalStore } from '../constants/store';

type RoleTarget = 'senior' | 'family' | 'provider';

const roles: {
  role: RoleTarget;
  icon: string;
  title: string;
  subtitle: string;
  route: '/onboarding/senior' | '/onboarding/family' | '/onboarding/helper';
  accent: string;
}[] = [
  {
    role: 'senior',
    icon: '👵',
    title: "I'm a Senior",
    subtitle: 'I need help',
    route: '/onboarding/senior',
    accent: '#0F766E',
  },
  {
    role: 'family',
    icon: '👨‍👩‍👧',
    title: "I'm Family",
    subtitle: 'I want to support',
    route: '/onboarding/family',
    accent: '#7C3AED',
  },
  {
    role: 'provider',
    icon: '🧑',
    title: "I'm a Helper",
    subtitle: 'I want to help',
    route: '/onboarding/helper',
    accent: '#2563EB',
  },
];

export default function LandingScreen() {
  const { setRole } = useRole();

  const chooseRole = (role: RoleTarget, route: (typeof roles)[number]['route']) => {
    setRole(role);
    globalStore.setRole(role);
    router.push(route);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.hero}>
          <Text style={styles.homeIcon}>🏠</Text>
          <Text style={styles.appName}>Sahara</Text>
          <Text style={styles.tagline}>
            Do not monitor seniors.{'\n'}Build a backup around them.
          </Text>
        </View>

        <Text style={styles.question}>Who are you?</Text>

        <View style={styles.cards}>
          {roles.map((item) => (
            <TouchableOpacity
              key={item.role}
              activeOpacity={0.86}
              style={[styles.roleCard, { borderColor: item.accent }]}
              onPress={() => chooseRole(item.role, item.route)}
            >
              <Text style={styles.roleIcon}>{item.icon}</Text>
              <View style={styles.roleCopy}>
                <Text style={styles.roleTitle}>{item.title}</Text>
                <Text style={styles.roleSubtitle}>{item.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 34,
  },
  homeIcon: {
    fontSize: 58,
    marginBottom: 12,
  },
  appName: {
    color: '#111827',
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
  },
  tagline: {
    color: '#4B5563',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 25,
    marginTop: 12,
    textAlign: 'center',
  },
  question: {
    color: '#1F2937',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 18,
    textAlign: 'center',
  },
  cards: {
    gap: 14,
  },
  roleCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 2,
    flexDirection: 'row',
    minHeight: 118,
    padding: 22,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  roleIcon: {
    fontSize: 44,
    width: 68,
  },
  roleCopy: {
    flex: 1,
  },
  roleTitle: {
    color: '#111827',
    fontSize: 23,
    fontWeight: '900',
  },
  roleSubtitle: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 5,
  },
});
