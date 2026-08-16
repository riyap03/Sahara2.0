import React, { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRole } from '../context/RoleContext';
import { shadow } from '../../constants/theme';
import { globalStore } from '../../constants/store';

export default function HomeScreen() {
  const router = useRouter();
  const { role, logout } = useRole();
  const [profile, setProfile] = useState(globalStore.getProfile());
  const [connectedSenior, setConnectedSenior] = useState(globalStore.getConnectedSenior());

  useEffect(() => {
    return globalStore.subscribe(() => {
      setProfile(globalStore.getProfile());
      setConnectedSenior(globalStore.getConnectedSenior());
    });
  }, []);

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      logout();
      router.replace('/landing');
      return;
    }
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => { logout(); router.replace('/landing'); } },
    ]);
  };

  if (role === 'family') {
    if (!connectedSenior) {
      return (
        <Screen>
          <Header title="Sahara" subtitle="No parent connected yet" />
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Connect to your parent</Text>
            <Text style={styles.bodyText}>
              Enter the Family Code from your senior app to unlock the authorized parent dashboard.
            </Text>
            <PrimaryButton title="Enter Family Code" onPress={() => router.replace('/onboarding/family')} />
          </View>
          <TouchableOpacity activeOpacity={0.8} style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </Screen>
      );
    }

    return (
      <Screen>
        <View style={styles.heroCard}>
          <Text style={styles.brand}>Sahara</Text>
          <Text style={styles.heroName}>Senior: {connectedSenior.name}</Text>
          <Text style={styles.metaText}>{connectedSenior.city || 'City not added'}</Text>
          <StatusBadge label="All Good" tone="safe" />
          <PrimaryButton title="View Parent Dashboard" onPress={() => router.push('/(tabs)/explore')} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Connected Relationship</Text>
          <Text style={styles.bodyText}>
            You are connected as {connectedSenior.relationship || 'Family'}. This connection came from the senior
            Family Code and stays attached to this parent.
          </Text>
        </View>
        <TouchableOpacity activeOpacity={0.8} style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </Screen>
    );
  }

  if (role === 'provider' || role === 'volunteer') {
    return (
      <Screen>
        <Header title="Helper Dashboard" subtitle="Available local tasks" />
        <View style={styles.heroCard}>
          <Text style={styles.brand}>Sahara</Text>
          <Text style={styles.heroName}>Ready to help</Text>
          <StatusBadge label="Available" tone="safe" />
          <PrimaryButton title="Open Helper Tasks" onPress={() => router.push('/(tabs)/explore')} />
        </View>
        <InfoRow icon="checkmark.circle.fill" title="Medicine pickup" detail="Near Vaishali Nagar - 2.1 km" />
        <InfoRow icon="wrench.fill" title="Household repair" detail="Backup helper needed today" />
        <TouchableOpacity activeOpacity={0.8} style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.heroCard}>
        <Text style={styles.brand}>Sahara</Text>
        <Text style={styles.heroName}>{profile.name}</Text>
        <Text style={styles.metaText}>{profile.city || profile.address || 'City not added'}</Text>
        {profile.familyCode ? (
          <View style={styles.codeMiniBox}>
            <Text style={styles.codeMiniLabel}>Family Code</Text>
            <Text style={styles.codeMiniValue}>{profile.familyCode}</Text>
          </View>
        ) : null}
        <StatusBadge label="All Good" tone="safe" />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today Backup</Text>
        <InfoLine title="Medicines" detail="Reminder completed" />
        <InfoLine title="Trusted network" detail="4 people available" />
        <InfoLine title="Family access" detail={profile.familyCode ? 'Family can connect using your code' : 'Create a Family Code from onboarding'} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Need help?</Text>
        <Text style={styles.bodyText}>Create a request and your trusted backup network can respond.</Text>
        <PrimaryButton title="Request Help" onPress={() => router.push('/(tabs)/requests')} />
      </View>
      <TouchableOpacity activeOpacity={0.8} style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </Screen>
  );
}

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
      <Text style={styles.headerSubtitle}>{subtitle}</Text>
    </View>
  );
}

function StatusBadge({ label, tone }: { label: string; tone: 'safe' | 'warning' }) {
  return (
    <View style={[styles.statusBadge, tone === 'safe' ? styles.statusSafe : styles.statusWarning]}>
      <View style={[styles.statusDot, tone === 'safe' ? styles.dotSafe : styles.dotWarning]} />
      <Text style={[styles.statusText, tone === 'safe' ? styles.textSafe : styles.textWarning]}>{label}</Text>
    </View>
  );
}

function InfoRow({
  icon,
  title,
  detail,
}: {
  icon: React.ComponentProps<typeof IconSymbol>['name'];
  title: string;
  detail: string;
}) {
  return (
    <View style={styles.infoRow}>
      <IconSymbol name={icon} size={22} color="#0F766E" />
      <View style={styles.infoCopy}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoDetail}>{detail}</Text>
      </View>
    </View>
  );
}

function InfoLine({ title, detail }: { title: string; detail: string }) {
  return (
    <View style={styles.infoLine}>
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={styles.infoDetail}>{detail}</Text>
    </View>
  );
}

function PrimaryButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.86} style={styles.primaryButton} onPress={onPress}>
      <Text style={styles.primaryButtonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 18,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    color: '#111827',
    fontSize: 25,
    fontWeight: '900',
  },
  headerSubtitle: {
    color: '#64748B',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 4,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1FAE5',
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: 16,
    padding: 20,
    ...shadow({ color: '#0F172A', offset: { width: 0, height: 3 }, opacity: 0.08, radius: 8, elevation: 3 }),
  },
  brand: {
    color: '#0F766E',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  heroName: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 12,
  },
  metaText: {
    color: '#4B5563',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 5,
  },
  codeMiniBox: {
    backgroundColor: '#F0FDFA',
    borderColor: '#99F6E4',
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 16,
    padding: 14,
  },
  codeMiniLabel: {
    color: '#0F766E',
    fontSize: 12,
    fontWeight: '900',
  },
  codeMiniValue: {
    color: '#111827',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 3,
    marginTop: 2,
  },
  statusBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statusSafe: {
    backgroundColor: '#ECFDF5',
  },
  statusWarning: {
    backgroundColor: '#FFFBEB',
  },
  statusDot: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  dotSafe: {
    backgroundColor: '#10B981',
  },
  dotWarning: {
    backgroundColor: '#F59E0B',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '900',
  },
  textSafe: {
    color: '#065F46',
  },
  textWarning: {
    color: '#92400E',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    padding: 16,
  },
  cardTitle: {
    color: '#111827',
    fontSize: 19,
    fontWeight: '900',
    marginBottom: 10,
  },
  bodyText: {
    color: '#4B5563',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  infoRow: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    padding: 14,
  },
  infoCopy: {
    flex: 1,
  },
  infoLine: {
    borderTopColor: '#F3F4F6',
    borderTopWidth: 1,
    paddingVertical: 12,
  },
  infoTitle: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '900',
  },
  infoDetail: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 3,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#0F766E',
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 16,
    minHeight: 54,
    paddingHorizontal: 18,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },
  logoutButton: {
    alignItems: 'center',
    backgroundColor: '#DC2626',
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 16,
    minHeight: 52,
    paddingHorizontal: 18,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
});
