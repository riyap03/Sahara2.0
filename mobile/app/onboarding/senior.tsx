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

type Step = 'form' | 'code' | 'invite' | 'inviteDone';

const API_URL = 'http://localhost:5000/api';

export default function SeniorOnboardingScreen() {
  const router = useRouter();
  const { setRole, setToken, setUser } = useRole();
  const [step, setStep] = useState<Step>('form');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [familyCode, setFamilyCode] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteRelationship, setInviteRelationship] = useState('Daughter');
  const [isLoading, setIsLoading] = useState(false);

  const createProfile = async () => {
    if (!name.trim() || !phone.trim() || !city.trim()) {
      Alert.alert('Missing Info', 'Please fill in all fields.');
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
          role: 'senior',
          address: { city: city.trim() },
        }),
      });
      const data = await response.json();

      if (!data.success) {
        Alert.alert('Error', data.message || 'Registration failed.');
        return;
      }

      setRole('senior');
      setToken(data.token);
      setUser(data.user);
      globalStore.updateProfile({
        id: data.user?.id,
        name: name.trim(),
        phone: phone.trim(),
        address: city.trim(),
        city: city.trim(),
      });

      const codeResponse = await fetch(`${API_URL}/family-code/generate-code`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${data.token}`,
          'Content-Type': 'application/json',
        },
      });
      const codeData = await codeResponse.json();
      const nextCode = codeData.success ? codeData.familyCode : `GK-${Math.floor(1000 + Math.random() * 9000)}`;
      setFamilyCode(nextCode);
      globalStore.updateProfile({ familyCode: nextCode });
      globalStore.registerSeniorCode(nextCode, {
        id: data.user?.id,
        name: name.trim(),
        city: city.trim(),
        phone: phone.trim(),
      });
      setStep('code');
    } catch {
      const fallbackCode = `GK-${Math.floor(1000 + Math.random() * 9000)}`;
      setRole('senior');
      globalStore.setRole('senior');
      globalStore.updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        address: city.trim(),
        city: city.trim(),
      });
      globalStore.registerSeniorCode(fallbackCode, {
        name: name.trim(),
        city: city.trim(),
        phone: phone.trim(),
      });
      setFamilyCode(fallbackCode);
      globalStore.updateProfile({ familyCode: fallbackCode });
      setStep('code');
    } finally {
      setIsLoading(false);
    }
  };

  const sendInvite = async () => {
    if (!inviteName.trim() || !invitePhone.trim()) {
      Alert.alert('Missing Info', 'Please add the family member details.');
      return;
    }

    const token = globalStore.getToken();
    if (token) {
      try {
        await fetch(`${API_URL}/family-code/invite`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: inviteName.trim(),
            phone: invitePhone.trim(),
            relationship: inviteRelationship,
          }),
        });
      } catch {
        // The MVP can still show the invite confirmation if the local API is not running.
      }
    }
    setStep('inviteDone');
  };

  const openDashboard = () => router.replace('/(tabs)');

  if (step === 'code') {
    return (
      <Screen>
        <Text style={styles.title}>Your Family Code</Text>
        <View style={styles.codeBox}>
          <Text style={styles.code}>{familyCode}</Text>
        </View>
        <Text style={styles.helperText}>
          Share this code with your son, daughter or trusted family member.
        </Text>
        <Button title="Copy Code" onPress={() => Alert.alert('Copied', `Family Code: ${familyCode}`)} />
        <Button title="Invite Family Member" variant="secondary" onPress={() => setStep('invite')} />
        <Button title="Open My Dashboard" variant="ghost" onPress={openDashboard} />
      </Screen>
    );
  }

  if (step === 'invite') {
    return (
      <Screen>
        <Text style={styles.title}>Invite Family</Text>
        <FormField label="Name" value={inviteName} onChangeText={setInviteName} />
        <FormField label="Phone / Email" value={invitePhone} onChangeText={setInvitePhone} />
        <Text style={styles.label}>Relationship</Text>
        <View style={styles.chipRow}>
          {['Daughter', 'Son', 'Spouse', 'Other'].map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.chip, inviteRelationship === item && styles.chipActive]}
              onPress={() => setInviteRelationship(item)}
            >
              <Text style={[styles.chipText, inviteRelationship === item && styles.chipTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button title="Send Invitation" onPress={sendInvite} />
        <Button title="Back to Code" variant="ghost" onPress={() => setStep('code')} />
      </Screen>
    );
  }

  if (step === 'inviteDone') {
    return (
      <Screen>
        <Text style={styles.successMark}>✓</Text>
        <Text style={styles.title}>Family Member Connected</Text>
        <Text style={styles.helperText}>
          {inviteName || 'Your family member'} can accept the invitation and access your backup dashboard.
        </Text>
        <Button title="Open My Dashboard" onPress={openDashboard} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.title}>Welcome 👋</Text>
      <Text style={styles.subtitle}>Let us create your Sahara.</Text>
      <FormField label="Name" value={name} onChangeText={setName} />
      <FormField label="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <FormField label="City" value={city} onChangeText={setCity} />
      <Button title={isLoading ? 'Creating...' : 'Continue'} onPress={createProfile} disabled={isLoading} />
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

function FormField(props: React.ComponentProps<typeof TextInput> & { label: string }) {
  const { label, ...inputProps } = props;
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} placeholderTextColor="#9CA3AF" {...inputProps} />
    </View>
  );
}

function Button({
  title,
  onPress,
  disabled,
  variant = 'primary',
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.86}
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, styles[`${variant}Button`], disabled && styles.disabledButton]}
    >
      <Text style={[styles.buttonText, styles[`${variant}ButtonText`]]}>{title}</Text>
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
    marginBottom: 28,
    textAlign: 'center',
  },
  helperText: {
    color: '#4B5563',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
    marginBottom: 24,
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
  codeBox: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#0F766E',
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: 22,
    padding: 28,
  },
  code: {
    color: '#111827',
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: 5,
  },
  button: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 2,
    marginTop: 12,
    minHeight: 56,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  primaryButton: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#0F766E',
  },
  ghostButton: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  disabledButton: {
    opacity: 0.55,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '900',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#0F766E',
  },
  ghostButtonText: {
    color: '#4B5563',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
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
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  chipText: {
    color: '#4B5563',
    fontWeight: '800',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  successMark: {
    color: '#0F766E',
    fontSize: 58,
    fontWeight: '900',
    textAlign: 'center',
  },
});
