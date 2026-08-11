import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  StatusBar,
  TextInput,
} from 'react-native';
import { Link } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRole } from '../context/RoleContext';

// Imports from the original starter home screen
import { HelloWave } from '../../components/hello-wave';
import ParallaxScrollView from '../../components/parallax-scroll-view';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';

// Imports from our high-fidelity elder UI
import { IconSymbol } from '../../components/ui/icon-symbol';
import { globalStore } from '../../constants/store';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const {
    role,
    setRole,
    isAvailable,
    setIsAvailable,
    demoStep,
    setDemoStep,
    isEmergencyAlertActive,
    setIsEmergencyAlertActive,
  } = useRole();

  const [otpValue, setOtpValue] = useState('');
  const [isFamilyEmergencyActive, setIsFamilyEmergencyActive] = useState(false);

  // Verification helper methods
  const handleVerifyOtp = () => {
    if (otpValue === '1234' || otpValue.trim() === '1234') {
      setDemoStep('verified');
      setOtpValue('');
    } else {
      alert('Incorrect OTP. Hint: Use 1234 for SIH live verification demo');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Role Switcher Controller Header */}
      <View style={styles.roleHeader}>
        <View style={styles.roleHeaderLeft}>
          <IconSymbol size={18} name="person.badge.shield.checkmark.fill" color="#7C3AED" />
          <Text style={styles.roleHeaderTitle}>Ghar Ka Backup</Text>
        </View>
        <View style={styles.roleHeaderRight}>
          <TouchableOpacity
            style={[styles.roleSelectBtn, role === 'family' && styles.roleSelectActiveFamily]}
            onPress={() => setRole('family')}
          >
            <Text style={[styles.roleSelectText, role === 'family' && styles.roleSelectActiveText]}>
              Family Mode
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleSelectBtn, role === 'volunteer' && styles.roleSelectActiveVolunteer]}
            onPress={() => setRole('volunteer')}
          >
            <Text style={[styles.roleSelectText, role === 'volunteer' && styles.roleSelectActiveText]}>
              Helper Mode
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* RENDER VIEW ACCORDING TO SELECTED MODE */}
      {appMode === 'developer' ? (
        /* RENDER ORIGINAL DEVELOPER STARTER HOME SCREEN FROM MAIN (100% PRESERVED) */
        <ParallaxScrollView
          headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
          headerImage={
            <Image
              source={require('../../assets/images/partial-react-logo.png')}
              style={mergedStyles.reactLogo}
            />
          }>
          <ThemedView style={mergedStyles.titleContainer}>
            <ThemedText type="title">Ri</ThemedText>
            <HelloWave />
          </ThemedView>
          <ThemedView style={mergedStyles.stepContainer}>
            <ThemedText type="subtitle">Step 1: Try it</ThemedText>
            <ThemedText>
              Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
              Press{' '}
              <ThemedText type="defaultSemiBold">
                {Platform.select({
                  ios: 'cmd + d',
                  android: 'cmd + m',
                  web: 'F12',
                })}
              </ThemedText>{' '}
              to open developer tools.
            </ThemedText>
          </ThemedView>
          <ThemedView style={mergedStyles.stepContainer}>
            <Link href="/modal">
              <Link.Trigger>
                <ThemedText type="subtitle">Step 2: Explore</ThemedText>
              </Link.Trigger>
              <Link.Preview />
              <Link.Menu>
                <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
                <Link.MenuAction
                  title="Share"
                  icon="square.and.arrow.up"
                  onPress={() => alert('Share pressed')}
                />
                <Link.Menu title="More" icon="ellipsis">
                  <Link.MenuAction
                    title="Delete"
                    icon="trash"
                    destructive
                    onPress={() => alert('Delete pressed')}
                  />
                </Link.Menu>
              </Link.Menu>
            </Link>

            <ThemedText>
              {`Tap the Explore tab to learn more about what's included in this starter app.`}
            </ThemedText>
          </ThemedView>
          <ThemedView style={mergedStyles.stepContainer}>
            <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
            <ThemedText>
              {`When you're ready, run `}
              <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
              <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
              <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
              <ThemedText type="defaultSemiBold">app-example</ThemedText>.
            </ThemedText>
          </ThemedView>
        </ParallaxScrollView>
      ) : (
        /* RENDER ACCESSIBLE SENIOR CITIZEN VOICE FLOW */
        <View style={mergedStyles.elderRoot}>
          {/* Dev Simulation Scenario Controller Banner */}
          <View style={mergedStyles.devPanel}>
            <Text style={mergedStyles.devPanelText}>🛠️ [DEMO CONTROLLER] Choose Scenario Flow:</Text>
            <View style={mergedStyles.devBtnRow}>
              <TouchableOpacity
                style={[mergedStyles.devBtn, scenario === 'backup' && mergedStyles.devBtnActive]}
                onPress={() => globalStore.setScenario('backup')}
              >
                <Text style={[mergedStyles.devBtnText, scenario === 'backup' && mergedStyles.devBtnTextActive]}>
                  Concept: Ghar Ka Backup
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[mergedStyles.devBtn, scenario === 'regular' && mergedStyles.devBtnActive]}
                onPress={() => globalStore.setScenario('regular')}
              >
                <Text style={[mergedStyles.devBtnText, scenario === 'regular' && mergedStyles.devBtnTextActive]}>
                  Direct Match
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={mergedStyles.container} contentContainerStyle={mergedStyles.contentContainer}>
            {/* State 0: IDLE */}
            {demoState === 'idle' && (
              <View style={mergedStyles.idleView}>
                {/* Header */}
                <View style={mergedStyles.header}>
                  <Text style={mergedStyles.namasteText}>{t.namaste}</Text>
                  <Text style={mergedStyles.taglineText}>{t.tagline}</Text>
                </View>

                {/* Massive Microphone Button */}
                <TouchableOpacity
                  style={mergedStyles.voiceButtonContainer}
                  onPress={startListening}
                  activeOpacity={0.85}
                >
                  <View style={mergedStyles.voiceOuterCircle}>
                    <View style={mergedStyles.voiceInnerCircle}>
                      <Text style={mergedStyles.voiceEmoji}>🎙️</Text>
                      <Text style={mergedStyles.voiceButtonText}>{t.micBtn}</Text>
                    </View>
                  </View>
                  <Text style={mergedStyles.voiceButtonSubtext}>{t.micSub}</Text>
                </TouchableOpacity>

                {/* Simulated preset quick helpers for elderly click */}
                <View style={mergedStyles.presetsCard}>
                  <Text style={mergedStyles.categoryTitle}>{t.categories}</Text>

                  <TouchableOpacity
                    style={mergedStyles.presetRow}
                    onPress={() => handlePresetSelect(lang === 'hi' ? 'मुझे प्लंबर चाहिए' : 'I need a plumber', 'household')}
                    activeOpacity={0.7}
                  >
                    <Text style={mergedStyles.presetText}>{t.catHousehold}</Text>
                    <IconSymbol size={24} name="chevron.right" color="#2E7D32" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={mergedStyles.presetRow}
                    onPress={() => handlePresetSelect(lang === 'hi' ? 'मुझे दवाई ला दो' : 'Get me medicine', 'medicine')}
                    activeOpacity={0.7}
                  >
                    <Text style={mergedStyles.presetText}>{t.catMedicine}</Text>
                    <IconSymbol size={24} name="chevron.right" color="#2E7D32" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={mergedStyles.presetRow}
                    onPress={() => handlePresetSelect(lang === 'hi' ? 'कल डॉक्टर के पास जाना है' : 'I have to visit doctor tomorrow', 'doctor')}
                    activeOpacity={0.7}
                  >
                    <Text style={mergedStyles.presetText}>{t.catDoctor}</Text>
                    <IconSymbol size={24} name="chevron.right" color="#2E7D32" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* State 1: LISTENING */}
            {demoState === 'listening' && (
              <View style={mergedStyles.stateCard}>
                <Text style={mergedStyles.stateTitle}>{t.listening}</Text>
                <Text style={mergedStyles.stateDesc}>{t.speakNow}</Text>

                {/* Waveform Simulation Block */}
                <View style={mergedStyles.waveformContainer}>
                  {waveHeights.map((h, idx) => (
                    <View key={idx} style={[mergedStyles.waveBar, { height: h }]} />
                  ))}
                </View>

                {/* Click to simulate preset voice commands for presentation */}
                <View style={mergedStyles.simInputsBox}>
                  <Text style={mergedStyles.simInputsTitle}>[Simulate Speech / बोलकर कहें]:</Text>
                  <TouchableOpacity
                    style={mergedStyles.simInputBtn}
                    onPress={() => handlePresetSelect(lang === 'hi' ? 'मुझे प्लंबर चाहिए' : 'I need a plumber', 'household')}
                  >
                    <Text style={mergedStyles.simInputBtnText}>{t.speakPrompt1}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={mergedStyles.simInputBtn}
                    onPress={() => handlePresetSelect(lang === 'hi' ? 'कल डॉक्टर के पास जाना है' : 'I want to visit doctor tomorrow', 'doctor')}
                  >
                    <Text style={mergedStyles.simInputBtnText}>{t.speakPrompt2}</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={mergedStyles.stopButton}
                  onPress={stopListeningSimulate}
                  activeOpacity={0.8}
                >
                  <Text style={mergedStyles.stopButtonText}>{t.stopBtn}</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* State 2: VOICE TO TEXT CONFIRMATION */}
            {demoState === 'confirm' && (
              <View style={mergedStyles.stateCard}>
                <Text style={mergedStyles.stateTitle}>{t.suna}</Text>

                <View style={mergedStyles.transcriptionBox}>
                  <Text style={mergedStyles.transcriptionText}>"{inputText}"</Text>
                </View>

                <Text style={mergedStyles.stateSubtitle}>{t.sahiHai}</Text>

                <View style={mergedStyles.confirmButtonsRow}>
                  <TouchableOpacity
                    style={[mergedStyles.confirmBtn, mergedStyles.btnBadlein]}
                    onPress={() => globalStore.setDemoState('listening')}
                    activeOpacity={0.8}
                  >
                    <Text style={mergedStyles.btnBadleinText}>{t.btnBadlein}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[mergedStyles.confirmBtn, mergedStyles.btnHaan]}
                    onPress={handleConfirmHaan}
                    activeOpacity={0.8}
                  >
                    <Text style={mergedStyles.btnHaanText}>{t.btnHaan}</Text>
      {/* ========================================================= */}
      {/* ==================== 1. FAMILY VIEW ==================== */}
      {/* ========================================================= */}
      {role === 'family' && (
        <View style={styles.viewWrapper}>
          {/* Simulation Banner */}
          <View style={styles.simulationBanner}>
            <Text style={styles.simulationText}>
              {isFamilyEmergencyActive ? '🚨 EMERGENCY ACTIVE (SIMULATION)' : '🟢 NORMAL STATUS'}
            </Text>
            <TouchableOpacity
              style={[styles.simulationButton, isFamilyEmergencyActive ? styles.btnNormal : styles.btnEmergency]}
              onPress={() => setIsFamilyEmergencyActive(!isFamilyEmergencyActive)}
            >
              <Text style={styles.simulationButtonText}>
                {isFamilyEmergencyActive ? 'Reset to Safe Mode' : 'Simulate Emergency Alert'}
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

              <View style={[styles.statusBadge, isFamilyEmergencyActive ? styles.badgeAlert : styles.badgeSafe]}>
                <View style={[styles.statusDot, isFamilyEmergencyActive ? styles.dotAlert : styles.dotSafe]} />
                <Text style={[styles.statusBadgeText, isFamilyEmergencyActive ? styles.textAlert : styles.textSafe]}>
                  {isFamilyEmergencyActive ? 'Action Required' : 'No action required'}
                </Text>
              </View>
            </View>

            {/* EMERGENCY ALERT SECTION (Dynamic) */}
            {isFamilyEmergencyActive && (
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
                  <Text style={[styles.philosophyValue, isFamilyEmergencyActive ? styles.philosophyDanger : styles.philosophySuccess]}>
                    {isFamilyEmergencyActive ? 'No, Urgent Alert' : 'Yes, Mom & Dad Safe'}
                  </Text>
                </View>
                <View style={styles.philosophyItem}>
                  <Text style={styles.philosophyLabel}>What Happened?</Text>
                  <Text style={styles.philosophyValue}>
                    {isFamilyEmergencyActive ? 'Panic alarm triggered' : 'Water pump repairs done'}
                  </Text>
                </View>
                <View style={styles.philosophyItem}>
                  <Text style={styles.philosophyLabel}>Who is Handling?</Text>
                  <Text style={styles.philosophyValue}>
                    {isFamilyEmergencyActive ? 'Neighbour Amit Sharma' : 'Plumber Plumb-Raj Team'}
                  </Text>
                </View>
              </View>
            </View>

            {/* ATTENTION SECTION */}
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

            {/* TODAY'S ACTIVITY */}
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

            {/* TRUSTED NETWORK QUICK VIEW */}
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

            {/* RECENT TASKS */}
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
        </View>
      )}

      {/* ============================================================ */}
      {/* ==================== 2. VOLUNTEER VIEW ==================== */}
      {/* ============================================================ */}
      {role === 'volunteer' && (
        <View style={styles.viewWrapper}>
          {/* Volunteer Status Banner */}
          <View style={styles.simulationBannerVolunteer}>
            <Text style={styles.simulationText}>
              {isAvailable ? '🟢 AVAILABLE FOR HELP' : '🔴 OFFLINE / UNAVAILABLE'}
            </Text>
            <TouchableOpacity
              style={[styles.simulationButton, isAvailable ? styles.btnNormal : styles.btnEmergency]}
              onPress={() => {
                setIsAvailable(!isAvailable);
                // Reset demo steps when helper goes offline
                if (isAvailable) setDemoStep('idle');
              }}
            >
              <Text style={styles.simulationButtonText}>
                {isAvailable ? 'Go Offline' : 'Go Online'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            {/* Header Greetings */}
            <View style={styles.volunteerGreetingBox}>
              <Text style={styles.volunteerGreetingText}>Good Evening, Amit 👋</Text>
              <Text style={styles.volunteerSubtitleText}>
                {isAvailable ? 'Ready to help out in your community?' : 'You are currently not receiving care requests.'}
              </Text>
            </View>

            {/* Trust Profile Card */}
            <View style={styles.volunteerTrustCard}>
              <View style={styles.trustHeaderRow}>
                <View>
                  <Text style={styles.trustProfileName}>Amit Sharma</Text>
                  <Text style={styles.trustProfileTitle}>Neighbour Volunteer</Text>
                </View>
                <View style={styles.trustScoreBadge}>
                  <Text style={styles.trustScoreLabel}>Trust Score</Text>
                  <Text style={styles.trustScoreValue}>94</Text>
                </View>
              </View>
              <View style={styles.trustDividers} />
              <View style={styles.trustDetailsGrid}>
                <View style={styles.trustBullet}>
                  <IconSymbol size={16} name="checkmark.circle.fill" color="#10B981" />
                  <Text style={styles.trustBulletText}>Identity Verified</Text>
                </View>
                <View style={styles.trustBullet}>
                  <IconSymbol size={16} name="checkmark.circle.fill" color="#10B981" />
                  <Text style={styles.trustBulletText}>Community Approved</Text>
                </View>
                <View style={styles.trustBullet}>
                  <IconSymbol size={16} name="clock.fill" color="#4B5563" />
                  <Text style={styles.trustBulletText}>Tasks Completed: 37</Text>
                </View>
                <View style={styles.trustBullet}>
                  <IconSymbol size={16} name="shield.fill" color="#7C3AED" />
                  <Text style={styles.trustBulletText}>Rating: ⭐ 4.8</Text>
                </View>
              </View>
            </View>

            {/* DEMO ENGINE TESTING TRIGGERS */}
            {isAvailable && (
              <View style={styles.demoEngineControls}>
                <Text style={styles.demoEngineHeader}>SIH MATCHING DEMO EMULATOR</Text>
                <Text style={styles.demoEngineText}>
                  Simulate different pipeline stages to test matching and automatic backup chain:
                </Text>
                <View style={styles.demoEngineButtonsContainer}>
                  <TouchableOpacity
                    style={[styles.demoEngineBtn, demoStep === 'idle' && styles.demoEngineBtnActive]}
                    onPress={() => setDemoStep('idle')}
                  >
                    <Text style={styles.demoEngineBtnText}>1. Empty State</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.demoEngineBtn, demoStep === 'received' && styles.demoEngineBtnActive]}
                    onPress={() => setDemoStep('received')}
                  >
                    <Text style={styles.demoEngineBtnText}>2. Request Arrived</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.demoEngineBtn, demoStep === 'accepted' && styles.demoEngineBtnActive]}
                    onPress={() => setDemoStep('accepted')}
                  >
                    <Text style={styles.demoEngineBtnText}>3. Accepted (Route)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.demoEngineBtn, demoStep === 'arrived' && styles.demoEngineBtnActive]}
                    onPress={() => setDemoStep('arrived')}
                  >
                    <Text style={styles.demoEngineBtnText}>4. Check-in (OTP)</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* ==================== 2.1 VOLUNTEER IDLE STATE ==================== */}
            {isAvailable && demoStep === 'idle' && (
              <View style={styles.idleStateCard}>
                <IconSymbol size={48} name="bell.fill" color="#D1D5DB" />
                <Text style={styles.idleStateTitle}>Waiting for Requests</Text>
                <Text style={styles.idleStateText}>
                  New tasks from nearby connected families will appear here. No action required.
                </Text>
              </View>
            )}

            {/* ==================== 2.2 NEW WORK REQUEST STATE ==================== */}
            {isAvailable && demoStep === 'received' && (
              <View style={styles.requestCard}>
                {/* SIH Backup Chain visual indicator */}
                <View style={styles.backupHeaderBadge}>
                  <IconSymbol size={16} name="shield.fill" color="#fff" />
                  <Text style={styles.backupHeaderText}>BACKUP SYSTEM ACTIVATED</Text>
                </View>

                <View style={styles.requestCardHeader}>
                  <View style={styles.requestMainText}>
                    <Text style={styles.avatarEmojiLarge}>👵</Text>
                    <View>
                      <Text style={styles.requestSeniorTitle}>Water Pump Repair</Text>
                      <Text style={styles.requestSeniorSubtitle}>Mom & Dad • 0.8 km away</Text>
                    </View>
                  </View>
                  <View style={styles.priorityBadge}>
                    <Text style={styles.priorityText}>🟢 Normal</Text>
                  </View>
                </View>

                <View style={styles.requestMetricsGrid}>
                  <View style={styles.requestMetricCell}>
                    <Text style={styles.reqMetricLabel}>Est. Travel</Text>
                    <Text style={styles.reqMetricValue}>5 mins</Text>
                  </View>
                  <View style={styles.requestMetricCell}>
                    <Text style={styles.reqMetricLabel}>Task Duration</Text>
                    <Text style={styles.reqMetricValue}>20-30 mins</Text>
                  </View>
                  <View style={styles.requestMetricCell}>
                    <Text style={styles.reqMetricLabel}>Selection Tier</Text>
                    <Text style={[styles.reqMetricValue, { color: '#B45309', fontWeight: '700' }]}>Backup #1</Text>
                  </View>
                </View>

                {/* SIH matching reasons */}
                <View style={styles.matchedSection}>
                  <Text style={styles.matchedTitle}>Why you were matched:</Text>
                  <View style={styles.matchedChecklist}>
                    <Text style={styles.matchedCheckitem}>✓ Primary helper unavailable (Raj Plumbing occupied 🔴)</Text>
                    <Text style={styles.matchedCheckitem}>✓ Vetted neighbour & nearby (0.6 km)</Text>
                    <Text style={styles.matchedCheckitem}>✓ Skills matched (Basic household assistance)</Text>
                    <Text style={styles.matchedCheckitem}>✓ Currently online & available</Text>
                  </View>
                </View>

                <View style={styles.requestActionsRow}>
                  <TouchableOpacity
                    style={styles.requestAcceptBtn}
                    onPress={() => setDemoStep('accepted')}
                  >
                    <Text style={styles.requestAcceptBtnText}>Accept Request</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.requestRejectBtn}
                    onPress={() => setDemoStep('idle')}
                  >
                    <Text style={styles.requestRejectBtnText}>Decline</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* ==================== 2.3 ACCEPTED / ROUTE SCREEN ==================== */}
            {isAvailable && demoStep === 'accepted' && (
              <View style={styles.requestCard}>
                <View style={styles.activeHeaderIndicator}>
                  <Text style={styles.activeIndicatorText}>✓ REQUEST ACCEPTED</Text>
                </View>

                <Text style={styles.acceptedCongrats}>
                  You are now helping Mom & Dad.
                </Text>

                <View style={styles.routeDetailsBox}>
                  <Text style={styles.routeLabel}>Task Details</Text>
                  <Text style={styles.routeValue}>🔧 Water Pump Repair</Text>
                  <Text style={styles.routeSubText}>
                    Description: &ldquo;Water pump is not working since morning.&rdquo;
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.navigationButton}
                  onPress={() => alert('Starting navigation context...')}
                >
                  <IconSymbol size={18} name="map.fill" color="#fff" />
                  <Text style={styles.navigationBtnText}>🗺 Open Navigation</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.arrivedButton}
                  onPress={() => setDemoStep('arrived')}
                >
                  <Text style={styles.arrivedBtnText}>I&apos;ve Arrived</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ==================== 2.4 OTP VERIFICATION ==================== */}
            {isAvailable && demoStep === 'arrived' && (
              <View style={styles.requestCard}>
                <Text style={styles.otpHeaderTitle}>🔒 Task Check-In</Text>
                <Text style={styles.otpHeaderSub}>
                  To ensure accountability, ask Mom & Dad for the 4-digit verification OTP.
                </Text>

                <View style={styles.otpInputContainer}>
                  <TextInput
                    style={styles.otpInput}
                    placeholder="E.g. 1234"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="number-pad"
                    maxLength={4}
                    value={otpValue}
                    onChangeText={setOtpValue}
                  />
                  <TouchableOpacity
                    style={styles.otpVerifyBtn}
                    onPress={handleVerifyOtp}
                  >
                    <Text style={styles.otpVerifyBtnText}>Verify OTP</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.otpHelpHint}>
                  💡 Demo Hint: Type <Text style={{ fontWeight: 'bold' }}>1234</Text> and tap verify.
                </Text>
              </View>
            )}

            {/* ==================== 2.5 IN PROGRESS STATE ==================== */}
            {isAvailable && demoStep === 'verified' && (
              <View style={styles.requestCard}>
                <View style={styles.progressBadgeRow}>
                  <View style={styles.pulseDot} />
                  <Text style={styles.progressText}>TASK IN PROGRESS</Text>
                </View>

                <View style={styles.progressMainDetails}>
                  <Text style={styles.progressTaskName}>🔧 Water Pump Repair</Text>
                  <Text style={styles.progressTimeStarted}>Started: Today, 6:14 PM</Text>
                </View>

                <TouchableOpacity
                  style={styles.completeTaskBtn}
                  onPress={() => setDemoStep('completed')}
                >
                  <Text style={styles.completeTaskBtnText}>Mark Task Completed</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ==================== 2.6 COMPLETE CONFIRMATION ==================== */}
            {isAvailable && demoStep === 'completed' && (
              <View style={styles.requestCard}>
                <Text style={styles.completedConfirmTitle}>Is the task completed?</Text>
                <Text style={styles.completedConfirmSub}>
                  Confirming this means the water pump issue is resolved and the senior is satisfied.
                </Text>

                <View style={styles.confirmBtnRow}>
                  <TouchableOpacity
                    style={styles.confirmYesBtn}
                    onPress={() => setDemoStep('checkout')}
                  >
                    <Text style={styles.confirmYesText}>Yes, Complete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.confirmNoBtn}
                    onPress={() => setDemoStep('verified')}
                  >
                    <Text style={styles.confirmNoText}>Not yet</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* ==================== 2.7 TASK SUCCESS CHECKOUT ==================== */}
            {isAvailable && demoStep === 'checkout' && (
              <View style={styles.requestCard}>
                <View style={styles.checkoutSuccessIconContainer}>
                  <IconSymbol size={48} name="checkmark.circle.fill" color="#10B981" />
                </View>
                <Text style={styles.checkoutTitle}>✓ Visited & Checked Out</Text>
                <Text style={styles.checkoutSub}>
                  Visit duration: <Text style={{ fontWeight: 'bold' }}>28 minutes</Text>.{"\n"}
                  Your local care backup support has been successfully logged!
                </Text>

                <View style={styles.familyAlertReassuranceBox}>
                  <Text style={styles.familyAlertReassuranceText}>
                    📩 Family has been notified:{"\n"}
                    &ldquo;Water pump repair completed by Amit at 6:42 PM.&rdquo;
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.checkoutHomeBtn}
                  onPress={() => setDemoStep('idle')}
                >
                  <Text style={styles.checkoutHomeText}>Back to Home</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Reassurance Volunteer Quote Footer */}
            <View style={styles.footerReassurance}>
              <Text style={styles.reassuranceText}>
                &ldquo;VettedLocalBackup. Directly coordinated. Fully accountable.&rdquo;
              </Text>
            </View>
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  roleHeader: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roleHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  roleHeaderRight: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 2,
  },
  roleSelectBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  roleSelectActiveFamily: {
    backgroundColor: '#2563EB',
  },
  roleSelectActiveVolunteer: {
    backgroundColor: '#7C3AED',
  },
  roleSelectText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
  },
  roleSelectActiveText: {
    color: '#FFFFFF',
  },
  viewWrapper: {
    flex: 1,
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
  simulationBannerVolunteer: {
    backgroundColor: '#1E1B4B',
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#312E81',
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

  /* Volunteer Screen Styles */
  volunteerGreetingBox: {
    marginBottom: 16,
  },
  volunteerGreetingText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E1B4B',
  },
  volunteerSubtitleText: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 4,
  },
  volunteerTrustCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  trustHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trustProfileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  trustProfileTitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  trustScoreBadge: {
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  trustScoreLabel: {
    fontSize: 9,
    color: '#7C3AED',
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  trustScoreValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#7C3AED',
  },
  trustDividers: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
  trustDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  trustBullet: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F9FAFB',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  trustBulletText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  demoEngineControls: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  demoEngineHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
    letterSpacing: 0.5,
  },
  demoEngineText: {
    fontSize: 12,
    color: '#78350F',
    marginVertical: 4,
    lineHeight: 16,
  },
  demoEngineButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  demoEngineBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  demoEngineBtnActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#D97706',
  },
  demoEngineBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },
  idleStateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  idleStateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginTop: 12,
  },
  idleStateText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  backupHeaderBadge: {
    backgroundColor: '#EA580C',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  backupHeaderText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  requestCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  requestMainText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarEmojiLarge: {
    fontSize: 32,
  },
  requestSeniorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  requestSeniorSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  priorityBadge: {
    backgroundColor: '#ECFDF5',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 11,
    color: '#065F46',
    fontWeight: '600',
  },
  requestMetricsGrid: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 10,
    marginVertical: 14,
    gap: 8,
  },
  requestMetricCell: {
    flex: 1,
    alignItems: 'center',
  },
  reqMetricLabel: {
    fontSize: 9,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  reqMetricValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginTop: 2,
  },
  matchedSection: {
    backgroundColor: '#F5F3FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  matchedTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5B21B6',
    marginBottom: 6,
  },
  matchedChecklist: {
    gap: 4,
  },
  matchedCheckitem: {
    fontSize: 11,
    color: '#6D28D9',
    fontWeight: '500',
  },
  requestActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  requestAcceptBtn: {
    flex: 2,
    backgroundColor: '#7C3AED',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  requestAcceptBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  requestRejectBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  requestRejectBtnText: {
    color: '#4B5563',
    fontWeight: '600',
    fontSize: 14,
  },
  activeHeaderIndicator: {
    backgroundColor: '#10B981',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  activeIndicatorText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  acceptedCongrats: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  routeDetailsBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 14,
  },
  routeLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  routeValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 2,
  },
  routeSubText: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 6,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  navigationButton: {
    backgroundColor: '#7C3AED',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  navigationBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  arrivedButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#7C3AED',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  arrivedBtnText: {
    color: '#7C3AED',
    fontWeight: '700',
    fontSize: 14,
  },
  otpHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  otpHeaderSub: {
    fontSize: 13,
    color: '#4B5563',
    textAlign: 'center',
    marginVertical: 8,
    lineHeight: 18,
  },
  otpInputContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    marginBottom: 10,
  },
  otpInput: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
  },
  otpVerifyBtn: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 8,
  },
  otpVerifyBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  otpHelpHint: {
    fontSize: 12,
    color: '#92400E',
    backgroundColor: '#FFFBEB',
    padding: 8,
    borderRadius: 6,
    textAlign: 'center',
  },
  progressBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D97706',
  },
  progressText: {
    color: '#92400E',
    fontSize: 11,
    fontWeight: '700',
  },
  progressMainDetails: {
    marginBottom: 16,
  },
  progressTaskName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  progressTimeStarted: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  completeTaskBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  completeTaskBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  completedConfirmTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  completedConfirmSub: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 16,
    lineHeight: 18,
  },
  confirmBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  confirmYesBtn: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmYesText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  confirmNoBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmNoText: {
    color: '#4B5563',
    fontWeight: '600',
    fontSize: 14,
  },
  checkoutSuccessIconContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  checkoutTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  checkoutSub: {
    fontSize: 13,
    color: '#4B5563',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  familyAlertReassuranceBox: {
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 12,
    marginVertical: 16,
  },
  familyAlertReassuranceText: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '600',
    lineHeight: 18,
    textAlign: 'center',
  },
  checkoutHomeBtn: {
    backgroundColor: '#7C3AED',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutHomeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});

const mergedStyles = {
  ...styles,
  ...originalStyles,
};
