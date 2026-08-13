import React, { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRole } from '../context/RoleContext';
import { globalStore } from '../../constants/store';

export default function ProfileScreen() {
  const router = useRouter();
  const { role, user, logout } = useRole();
  const [profile, setProfile] = useState(globalStore.getProfile());
  const [connectedSenior, setConnectedSenior] = useState(globalStore.getConnectedSenior());

  useEffect(() => {
    return globalStore.subscribe(() => {
      setProfile(globalStore.getProfile());
      setConnectedSenior(globalStore.getConnectedSenior());
    });
  }, []);

  const doLogout = () => {
    logout();
    router.replace('/landing');
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      doLogout();
      return;
    }

    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: doLogout },
    ]);
  };

  const displayName =
    role === 'family'
      ? user?.name || 'Family Member'
      : role === 'provider' || role === 'volunteer'
        ? user?.name || 'Helper'
        : profile.name;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>My Profile</Text>
        <Text style={styles.subtitle}>Sahara</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.identityRow}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{role === 'family' ? 'F' : role === 'provider' ? 'H' : 'S'}</Text>
          </View>
          <View style={styles.identityCopy}>
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.roleText}>{role ? roleLabel(role) : 'No role selected'}</Text>
          </View>
        </View>
      </View>

      {role === 'family' && connectedSenior ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Connected Parent</Text>
          <InfoRow icon="person.fill" label="Senior" value={connectedSenior.name} />
          <InfoRow icon="map.fill" label="City" value={connectedSenior.city || 'Not added'} />
          <InfoRow icon="people.fill" label="Relationship" value={connectedSenior.relationship || 'Family'} />
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Account Details</Text>
          <InfoRow icon="phone.fill" label="Phone" value={profile.phone || user?.phone || 'Not added'} />
          <InfoRow icon="map.fill" label="Location" value={profile.city || profile.address || 'Not added'} />
        </View>
      )}

      <TouchableOpacity activeOpacity={0.86} style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function roleLabel(role: string) {
  if (role === 'senior') return 'Senior';
  if (role === 'family') return 'Family';
  return 'Helper';
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof IconSymbol>['name'];
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <IconSymbol name={icon} size={22} color="#0F766E" />
      <View style={styles.infoCopy}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 20,
    paddingTop: 42,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 18,
  },
  title: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    color: '#0F766E',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    padding: 16,
  },
  identityRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  avatarCircle: {
    alignItems: 'center',
    backgroundColor: '#CCFBF1',
    borderColor: '#0F766E',
    borderRadius: 32,
    borderWidth: 2,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  avatarText: {
    color: '#0F766E',
    fontSize: 26,
    fontWeight: '900',
  },
  identityCopy: {
    flex: 1,
  },
  name: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '900',
  },
  roleText: {
    color: '#64748B',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 3,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 19,
    fontWeight: '900',
    marginBottom: 8,
  },
  infoRow: {
    alignItems: 'center',
    borderTopColor: '#F3F4F6',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
  },
  infoCopy: {
    flex: 1,
  },
  label: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  value: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  logoutButton: {
    alignItems: 'center',
    backgroundColor: '#DC2626',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 56,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
});
