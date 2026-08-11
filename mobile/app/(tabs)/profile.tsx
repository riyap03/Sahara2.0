import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { IconSymbol } from '../../components/ui/icon-symbol';
import { globalStore } from '../../constants/store';

export default function ProfileScreen() {
  const [lang, setLang] = useState(globalStore.getLanguage());
  const [profile, setProfile] = useState(globalStore.getProfile());

  useEffect(() => {
    return globalStore.subscribe(() => {
      setLang(globalStore.getLanguage());
      setProfile(globalStore.getProfile());
    });
  }, []);

  const t = {
    hi: {
      title: 'मेरी प्रोफ़ाइल',
      age: 'उम्र',
      phone: 'फ़ोन नंबर',
      address: 'घर का पता',
      emergencyContact: 'आपातकालीन संपर्क (Emergency Contact)',
      emergencyDesc: 'मुसीबत के समय इस नंबर पर तुरंत सूचना जाएगी',
      langTitle: 'भाषा बदलें (Change Language)',
      selectLang: 'कृपया अपनी पसंदीदा भाषा चुनें:',
      footerNote: '👵 घर का बैकअप हर समय आपकी सुरक्षा के लिए तैयार है।',
      daughter: 'बेटी (Daughter)',
    },
    en: {
      title: 'My Profile',
      age: 'Age',
      phone: 'Phone Number',
      address: 'Home Address',
      emergencyContact: 'Emergency Contact',
      emergencyDesc: 'In case of emergency, this contact will be notified immediately.',
      langTitle: 'Change Language',
      selectLang: 'Please select your preferred language:',
      footerNote: '👵 Ghar Ka Backup is always ready to protect you.',
      daughter: 'Daughter',
    },
  }[lang];

  const handleLanguageChange = (newLang: 'hi' | 'en') => {
    globalStore.setLanguage(newLang);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Title */}
      <View style={styles.header}>
        <Text style={styles.titleText}>{t.title}</Text>
      </View>

      {/* Profile Card */}
      <View style={styles.card}>
        <View style={styles.avatarRow}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>👵</Text>
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>{profile.name}</Text>
            <Text style={styles.subtext}>{t.age}: {profile.age}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <IconSymbol size={24} name="phone.fill" color="#2E7D32" style={styles.infoIcon} />
          <View style={styles.infoContent}>
            <Text style={styles.label}>{t.phone}</Text>
            <Text style={styles.value}>{profile.phone}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <IconSymbol size={24} name="house.fill" color="#2E7D32" style={styles.infoIcon} />
          <View style={styles.infoContent}>
            <Text style={styles.label}>{t.address}</Text>
            <Text style={styles.value}>{profile.address}</Text>
          </View>
        </View>
      </View>

      {/* Emergency Contact */}
      <View style={[styles.card, styles.emergencyCard]}>
        <View style={styles.emergencyHeader}>
          <Text style={styles.emergencyEmoji}>🆘</Text>
          <Text style={styles.emergencyTitle}>{t.emergencyContact}</Text>
        </View>
        <Text style={styles.emergencyDesc}>{t.emergencyDesc}</Text>
        <View style={styles.emergencyBox}>
          <View style={styles.emergencyContactInfo}>
            <Text style={styles.emergencyName}>{profile.emergencyContactName}</Text>
            <Text style={styles.emergencyPhone}>{profile.emergencyContactPhone}</Text>
          </View>
          <TouchableOpacity
            style={styles.callButton}
            activeOpacity={0.7}
            onPress={() => Alert.alert(lang === 'hi' ? 'फ़ोन लगाया जा रहा है...' : 'Calling...', profile.emergencyContactPhone)}
          >
            <IconSymbol size={28} name="phone.fill" color="#FFFFFF" />
            <Text style={styles.callButtonText}>{lang === 'hi' ? 'फ़ोन करें' : 'Call'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Language Selector */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t.langTitle}</Text>
        <Text style={styles.sectionSubtitle}>{t.selectLang}</Text>

        <View style={styles.langButtonsRow}>
          <TouchableOpacity
            style={[
              styles.langButton,
              lang === 'hi' && styles.langButtonActive,
            ]}
            onPress={() => handleLanguageChange('hi')}
            activeOpacity={0.8}
          >
            <Text style={[styles.langText, lang === 'hi' && styles.langTextActive]}>हिन्दी</Text>
            {lang === 'hi' && <Text style={styles.checkMark}>✓</Text>}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.langButton,
              lang === 'en' && styles.langButtonActive,
            ]}
            onPress={() => handleLanguageChange('en')}
            activeOpacity={0.8}
          >
            <Text style={[styles.langText, lang === 'en' && styles.langTextActive]}>English</Text>
            {lang === 'en' && <Text style={styles.checkMark}>✓</Text>}
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer reassuring note */}
      <Text style={styles.footerNote}>{t.footerNote}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  titleText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1B5E20',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#2E7D32',
  },
  avatarText: {
    fontSize: 36,
  },
  nameContainer: {
    marginLeft: 15,
    flex: 1,
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212121',
  },
  subtext: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '600',
    marginTop: 2,
  },
  divider: {
    height: 2,
    backgroundColor: '#EEEEEE',
    marginVertical: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoIcon: {
    marginRight: 15,
  },
  infoContent: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#666666',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 18,
    color: '#212121',
    fontWeight: '600',
    marginTop: 2,
  },
  emergencyCard: {
    borderColor: '#D32F2F',
    borderWidth: 3,
    backgroundColor: '#FFEBEE',
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  emergencyEmoji: {
    fontSize: 26,
    marginRight: 10,
  },
  emergencyTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#C62828',
  },
  emergencyDesc: {
    fontSize: 15,
    color: '#424242',
    lineHeight: 20,
    marginBottom: 15,
    fontWeight: '600',
  },
  emergencyBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#EF5350',
  },
  emergencyContactInfo: {
    flex: 1,
    marginRight: 10,
  },
  emergencyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  emergencyPhone: {
    fontSize: 16,
    color: '#C62828',
    fontWeight: 'bold',
    marginTop: 4,
  },
  callButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 100,
    height: 48,
    justifyContent: 'center',
  },
  callButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  sectionSubtitle: {
    fontSize: 15,
    color: '#666666',
    marginTop: 4,
    marginBottom: 15,
    fontWeight: '600',
  },
  langButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  langButton: {
    flex: 1,
    height: 54,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#BDBDBD',
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  langButtonActive: {
    borderColor: '#2E7D32',
    backgroundColor: '#E8F5E9',
    borderWidth: 3,
  },
  langText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#616161',
  },
  langTextActive: {
    color: '#1B5E20',
  },
  checkMark: {
    color: '#1B5E20',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  footerNote: {
    fontSize: 16,
    color: '#555555',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
});
