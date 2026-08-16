import React, { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { IconSymbol } from '../../components/ui/icon-symbol';
import { globalStore } from '../../constants/store';
import { shadow } from '../../constants/theme';
import { useRole } from '../context/RoleContext';
import { useRouter } from 'expo-router';

export default function RequestsScreen() {
  const router = useRouter();
  const { logout } = useRole();
  const [lang, setLang] = useState(globalStore.getLanguage());
  const [requestsList, setRequestsList] = useState(globalStore.getRequests());

  useEffect(() => {
    return globalStore.subscribe(() => {
      setLang(globalStore.getLanguage());
      setRequestsList([...globalStore.getRequests()]);
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

  const t = {
    hi: {
      title: 'मेरी मांगें (Requests)',
      subtitle: 'आपकी अभी की और पुरानी सभी मदद की लिस्ट',
      completed: 'पूरा हो गया (Completed)',
      scheduled: 'तय समय पर (Scheduled)',
      active: 'मददगार आ रहा है (On the Way)',
      helper: 'सहायक',
      when: 'कब',
      rating: 'रेटिंग',
      noRequests: 'अभी कोई पुरानी मांग नहीं है।',
      starSubmit: 'मददगार की रेटिंग',
      tapToCall: 'सहायक को फ़ोन करें',
    },
    en: {
      title: 'My Requests',
      subtitle: 'History of all your current and previous help requests',
      completed: 'Completed',
      scheduled: 'Scheduled',
      active: 'Helper is Coming',
      helper: 'Helper',
      when: 'When',
      rating: 'Rating',
      noRequests: 'No requests found.',
      starSubmit: 'Helper Rating',
      tapToCall: 'Call Helper',
    },
  }[lang];

  const getEmojiForCategory = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'medicine':
        return '💊';
      case 'doctor':
        return '🏥';
      case 'grocery':
        return '🛒';
      case 'travel':
        return '🚗';
      case 'household':
        return '🔧';
      case 'emergency':
        return '🆘';
      default:
        return '📋';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return { bg: '#E8F5E9', text: '#2E7D32', border: '#C8E6C9' };
      case 'scheduled':
        return { bg: '#E3F2FD', text: '#1565C0', border: '#BBDEFB' };
      case 'on the way':
      case 'active':
      case 'searching':
        return { bg: '#FFF3E0', text: '#E65100', border: '#FFE0B2' };
      default:
        return { bg: '#F5F5F5', text: '#616161', border: '#E0E0E0' };
    }
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={[styles.star, i <= rating ? styles.starActive : styles.starInactive]}>
          ★
        </Text>
      );
    }
    return <View style={styles.starRow}>{stars}</View>;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.titleText}>{t.title}</Text>
        <Text style={styles.subtitleText}>{t.subtitle}</Text>
      </View>

      {/* List */}
      {requestsList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t.noRequests}</Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
          {requestsList.map((req) => {
            const colors = getStatusColor(req.status);
            return (
              <View key={req.id} style={[styles.requestCard, { borderColor: colors.border }]}>
                <View style={styles.cardHeader}>
                  <View style={styles.iconCircle}>
                    <Text style={styles.categoryEmoji}>{getEmojiForCategory(req.category)}</Text>
                  </View>
                  <View style={styles.cardTitleContainer}>
                    <Text style={styles.cardTitle}>{req.title}</Text>
                    <Text style={styles.timeText}>{t.when}: {req.time}</Text>
                  </View>
                </View>

                <View style={styles.cardDivider} />

                <View style={styles.cardBody}>
                  <View style={[styles.statusBadge, { backgroundColor: colors.bg, borderColor: colors.text }]}>
                    <Text style={[styles.statusText, { color: colors.text }]}>
                      {req.status === 'Completed' ? t.completed : req.status === 'Scheduled' ? t.scheduled : req.status}
                    </Text>
                  </View>

                  {req.helperName && (
                    <View style={styles.helperRow}>
                      <Text style={styles.helperLabel}>{t.helper}:</Text>
                      <Text style={styles.helperValue}>{req.helperName}</Text>
                    </View>
                  )}

                  {req.rating && (
                    <View style={styles.ratingRow}>
                      <Text style={styles.ratingLabel}>{t.rating}:</Text>
                      {renderStars(req.rating)}
                    </View>
                  )}

                  {req.status !== 'Completed' && req.helperName && (
                    <TouchableOpacity
                      style={styles.callHelperBtn}
                      activeOpacity={0.7}
                      onPress={() => Alert.alert(lang === 'hi' ? 'फ़ोन लगाया जा रहा है...' : 'Calling...', `${req.helperName}`)}
                    >
                      <IconSymbol size={22} name="phone.fill" color="#FFFFFF" />
                      <Text style={styles.callHelperText}>{t.tapToCall}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}
      <TouchableOpacity activeOpacity={0.8} style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
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
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#757575',
    fontWeight: 'bold',
  },
  listContainer: {
    gap: 20,
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 2.5,
    ...shadow({ color: '#000', offset: { width: 0, height: 3 }, opacity: 0.1, radius: 5, elevation: 3 }),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#2E7D32',
  },
  categoryEmoji: {
    fontSize: 30,
  },
  cardTitleContainer: {
    marginLeft: 15,
    flex: 1,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#212121',
  },
  timeText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '700',
    marginTop: 4,
  },
  cardDivider: {
    height: 1.5,
    backgroundColor: '#EEEEEE',
    marginVertical: 12,
  },
  cardBody: {
    gap: 10,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 2,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '900',
  },
  helperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  helperLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#616161',
    marginRight: 6,
  },
  helperValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#616161',
    marginRight: 6,
  },
  starRow: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 22,
    marginHorizontal: 1,
  },
  starActive: {
    color: '#FFB300',
  },
  starInactive: {
    color: '#E0E0E0',
  },
  callHelperBtn: {
    backgroundColor: '#2E7D32',
    height: 48,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: '#1B5E20',
  },
  callHelperText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
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
