import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Link } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function HomeScreen() {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);

  // Toggle emergency simulation mode
  const handleToggleEmergency = () => {
    setIsEmergencyActive(!isEmergencyActive);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Simulation Banner */}
      <View style={styles.simulationBanner}>
        <Text style={styles.simulationText}>
          {isEmergencyActive ? '🚨 EMERGENCY ACTIVE (SIMULATION)' : '🟢 NORMAL STATUS'}
        </Text>
        <TouchableOpacity
          style={[styles.simulationButton, isEmergencyActive ? styles.btnNormal : styles.btnEmergency]}
          onPress={handleToggleEmergency}
        >
          <Text style={styles.simulationButtonText}>
            {isEmergencyActive ? 'Reset to Safe Mode' : 'Simulate Emergency Alert'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <Text style={styles.brandTitle}>Ghar Ka Backup</Text>
            <Text style={styles.seniorNames}>Mom & Dad</Text>
            <View style={styles.locationContainer}>
              <IconSymbol size={16} name="map.fill" color="#666" style={styles.miniIcon} />
              <Text style={styles.locationText}>Jaipur</Text>
            </View>
          </View>

          <View style={[styles.statusBadge, isEmergencyActive ? styles.badgeAlert : styles.badgeSafe]}>
            <View style={[styles.statusDot, isEmergencyActive ? styles.dotAlert : styles.dotSafe]} />
            <Text style={[styles.statusBadgeText, isEmergencyActive ? styles.textAlert : styles.textSafe]}>
              {isEmergencyActive ? 'Action Required' : 'No action required'}
            </Text>
          </View>
        </View>

        {/* 1. EMERGENCY ALERT SECTION (Dynamic) */}
        {isEmergencyActive && (
          <View style={styles.emergencyCard}>
            <View style={styles.emergencyHeader}>
              <IconSymbol size={24} name="exclamationmark.triangle.fill" color="#fff" />
              <Text style={styles.emergencyHeaderTitle}>🚨 EMERGENCY</Text>
            </View>
            <View style={styles.emergencyBody}>
              <Text style={styles.emergencyAlertText}>
                Mom has requested urgent assistance.
              </Text>

              <View style={styles.emergencyHighlightBox}>
                <Text style={styles.emergencySubTitle}>Nearby Trusted Contact</Text>
                <Text style={styles.emergencyContactName}>Amit Sharma — 0.6 km</Text>
                <Text style={styles.emergencyContactRole}>Neighbour (Available 🟢)</Text>
              </View>

              <View style={styles.escalationRow}>
                <View style={styles.checklistRow}>
                  <IconSymbol size={18} name="checkmark.circle.fill" color="#fff" />
                  <Text style={styles.checklistText}>Family notified</Text>
                </View>
                <View style={styles.checklistRow}>
                  <IconSymbol size={18} name="checkmark.circle.fill" color="#fff" />
                  <Text style={styles.checklistText}>Emergency escalation: Active</Text>
                </View>
              </View>

              <Link href="/explore" asChild>
                <TouchableOpacity style={styles.emergencyButton}>
                  <Text style={styles.emergencyButtonText}>[ View Emergency Info ]</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        )}

        {/* Philosophy Core Answers Box */}
        <View style={styles.philosophyContainer}>
          <Text style={styles.philosophyHeader}>At a Glance</Text>
          <View style={styles.philosophyGrid}>
            <View style={styles.philosophyItem}>
              <Text style={styles.philosophyLabel}>Everything Okay?</Text>
              <Text style={[styles.philosophyValue, isEmergencyActive ? styles.philosophyDanger : styles.philosophySuccess]}>
                {isEmergencyActive ? 'No, Urgent Alert' : 'Yes, Mom & Dad Safe'}
              </Text>
            </View>
            <View style={styles.philosophyItem}>
              <Text style={styles.philosophyLabel}>What Happened?</Text>
              <Text style={styles.philosophyValue}>
                {isEmergencyActive ? 'Panic alarm triggered' : 'Water pump repairs done'}
              </Text>
            </View>
            <View style={styles.philosophyItem}>
              <Text style={styles.philosophyLabel}>Who is Handling?</Text>
              <Text style={styles.philosophyValue}>
                {isEmergencyActive ? 'Neighbour Amit Sharma' : 'Plumber Plumb-Raj Team'}
              </Text>
            </View>
          </View>
        </View>

        {/* 2. ATTENTION SECTION */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.headerLeftRow}>
              <IconSymbol size={20} name="bell.fill" color="#D97706" />
              <Text style={styles.sectionTitle}>🔔 ATTENTION</Text>
            </View>
            <View style={styles.handledBadge}>
              <View style={styles.bulletGreen} />
              <Text style={styles.handledText}>Being handled</Text>
            </View>
          </View>

          <View style={styles.attentionBody}>
            <Text style={styles.attentionAlertTitle}>⚠️ Water Pump Issue</Text>
            <Text style={styles.attentionText}>
              Primary plumber unavailable.{"\n"}
              Backup helper has been assigned.
            </Text>
            <View style={styles.helperAssignedRow}>
              <IconSymbol size={16} name="person.badge.shield.checkmark.fill" color="#059669" />
              <Text style={styles.helperAssignedText}>Backup helper assigned ✓</Text>
            </View>
          </View>
        </View>

        {/* 3. TODAY'S ACTIVITY */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.headerLeftRow}>
              <IconSymbol size={20} name="checkmark.circle.fill" color="#2563EB" />
              <Text style={styles.sectionTitle}>📋 TODAY&apos;S ACTIVITY</Text>
            </View>
          </View>

          <View style={styles.activityList}>
            <View style={styles.activityRow}>
              <View style={styles.activityLabelCol}>
                <Text style={styles.activityEmoji}>💊</Text>
                <Text style={styles.activityName}>Medicine</Text>
              </View>
              <View style={styles.activityStatusCompleted}>
                <Text style={styles.completedText}>Completed ✓</Text>
              </View>
            </View>

            <View style={styles.activityRow}>
              <View style={styles.activityLabelCol}>
                <Text style={styles.activityEmoji}>🔧</Text>
                <Text style={styles.activityName}>Water Pump Repair</Text>
              </View>
              <View style={styles.activityStatusCompleted}>
                <Text style={styles.completedText}>Completed ✓</Text>
              </View>
            </View>

            <View style={styles.activityRow}>
              <View style={styles.activityLabelCol}>
                <Text style={styles.activityEmoji}>🏥</Text>
                <Text style={styles.activityName}>Doctor Appointment</Text>
              </View>
              <View style={styles.activityStatusUpcoming}>
                <Text style={styles.upcomingText}>Tomorrow — 10:00 AM</Text>
              </View>
            </View>

            <View style={styles.activityRow}>
              <View style={styles.activityLabelCol}>
                <Text style={styles.activityEmoji}>🚗</Text>
                <Text style={styles.activityName}>Hospital Transport</Text>
              </View>
              <View style={styles.activityStatusCompleted}>
                <Text style={styles.completedText}>Scheduled ✓</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 4. TRUSTED NETWORK QUICK VIEW */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.headerLeftRow}>
              <IconSymbol size={20} name="people.fill" color="#7C3AED" />
              <Text style={styles.sectionTitle}>👥 TRUSTED NETWORK</Text>
            </View>
          </View>

          <View style={styles.networkBrief}>
            <View style={styles.briefItem}>
              <View style={styles.briefRoleRow}>
                <Text style={styles.briefEmoji}>👨</Text>
                <Text style={styles.briefLabel}>Neighbour</Text>
              </View>
              <View style={[styles.statusIndicatorCircle, styles.circleSafe]} />
            </View>

            <View style={styles.briefItem}>
              <View style={styles.briefRoleRow}>
                <Text style={styles.briefEmoji}>🛡</Text>
                <Text style={styles.briefLabel}>Society Guard</Text>
              </View>
              <View style={[styles.statusIndicatorCircle, styles.circleSafe]} />
            </View>

            <View style={styles.briefItem}>
              <View style={styles.briefRoleRow}>
                <Text style={styles.briefEmoji}>🔧</Text>
                <Text style={styles.briefLabel}>Plumber</Text>
              </View>
              <View style={[styles.statusIndicatorCircle, styles.circleDanger]} />
            </View>
          </View>

          <Link href="/explore" asChild>
            <TouchableOpacity style={styles.viewNetworkBtn}>
              <Text style={styles.viewNetworkBtnText}>[ View Trusted Network ]</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* 5. RECENT TASKS */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.headerLeftRow}>
              <IconSymbol size={20} name="clock.fill" color="#4B5563" />
              <Text style={styles.sectionTitle}>📋 RECENT TASKS</Text>
            </View>
          </View>

          <View style={styles.recentTasksList}>
            <View style={styles.recentTaskItem}>
              <Text style={styles.recentTaskText}>Water Pump Repair</Text>
              <Text style={styles.recentTaskTick}>✓</Text>
            </View>
            <View style={styles.recentTaskItem}>
              <Text style={styles.recentTaskText}>Medicine Pickup</Text>
              <Text style={styles.recentTaskTick}>✓</Text>
            </View>
            <View style={styles.recentTaskItem}>
              <Text style={styles.recentTaskText}>Doctor Visit</Text>
              <Text style={styles.recentTaskTick}>✓</Text>
            </View>
          </View>
        </View>

        {/* Reassurance Footer */}
        <View style={styles.footerReassurance}>
          <Text style={styles.reassuranceText}>
            &ldquo;Family doesn&apos;t monitor the senior.{"\n"}Family knows that someone trusted is there when needed.&rdquo;
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  simulationBanner: {
    backgroundColor: '#1E293B',
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  simulationText: {
    color: '#F8FAFC',
    fontWeight: '700',
    fontSize: 12,
  },
  simulationButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  btnEmergency: {
    backgroundColor: '#EF4444',
  },
  btnNormal: {
    backgroundColor: '#10B981',
  },
  simulationButtonText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerLeft: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  seniorNames: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginVertical: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniIcon: {
    marginRight: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  badgeSafe: {
    backgroundColor: '#ECFDF5',
  },
  badgeAlert: {
    backgroundColor: '#FEF2F2',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  dotSafe: {
    backgroundColor: '#10B981',
  },
  dotAlert: {
    backgroundColor: '#EF4444',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  textSafe: {
    color: '#065F46',
  },
  textAlert: {
    color: '#991B1B',
  },
  philosophyContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  philosophyHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  philosophyGrid: {
    gap: 12,
  },
  philosophyItem: {
    borderLeftWidth: 3,
    borderLeftColor: '#D1D5DB',
    paddingLeft: 10,
  },
  philosophyLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  philosophyValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 2,
  },
  philosophySuccess: {
    color: '#059669',
  },
  philosophyDanger: {
    color: '#DC2626',
    fontWeight: '700',
  },
  emergencyCard: {
    backgroundColor: '#DC2626',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  emergencyHeaderTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  emergencyBody: {
    gap: 12,
  },
  emergencyAlertText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  emergencyHighlightBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    padding: 12,
  },
  emergencySubTitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  emergencyContactName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    marginVertical: 2,
  },
  emergencyContactRole: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
  },
  escalationRow: {
    gap: 6,
  },
  checklistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  checklistText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '500',
  },
  emergencyButton: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  emergencyButtonText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 13,
  },
  sectionCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 10,
  },
  headerLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    letterSpacing: 0.5,
  },
  handledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 4,
  },
  bulletGreen: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  handledText: {
    fontSize: 11,
    color: '#065F46',
    fontWeight: '600',
  },
  attentionBody: {
    gap: 8,
  },
  attentionAlertTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  attentionText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  helperAssignedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  helperAssignedText: {
    fontSize: 13,
    color: '#166534',
    fontWeight: '600',
  },
  activityList: {
    gap: 12,
  },
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  activityLabelCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  activityEmoji: {
    fontSize: 20,
  },
  activityName: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  activityStatusCompleted: {
    backgroundColor: '#ECFDF5',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  completedText: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '600',
  },
  activityStatusUpcoming: {
    backgroundColor: '#FFFBEB',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  upcomingText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '600',
  },
  networkBrief: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  briefItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  briefRoleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  briefEmoji: {
    fontSize: 16,
  },
  briefLabel: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  statusIndicatorCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  circleSafe: {
    backgroundColor: '#10B981',
  },
  circleDanger: {
    backgroundColor: '#EF4444',
  },
  viewNetworkBtn: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  viewNetworkBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  recentTasksList: {
    gap: 8,
  },
  recentTaskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 8,
  },
  recentTaskText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  recentTaskTick: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '700',
  },
  footerReassurance: {
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  reassuranceText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 18,
  },
});
