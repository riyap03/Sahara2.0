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
import { globalStore, ConnectedSenior } from '../../constants/store';
import { useRole } from '../context/RoleContext';

type Step = 'choice' | 'create' | 'connect' | 'success';

const API_URL = 'http://localhost:5000/api';
const relationships = ['Daughter', 'Son', 'Spouse', 'Other'];

export default function FamilyOnboardingScreen() {
  const router = useRouter();
  const { setRole, setToken, setUser } = useRole();
  const [step, setStep] = useState<Step>('choice');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('Daughter');
  const [familyCode, setFamilyCode] = useState('');
  const [connectedSenior, setConnectedSenior] = useState<ConnectedSenior | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createAccount = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Missing Info', 'Please fill in your account details.');
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
          role: 'family',
        }),
      });
      const data = await response.json();

      if (!data.success) {
        Alert.alert('Error', data.message || 'Registration failed.');
        return;
      }

      setRole('family');
      setToken(data.token);
      setUser(data.user);
      setStep('connect');
    } catch {
      setRole('family');
      globalStore.setRole('family');
      setStep('connect');
    } finally {
      setIsLoading(false);
    }
  };

  const connectToParent = async () => {
    if (!familyCode.trim()) {
      Alert.alert('Missing Code', 'Please enter the Family Code.');
      return;
    }

    setIsLoading(true);
    try {
      const token = globalStore.getToken();
      const response = await fetch(`${API_URL}/family-code/connect`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          familyCode: familyCode.trim().toUpperCase(),
          relationship,
        }),
      });
      const data = await response.json();

      if (!data.success) {
        const localSenior = globalStore.findSeniorByCode(familyCode);
        if (localSenior) {
          finishConnection({
            ...localSenior,
            relationship,
          });
          return;
        }
        Alert.alert('Error', data.message || 'Connection failed.');
        return;
      }

      finishConnection({
        id: data.senior?.id || data.senior?._id,
        name: data.senior?.name || 'Shanti Devi',
        city: data.senior?.address?.city || data.senior?.city || 'Jaipur',
        relationship: data.relationship || relationship,
      });
    } catch {
      const localSenior = globalStore.findSeniorByCode(familyCode);
      if (!localSenior) {
        Alert.alert(
          'Code Not Found',
          'This Family Code does not match any senior profile on this app. Please check the code and try again.'
        );
        return;
      }

      finishConnection({
        ...localSenior,
        relationship,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const finishConnection = (senior: ConnectedSenior) => {
    setRole('family');
    globalStore.setRole('family');
    globalStore.setConnectedSenior(senior);
    setConnectedSenior(senior);
    setStep('success');
  };

  if (step === 'create') {
    return (
      <Screen>
        <Back onPress={() => setStep('choice')} />
        <Text style={styles.title}>Create Your Account</Text>
        <FormField label="Name" value={name} onChangeText={setName} />
        <FormField label="Phone / Email" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <RelationshipPicker value={relationship} onChange={setRelationship} />
        <Button title={isLoading ? 'Creating...' : 'Continue'} onPress={createAccount} disabled={isLoading} />
      </Screen>
    );
  }

  if (step === 'connect') {
    return (
      <Screen>
        <Back onPress={() => setStep('choice')} />
        <Text style={styles.title}>Connect to your parent</Text>
        <Text style={styles.subtitle}>Enter their Family Code:</Text>
        <TextInput
          autoCapitalize="characters"
          onChangeText={setFamilyCode}
          placeholder="GK-____"
          placeholderTextColor="#9CA3AF"
          style={[styles.input, styles.codeInput]}
          value={familyCode}
        />
        <Button title={isLoading ? 'Connecting...' : 'Connect'} onPress={connectToParent} disabled={isLoading} />
      </Screen>
    );
  }

  if (step === 'success' && connectedSenior) {
    return (
      <Screen>
        <Text style={styles.successMark}>✓</Text>
        <Text style={styles.title}>Connected Successfully</Text>
        <Text style={styles.connectedLabel}>You are connected to:</Text>
        <View style={styles.parentCard}>
          <Text style={styles.parentName}>👵 {connectedSenior.name}</Text>
          <Text style={styles.parentCity}>📍 {connectedSenior.city || 'Jaipur'}</Text>
          <Text style={styles.parentRelationship}>Relationship: {connectedSenior.relationship || relationship}</Text>
        </View>
        <Button title="Open Parent Dashboard" onPress={() => router.replace('/(tabs)')} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.title}>Welcome 👋</Text>
      <Text style={styles.subtitle}>How would you like to continue?</Text>

      <TouchableOpacity activeOpacity={0.86} style={styles.optionCard} onPress={() => setStep('connect')}>
        <Text style={styles.optionIcon}>🔗</Text>
        <Text style={styles.optionTitle}>Connect to Parent</Text>
        <Text style={styles.optionSubtitle}>I already have a Family Code</Text>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.86} style={styles.optionCard} onPress={() => setStep('create')}>
        <Text style={styles.optionIcon}>✨</Text>
        <Text style={styles.optionTitle}>Create Family Account</Text>
        <Text style={styles.optionSubtitle}>I do not have an account</Text>
      </TouchableOpacity>
    </Screen>
  );
}

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
    </SafeAreaView>
  );
}

function Back({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.backButton}>
      <Text style={styles.backText}>Back</Text>
    </TouchableOpacity>
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

function RelationshipPicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>Relationship</Text>
      <View style={styles.chipRow}>
        {relationships.map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.chip, value === item && styles.chipActive]}
            onPress={() => onChange(item)}
          >
            <Text style={[styles.chipText, value === item && styles.chipTextActive]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function Button({ title, onPress, disabled }: { title: string; onPress: () => void; disabled?: boolean }) {
  return (
    <TouchableOpacity
      activeOpacity={0.86}
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, disabled && styles.disabledButton]}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
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
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 18,
  },
  backText: {
    color: '#7C3AED',
    fontSize: 16,
    fontWeight: '900',
  },
  title: {
    color: '#111827',
    fontSize: 29,
    fontWeight: '900',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#4B5563',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 25,
    marginBottom: 26,
    textAlign: 'center',
  },
  optionCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#7C3AED',
    borderRadius: 8,
    borderWidth: 2,
    marginTop: 14,
    minHeight: 142,
    padding: 22,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  optionIcon: {
    fontSize: 36,
    marginBottom: 10,
  },
  optionTitle: {
    color: '#111827',
    fontSize: 21,
    fontWeight: '900',
    textAlign: 'center',
  },
  optionSubtitle: {
    color: '#6B7280',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 6,
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
  codeInput: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 4,
    marginBottom: 10,
    textAlign: 'center',
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
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#7C3AED',
    borderColor: '#6D28D9',
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
  successMark: {
    color: '#0F766E',
    fontSize: 58,
    fontWeight: '900',
    textAlign: 'center',
  },
  connectedLabel: {
    color: '#4B5563',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 14,
    textAlign: 'center',
  },
  parentCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DDD6FE',
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: 14,
    padding: 20,
  },
  parentName: {
    color: '#111827',
    fontSize: 23,
    fontWeight: '900',
    marginBottom: 8,
  },
  parentCity: {
    color: '#4B5563',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 14,
  },
  parentRelationship: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '800',
  },
});
