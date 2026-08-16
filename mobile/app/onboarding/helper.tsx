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
import { useRouter } from 'expo-router';
import { globalStore } from '../../constants/store';
import { useRole } from '../context/RoleContext';

import { API_BASE_URL } from '../../constants/api';

const API_URL = API_BASE_URL;
const skills = ['Household Help', 'Grocery', 'Medical Assistance', 'Travel Assistance'];

export default function HelperOnboardingScreen() {
  const router = useRouter();
  const { setRole, setToken, setUser } = useRole();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((current) =>
      current.includes(skill) ? current.filter((item) => item !== skill) : [...current, skill]
    );
  };

  const createProfile = async () => {
    if (!name.trim() || phone.trim().length !== 10 || selectedSkills.length === 0 || password.trim().length < 6) {
      Alert.alert('Missing Info', 'Please enter a valid 10-digit phone, select at least one skill, and use a 6+ digit password.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: `${phone.trim()}@gharkabackup.com`,
          phone: phone.trim(),
          password: password.trim(),
          role: 'provider',
          address: { city: city.trim() },
          skills: selectedSkills,
        }),
      });
      const data = await response.json();

      if (!data.success) {
        Alert.alert('Error', data.message || 'Registration failed.');
        return;
      }

      setRole('provider');
      setToken(data.token);
      setUser(data.user);
      router.replace('/(tabs)/explore');
    } catch {
      setRole('provider');
      globalStore.setRole('provider');
      router.replace('/(tabs)/explore');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!loginPhone.trim() || loginPassword.trim().length < 6) {
      Alert.alert('Missing Info', 'Please enter phone number and a 6+ digit password.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: loginPhone.trim(), password: loginPassword.trim() }),
      });
      const data = await response.json();

      if (!data.success) {
        Alert.alert('Login Failed', data.message || 'Invalid credentials.');
        return;
      }

      setRole('provider');
      setToken(data.token);
      setUser(data.user);
      globalStore.setRole('provider');
      globalStore.setToken(data.token);
      globalStore.setUser(data.user);
      router.replace('/(tabs)/explore');
    } catch {
      Alert.alert('Error', 'Could not connect to server.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLogin) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Helper Login</Text>
          <Text style={styles.subtitle}>Access your existing helper account</Text>
          <View style={styles.field}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={loginPhone}
              onChangeText={setLoginPhone}
              placeholder="10-digit mobile number"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              maxLength={10}
            />
            {loginPhone.length > 0 && loginPhone.length !== 10 && (
              <Text style={styles.errorText}>Please enter a valid 10-digit phone number</Text>
            )}
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={styles.input}
                value={loginPassword}
                onChangeText={setLoginPassword}
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showLoginPassword}
              />
              <TouchableOpacity onPress={() => setShowLoginPassword(!showLoginPassword)} style={styles.eyeButton}>
                <IconSymbol name={showLoginPassword ? 'eye-off' : 'eye'} size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.86}
            disabled={isLoading}
            onPress={handleLogin}
            style={[styles.button, isLoading && styles.disabledButton]}
          >
            <Text style={styles.buttonText}>{isLoading ? 'Logging in...' : 'Login'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsLogin(false)}
            style={styles.loginToggle}
          >
            <Text style={styles.loginToggleText}>New here? Register instead</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Create Helper Profile</Text>
        <FormField label="Name" value={name} onChangeText={setName} />
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
        <FormField label="City" value={city} onChangeText={setCity} />

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
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
          <Text style={styles.label}>Skills</Text>
          <View style={styles.skillList}>
            {skills.map((skill) => {
              const selected = selectedSkills.includes(skill);
              return (
                <TouchableOpacity
                  activeOpacity={0.86}
                  key={skill}
                  onPress={() => toggleSkill(skill)}
                  style={[styles.skillRow, selected && styles.skillRowActive]}
                >
                  <Text style={[styles.checkbox, selected && styles.checkboxActive]}>
                    {selected ? '✓' : ''}
                  </Text>
                  <Text style={[styles.skillText, selected && styles.skillTextActive]}>{skill}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.86}
          disabled={isLoading}
          onPress={createProfile}
          style={[styles.button, isLoading && styles.disabledButton]}
        >
          <Text style={styles.buttonText}>{isLoading ? 'Creating...' : 'Continue'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsLogin(true)}
          style={styles.loginToggle}
        >
          <Text style={styles.loginToggleText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function FormField(props: React.ComponentProps<typeof TextInput> & { label: string }) {
  const { label, ...inputProps } = props;
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} placeholderTextColor="#9CA3AF" {...inputProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: '#111827',
    fontSize: 29,
    fontWeight: '900',
    marginBottom: 26,
    textAlign: 'center',
  },
  field: {
    marginBottom: 18,
  },
  label: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D5DB',
    borderRadius: 8,
    borderWidth: 2,
    color: '#111827',
    fontSize: 17,
    fontWeight: '600',
    minHeight: 54,
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
  skillList: {
    gap: 10,
  },
  skillRow: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D5DB',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 52,
    paddingHorizontal: 14,
  },
  skillRowActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  checkbox: {
    borderColor: '#9CA3AF',
    borderRadius: 4,
    borderWidth: 2,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    height: 24,
    lineHeight: 20,
    marginRight: 12,
    textAlign: 'center',
    width: 24,
  },
  checkboxActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  skillText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '800',
  },
  skillTextActive: {
    color: '#1D4ED8',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderColor: '#1D4ED8',
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    marginTop: 12,
    minHeight: 56,
    paddingHorizontal: 18,
  },
  disabledButton: {
    opacity: 0.55,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  loginToggle: {
    marginTop: 16,
    alignItems: 'center',
  },
  loginToggleText: {
    color: '#2563EB',
    fontSize: 15,
    fontWeight: '800',
  },
});
