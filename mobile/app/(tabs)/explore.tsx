import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  StatusBar,
  Linking,
} from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function TabTwoScreen() {
  const [activeTab, setActiveTab] = useState<'network' | 'profile' | 'history' | 'notifications'>('network');

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => alert('Could not initiate call'));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Segmented Controller Header */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'network' && styles.activeTabButton]}
          onPress={() => setActiveTab('network')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'network' && styles.activeTabButtonText]}>
            Network
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'profile' && styles.activeTabButton]}
          onPress={() => setActiveTab('profile')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'profile' && styles.activeTabButtonText]}>
            Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'history' && styles.activeTabButton]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'history' && styles.activeTabButtonText]}>
            History
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'notifications' && styles.activeTabButton]}
          onPress={() => setActiveTab('notifications')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'notifications' && styles.activeTabButtonText]}>
            Alerts
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {/* ==================== 1. TRUSTED NETWORK PANEL ==================== */}
        {activeTab === 'network' && (
          <View style={styles.panelContainer}>
            <View style={styles.panelHeader}>
              <IconSymbol size={22} name="people.fill" color="#7C3AED" />
              <Text style={styles.panelTitle}>Trusted Network</Text>
            </View>
            <Text style={styles.panelSubtitle}>
              These verified helpers can be coordinated directly when needed.
            </Text>

            {/* Contact Card 1 */}
            <View style={styles.contactCard}>
              <View style={styles.contactHeader}>
                <View style={styles.contactInfoMain}>
                  <Text style={styles.avatar}>👨</Text>
                  <View>
                    <Text style={styles.contactName}>Amit Sharma</Text>
                    <Text style={styles.contactRole}>Neighbour • 0.6 km away</Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, styles.badgeSafe]}>
                  <Text style={styles.badgeTextSafe}>🟢 Available</Text>
                </View>
              </View>
              <View style={styles.contactMetrics}>
                <View style={styles.metricBox}>
                  <Text style={styles.metricLabel}>Trust Score</Text>
                  <Text style={styles.metricValue}>94</Text>
                </View>
                <TouchableOpacity style={styles.callButton} onPress={() => handleCall('+919876543210')}>
                  <IconSymbol size={16} name="phone.fill" color="#7C3AED" />
                  <Text style={styles.callButtonText}>Call neighbour</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Contact Card 2 */}
            <View style={styles.contactCard}>
              <View style={styles.contactHeader}>
                <View style={styles.contactInfoMain}>
                  <Text style={styles.avatar}>🛡</Text>
                  <View>
                    <Text style={styles.contactName}>Rakesh Singh</Text>
                    <Text style={styles.contactRole}>Society Guard • On Duty</Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, styles.badgeSafe]}>
                  <Text style={styles.badgeTextSafe}>🟢 Available</Text>
                </View>
              </View>
              <View style={styles.contactMetrics}>
                <View style={styles.metricBox}>
                  <Text style={styles.metricLabel}>Trust Score</Text>
                  <Text style={styles.metricValue}>91</Text>
                </View>
                <TouchableOpacity style={styles.callButton} onPress={() => handleCall('+919876543211')}>
                  <IconSymbol size={16} name="phone.fill" color="#7C3AED" />
                  <Text style={styles.callButtonText}>Call guard</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Contact Card 3 */}
            <View style={styles.contactCard}>
              <View style={styles.contactHeader}>
                <View style={styles.contactInfoMain}>
                  <Text style={styles.avatar}>🔧</Text>
                  <View>
                    <Text style={styles.contactName}>Raj Plumbing</Text>
                    <Text style={styles.contactRole}>Plumber • Agency Team</Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, styles.badgeAlert]}>
                  <Text style={styles.badgeTextAlert}>🔴 Unavailable</Text>
                </View>
              </View>
              <View style={styles.contactMetrics}>
                <View style={styles.metricBox}>
                  <Text style={styles.metricLabel}>Trust Score</Text>
                  <Text style={styles.metricValue}>96</Text>
                </View>
                <TouchableOpacity style={[styles.callButton, styles.callButtonDisabled]} disabled>
                  <IconSymbol size={16} name="phone.fill" color="#9CA3AF" />
                  <Text style={styles.callButtonTextDisabled}>Unavailable</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* ==================== 2. SENIOR PROFILE PANEL ==================== */}
        {activeTab === 'profile' && (
          <View style={styles.panelContainer}>
            <View style={styles.panelHeader}>
              <IconSymbol size={22} name="person.fill" color="#2563EB" />
              <Text style={styles.panelTitle}>Senior Profile</Text>
            </View>

            <View style={styles.profileCard}>
              <Text style={styles.profileSectionTitle}>Personal Details</Text>

              <View style={styles.profileRow}>
                <Text style={styles.profileLabel}>Name</Text>
                <Text style={styles.profileValue}>Mom & Dad (Savitri & Ramesh Sharma)</Text>
              </View>

              <View style={styles.profileRow}>
                <Text style={styles.profileLabel}>Age</Text>
                <Text style={styles.profileValue}>72 & 75 years</Text>
              </View>

              <View style={styles.profileRow}>
                <Text style={styles.profileLabel}>Address</Text>
                <Text style={styles.profileValue}>C-45, Vaishali Nagar, Jaipur</Text>
              </View>

              <View style={styles.profileRow}>
                <Text style={styles.profileLabel}>Phone</Text>
                <Text style={styles.profileValue}>+91 98290 12345</Text>
              </View>

              <View style={styles.profileRow}>
                <Text style={styles.profileLabel}>Preferred Language</Text>
                <Text style={styles.profileValue}>Hindi / Rajasthani / English</Text>
              </View>
            </View>

            <View style={styles.profileCard}>
              <Text style={styles.profileSectionTitle}>Emergency Information</Text>

              <View style={styles.profileRow}>
                <Text style={styles.profileLabel}>Primary Son (You)</Text>
                <Text style={styles.profileValue}>+91 99999 88888</Text>
              </View>

              <View style={styles.profileRow}>
                <Text style={styles.profileLabel}>Nearby Dr. Hospital</Text>
                <Text style={styles.profileValue}>Fortis Hospital, Jaipur</Text>
              </View>

              <View style={styles.profileRow}>
                <Text style={styles.profileLabel}>Important Note</Text>
                <Text style={[styles.profileValue, styles.highlightNote]}>
                  Dad takes blood pressure pills daily at 9:00 AM. Water pump switch is behind the stairs.
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ==================== 3. TASK HISTORY PANEL ==================== */}
        {activeTab === 'history' && (
          <View style={styles.panelContainer}>
            <View style={styles.panelHeader}>
              <IconSymbol size={22} name="clock.fill" color="#4B5563" />
              <Text style={styles.panelTitle}>Task History</Text>
            </View>
            <Text style={styles.panelSubtitle}>
              Transparent event logs showing exact helper coordination details.
            </Text>

            {/* Detailed Timeline Card 1 */}
            <View style={styles.historyCard}>
              <View style={styles.historyCardHeader}>
                <Text style={styles.historyCardTitle}>🔧 Water Pump Repair</Text>
                <Text style={styles.historyCardDate}>Today, 11:30 AM</Text>
              </View>

              <View style={styles.timeline}>
                <View style={styles.timelineItem}>
                  <View style={styles.timelineBulletCompleted}>
                    <IconSymbol size={10} name="checkmark.circle.fill" color="#fff" />
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineTitle}>Task completed successfully</Text>
                    <Text style={styles.timelineDesc}>Backup plumber finished work.</Text>
                  </View>
                </View>

                <View style={styles.timelineItem}>
                  <View style={styles.timelineBulletCompleted}>
                    <IconSymbol size={10} name="checkmark.circle.fill" color="#fff" />
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineTitle}>OTP verified</Text>
                    <Text style={styles.timelineDesc}>Secure check-in verified by dad.</Text>
                  </View>
                </View>

                <View style={styles.timelineItem}>
                  <View style={styles.timelineBulletCompleted}>
                    <IconSymbol size={10} name="checkmark.circle.fill" color="#fff" />
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineTitle}>Helper arrived at location</Text>
                    <Text style={styles.timelineDesc}>Assigned backup worker arrived.</Text>
                  </View>
                </View>

                <View style={styles.timelineItem}>
                  <View style={styles.timelineBulletCompleted}>
                    <IconSymbol size={10} name="checkmark.circle.fill" color="#fff" />
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineTitle}>Backup helper assigned</Text>
                    <Text style={styles.timelineDesc}>Primary agency worker was unavailable.</Text>
                  </View>
                </View>

                <View style={styles.timelineItem}>
                  <View style={styles.timelineBulletCompleted}>
                    <IconSymbol size={10} name="checkmark.circle.fill" color="#fff" />
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineTitle}>Request created by family</Text>
                    <Text style={styles.timelineDesc}>Water pump malfunction reported.</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Past History Log */}
            <View style={styles.simpleHistoryCard}>
              <Text style={styles.simpleHistoryHeader}>Previous Requests</Text>

              <View style={styles.simpleHistoryRow}>
                <Text style={styles.simpleHistoryLabel}>💊 Medicine Pickup</Text>
                <Text style={styles.simpleHistoryStatus}>✓ Completed</Text>
              </View>

              <View style={styles.simpleHistoryRow}>
                <Text style={styles.simpleHistoryLabel}>🏥 Doctor Visit Coordination</Text>
                <Text style={styles.simpleHistoryStatus}>✓ Completed</Text>
              </View>
            </View>
          </View>
        )}

        {/* ==================== 4. NOTIFICATIONS PANEL ==================== */}
        {activeTab === 'notifications' && (
          <View style={styles.panelContainer}>
            <View style={styles.panelHeader}>
              <IconSymbol size={22} name="bell.fill" color="#EA580C" />
              <Text style={styles.panelTitle}>Verified Notifications</Text>
            </View>
            <Text style={styles.panelSubtitle}>
              Only highly-relevant activities. Absolutely no micro-surveillance logs.
            </Text>

            <View style={styles.notificationsList}>
              <View style={styles.notificationItem}>
                <View style={styles.notificationDot} />
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>✅ Task completed</Text>
                  <Text style={styles.notificationText}>Water pump task finished by helper.</Text>
                  <Text style={styles.notificationTime}>Today, 11:30 AM</Text>
                </View>
              </View>

              <View style={styles.notificationItem}>
                <View style={styles.notificationDot} />
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>✅ Helper arrived</Text>
                  <Text style={styles.notificationText}>Helper checked in using OTP at Vaishali Nagar.</Text>
                  <Text style={styles.notificationTime}>Today, 10:45 AM</Text>
                </View>
              </View>

              <View style={styles.notificationItem}>
                <View style={styles.notificationDot} />
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>✅ Helper accepted request</Text>
                  <Text style={styles.notificationText}>Backup service partner assigned to work order.</Text>
                  <Text style={styles.notificationTime}>Today, 10:15 AM</Text>
                </View>
              </View>

              <View style={styles.notificationItem}>
                <View style={[styles.notificationDot, { backgroundColor: '#EA580C' }]} />
                <View style={styles.notificationContent}>
                  <Text style={[styles.notificationTitle, { color: '#EA580C' }]}>⚠️ Primary helper unavailable</Text>
                  <Text style={styles.notificationText}>Raj Plumbing was occupied; automatic rerouting active.</Text>
                  <Text style={styles.notificationTime}>Today, 10:05 AM</Text>
                </View>
              </View>

              <View style={styles.notificationItem}>
                <View style={[styles.notificationDot, { backgroundColor: '#10B981' }]} />
                <View style={styles.notificationContent}>
                  <Text style={[styles.notificationTitle, { color: '#059669' }]}>🔄 Backup activated</Text>
                  <Text style={styles.notificationText}>Work assigned to local backup dispatcher team.</Text>
                  <Text style={styles.notificationTime}>Today, 10:05 AM</Text>
                </View>
              </View>

              <View style={styles.notificationItem}>
                <View style={[styles.notificationDot, { backgroundColor: '#EF4444' }]} />
                <View style={styles.notificationContent}>
                  <Text style={[styles.notificationTitle, { color: '#DC2626' }]}>🚨 Emergency request (Test alert logs)</Text>
                  <Text style={styles.notificationText}>Simulated Panic button response history is logged safely.</Text>
                  <Text style={styles.notificationTime}>Active in Simulator</Text>
                </View>
              </View>
            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: '#F3E8FF',
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabButtonText: {
    color: '#7C3AED',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  panelContainer: {
    gap: 16,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  panelSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginTop: -8,
  },
  contactCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  contactInfoMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    fontSize: 28,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  contactRole: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  badgeSafe: {
    backgroundColor: '#ECFDF5',
  },
  badgeAlert: {
    backgroundColor: '#FEF2F2',
  },
  badgeTextSafe: {
    fontSize: 11,
    color: '#065F46',
    fontWeight: '600',
  },
  badgeTextAlert: {
    fontSize: 11,
    color: '#991B1B',
    fontWeight: '600',
  },
  contactMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
    marginTop: 12,
  },
  metricBox: {
    flexDirection: 'column',
  },
  metricLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginTop: 2,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#7C3AED',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  callButtonDisabled: {
    borderColor: '#D1D5DB',
  },
  callButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7C3AED',
  },
  callButtonTextDisabled: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  profileCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  profileSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  profileRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  profileLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  profileValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    marginTop: 4,
  },
  highlightNote: {
    color: '#B45309',
    backgroundColor: '#FFFBEB',
    padding: 8,
    borderRadius: 8,
    marginTop: 6,
    lineHeight: 18,
  },
  historyCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  historyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 10,
    marginBottom: 14,
  },
  historyCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  historyCardDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  timeline: {
    gap: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 12,
  },
  timelineBulletCompleted: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  timelineDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  simpleHistoryCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  simpleHistoryHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  simpleHistoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  simpleHistoryLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  simpleHistoryStatus: {
    fontSize: 13,
    color: '#059669',
    fontWeight: '600',
  },
  notificationsList: {
    gap: 12,
  },
  notificationItem: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginTop: 6,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  notificationText: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 2,
    lineHeight: 18,
  },
  notificationTime: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
  },
});
