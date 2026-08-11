import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, Alert, Dimensions, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';

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
  // Mode switcher: default to 'elder' to showcase senior accessibility target,
  // but allow toggling to 'developer' to render 100% of the original starter screen from main.
  const [appMode, setAppMode] = useState<'elder' | 'developer'>('elder');

  const [lang, setLang] = useState(globalStore.getLanguage());
  const [demoState, setDemoState] = useState(globalStore.getDemoState());
  const [inputText, setInputText] = useState(globalStore.getDemoInputText());
  const [scenario, setScenario] = useState(globalStore.getScenario());
  const [currentRating, setCurrentRating] = useState(globalStore.getActiveRating());
  const [showSosModal, setShowSosModal] = useState(false);
  const [sosConfirmed, setSosConfirmed] = useState(false);

  // Waveform animation simulation
  const [waveHeights, setWaveHeights] = useState([20, 40, 15, 30, 45, 10, 25, 35, 15, 20]);

  useEffect(() => {
    return globalStore.subscribe(() => {
      setLang(globalStore.getLanguage());
      setDemoState(globalStore.getDemoState());
      setInputText(globalStore.getDemoInputText());
      setScenario(globalStore.getScenario());
      setCurrentRating(globalStore.getActiveRating());
    });
  }, []);

  // Simulate sound wave movement when listening
  useEffect(() => {
    let interval: any;
    if (demoState === 'listening') {
      interval = setInterval(() => {
        setWaveHeights(prev => prev.map(() => Math.floor(Math.random() * 50) + 10));
      }, 150);
    }
    return () => clearInterval(interval);
  }, [demoState]);

  // English & Hindi Translations mapping
  const t = {
    hi: {
      namaste: 'नमस्ते, शांति जी 👋',
      tagline: 'आपको किस चीज़ में मदद चाहिए?',
      micBtn: 'बोलकर बताएं',
      micSub: '"मुझे क्या चाहिए?"',
      currentRequest: '🟢 चालू अनुरोध (Active Help)',
      currentRequestPlumber: 'प्लंबर आ रहा है - समय: 10 मिनट',
      emergencyBtn: '🆘 आपातकालीन (SOS)',
      categories: 'या नीचे से एक काम चुनें:',
      catHousehold: '🔧 घर का काम',
      catMedicine: '💊 दवाई (Medicine)',
      catDoctor: '🏥 डॉक्टर / अस्पताल',
      catGrocery: '🛒 राशन (Grocery)',
      catTravel: '🚗 सफ़र (Travel)',
      catEmergency: '🆘 इमरजेंसी',

      listening: '🎙️ सुन रहा हूँ (Listening)...',
      speakNow: 'कृपया आप बोलना शुरू करें:',
      speakPrompt1: '"मुझे प्लंबर चाहिए"',
      speakPrompt2: '"कल डॉक्टर के पास जाना है"',
      speakPrompt3: '"दवाई ला दो"',
      stopBtn: '🛑 रोकें (Stop)',

      suna: 'मैंने सुना:',
      sahiHai: 'क्या यह सही है?',
      btnHaan: '✓ हाँ, सही है',
      btnBadlein: '✏️ बदलें',

      intentTitle: 'AI विश्लेषण (Intent Detected)',
      intentCategory: 'श्रेणी (Category)',
      intentSkill: 'ज़रूरी कौशल (Skill)',
      intentPriority: 'प्राथमिकता (Priority)',
      intentLocation: 'पता (Location)',
      intentHome: 'शांति जी का पंजीकृत घर',
      btnConfirmIntent: 'सही है, आगे बढ़ें ✓',

      confirmTitle: 'मदद की पुष्टि करें',
      confirmSubtitle: 'हम आपके सबसे भरोसेमंद उपलब्ध सहायक को ढूंढेंगे।',
      btnSendRequest: 'मदद भेजें [SEND REQUEST]',
      btnCancel: 'रद्द करें (Cancel)',

      finding: '🔍 सहायक की खोज जारी है...',
      checkingNetwork: 'आपके भरोसेमंद नेटवर्क की जांच कर रहे हैं',
      nearby: '✓ आस-पास के लोग',
      trusted: '✓ भरोसेमंद सहायक',
      availability: '✓ उपलब्धता की जांच',
      pleaseWait: 'कृपया प्रतीक्षा करें...',

      backupTitle: 'ℹ️ आपके नियमित प्लंबर राजेश उपलब्ध नहीं हैं।',
      backupDonotWorry: 'चिंता न करें!',
      backupFound: 'हमें आपका अगला सबसे भरोसेमंद विकल्प मिल गया है:',
      backupRaj: '🔧 राज प्लंबिंग',
      backupVerified: '✓ सत्यापित प्रदाता (Verified)',
      backupRequestBtn: 'मदद के लिए अनुरोध भेजें',

      trackingTitle: '🔧 प्लंबर आ रहा है',
      trackingStatusAccepted: '✓ अनुरोध स्वीकार कर लिया गया',
      trackingStatusOnWay: '✓ रास्ते में है (On the Way)',
      trackingStatusArrived: '○ पहुंच गया (Arrived)',
      trackingStatusCompleted: '○ काम पूरा हो गया',
      trackingEta: 'अनुमानित समय: 8 मिनट',
      btnContactHelper: 'सहायक से बात करें',
      btnCancelRequest: 'अनुरोध रद्द करें',

      arrivedTitle: '👨 राज पहुंच गए हैं',
      arrivedOtpPrompt: 'कृपया सहायक को काम शुरू करने के लिए OTP पूछें:',
      taskOtp: 'काम का OTP:',
      arrivedVerified: '✓ सहायक सत्यापित है',
      btnStartTask: 'काम शुरू करने की अनुमति दें',

      progressTitle: '🔧 काम प्रगति पर है',
      progressDesc: 'राज आपके प्लंबिंग के काम पर ध्यान दे रहे हैं।',
      progressStarted: 'शुरू हुआ: शाम 6:14 बजे',
      btnCompleteTask: 'काम पूरा हुआ (Complete)',

      doneTitle: '✓ काम पूरा हुआ!',
      doneDesc: 'आपका प्लंबिंग का काम सफलतापूर्वक समाप्त हो गया है।',
      doneCheckout: 'राज शाम 6:42 बजे चले गए।',
      doneRatingPrompt: 'क्या आपको मिली मदद उपयोगी लगी?',
      btnSubmitRating: 'रेटिंग जमा करें [SUBMIT]',

      sosTitle: '🚨 आपातकालीन सहायता',
      sosPrompt: 'क्या आपको तुरंत आपातकालीन मदद की आवश्यकता है?',
      sosYes: 'हाँ, तुरंत मदद चाहिए!',
      sosNo: 'नहीं, रद्द करें',
      sosSentTitle: '🚨 आपातकालीन अलर्ट भेज दिया गया है!',
      sosSentDesc1: '✓ आपके भरोसेमंद पड़ोसी और सुरक्षा गार्ड को सूचित कर दिया गया है',
      sosSentDesc2: '✓ आपकी बेटी किरण को संदेश भेज दिया गया है',
      sosSentDesc3: '✓ आपातकालीन सहायता टीम सक्रिय हो गई है',
      sosClose: 'ठीक है (Close)',
    },
    en: {
      namaste: 'Namaste, Shanti ji 👋',
      tagline: 'How can we help you today?',
      micBtn: 'Speak to Us',
      micSub: '"What do you need?"',
      currentRequest: '🟢 Active Help Request',
      currentRequestPlumber: 'Plumber is coming - ETA: 10 mins',
      emergencyBtn: '🆘 EMERGENCY (SOS)',
      categories: 'Or select a service below:',
      catHousehold: '🔧 Household Repair',
      catMedicine: '💊 Medicine Pickup',
      catDoctor: '🏥 Doctor / Hospital',
      catGrocery: '🛒 Grocery / Essentials',
      catTravel: '🚗 Travel Assistance',
      catEmergency: '🆘 Emergency Help',

      listening: '🎙️ Listening...',
      speakNow: 'Please speak now, we are listening:',
      speakPrompt1: '"I need a plumber"',
      speakPrompt2: '"I want to visit the doctor tomorrow"',
      speakPrompt3: '"Get me medicine"',
      stopBtn: '🛑 Stop',

      suna: 'I heard:',
      sahiHai: 'Is this correct?',
      btnHaan: '✓ Yes, Correct',
      btnBadlein: '✏️ Change',

      intentTitle: 'AI Intent Detected',
      intentCategory: 'Category',
      intentSkill: 'Required Skill',
      intentPriority: 'Priority',
      intentLocation: 'Location',
      intentHome: "Shanti's registered home",
      btnConfirmIntent: 'Correct, Proceed ✓',

      confirmTitle: 'Confirm Help Request',
      confirmSubtitle: 'We will find your most trusted available helper.',
      btnSendRequest: 'SEND HELP REQUEST',
      btnCancel: 'Cancel',

      finding: '🔍 Finding help...',
      checkingNetwork: 'Checking your trusted network',
      nearby: '✓ Nearby people',
      trusted: '✓ Trusted providers',
      availability: '✓ Availability status',
      pleaseWait: 'Please wait...',

      backupTitle: 'ℹ️ Your regular plumber Rajesh is unavailable.',
      backupDonotWorry: "Don't worry.",
      backupFound: 'We found your next trusted option:',
      backupRaj: '🔧 Raj Plumbing',
      backupVerified: '✓ Verified Provider',
      backupRequestBtn: 'REQUEST HELP NOW',

      trackingTitle: '🔧 Plumber is coming',
      trackingStatusAccepted: '✓ Request accepted',
      trackingStatusOnWay: '✓ On the way',
      trackingStatusArrived: '○ Arrived',
      trackingStatusCompleted: '○ Task completed',
      trackingEta: 'Estimated arrival: 8 minutes',
      btnContactHelper: 'Contact Helper',
      btnCancelRequest: 'Cancel Request',

      arrivedTitle: '👨 Raj has arrived',
      arrivedOtpPrompt: 'Please ask the helper for the Task OTP:',
      taskOtp: 'Task OTP:',
      arrivedVerified: '✓ Helper verified',
      btnStartTask: 'Authorize Helper to Start',

      progressTitle: '🔧 Help in progress',
      progressDesc: 'Raj is working on your plumbing issue.',
      progressStarted: 'Started: 6:14 PM',
      btnCompleteTask: 'Mark Task Completed',

      doneTitle: '✓ Done!',
      doneDesc: 'Your plumbing issue has been completed.',
      doneCheckout: 'Raj checked out at 6:42 PM.',
      doneRatingPrompt: 'Was the help useful?',
      btnSubmitRating: 'Submit Rating [SUBMIT]',

      sosTitle: '🚨 EMERGENCY ALERT',
      sosPrompt: 'Do you need immediate help right now?',
      sosYes: 'YES, GET HELP IMMEDIATELY',
      sosNo: 'NO, CANCEL',
      sosSentTitle: '🚨 Emergency Alert Sent!',
      sosSentDesc1: '✓ Trusted nearby neighbor & guards alerted',
      sosSentDesc2: '✓ Family (daughter Kiran) notified instantly',
      sosSentDesc3: '✓ Emergency support services dispatched',
      sosClose: 'Close & Dismiss',
    },
  }[lang];

  // Helper values mapping based on scenario
  const getHelperDetails = () => {
    if (scenario === 'regular') {
      return {
        name: 'Amit Sharma',
        type: 'Society Guard / Approved Helper',
        rating: '4.8',
        dist: '0.8 km',
        eta: '10 mins',
      };
    } else {
      return {
        name: 'Raj Plumbing',
        type: 'Ghar Ka Backup Provider',
        rating: '4.7',
        dist: '1.2 km',
        eta: '8 mins',
      };
    }
  };

  const handlePresetSelect = (text: string, category: string) => {
    globalStore.setDemoInputText(text, category);
    globalStore.setDemoState('confirm');
  };

  const startListening = () => {
    globalStore.setDemoState('listening');
  };

  const stopListeningSimulate = () => {
    // Automatically simulate plumber request for direct flow
    handlePresetSelect(
      lang === 'hi'
        ? 'मुझे प्लंबर चाहिए, बाथरूम का पाइप लीक हो रहा है'
        : 'I need a plumber, bathroom pipe is leaking',
      'household'
    );
  };

  const handleConfirmHaan = () => {
    globalStore.setDemoState('intent');
  };

  const handleConfirmIntent = () => {
    globalStore.setDemoState('dispatch');
  };

  const handleSendRequest = () => {
    globalStore.setDemoState('matching');
    // Simulate matching search timeout
    setTimeout(() => {
      if (scenario === 'backup') {
        globalStore.setDemoState('backup_warning');
      } else {
        globalStore.setDemoState('tracking');
      }
    }, 2500);
  };

  const handleAcceptBackup = () => {
    globalStore.setDemoState('tracking');
  };

  const handleSimulateArrived = () => {
    globalStore.setDemoState('arrived');
  };

  const handleAuthorizeStart = () => {
    globalStore.setDemoState('progress');
  };

  const handleSimulateCompleted = () => {
    globalStore.setDemoState('completed');
  };

  const handleSubmitRating = () => {
    // Add completed item to requests list
    globalStore.addRequest({
      category: globalStore.getCategory() || 'household',
      title: inputText,
      status: 'Completed',
      time: lang === 'hi' ? 'अभी-अभी पूरा हुआ' : 'Just Completed',
      helperName: scenario === 'regular' ? 'Amit Sharma' : 'Raj Plumbing',
      rating: currentRating || 5,
    });

    // Reset demo back to idle
    globalStore.setDemoState('idle');
    globalStore.setDemoInputText('');
    globalStore.setActiveRating(0);
  };

  const handleTriggerSOS = () => {
    setShowSosModal(true);
    setSosConfirmed(false);
  };

  const handleSosConfirm = () => {
    setSosConfirmed(true);
  };

  const handleSosDismiss = () => {
    setShowSosModal(false);
    setSosConfirmed(false);
  };

  return (
    <View style={mergedStyles.outerContainer}>
      {/* 💻 Mode Switcher Header Panel: Allows toggling between Elder Mode and Developer Mode */}
      <View style={mergedStyles.modeSwitcherPanel}>
        <Text style={mergedStyles.modeSwitcherText}>⚙️ Select Screen Mode (पसंदीदा स्क्रीन):</Text>
        <View style={mergedStyles.modeBtnRow}>
          <TouchableOpacity
            style={[mergedStyles.modeBtn, appMode === 'elder' && mergedStyles.modeBtnActive]}
            onPress={() => setAppMode('elder')}
          >
            <Text style={[mergedStyles.modeBtnText, appMode === 'elder' && mergedStyles.modeBtnTextActive]}>
              👵 Elder / Senior UI
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[mergedStyles.modeBtn, appMode === 'developer' && mergedStyles.modeBtnActive]}
            onPress={() => setAppMode('developer')}
          >
            <Text style={[mergedStyles.modeBtnText, appMode === 'developer' && mergedStyles.modeBtnTextActive]}>
              💻 Developer / Starter UI
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
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* State 3: AI INTENT DETECTION BOX */}
            {demoState === 'intent' && (
              <View style={mergedStyles.stateCard}>
                <Text style={mergedStyles.stateTitle}>{t.intentTitle}</Text>

                <View style={mergedStyles.intentBox}>
                  <View style={mergedStyles.intentRow}>
                    <Text style={mergedStyles.intentLabel}>{t.intentCategory}:</Text>
                    <Text style={mergedStyles.intentValue}>HOUSEHOLD REPAIR</Text>
                  </View>
                  <View style={mergedStyles.intentRow}>
                    <Text style={mergedStyles.intentLabel}>{t.intentSkill}:</Text>
                    <Text style={mergedStyles.intentValue}>PLUMBING</Text>
                  </View>
                  <View style={mergedStyles.intentRow}>
                    <Text style={mergedStyles.intentLabel}>{t.intentPriority}:</Text>
                    <Text style={[mergedStyles.intentValue, { color: '#E65100' }]}>NORMAL</Text>
                  </View>
                  <View style={mergedStyles.intentRow}>
                    <Text style={mergedStyles.intentLabel}>{t.intentLocation}:</Text>
                    <Text style={mergedStyles.intentValue}>{t.intentHome}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={mergedStyles.actionButton}
                  onPress={handleConfirmIntent}
                  activeOpacity={0.8}
                >
                  <Text style={mergedStyles.actionButtonText}>{t.btnConfirmIntent}</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* State 4: CONFIRM DISPATCH */}
            {demoState === 'dispatch' && (
              <View style={mergedStyles.stateCard}>
                <Text style={mergedStyles.stateTitle}>{t.confirmTitle}</Text>
                <Text style={mergedStyles.stateDesc}>{t.confirmSubtitle}</Text>

                <View style={mergedStyles.confirmSummaryBox}>
                  <View style={mergedStyles.summaryItem}>
                    <Text style={mergedStyles.summaryEmoji}>🔧</Text>
                    <Text style={mergedStyles.summaryText}>{inputText}</Text>
                  </View>
                  <View style={mergedStyles.summaryItem}>
                    <Text style={mergedStyles.summaryEmoji}>📍</Text>
                    <Text style={mergedStyles.summaryText}>{t.intentHome}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={mergedStyles.actionButton}
                  onPress={handleSendRequest}
                  activeOpacity={0.8}
                >
                  <Text style={mergedStyles.actionButtonText}>{t.btnSendRequest}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={mergedStyles.cancelBtnTextOnly}
                  onPress={() => globalStore.setDemoState('idle')}
                  activeOpacity={0.7}
                >
                  <Text style={mergedStyles.cancelTextOnly}>{t.btnCancel}</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* State 5: MATCHING ENGINE IN SEARCH */}
            {demoState === 'matching' && (
              <View style={mergedStyles.stateCard}>
                <Text style={mergedStyles.stateTitle}>{t.finding}</Text>
                <ActivityIndicator size="large" color="#2E7D32" style={mergedStyles.loader} />
                <Text style={mergedStyles.stateSubtitle}>{t.checkingNetwork}</Text>

                <View style={mergedStyles.matchingChecks}>
                  <Text style={mergedStyles.checkItem}>{t.nearby}</Text>
                  <Text style={mergedStyles.checkItem}>{t.trusted}</Text>
                  <Text style={mergedStyles.checkItem}>{t.availability}</Text>
                </View>

                <Text style={mergedStyles.pleaseWaitText}>{t.pleaseWait}</Text>
              </View>
            )}

            {/* State 6: BACKUP WARNING / ACTIVATION (USP) */}
            {demoState === 'backup_warning' && (
              <View style={[mergedStyles.stateCard, mergedStyles.backupCard]}>
                <Text style={mergedStyles.backupTitleText}>{t.backupTitle}</Text>
                <Text style={mergedStyles.backupDorryText}>{t.backupDonotWorry}</Text>
                <Text style={mergedStyles.backupFoundText}>{t.backupFound}</Text>

                <View style={mergedStyles.backupHelperBox}>
                  <View style={mergedStyles.avatarCircleSmall}>
                    <Text style={mergedStyles.avatarEmojiSmall}>🔧</Text>
                  </View>
                  <View style={mergedStyles.backupDetails}>
                    <Text style={mergedStyles.backupHelperName}>{t.backupRaj}</Text>
                    <Text style={mergedStyles.backupVerifiedText}>{t.backupVerified}</Text>
                    <Text style={mergedStyles.backupRating}>⭐ 4.7 (1.2 km away)</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[mergedStyles.actionButton, mergedStyles.backupBtn]}
                  onPress={handleAcceptBackup}
                  activeOpacity={0.8}
                >
                  <Text style={mergedStyles.actionButtonText}>{t.backupRequestBtn}</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* State 7: ACTIVE REQUEST TRACKING */}
            {demoState === 'tracking' && (
              <View style={mergedStyles.stateCard}>
                <Text style={mergedStyles.stateTitle}>{t.trackingTitle}</Text>

                <View style={mergedStyles.helperProfileCard}>
                  <Text style={mergedStyles.helperAvatarLarge}>👨</Text>
                  <Text style={mergedStyles.helperNameLarge}>{getHelperDetails().name}</Text>
                  <Text style={mergedStyles.helperType}>{getHelperDetails().type}</Text>
                  <Text style={mergedStyles.helperRatingBadge}>⭐ {getHelperDetails().rating}</Text>
                  <Text style={mergedStyles.helperEta}>{t.trackingEta}</Text>
                </View>

                <View style={mergedStyles.trackingTimeline}>
                  <Text style={mergedStyles.timelineItemActive}>{t.trackingStatusAccepted}</Text>
                  <Text style={mergedStyles.timelineItemActive}>{t.trackingStatusOnWay}</Text>
                  <Text style={mergedStyles.timelineItemInactive}>{t.trackingStatusArrived}</Text>
                  <Text style={mergedStyles.timelineItemInactive}>{t.trackingStatusCompleted}</Text>
                </View>

                {/* Quick action to move demo along */}
                <TouchableOpacity
                  style={mergedStyles.demoNextBtn}
                  onPress={handleSimulateArrived}
                >
                  <Text style={mergedStyles.demoNextBtnText}>[Simulate Helper Arrival / आ गया]</Text>
                </TouchableOpacity>

                <View style={mergedStyles.trackingButtons}>
                  <TouchableOpacity
                    style={mergedStyles.contactBtn}
                    onPress={() => Alert.alert(lang === 'hi' ? 'फ़ोन लगाया जा रहा है...' : 'Calling...', getHelperDetails().name)}
                    activeOpacity={0.8}
                  >
                    <IconSymbol size={24} name="phone.fill" color="#FFFFFF" />
                    <Text style={mergedStyles.contactBtnText}>{t.btnContactHelper}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* State 8: HELPER ARRIVED (OTP EXPOSURE) */}
            {demoState === 'arrived' && (
              <View style={mergedStyles.stateCard}>
                <Text style={mergedStyles.stateTitle}>{t.arrivedTitle}</Text>
                <Text style={mergedStyles.stateDesc}>{t.arrivedOtpPrompt}</Text>

                <View style={mergedStyles.otpCard}>
                  <Text style={mergedStyles.otpLabel}>{t.taskOtp}</Text>
                  <View style={mergedStyles.otpDigitsContainer}>
                    <Text style={mergedStyles.otpDigit}>4</Text>
                    <Text style={mergedStyles.otpDigit}>8</Text>
                    <Text style={mergedStyles.otpDigit}>2</Text>
                    <Text style={mergedStyles.otpDigit}>1</Text>
                  </View>
                  <Text style={mergedStyles.otpVerifiedText}>{t.arrivedVerified}</Text>
                </View>

                <TouchableOpacity
                  style={mergedStyles.actionButton}
                  onPress={handleAuthorizeStart}
                  activeOpacity={0.8}
                >
                  <Text style={mergedStyles.actionButtonText}>{t.btnStartTask}</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* State 9: TASK IN PROGRESS */}
            {demoState === 'progress' && (
              <View style={mergedStyles.stateCard}>
                <Text style={mergedStyles.stateTitle}>{t.progressTitle}</Text>
                <Text style={mergedStyles.stateDesc}>{t.progressDesc}</Text>

                <View style={mergedStyles.progressAnimationBox}>
                  <ActivityIndicator size="large" color="#2E7D32" />
                  <Text style={mergedStyles.progressStartedText}>{t.progressStarted}</Text>
                </View>

                <TouchableOpacity
                  style={mergedStyles.actionButton}
                  onPress={handleSimulateCompleted}
                  activeOpacity={0.8}
                >
                  <Text style={mergedStyles.actionButtonText}>{t.btnCompleteTask}</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* State 10: TASK COMPLETED & STAR RATING */}
            {demoState === 'completed' && (
              <View style={mergedStyles.stateCard}>
                <Text style={mergedStyles.stateTitle}>{t.doneTitle}</Text>
                <Text style={mergedStyles.stateDesc}>{t.doneDesc}</Text>
                <Text style={mergedStyles.checkoutText}>{t.doneCheckout}</Text>

                <View style={mergedStyles.ratingBox}>
                  <Text style={mergedStyles.ratingTitle}>{t.doneRatingPrompt}</Text>

                  <View style={mergedStyles.starsContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <TouchableOpacity
                        key={star}
                        onPress={() => globalStore.setActiveRating(star)}
                        activeOpacity={0.7}
                      >
                        <Text style={[mergedStyles.ratingStar, star <= currentRating ? mergedStyles.starOn : mergedStyles.starOff]}>
                          ★
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <TouchableOpacity
                  style={mergedStyles.actionButton}
                  onPress={handleSubmitRating}
                  activeOpacity={0.8}
                >
                  <Text style={mergedStyles.actionButtonText}>{t.btnSubmitRating}</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Beautiful empty spacer to ensure list contents never overlap with sticky SOS button */}
            <View style={{ height: 120 }} />
          </ScrollView>

          {/* Persistent SOS Emergency Trigger Button */}
          <TouchableOpacity
            style={mergedStyles.sosStickyBtn}
            onPress={handleTriggerSOS}
            activeOpacity={0.9}
          >
            <Text style={mergedStyles.sosStickyBtnText}>{t.emergencyBtn}</Text>
          </TouchableOpacity>

          {/* Emergency SOS Overlay Modal */}
          {showSosModal && (
            <View style={mergedStyles.sosModalOverlay}>
              <View style={[mergedStyles.sosModalContent, sosConfirmed && mergedStyles.sosConfirmedBg]}>
                {!sosConfirmed ? (
                  <>
                    <Text style={mergedStyles.sosEmojiLarge}>🚨</Text>
                    <Text style={mergedStyles.sosModalTitle}>{t.sosTitle}</Text>
                    <Text style={mergedStyles.sosModalPrompt}>{t.sosPrompt}</Text>

                    <TouchableOpacity
                      style={mergedStyles.sosConfirmBtn}
                      onPress={handleSosConfirm}
                      activeOpacity={0.8}
                    >
                      <Text style={mergedStyles.sosConfirmBtnText}>{t.sosYes}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={mergedStyles.sosCancelBtn}
                      onPress={handleSosDismiss}
                      activeOpacity={0.8}
                    >
                      <Text style={mergedStyles.sosCancelBtnText}>{t.sosNo}</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Text style={mergedStyles.sosEmojiLarge}>✓</Text>
                    <Text style={mergedStyles.sosSentTitle}>{t.sosSentTitle}</Text>

                    <View style={mergedStyles.sosBulletList}>
                      <Text style={mergedStyles.sosBulletItem}>{t.sosSentDesc1}</Text>
                      <Text style={mergedStyles.sosBulletItem}>{t.sosSentDesc2}</Text>
                      <Text style={mergedStyles.sosBulletItem}>{t.sosSentDesc3}</Text>
                    </View>

                    <TouchableOpacity
                      style={mergedStyles.sosCloseBtn}
                      onPress={handleSosDismiss}
                      activeOpacity={0.8}
                    >
                      <Text style={mergedStyles.sosCloseBtnText}>{t.sosClose}</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  modeSwitcherPanel: {
    backgroundColor: '#1565C0',
    padding: 12,
    paddingTop: Platform.OS === 'ios' ? 50 : 25,
    borderBottomWidth: 3,
    borderColor: '#90CAF9',
  },
  modeSwitcherText: {
    color: '#E3F2FD',
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },
  modeBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modeBtn: {
    flex: 1,
    backgroundColor: '#0D47A1',
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#42A5F5',
  },
  modeBtnActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#1E88E5',
  },
  modeBtnText: {
    color: '#90CAF9',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modeBtnTextActive: {
    color: '#1565C0',
    fontWeight: '900',
  },
  elderRoot: {
    flex: 1,
  },
  devPanel: {
    backgroundColor: '#212121',
    padding: 10,
    borderBottomWidth: 3,
    borderColor: '#FFD54F',
  },
  devPanelText: {
    color: '#FFD54F',
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 6,
  },
  devBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  devBtn: {
    flex: 1,
    backgroundColor: '#424242',
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#757575',
  },
  devBtnActive: {
    backgroundColor: '#FFD54F',
    borderColor: '#FFB300',
  },
  devBtnText: {
    color: '#BDBDBD',
    fontSize: 11,
    fontWeight: 'bold',
  },
  devBtnTextActive: {
    color: '#212121',
    fontWeight: '900',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 160, // Deep padding bottom to ensure list items can fully scroll clear of sticky SOS button
  },
  idleView: {
    flex: 1,
  },
  header: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  namasteText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1B5E20',
    textAlign: 'center',
  },
  taglineText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
    textAlign: 'center',
    marginTop: 8,
  },
  voiceButtonContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  voiceOuterCircle: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#A5D6A7',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  voiceInnerCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1B5E20',
  },
  voiceEmoji: {
    fontSize: 50,
  },
  voiceButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 6,
    textTransform: 'uppercase',
  },
  voiceButtonSubtext: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 12,
  },
  presetsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2.5,
    borderColor: '#E0E0E0',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 15,
  },
  presetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1.5,
    borderBottomColor: '#EEEEEE',
    minHeight: 52,
  },
  presetText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  stateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 3,
    borderColor: '#2E7D32',
    marginTop: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  stateTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1B5E20',
    textAlign: 'center',
    marginBottom: 10,
  },
  stateSubtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#424242',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 15,
  },
  stateDesc: {
    fontSize: 16,
    color: '#555555',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    gap: 6,
    marginBottom: 25,
  },
  waveBar: {
    width: 6,
    backgroundColor: '#2E7D32',
    borderRadius: 3,
  },
  simInputsBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 15,
    marginBottom: 25,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
  },
  simInputsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  simInputBtn: {
    backgroundColor: '#E8F5E9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#A5D6A7',
  },
  simInputBtnText: {
    color: '#1B5E20',
    fontSize: 15,
    fontWeight: 'bold',
  },
  stopButton: {
    backgroundColor: '#D32F2F',
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#C62828',
  },
  stopButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  transcriptionBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    padding: 20,
    marginVertical: 15,
    borderWidth: 2,
    borderColor: '#81C784',
  },
  transcriptionText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B5E20',
    textAlign: 'center',
    lineHeight: 30,
  },
  confirmButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginTop: 10,
  },
  confirmBtn: {
    flex: 1,
    height: 60,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  btnBadlein: {
    backgroundColor: '#FFFFFF',
    borderColor: '#757575',
  },
  btnBadleinText: {
    color: '#424242',
    fontSize: 18,
    fontWeight: 'bold',
  },
  btnHaan: {
    backgroundColor: '#2E7D32',
    borderColor: '#1B5E20',
  },
  btnHaanText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  intentBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    gap: 10,
  },
  intentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  intentLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#666',
  },
  intentValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
  },
  actionButton: {
    backgroundColor: '#2E7D32',
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1B5E20',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: 'bold',
  },
  confirmSummaryBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    borderWidth: 1.5,
    borderColor: '#81C784',
    gap: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryEmoji: {
    fontSize: 26,
    marginRight: 12,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
    flex: 1,
  },
  cancelBtnTextOnly: {
    alignItems: 'center',
    marginTop: 15,
  },
  cancelTextOnly: {
    color: '#D32F2F',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    marginVertical: 20,
  },
  matchingChecks: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 15,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 8,
  },
  checkItem: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  pleaseWaitText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    fontWeight: '600',
  },
  backupCard: {
    borderColor: '#FFA000',
    backgroundColor: '#FFFDE7',
  },
  backupTitleText: {
    fontSize: 19,
    fontWeight: '900',
    color: '#E65100',
    textAlign: 'center',
  },
  backupDorryText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginTop: 8,
  },
  backupFoundText: {
    fontSize: 16,
    color: '#424242',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  backupHelperBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFA000',
    marginBottom: 20,
  },
  avatarCircleSmall: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmojiSmall: {
    fontSize: 24,
  },
  backupDetails: {
    marginLeft: 15,
    flex: 1,
  },
  backupHelperName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  backupVerifiedText: {
    color: '#2E7D32',
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 2,
  },
  backupRating: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    marginTop: 2,
  },
  backupBtn: {
    backgroundColor: '#FF9800',
    borderColor: '#E65100',
  },
  helperProfileCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#81C784',
  },
  helperAvatarLarge: {
    fontSize: 48,
  },
  helperNameLarge: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginTop: 5,
  },
  helperType: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
    marginTop: 2,
  },
  helperRatingBadge: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#E65100',
    marginTop: 4,
  },
  helperEta: {
    fontSize: 18,
    fontWeight: '900',
    color: '#2E7D32',
    marginTop: 8,
  },
  trackingTimeline: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    gap: 8,
  },
  timelineItemActive: {
    fontSize: 15,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  timelineItemInactive: {
    fontSize: 15,
    color: '#999',
    fontWeight: '600',
  },
  demoNextBtn: {
    backgroundColor: '#FFEB3B',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FBC02D',
    marginBottom: 15,
    alignItems: 'center',
  },
  demoNextBtnText: {
    color: '#5D4037',
    fontSize: 13,
    fontWeight: '900',
  },
  trackingButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  contactBtn: {
    flex: 1,
    backgroundColor: '#2E7D32',
    height: 52,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  contactBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  otpCard: {
    backgroundColor: '#FFF9C4',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 25,
    borderWidth: 2.5,
    borderColor: '#FBC02D',
  },
  otpLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5D4037',
  },
  otpDigitsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 15,
  },
  otpDigit: {
    backgroundColor: '#FFFFFF',
    width: 44,
    height: 52,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FBC02D',
    textAlign: 'center',
    lineHeight: 48,
    fontSize: 26,
    fontWeight: '900',
    color: '#212121',
  },
  otpVerifiedText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressAnimationBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    marginBottom: 25,
    gap: 10,
  },
  progressStartedText: {
    fontSize: 15,
    color: '#666',
    fontWeight: 'bold',
  },
  checkoutText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  ratingBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    marginBottom: 25,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  ratingStar: {
    fontSize: 36,
  },
  starOn: {
    color: '#FFB300',
  },
  starOff: {
    color: '#E0E0E0',
  },
  sosStickyBtn: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    backgroundColor: '#D32F2F',
    width: width - 40,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#B71C1C',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  sosStickyBtnText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '900',
  },
  sosModalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sosModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 450,
    borderWidth: 4,
    borderColor: '#D32F2F',
    alignItems: 'center',
  },
  sosConfirmedBg: {
    borderColor: '#2E7D32',
  },
  sosEmojiLarge: {
    fontSize: 54,
    marginBottom: 10,
  },
  sosModalTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#C62828',
    marginBottom: 10,
    textAlign: 'center',
  },
  sosModalPrompt: {
    fontSize: 18,
    color: '#424242',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  },
  sosConfirmBtn: {
    backgroundColor: '#D32F2F',
    width: '100%',
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  sosConfirmBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  sosCancelBtn: {
    backgroundColor: '#EEEEEE',
    width: '100%',
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosCancelBtnText: {
    color: '#424242',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sosSentTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#2E7D32',
    marginBottom: 15,
    textAlign: 'center',
  },
  sosBulletList: {
    width: '100%',
    gap: 12,
    marginBottom: 25,
  },
  sosBulletItem: {
    fontSize: 15,
    color: '#2E7D32',
    fontWeight: 'bold',
    lineHeight: 20,
  },
  sosCloseBtn: {
    backgroundColor: '#2E7D32',
    width: '100%',
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosCloseBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

const originalStyles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

const mergedStyles = {
  ...styles,
  ...originalStyles,
};
