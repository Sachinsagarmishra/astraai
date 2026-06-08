import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Sun, Moon, Calendar, ArrowRight, CircleDot, BookOpen, Sparkles, MapPin } from 'lucide-react-native';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [city, setCity] = useState('New Delhi');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Suprabhat');
    else if (hour < 18) setGreeting('Shubh Dophar');
    else setGreeting('Shubh Sandhya');

    AsyncStorage.getItem('userPreferences').then((prefs) => {
      if (prefs) {
        const parsed = JSON.parse(prefs);
        if (parsed.city) setCity(parsed.city);
      }
    });
  }, []);

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const panchang = {
    tithi: 'Shukla Paksha Ekadashi',
    nakshatra: 'Rohini',
    sunrise: '06:14 AM',
    sunset: '06:28 PM',
    abhijitMuhurta: '11:58 AM - 12:46 PM',
    rahuKaal: '04:30 PM - 06:00 PM',
  };

  const festivals = [
    { name: 'Maha Shivaratri', date: 'Mar 14', daysLeft: 3 },
    { name: 'Holi', date: 'Mar 25', daysLeft: 14 },
    { name: 'Chaitra Navratri', date: 'Apr 9', daysLeft: 29 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Namaste, Rahul</Text>
            <Text style={styles.headerSubtitle}>{greeting} • {todayStr}</Text>
          </View>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&h=100&q=80' }}
            style={styles.avatar}
          />
        </View>

        {/* Daily Panchang Card */}
        <View style={styles.panchangCard}>
          <View style={styles.panchangHeader}>
            <View>
              <Text style={styles.sectionLabel}>TODAY'S PANCHANG</Text>
              <View style={styles.locationRow}>
                <MapPin size={12} color="#78716c" />
                <Text style={styles.locationText}>{city}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.calendarButton}>
              <Calendar size={16} color="#78716c" />
            </TouchableOpacity>
          </View>

          <View style={styles.panchangGrid}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Tithi</Text>
              <Text style={styles.gridValue}>{panchang.tithi}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Nakshatra</Text>
              <Text style={styles.gridValue}>{panchang.nakshatra}</Text>
            </View>
          </View>

          <View style={styles.sunSetRow}>
            <View style={styles.sunSetItem}>
              <Sun size={20} color="#f59e0b" />
              <View style={styles.sunSetInfo}>
                <Text style={styles.sunSetLabel}>Sunrise</Text>
                <Text style={styles.sunSetTime}>{panchang.sunrise}</Text>
              </View>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.sunSetItem}>
              <Moon size={20} color="#818cf8" />
              <View style={styles.sunSetInfo}>
                <Text style={styles.sunSetLabel}>Sunset</Text>
                <Text style={styles.sunSetTime}>{panchang.sunset}</Text>
              </View>
            </View>
          </View>

          <View style={styles.muhurtaList}>
            <View style={[styles.muhurtaItem, styles.muhurtaGood]}>
              <Text style={styles.muhurtaGoodText}>Abhijit Muhurta</Text>
              <Text style={styles.muhurtaTimeGood}>{panchang.abhijitMuhurta}</Text>
            </View>
            <View style={[styles.muhurtaItem, styles.muhurtaBad]}>
              <Text style={styles.muhurtaBadText}>Rahu Kaal</Text>
              <Text style={styles.muhurtaTimeBad}>{panchang.rahuKaal}</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionCard} onPress={() => onNavigate('jaap')}>
            <View style={[styles.actionIconContainer, { backgroundColor: '#FFF7ED' }]}>
              <CircleDot size={24} color="#ea580c" />
            </View>
            <Text style={styles.actionText}>Start Jaap</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => onNavigate('puja')}>
            <View style={[styles.actionIconContainer, { backgroundColor: '#FEF3C7' }]}>
              <BookOpen size={24} color="#d97706" />
            </View>
            <Text style={styles.actionText}>Puja Vidhi</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => onNavigate('palmReading')}>
            <View style={[styles.actionIconContainer, { backgroundColor: '#F3E8FF' }]}>
              <Sparkles size={24} color="#9333ea" />
            </View>
            <Text style={styles.actionText}>Palmistry</Text>
          </TouchableOpacity>
        </View>

        {/* Upcoming Festivals */}
        <View style={styles.festivalsHeader}>
          <Text style={styles.sectionTitle}>UPCOMING FESTIVALS</Text>
          <TouchableOpacity style={styles.viewAllBtn}>
            <Text style={styles.viewAllText}>View All</Text>
            <ArrowRight size={14} color="#ea580c" />
          </TouchableOpacity>
        </View>

        <View style={styles.festivalsList}>
          {festivals.map((fest, idx) => (
            <View key={fest.name} style={styles.festivalCard}>
              <View style={styles.festivalInfo}>
                <View style={styles.dateBlock}>
                  <Text style={styles.dateDay}>{fest.date.split(' ')[1]}</Text>
                  <Text style={styles.dateMonth}>{fest.date.split(' ')[0]}</Text>
                </View>
                <View style={styles.festivalDetails}>
                  <Text style={styles.festivalName}>{fest.name}</Text>
                  <Text style={styles.festivalDays}>In {fest.daysLeft} days</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.arrowCircle}>
                <ArrowRight size={16} color="#78716c" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFBF7',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1c1917',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#78716c',
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#ffedd5',
  },
  panchangCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f5f5f4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  panchangHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#ea580c',
    letterSpacing: 1.5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#78716c',
    marginLeft: 4,
  },
  calendarButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  panchangGrid: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  gridItem: {
    flex: 1,
  },
  gridLabel: {
    fontSize: 12,
    color: '#78716c',
    marginBottom: 2,
  },
  gridValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1c1917',
  },
  sunSetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f5f5f4',
    paddingVertical: 12,
    marginBottom: 16,
  },
  sunSetItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sunSetInfo: {
    marginLeft: 8,
  },
  sunSetLabel: {
    fontSize: 10,
    color: '#78716c',
  },
  sunSetTime: {
    fontSize: 12,
    fontWeight: '600',
    color: '#44403c',
  },
  verticalDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#e7e5e4',
    marginHorizontal: 16,
  },
  muhurtaList: {
    gap: 8,
  },
  muhurtaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  muhurtaGood: {
    backgroundColor: '#f0fdf4',
    borderColor: '#dcfce7',
  },
  muhurtaBad: {
    backgroundColor: '#fff1f2',
    borderColor: '#ffe4e6',
  },
  muhurtaGoodText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
  },
  muhurtaTimeGood: {
    fontSize: 12,
    color: '#15803d',
  },
  muhurtaBadText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9f1239',
  },
  muhurtaTimeBad: {
    fontSize: 12,
    color: '#be123c',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#78716c',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f5f5f4',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.01,
    shadowRadius: 4,
    elevation: 1,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#44403c',
  },
  festivalsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ea580c',
    marginRight: 4,
  },
  festivalsList: {
    gap: 12,
  },
  festivalCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f5f5f4',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  festivalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateBlock: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#fff7ed',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffedd5',
  },
  dateDay: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ea580c',
    lineHeight: 16,
  },
  dateMonth: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#ea580c',
    textTransform: 'uppercase',
  },
  festivalDetails: {
    marginLeft: 12,
  },
  festivalName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1c1917',
  },
  festivalDays: {
    fontSize: 11,
    color: '#78716c',
    marginTop: 2,
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f4',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
