import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, Alert, Dimensions, ActivityIndicator } from 'react-native';
import { IconSymbol } from '../../components/ui/icon-symbol';
import { globalStore } from '../../constants/store';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
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
    <View style={styles.outerContainer}>
      {/* Dev Simulation Scenario Controller Banner */}
      <View style={styles.devPanel}>
        <Text style={styles.devPanelText}>🛠️ [DEMO CONTROLLER] Choose Scenario Flow:</Text>
        <View style={styles.devBtnRow}>
          <TouchableOpacity
            style={[styles.devBtn, scenario === 'backup' && styles.devBtnActive]}
            onPress={() => globalStore.setScenario('backup')}
          >
            <Text style={[styles.devBtnText, scenario === 'backup' && styles.devBtnTextActive]}>
              Concept: Ghar Ka Backup
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.devBtn, scenario === 'regular' && styles.devBtnActive]}
            onPress={() => globalStore.setScenario('regular')}
          >
            <Text style={[styles.devBtnText, scenario === 'regular' && styles.devBtnTextActive]}>
              Direct Match
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* State 0: IDLE */}
        {demoState === 'idle' && (
          <View style={styles.idleView}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.namasteText}>{t.namaste}</Text>
              <Text style={styles.taglineText}>{t.tagline}</Text>
            </View>

            {/* Massive Microphone Button */}
            <TouchableOpacity
              style={styles.voiceButtonContainer}
              onPress={startListening}
              activeOpacity={0.85}
            >
              <View style={styles.voiceOuterCircle}>
                <View style={styles.voiceInnerCircle}>
                  <Text style={styles.voiceEmoji}>🎙️</Text>
                  <Text style={styles.voiceButtonText}>{t.micBtn}</Text>
                </View>
              </View>
              <Text style={styles.voiceButtonSubtext}>{t.micSub}</Text>
            </TouchableOpacity>

            {/* Simulated preset quick helpers for elderly click */}
            <View style={styles.presetsCard}>
              <Text style={styles.categoryTitle}>{t.categories}</Text>

              <TouchableOpacity
                style={styles.presetRow}
                onPress={() => handlePresetSelect(lang === 'hi' ? 'मुझे प्लंबर चाहिए' : 'I need a plumber', 'household')}
                activeOpacity={0.7}
              >
                <Text style={styles.presetText}>{t.catHousehold}</Text>
                <IconSymbol size={24} name="chevron.right" color="#2E7D32" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.presetRow}
                onPress={() => handlePresetSelect(lang === 'hi' ? 'मुझे दवाई ला दो' : 'Get me medicine', 'medicine')}
                activeOpacity={0.7}
              >
                <Text style={styles.presetText}>{t.catMedicine}</Text>
                <IconSymbol size={24} name="chevron.right" color="#2E7D32" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.presetRow}
                onPress={() => handlePresetSelect(lang === 'hi' ? 'कल डॉक्टर के पास जाना है' : 'I have to visit doctor tomorrow', 'doctor')}
                activeOpacity={0.7}
              >
                <Text style={styles.presetText}>{t.catDoctor}</Text>
                <IconSymbol size={24} name="chevron.right" color="#2E7D32" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* State 1: LISTENING */}
        {demoState === 'listening' && (
          <View style={styles.stateCard}>
            <Text style={styles.stateTitle}>{t.listening}</Text>
            <Text style={styles.stateDesc}>{t.speakNow}</Text>

            {/* Waveform Simulation Block */}
            <View style={styles.waveformContainer}>
              {waveHeights.map((h, idx) => (
                <View key={idx} style={[styles.waveBar, { height: h }]} />
              ))}
            </View>

            {/* Click to simulate preset voice commands for presentation */}
            <View style={styles.simInputsBox}>
              <Text style={styles.simInputsTitle}>[Simulate Speech / बोलकर कहें]:</Text>
              <TouchableOpacity
                style={styles.simInputBtn}
                onPress={() => handlePresetSelect(lang === 'hi' ? 'मुझे प्लंबर चाहिए' : 'I need a plumber', 'household')}
              >
                <Text style={styles.simInputBtnText}>{t.speakPrompt1}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.simInputBtn}
                onPress={() => handlePresetSelect(lang === 'hi' ? 'कल डॉक्टर के पास जाना है' : 'I want to visit doctor tomorrow', 'doctor')}
              >
                <Text style={styles.simInputBtnText}>{t.speakPrompt2}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.stopButton}
              onPress={stopListeningSimulate}
              activeOpacity={0.8}
            >
              <Text style={styles.stopButtonText}>{t.stopBtn}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* State 2: VOICE TO TEXT CONFIRMATION */}
        {demoState === 'confirm' && (
          <View style={styles.stateCard}>
            <Text style={styles.stateTitle}>{t.suna}</Text>

            <View style={styles.transcriptionBox}>
              <Text style={styles.transcriptionText}>"{inputText}"</Text>
            </View>

            <Text style={styles.stateSubtitle}>{t.sahiHai}</Text>

            <View style={styles.confirmButtonsRow}>
              <TouchableOpacity
                style={[styles.confirmBtn, styles.btnBadlein]}
                onPress={() => globalStore.setDemoState('listening')}
                activeOpacity={0.8}
              >
                <Text style={styles.btnBadleinText}>{t.btnBadlein}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.confirmBtn, styles.btnHaan]}
                onPress={handleConfirmHaan}
                activeOpacity={0.8}
              >
                <Text style={styles.btnHaanText}>{t.btnHaan}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* State 3: AI INTENT DETECTION BOX */}
        {demoState === 'intent' && (
          <View style={styles.stateCard}>
            <Text style={styles.stateTitle}>{t.intentTitle}</Text>

            <View style={styles.intentBox}>
              <View style={styles.intentRow}>
                <Text style={styles.intentLabel}>{t.intentCategory}:</Text>
                <Text style={styles.intentValue}>HOUSEHOLD REPAIR</Text>
              </View>
              <View style={styles.intentRow}>
                <Text style={styles.intentLabel}>{t.intentSkill}:</Text>
                <Text style={styles.intentValue}>PLUMBING</Text>
              </View>
              <View style={styles.intentRow}>
                <Text style={styles.intentLabel}>{t.intentPriority}:</Text>
                <Text style={[styles.intentValue, { color: '#E65100' }]}>NORMAL</Text>
              </View>
              <View style={styles.intentRow}>
                <Text style={styles.intentLabel}>{t.intentLocation}:</Text>
                <Text style={styles.intentValue}>{t.intentHome}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleConfirmIntent}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>{t.btnConfirmIntent}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* State 4: CONFIRM DISPATCH */}
        {demoState === 'dispatch' && (
          <View style={styles.stateCard}>
            <Text style={styles.stateTitle}>{t.confirmTitle}</Text>
            <Text style={styles.stateDesc}>{t.confirmSubtitle}</Text>

            <View style={styles.confirmSummaryBox}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryEmoji}>🔧</Text>
                <Text style={styles.summaryText}>{inputText}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryEmoji}>📍</Text>
                <Text style={styles.summaryText}>{t.intentHome}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleSendRequest}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>{t.btnSendRequest}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtnTextOnly}
              onPress={() => globalStore.setDemoState('idle')}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelTextOnly}>{t.btnCancel}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* State 5: MATCHING ENGINE IN SEARCH */}
        {demoState === 'matching' && (
          <View style={styles.stateCard}>
            <Text style={styles.stateTitle}>{t.finding}</Text>
            <ActivityIndicator size="large" color="#2E7D32" style={styles.loader} />
            <Text style={styles.stateSubtitle}>{t.checkingNetwork}</Text>

            <View style={styles.matchingChecks}>
              <Text style={styles.checkItem}>{t.nearby}</Text>
              <Text style={styles.checkItem}>{t.trusted}</Text>
              <Text style={styles.checkItem}>{t.availability}</Text>
            </View>

            <Text style={styles.pleaseWaitText}>{t.pleaseWait}</Text>
          </View>
        )}

        {/* State 6: BACKUP WARNING / ACTIVATION (USP) */}
        {demoState === 'backup_warning' && (
          <View style={[styles.stateCard, styles.backupCard]}>
            <Text style={styles.backupTitleText}>{t.backupTitle}</Text>
            <Text style={styles.backupDorryText}>{t.backupDonotWorry}</Text>
            <Text style={styles.backupFoundText}>{t.backupFound}</Text>

            <View style={styles.backupHelperBox}>
              <View style={styles.avatarCircleSmall}>
                <Text style={styles.avatarEmojiSmall}>🔧</Text>
              </View>
              <View style={styles.backupDetails}>
                <Text style={styles.backupHelperName}>{t.backupRaj}</Text>
                <Text style={styles.backupVerifiedText}>{t.backupVerified}</Text>
                <Text style={styles.backupRating}>⭐ 4.7 (1.2 km away)</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.actionButton, styles.backupBtn]}
              onPress={handleAcceptBackup}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>{t.backupRequestBtn}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* State 7: ACTIVE REQUEST TRACKING */}
        {demoState === 'tracking' && (
          <View style={styles.stateCard}>
            <Text style={styles.stateTitle}>{t.trackingTitle}</Text>

            <View style={styles.helperProfileCard}>
              <Text style={styles.helperAvatarLarge}>👨</Text>
              <Text style={styles.helperNameLarge}>{getHelperDetails().name}</Text>
              <Text style={styles.helperType}>{getHelperDetails().type}</Text>
              <Text style={styles.helperRatingBadge}>⭐ {getHelperDetails().rating}</Text>
              <Text style={styles.helperEta}>{t.trackingEta}</Text>
            </View>

            <View style={styles.trackingTimeline}>
              <Text style={styles.timelineItemActive}>{t.trackingStatusAccepted}</Text>
              <Text style={styles.timelineItemActive}>{t.trackingStatusOnWay}</Text>
              <Text style={styles.timelineItemInactive}>{t.trackingStatusArrived}</Text>
              <Text style={styles.timelineItemInactive}>{t.trackingStatusCompleted}</Text>
            </View>

            {/* Quick action to move demo along */}
            <TouchableOpacity
              style={styles.demoNextBtn}
              onPress={handleSimulateArrived}
            >
              <Text style={styles.demoNextBtnText}>[Simulate Helper Arrival / आ गया]</Text>
            </TouchableOpacity>

            <View style={styles.trackingButtons}>
              <TouchableOpacity
                style={styles.contactBtn}
                onPress={() => Alert.alert(lang === 'hi' ? 'फ़ोन लगाया जा रहा है...' : 'Calling...', getHelperDetails().name)}
                activeOpacity={0.8}
              >
                <IconSymbol size={24} name="phone.fill" color="#FFFFFF" />
                <Text style={styles.contactBtnText}>{t.btnContactHelper}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* State 8: HELPER ARRIVED (OTP EXPOSURE) */}
        {demoState === 'arrived' && (
          <View style={styles.stateCard}>
            <Text style={styles.stateTitle}>{t.arrivedTitle}</Text>
            <Text style={styles.stateDesc}>{t.arrivedOtpPrompt}</Text>

            <View style={styles.otpCard}>
              <Text style={styles.otpLabel}>{t.taskOtp}</Text>
              <View style={styles.otpDigitsContainer}>
                <Text style={styles.otpDigit}>4</Text>
                <Text style={styles.otpDigit}>8</Text>
                <Text style={styles.otpDigit}>2</Text>
                <Text style={styles.otpDigit}>1</Text>
              </View>
              <Text style={styles.otpVerifiedText}>{t.arrivedVerified}</Text>
            </View>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleAuthorizeStart}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>{t.btnStartTask}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* State 9: TASK IN PROGRESS */}
        {demoState === 'progress' && (
          <View style={styles.stateCard}>
            <Text style={styles.stateTitle}>{t.progressTitle}</Text>
            <Text style={styles.stateDesc}>{t.progressDesc}</Text>

            <View style={styles.progressAnimationBox}>
              <ActivityIndicator size="large" color="#2E7D32" />
              <Text style={styles.progressStartedText}>{t.progressStarted}</Text>
            </View>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleSimulateCompleted}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>{t.btnCompleteTask}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* State 10: TASK COMPLETED & STAR RATING */}
        {demoState === 'completed' && (
          <View style={styles.stateCard}>
            <Text style={styles.stateTitle}>{t.doneTitle}</Text>
            <Text style={styles.stateDesc}>{t.doneDesc}</Text>
            <Text style={styles.checkoutText}>{t.doneCheckout}</Text>

            <View style={styles.ratingBox}>
              <Text style={styles.ratingTitle}>{t.doneRatingPrompt}</Text>

              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => globalStore.setActiveRating(star)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.ratingStar, star <= currentRating ? styles.starOn : styles.starOff]}>
                      ★
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleSubmitRating}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>{t.btnSubmitRating}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Persistent SOS Emergency Trigger Button */}
      <TouchableOpacity
        style={styles.sosStickyBtn}
        onPress={handleTriggerSOS}
        activeOpacity={0.9}
      >
        <Text style={styles.sosStickyBtnText}>{t.emergencyBtn}</Text>
      </TouchableOpacity>

      {/* Emergency SOS Overlay Modal */}
      {showSosModal && (
        <View style={styles.sosModalOverlay}>
          <View style={[styles.sosModalContent, sosConfirmed && styles.sosConfirmedBg]}>
            {!sosConfirmed ? (
              <>
                <Text style={styles.sosEmojiLarge}>🚨</Text>
                <Text style={styles.sosModalTitle}>{t.sosTitle}</Text>
                <Text style={styles.sosModalPrompt}>{t.sosPrompt}</Text>

                <TouchableOpacity
                  style={styles.sosConfirmBtn}
                  onPress={handleSosConfirm}
                  activeOpacity={0.8}
                >
                  <Text style={styles.sosConfirmBtnText}>{t.sosYes}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.sosCancelBtn}
                  onPress={handleSosDismiss}
                  activeOpacity={0.8}
                >
                  <Text style={styles.sosCancelBtnText}>{t.sosNo}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.sosEmojiLarge}>✓</Text>
                <Text style={styles.sosSentTitle}>{t.sosSentTitle}</Text>

                <View style={styles.sosBulletList}>
                  <Text style={styles.sosBulletItem}>{t.sosSentDesc1}</Text>
                  <Text style={styles.sosBulletItem}>{t.sosSentDesc2}</Text>
                  <Text style={styles.sosBulletItem}>{t.sosSentDesc3}</Text>
                </View>

                <TouchableOpacity
                  style={styles.sosCloseBtn}
                  onPress={handleSosDismiss}
                  activeOpacity={0.8}
                >
                  <Text style={styles.sosCloseBtnText}>{t.sosClose}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
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
  devPanel: {
    backgroundColor: '#212121',
    padding: 12,
    paddingTop: Platform.OS === 'ios' ? 50 : 25,
    borderBottomWidth: 3,
    borderColor: '#FFD54F',
  },
  devPanelText: {
    color: '#FFD54F',
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },
  devBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  devBtn: {
    flex: 1,
    backgroundColor: '#424242',
    height: 38,
    borderRadius: 8,
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
    fontSize: 12,
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
    paddingBottom: 110, // Avoid overlapping sticky SOS button
  },
  idleView: {
    flex: 1,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
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
    marginBottom: 35,
  },
  voiceOuterCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
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
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1B5E20',
  },
  voiceEmoji: {
    fontSize: 54,
  },
  voiceButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 8,
    textTransform: 'uppercase',
  },
  voiceButtonSubtext: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 15,
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
