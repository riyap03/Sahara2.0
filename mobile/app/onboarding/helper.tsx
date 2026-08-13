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
import { useRouter } from 'expo-router';
import { globalStore } from '../../constants/store';
import { useRole } from '../context/RoleContext';

const API_URL = 'http://localhost:5000/api';
const skills = ['Household Help', 'Grocery', 'Medical Assistance', 'Travel Assistance'];

export default function HelperOnboardingScreen() {
  const router = useRouter();
  const { setRole, setToken, setUser } = useRole();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((current) =>
      current.includes(skill) ? current.filter((item) => item !== skill) : [...current, skill]
    );
  };

  const createProfile = async () => {
    if (!name.trim() || !phone.trim() || !city.trim() || selectedSkills.length === 0) {
      Alert.alert('Missing Info', 'Please fill in all fields and select at least one skill.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: `${phone.trim()}@gharkabackup.local`,
          phone: phone.trim(),
          password: 'password123',
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Create Helper Profile</Text>
        <FormField label="Name" value={name} onChangeText={setName} />
        <FormField label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <FormField label="City" value={city} onChangeText={setCity} />

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
});
