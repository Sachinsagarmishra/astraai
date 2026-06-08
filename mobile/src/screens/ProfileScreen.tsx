import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { Settings, Award, Flame, BarChart3, Crown, ChevronRight, LogOut, Edit3 } from 'lucide-react-native';

interface ProfileScreenProps {
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

export default function ProfileScreen({ onNavigate, onLogout }: ProfileScreenProps) {
  const user = {
    name: 'Rahul',
    phone: '+91 9876543210',
    city: 'New Delhi',
    gotra: 'Kashyap',
    subscription: 'Free',
  };

  const analytics = {
    totalJaap: 10800,
    currentStreak: 12,
    longestStreak: 45,
    mostChanted: 'Om Namah Shivaya',
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.settingsBtn}>
          <Settings size={20} color="#78716c" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Info Block */}
        <View style={styles.userInfoCard}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&h=200&q=80' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Edit3 size={12} color="#44403c" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.userInfoText}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userPhone}>{user.phone}</Text>
            <View style={styles.badgesRow}>
              <View style={styles.badge}><Text style={styles.badgeText}>{user.city}</Text></View>
              <View style={styles.badge}><Text style={styles.badgeText}>{user.gotra} Gotra</Text></View>
            </View>
          </View>
        </View>

        {/* Subscription Upgrade Card */}
        <TouchableOpacity style={styles.premiumCard} onPress={() => onNavigate('subscription')}>
          <View style={styles.premiumLeft}>
            <View style={styles.crownCircle}>
              <Crown size={20} color="#eab308" fill="#eab308" />
            </View>
            <View style={styles.premiumTextCol}>
              <Text style={styles.premiumTitle}>Current Plan: {user.subscription}</Text>
              <Text style={styles.premiumDesc}>Upgrade for ad-free experience</Text>
            </View>
          </View>
          <ChevronRight size={18} color="#a8a29e" />
        </TouchableOpacity>

        {/* Analytics Section */}
        <View style={styles.sectionHeader}>
          <BarChart3 size={16} color="#78716c" />
          <Text style={styles.sectionTitle}>SPIRITUAL PROGRESS</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: '#FFF7ED' }]}>
              <Award size={20} color="#ea580c" />
            </View>
            <Text style={styles.statValue}>{analytics.totalJaap.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Jaaps</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: '#FFF1F2' }]}>
              <Flame size={20} color="#f43f5e" />
            </View>
            <Text style={styles.statValue}>{analytics.currentStreak} Days</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </View>
        </View>

        <View style={styles.streakDetailsCard}>
          <View style={styles.streakDetailRow}>
            <Text style={styles.detailLabel}>Most Chanted</Text>
            <Text style={styles.detailValue}>{analytics.mostChanted}</Text>
          </View>
          <View style={[styles.streakDetailRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
            <Text style={styles.detailLabel}>Longest Streak</Text>
            <Text style={styles.detailValue}>{analytics.longestStreak} Days</Text>
          </View>
        </View>

        {/* Preferences */}
        <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12 }]}>PREFERENCES</Text>
        <View style={styles.preferencesCard}>
          <TouchableOpacity style={styles.prefItem}>
            <Text style={styles.prefText}>Primary Deity</Text>
            <View style={styles.prefRight}>
              <Text style={styles.prefValue}>Shiva</Text>
              <ChevronRight size={16} color="#d6d3d1" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.prefItem}>
            <Text style={styles.prefText}>Daily Reminder</Text>
            <View style={styles.prefRight}>
              <Text style={styles.prefValue}>06:00 AM</Text>
              <ChevronRight size={16} color="#d6d3d1" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.prefItem, { borderBottomWidth: 0 }]}>
            <Text style={styles.prefText}>Language</Text>
            <View style={styles.prefRight}>
              <Text style={styles.prefValue}>English</Text>
              <ChevronRight size={16} color="#d6d3d1" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <LogOut size={16} color="#ef4444" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFBF7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderColor: '#f5f5f4',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1c1917',
  },
  settingsBtn: {
    padding: 8,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  userInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f5f5f4',
    marginBottom: 16,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 3,
    borderColor: '#fff',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e7e5e4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfoText: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1c1917',
  },
  userPhone: {
    fontSize: 13,
    color: '#78716c',
    marginTop: 2,
    marginBottom: 8,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    backgroundColor: '#f5f5f4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#57534e',
  },
  premiumCard: {
    flexDirection: 'row',
    backgroundColor: '#1c1917',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  premiumLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  crownCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumTextCol: {
    marginLeft: 12,
  },
  premiumTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  premiumDesc: {
    fontSize: 12,
    color: '#a8a29e',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#78716c',
    letterSpacing: 1.5,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f5f5f4',
  },
  statIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1c1917',
  },
  statLabel: {
    fontSize: 10,
    color: '#78716c',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  streakDetailsCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f5f5f4',
  },
  streakDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#f5f5f4',
  },
  detailLabel: {
    fontSize: 14,
    color: '#57534e',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1c1917',
  },
  preferencesCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f5f5f4',
    overflow: 'hidden',
  },
  prefItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#f5f5f4',
  },
  prefText: {
    fontSize: 14,
    color: '#44403c',
    fontWeight: '500',
  },
  prefRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  prefValue: {
    fontSize: 13,
    color: '#78716c',
  },
  logoutBtn: {
    flexDirection: 'row',
    height: 52,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 15,
    fontWeight: '600',
  },
});
