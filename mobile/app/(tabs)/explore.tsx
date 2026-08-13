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
import { useRole } from '../context/RoleContext';

export default function TabTwoScreen() {
  const { role } = useRole();

  const [activeTab, setActiveTab] = useState<'network' | 'profile' | 'history' | 'notifications'>('network');
  const [volunteerTab, setVolunteerTab] = useState<'tasks' | 'trust' | 'preferences'>('tasks');
  const [isEmergencyAlertActive, setIsEmergencyAlertActive] = useState(false);

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => alert('Could not initiate call'));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* ==================== FAMILY MODE DETAIL HEADER ==================== */}
      {(role === 'family' || role === 'senior') && (
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
      )}

      {/* ==================== VOLUNTEER MODE DETAIL HEADER ==================== */}
      {role === 'volunteer' && (
        <View style={styles.tabContainerVolunteer}>
          <TouchableOpacity
            style={[styles.tabButtonVolunteer, volunteerTab === 'tasks' && styles.activeTabButtonVolunteer]}
            onPress={() => setVolunteerTab('tasks')}
          >
            <Text style={[styles.tabButtonTextVolunteer, volunteerTab === 'tasks' && styles.activeTabButtonTextVolunteer]}>
              My Tasks
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButtonVolunteer, volunteerTab === 'trust' && styles.activeTabButtonVolunteer]}
            onPress={() => setVolunteerTab('trust')}
          >
            <Text style={[styles.tabButtonTextVolunteer, volunteerTab === 'trust' && styles.activeTabButtonTextVolunteer]}>
              Trust & Performance
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButtonVolunteer, volunteerTab === 'preferences' && styles.activeTabButtonVolunteer]}
            onPress={() => setVolunteerTab('preferences')}
          >
            <Text style={[styles.tabButtonTextVolunteer, volunteerTab === 'preferences' && styles.activeTabButtonTextVolunteer]}>
              Preferences
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {/* ======================================================== */}
        {/* ==================== FAMILY SCHEMAS ==================== */}
        {/* ======================================================== */}
        {(role === 'family' || role === 'senior') && (
          <View>
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
          </View>
        )}

        {/* ========================================================== */}
        {/* ==================== VOLUNTEER SCHEMAS ==================== */}
        {/* ========================================================== */}
        {role === 'volunteer' && (
          <View>
            {/* 0. EMERGENCY ALERT MODAL OVERLAY IN VOLUNTEER CONTEXT */}
            <View style={styles.emergencyTriggerTesterCard}>
              <Text style={styles.emergencyTesterLabel}>SIH JUDGES TEST TOOL</Text>
              <TouchableOpacity
                style={styles.emergencyTriggerBtn}
                onPress={() => setIsEmergencyAlertActive(!isEmergencyAlertActive)}
              >
                <Text style={styles.emergencyTriggerBtnText}>
                  {isEmergencyAlertActive ? 'Reset Emergency Simulation' : '🚨 Simulate Emergency Critical Request'}
                </Text>
              </TouchableOpacity>
            </View>

            {isEmergencyAlertActive && (
              <View style={styles.volunteerEmergencyAlertCard}>
                <View style={styles.volunteerEmergencyHeader}>
                  <IconSymbol size={24} name="exclamationmark.triangle.fill" color="#fff" />
                  <Text style={styles.volunteerEmergencyHeaderTitle}>🚨 URGENT EMERGENCY REQUEST</Text>
                </View>
                <View style={styles.volunteerEmergencyBody}>
                  <Text style={styles.volunteerEmergencySubtitle}>
                    Senior: <Text style={{ fontWeight: 'bold' }}>Mom & Dad</Text>
                  </Text>
                  <Text style={styles.volunteerEmergencyDescription}>
                    Situation: <Text style={{ fontWeight: 'bold', color: '#FECACA' }}>Possible medical emergency</Text>
                  </Text>
                  <Text style={styles.volunteerEmergencyDistance}>
                    Distance: <Text style={{ fontWeight: 'bold' }}>0.6 km away</Text>
                  </Text>
                  <Text style={styles.volunteerEmergencyPriority}>
                    Priority: <Text style={{ fontWeight: 'bold', color: '#FEE2E2' }}>CRITICAL</Text>
                  </Text>

                  <View style={styles.emergencyActionBtnGrid}>
                    <TouchableOpacity
                      style={styles.emergencyAcceptBtn}
                      onPress={() => {
                        alert('✓ Emergency assistance accepted! Family notified & escalation chain is updated.');
                        setIsEmergencyAlertActive(false);
                      }}
                    >
                      <Text style={styles.emergencyAcceptBtnText}>Accept & Help</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.emergencyDeclineBtn}
                      onPress={() => setIsEmergencyAlertActive(false)}
                    >
                      <Text style={styles.emergencyDeclineBtnText}>Cannot Help</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.emergencyAvis}>
                    💡 Emergency backup escalation is automatically active. Local responders are dispatched.
                  </Text>
                </View>
              </View>
            )}

            {/* ==================== 1. MY TASKS TAB ==================== */}
            {volunteerTab === 'tasks' && (
              <View style={styles.panelContainer}>
                <View style={styles.panelHeader}>
                  <IconSymbol size={22} name="clock.fill" color="#7C3AED" />
                  <Text style={styles.panelTitle}>My Community Contributions</Text>
                </View>

                <View style={styles.volunteerTaskSubsection}>
                  <Text style={styles.volunteerTaskSubsectionTitle}>ACTIVE TASKS</Text>
                  <View style={styles.activeTaskItemBox}>
                    <View style={styles.activeTaskRowHead}>
                      <Text style={styles.activeTaskEmoji}>🔧</Text>
                      <View>
                        <Text style={styles.activeTaskTitle}>Water Pump Repair</Text>
                        <Text style={styles.activeTaskSenior}>Mom & Dad</Text>
                      </View>
                    </View>
                    <View style={styles.activeTaskStatusIndicator}>
                      <View style={styles.pulseDot} />
                      <Text style={styles.activeTaskStatusText}>In Progress</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.volunteerTaskSubsection}>
                  <Text style={styles.volunteerTaskSubsectionTitle}>COMPLETED TASKS</Text>

                  <View style={styles.completedTaskItem}>
                    <View style={styles.completedTaskHead}>
                      <Text style={styles.completedTaskEmoji}>💊</Text>
                      <View>
                        <Text style={styles.completedTaskTitle}>Medicine Pickup</Text>
                        <Text style={styles.completedTaskSenior}>Ramesh & Kamla • Vaishali Nagar</Text>
                      </View>
                    </View>
                    <Text style={styles.completedTaskDate}>Completed — Aug 10</Text>
                  </View>

                  <View style={styles.completedTaskItem}>
                    <View style={styles.completedTaskHead}>
                      <Text style={styles.completedTaskEmoji}>🍎</Text>
                      <View>
                        <Text style={styles.completedTaskTitle}>Grocery Assistance</Text>
                        <Text style={styles.completedTaskSenior}>Savitri Devi • Vaishali Nagar</Text>
                      </View>
                    </View>
                    <Text style={styles.completedTaskDate}>Completed — Aug 8</Text>
                  </View>
                </View>
              </View>
            )}

            {/* ==================== 2. TRUST & PERFORMANCE TAB ==================== */}
            {volunteerTab === 'trust' && (
              <View style={styles.panelContainer}>
                <View style={styles.panelHeader}>
                  <IconSymbol size={22} name="shield.fill" color="#7C3AED" />
                  <Text style={styles.panelTitle}>Reliability Metrics</Text>
                </View>
                <Text style={styles.panelSubtitle}>
                  This private trust scoreboard proves your standing without toxic competitive leaderboards.
                </Text>

                <View style={styles.metricsCardGrid}>
                  <View style={styles.metricBigBox}>
                    <Text style={styles.metricBigLabel}>TRUST SCORE</Text>
                    <Text style={styles.metricBigValue}>94 / 100</Text>
                    <Text style={styles.metricBigSubtitle}>Excellent Standing</Text>
                  </View>

                  <View style={styles.smallMetricsRow}>
                    <View style={styles.smallMetricCell}>
                      <Text style={styles.smallMetricLabel}>Tasks Completed</Text>
                      <Text style={styles.smallMetricValue}>37</Text>
                    </View>
                    <View style={styles.smallMetricCell}>
                      <Text style={styles.smallMetricLabel}>Successful Check-ins</Text>
                      <Text style={styles.smallMetricValue}>36</Text>
                    </View>
                  </View>

                  <View style={styles.smallMetricsRow}>
                    <View style={styles.smallMetricCell}>
                      <Text style={styles.smallMetricLabel}>Avg Response Time</Text>
                      <Text style={styles.smallMetricValue}>8 mins</Text>
                    </View>
                    <View style={styles.smallMetricCell}>
                      <Text style={styles.smallMetricLabel}>Reliability Rate</Text>
                      <Text style={styles.smallMetricValue}>97%</Text>
                    </View>
                  </View>
                </View>

                {/* Secure Badge */}
                <View style={styles.verifiedCommunityNotice}>
                  <IconSymbol size={20} name="checkmark.circle.fill" color="#059669" />
                  <Text style={styles.verifiedCommunityNoticeText}>
                    Vetted, approved, and fully trusted by 5 local senior families.
                  </Text>
                </View>
              </View>
            )}

            {/* ==================== 3. PREFERENCES TAB ==================== */}
            {volunteerTab === 'preferences' && (
              <View style={styles.panelContainer}>
                <View style={styles.panelHeader}>
                  <IconSymbol size={22} name="people.fill" color="#7C3AED" />
                  <Text style={styles.panelTitle}>Preferences & Profile</Text>
                </View>

                {/* Preferred Help Categories */}
                <View style={styles.preferencesCard}>
                  <Text style={styles.prefSectionTitle}>Preferred Categories</Text>

                  <View style={styles.checkboxRow}>
                    <IconSymbol size={18} name="checkmark.circle.fill" color="#7C3AED" />
                    <Text style={styles.checkboxText}>Household Repairs</Text>
                  </View>

                  <View style={styles.checkboxRow}>
                    <IconSymbol size={18} name="checkmark.circle.fill" color="#7C3AED" />
                    <Text style={styles.checkboxText}>Medical Assistance (Medicines, Appointments)</Text>
                  </View>

                  <View style={styles.checkboxRow}>
                    <IconSymbol size={18} name="checkmark.circle.fill" color="#7C3AED" />
                    <Text style={styles.checkboxText}>Grocery & Essentials Dispatch</Text>
                  </View>

                  <View style={styles.checkboxRow}>
                    <IconSymbol size={18} name="checkmark.circle.fill" color="#7C3AED" />
                    <Text style={styles.checkboxText}>Travel Support / Transport Coordination</Text>
                  </View>

                  <View style={styles.checkboxRow}>
                    <View style={styles.emptyCheckbox} />
                    <Text style={styles.checkboxTextDisabled}>Emergency Escalation Dispatch</Text>
                  </View>
                </View>

                {/* Profile Information */}
                <View style={styles.preferencesCard}>
                  <Text style={styles.prefSectionTitle}>Helper Credentials</Text>

                  <View style={styles.profileRow}>
                    <Text style={styles.profileLabel}>Skills</Text>
                    <Text style={styles.profileValue}>Household assistance, Basic Electrical/Plumbing fixes, Local transport</Text>
                  </View>

                  <View style={styles.profileRow}>
                    <Text style={styles.profileLabel}>Languages</Text>
                    <Text style={styles.profileValue}>Hindi, English, Rajasthani</Text>
                  </View>

                  <View style={styles.profileRow}>
                    <Text style={styles.profileLabel}>Availability window</Text>
                    <Text style={styles.profileValue}>9:00 AM – 8:00 PM</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.editProfileBtn}
                  onPress={() => alert('Profile settings updated successfully')}
                >
                  <Text style={styles.editProfileBtnText}>Edit Profile</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

// Reuse & enhance existing styles
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

  /* Volunteer styles */
  tabContainerVolunteer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD6FE',
  },
  tabButtonVolunteer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  activeTabButtonVolunteer: {
    backgroundColor: '#EEF2F6',
  },
  tabButtonTextVolunteer: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabButtonTextVolunteer: {
    color: '#7C3AED',
    fontWeight: '700',
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

  /* Volunteer emergency overlay styles */
  emergencyTriggerTesterCard: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  emergencyTesterLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#991B1B',
    letterSpacing: 0.5,
  },
  emergencyTriggerBtn: {
    backgroundColor: '#DC2626',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  emergencyTriggerBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  volunteerEmergencyAlertCard: {
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
  volunteerEmergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  volunteerEmergencyHeaderTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  volunteerEmergencyBody: {
    gap: 8,
  },
  volunteerEmergencySubtitle: {
    color: '#FFF',
    fontSize: 15,
  },
  volunteerEmergencyDescription: {
    color: '#FFF',
    fontSize: 14,
    marginTop: 2,
  },
  volunteerEmergencyDistance: {
    color: '#FFF',
    fontSize: 14,
    marginTop: 2,
  },
  volunteerEmergencyPriority: {
    color: '#FFF',
    fontSize: 14,
    marginTop: 2,
  },
  emergencyActionBtnGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  emergencyAcceptBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  emergencyAcceptBtnText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 13,
  },
  emergencyDeclineBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#FFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  emergencyDeclineBtnText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 13,
  },
  emergencyAvis: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 8,
  },

  /* Volunteer tabs content styles */
  volunteerTaskSubsection: {
    marginBottom: 16,
  },
  volunteerTaskSubsectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  activeTaskItemBox: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  activeTaskRowHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  activeTaskEmoji: {
    fontSize: 24,
  },
  activeTaskTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  activeTaskSenior: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  activeTaskStatusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D97706',
  },
  activeTaskStatusText: {
    fontSize: 11,
    color: '#92400E',
    fontWeight: '600',
  },
  completedTaskItem: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  completedTaskHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  completedTaskEmoji: {
    fontSize: 20,
  },
  completedTaskTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  completedTaskSenior: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  completedTaskDate: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 6,
    alignSelf: 'flex-end',
  },

  /* Volunteer trust score styles */
  metricsCardGrid: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  metricBigBox: {
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  metricBigLabel: {
    fontSize: 10,
    color: '#7C3AED',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  metricBigValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#7C3AED',
    marginVertical: 4,
  },
  metricBigSubtitle: {
    fontSize: 12,
    color: '#6D28D9',
    fontWeight: '600',
  },
  smallMetricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  smallMetricCell: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  smallMetricLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '600',
    textAlign: 'center',
  },
  smallMetricValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 4,
  },
  verifiedCommunityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 12,
  },
  verifiedCommunityNoticeText: {
    flex: 1,
    fontSize: 12,
    color: '#065F46',
    fontWeight: '600',
    lineHeight: 18,
  },

  /* Volunteer preferences styles */
  preferencesCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 16,
  },
  prefSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  checkboxText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  emptyCheckbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 4,
  },
  checkboxTextDisabled: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  editProfileBtn: {
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  editProfileBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
