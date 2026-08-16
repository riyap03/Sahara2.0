import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';
import { useRole } from './context/RoleContext';
import { globalStore } from '../constants/store';
import { shadow } from '../constants/theme';

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

import { API_BASE_URL } from '../constants/api';

const API_URL = API_BASE_URL;

export default function LandingScreen() {
  const { setRole, setToken, setUser } = useRole();
  const [isLogin, setIsLogin] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRoleState] = useState<RoleTarget>('senior');
  const [isLoading, setIsLoading] = useState(false);

  const chooseRole = (role: RoleTarget, route: (typeof roles)[number]['route']) => {
    setRole(role);
    globalStore.setRole(role);
    router.push(route);
  };

  const handleLogin = async () => {
    if (!phone.trim() || password.trim().length < 6) {
      Alert.alert('Missing Info', 'Please enter phone number and a 6+ digit password.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim(), password: password.trim() }),
      });
      const data = await response.json();

      if (!data.success) {
        Alert.alert('Login Failed', data.message || 'Invalid credentials.');
        return;
      }

      const userRole = (data.user?.role || 'senior') as RoleTarget;
      setRole(userRole);
      setToken(data.token);
      setUser(data.user);
      globalStore.setRole(userRole);
      globalStore.setToken(data.token);
      globalStore.setUser(data.user);
      router.replace('/(tabs)');
    } catch {
      Alert.alert('Error', 'Could not connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
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

        {!isLogin ? (
          <>
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

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.loginToggle}
              onPress={() => setIsLogin(true)}
            >
              <Text style={styles.loginToggleText}>Already have an account? Login</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.loginCard}>
            <Text style={styles.loginTitle}>Welcome Back</Text>
            <Text style={styles.loginSubtitle}>Login to your existing account</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="10-digit mobile number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                maxLength={10}
              />
              {phone.length > 0 && phone.length !== 10 && (
                <Text style={styles.errorText}>Please enter a valid 10-digit phone number</Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                  <IconSymbol name={showPassword ? 'eye-off' : 'eye'} size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
              <Text style={styles.passwordNote}>Password must be at least 6 characters</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>I am a</Text>
              <View style={styles.chipRow}>
                {roles.map((item) => (
                  <TouchableOpacity
                    key={item.role}
                    style={[styles.chip, role === item.role && styles.chipActive]}
                    onPress={() => setRoleState(item.role)}
                  >
                    <Text style={[styles.chipText, role === item.role && styles.chipTextActive]}>
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.86}
              style={styles.primaryButton}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.primaryButtonText}>{isLoading ? 'Logging in...' : 'Login'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.loginToggle}
              onPress={() => setIsLogin(false)}
            >
              <Text style={styles.loginToggleText}>New here? Create an account</Text>
            </TouchableOpacity>
          </View>
        )}
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
    ...shadow({ color: '#0F172A', offset: { width: 0, height: 3 }, opacity: 0.08, radius: 8, elevation: 3 }),
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
  loginToggle: {
    marginTop: 24,
    alignItems: 'center',
  },
  loginToggleText: {
    color: '#7C3AED',
    fontSize: 16,
    fontWeight: '800',
  },
  loginCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    padding: 20,
    ...shadow({ color: '#0F172A', offset: { width: 0, height: 3 }, opacity: 0.08, radius: 8, elevation: 3 }),
  },
  loginTitle: {
    color: '#111827',
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 4,
  },
  loginSubtitle: {
    color: '#6B7280',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 18,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderColor: '#D1D5DB',
    borderRadius: 8,
    borderWidth: 2,
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
    minHeight: 52,
    paddingHorizontal: 14,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eyeButton: {
    padding: 8,
  },
  passwordNote: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D5DB',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  chipActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  chipText: {
    color: '#4B5563',
    fontWeight: '800',
    fontSize: 13,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#6D28D9',
    justifyContent: 'center',
    marginTop: 12,
    minHeight: 54,
    paddingHorizontal: 18,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
});
