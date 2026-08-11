import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, TextInput, Alert, Modal } from 'react-native';
import { IconSymbol } from '../../components/ui/icon-symbol';
import { globalStore, TrustedPerson } from '../../constants/store';

export default function TrustedScreen() {
  const [lang, setLang] = useState(globalStore.getLanguage());
  const [trustedList, setTrustedList] = useState(globalStore.getTrustedPeople());
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    return globalStore.subscribe(() => {
      setLang(globalStore.getLanguage());
      setTrustedList([...globalStore.getTrustedPeople()]);
    });
  }, []);

  const t = {
    hi: {
      title: 'भरोसेमंद लोग',
      subtitle: 'आपके परिवार और समाज के वो लोग जो तुरंत मदद के लिए हमेशा तैयार हैं',
      addBtn: 'नया मददगार जोड़ें',
      available: 'मदद के लिए उपलब्ध',
      busy: 'अभी व्यस्त हैं',
      offline: 'उपलब्ध नहीं हैं',
      callText: 'फ़ोन करें',
      verified: 'सत्यापित सहायक',
      modalTitle: 'मददगार की जानकारी भरें',
      nameLabel: 'मददगार का नाम (Name)',
      phoneLabel: 'फ़ोन नंबर (Phone Number)',
      roleLabel: 'रिश्ता / काम (Relationship / Role - जैसे: पड़ोसी, गार्ड, प्लंबर)',
      cancel: 'रद्द करें',
      save: 'सुरक्षित करें',
      successMsg: 'नया भरोसेमंद व्यक्ति सुरक्षित कर लिया गया है!',
      placeholderName: 'जैसे: विजय कुमार',
      placeholderPhone: 'जैसे: +91 99999 88888',
      placeholderRole: 'जैसे: पड़ोसी (Neighbour)',
    },
    en: {
      title: 'Trusted Network',
      subtitle: 'People approved by you and your family who are ready to help.',
      addBtn: 'Add Trusted Person',
      available: 'Available to Help',
      busy: 'Busy Now',
      offline: 'Offline',
      callText: 'Call',
      verified: 'Verified Helper',
      modalTitle: 'Add Helper Details',
      nameLabel: 'Helper Name',
      phoneLabel: 'Phone Number',
      roleLabel: 'Relationship / Role (e.g. Neighbour, Guard, Driver)',
      cancel: 'Cancel',
      save: 'Save Person',
      successMsg: 'New trusted person has been successfully added!',
      placeholderName: 'e.g. Vijay Kumar',
      placeholderPhone: 'e.g. +91 99999 88888',
      placeholderRole: 'e.g. Neighbour',
    },
  }[lang];

  const handleAddPerson = () => {
    if (!name || !phone || !role) {
      Alert.alert(
        lang === 'hi' ? 'अधूरी जानकारी' : 'Incomplete Details',
        lang === 'hi' ? 'कृपया सभी जानकारी भरें!' : 'Please fill all fields!'
      );
      return;
    }

    globalStore.addTrustedPerson({
      name,
      phone,
      role,
      availability: 'Available',
      isVerified: true,
      trustScore: 90,
    });

    // Reset and close
    setName('');
    setPhone('');
    setRole('');
    setIsModalVisible(false);

    Alert.alert(
      lang === 'hi' ? 'सफलतापूर्वक जोड़ा गया' : 'Added Successfully',
      t.successMsg
    );
  };

  const getEmojiForRole = (roleStr: string) => {
    const r = roleStr.toLowerCase();
    if (r.includes('guard') || r.includes('गार्ड') || r.includes('security')) return '🛡️';
    if (r.includes('plumb') || r.includes('प्लंबर')) return '🔧';
    if (r.includes('doctor') || r.includes('डॉक्टर') || r.includes('medical') || r.includes('वैद्य')) return '👨‍⚕️';
    if (r.includes('neighbour') || r.includes('पड़ोसी') || r.includes('friend')) return '👨';
    if (r.includes('daughter') || r.includes('बेटी') || r.includes('son') || r.includes('बेटा')) return '❤️';
    return '👤';
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.titleText}>{t.title}</Text>
          <Text style={styles.subtitleText}>{t.subtitle}</Text>
        </View>

        {/* Add button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsModalVisible(true)}
          activeOpacity={0.8}
        >
          <IconSymbol size={28} name="plus" color="#FFFFFF" style={styles.addIcon} />
          <Text style={styles.addButtonText}>{t.addBtn}</Text>
        </TouchableOpacity>

        {/* List of trusted people */}
        <View style={styles.listContainer}>
          {trustedList.map((person) => {
            const isAvail = person.availability === 'Available';
            const isBusy = person.availability === 'Busy';

            return (
              <View key={person.id} style={styles.personCard}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.emojiAvatar}>{getEmojiForRole(person.role)}</Text>
                </View>

                <View style={styles.detailsContainer}>
                  <Text style={styles.nameText}>{person.name}</Text>
                  <Text style={styles.roleText}>{person.role}</Text>

                  {/* Status indicator */}
                  <View style={styles.statusRow}>
                    <View
                      style={[
                        styles.statusDot,
                        isAvail && styles.dotAvailable,
                        isBusy && styles.dotBusy,
                        !isAvail && !isBusy && styles.dotOffline,
                      ]}
                    />
                    <Text
                      style={[
                        styles.statusText,
                        isAvail && styles.textAvailable,
                        isBusy && styles.textBusy,
                        !isAvail && !isBusy && styles.textOffline,
                      ]}
                    >
                      {isAvail ? t.available : isBusy ? t.busy : t.offline}
                    </Text>
                  </View>

                  {person.isVerified && (
                    <View style={styles.verifiedTag}>
                      <Text style={styles.verifiedTagText}>✓ {t.verified}</Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.callCircle}
                  activeOpacity={0.7}
                  onPress={() => Alert.alert(lang === 'hi' ? 'फ़ोन लगाया जा रहा है...' : 'Calling...', `${person.name}\n${person.phone}`)}
                >
                  <IconSymbol size={26} name="phone.fill" color="#FFFFFF" />
                  <Text style={styles.callCircleText}>{lang === 'hi' ? 'कॉल' : 'Call'}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Add Helper Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>{t.modalTitle}</Text>

            {/* Input Name */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>{t.nameLabel}</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder={t.placeholderName}
                placeholderTextColor="#999"
              />
            </View>

            {/* Input Phone */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>{t.phoneLabel}</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder={t.placeholderPhone}
                placeholderTextColor="#999"
                keyboardType="phone-pad"
              />
            </View>

            {/* Input Role */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>{t.roleLabel}</Text>
              <TextInput
                style={styles.input}
                value={role}
                onChangeText={setRole}
                placeholder={t.placeholderRole}
                placeholderTextColor="#999"
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setIsModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelBtnText}>{t.cancel}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, styles.saveBtn]}
                onPress={handleAddPerson}
                activeOpacity={0.8}
              >
                <Text style={styles.saveBtnText}>{t.save}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
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
    alignItems: 'center',
  },
  titleText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1B5E20',
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 16,
    color: '#555555',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 6,
    lineHeight: 22,
  },
  addButton: {
    backgroundColor: '#2E7D32',
    height: 60,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    borderWidth: 2,
    borderColor: '#1B5E20',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  addIcon: {
    marginRight: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContainer: {
    gap: 15,
  },
  personCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#2E7D32',
  },
  emojiAvatar: {
    fontSize: 32,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 15,
    marginRight: 10,
  },
  nameText: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#212121',
  },
  roleText: {
    fontSize: 15,
    color: '#666666',
    fontWeight: '700',
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  dotAvailable: {
    backgroundColor: '#4CAF50',
  },
  dotBusy: {
    backgroundColor: '#FF9800',
  },
  dotOffline: {
    backgroundColor: '#9E9E9E',
  },
  statusText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  textAvailable: {
    color: '#2E7D32',
  },
  textBusy: {
    color: '#E65100',
  },
  textOffline: {
    color: '#616161',
  },
  verifiedTag: {
    backgroundColor: '#E8F5E9',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 6,
  },
  verifiedTagText: {
    color: '#2E7D32',
    fontSize: 11,
    fontWeight: '900',
  },
  callCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1B5E20',
  },
  callCircleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    borderWidth: 3,
    borderColor: '#2E7D32',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1B5E20',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#BDBDBD',
    borderRadius: 10,
    padding: 12,
    fontSize: 18,
    color: '#212121',
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    backgroundColor: '#EEEEEE',
    borderWidth: 2,
    borderColor: '#9E9E9E',
  },
  cancelBtnText: {
    color: '#424242',
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveBtn: {
    backgroundColor: '#2E7D32',
    borderWidth: 2,
    borderColor: '#1B5E20',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
