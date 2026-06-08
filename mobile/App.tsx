import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Platform, Linking, Modal, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Home, CircleDot, Sparkles, BookOpen, User, AlertTriangle, RefreshCw, Bell } from 'lucide-react-native';
import { api } from './src/services/api';

// Import Screens
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import JaapScreen from './src/screens/JaapScreen';
import PalmReadingScreen from './src/screens/PalmReadingScreen';
import PujaScreen from './src/screens/PujaScreen';
import PujaDetailScreen from './src/screens/PujaDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SubscriptionScreen from './src/screens/SubscriptionScreen';

type Screen = 'onboarding' | 'login' | 'home' | 'jaap' | 'palmReading' | 'puja' | 'pujaDetail' | 'profile' | 'subscription';

const CURRENT_APP_VERSION = '1.0.0';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen | null>(null);
  const [selectedPujaId, setSelectedPujaId] = useState<number | null>(null);
  
  // Dynamic updates and maintenance state
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isUpdateRequired, setIsUpdateRequired] = useState(false);
  const [appConfig, setAppConfig] = useState<any>(null);
  const [announcement, setAnnouncement] = useState<any>(null);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      // 1. Fetch dynamic config
      try {
        const config = await api.get<any>('/app-config');
        setAppConfig(config);

        if (config.maintenance_mode === 1) {
          setIsMaintenance(true);
          return;
        }

        // Version check helper (semantic version comparison)
        const isVersionLower = (current: string, required: string) => {
          const cParts = current.split('.').map(Number);
          const rParts = required.split('.').map(Number);
          for (let i = 0; i < 3; i++) {
            const c = cParts[i] || 0;
            const r = rParts[i] || 0;
            if (c < r) return true;
            if (c > r) return false;
          }
          return false;
        };

        if (config.force_update === 1 && config.min_app_version) {
          if (isVersionLower(CURRENT_APP_VERSION, config.min_app_version)) {
            setIsUpdateRequired(true);
            return;
          }
        }

        if (config.show_announcement === 1 && config.announcement_title) {
          setAnnouncement({
            title: config.announcement_title,
            message: config.announcement_message
          });
          setShowAnnouncementModal(true);
        }
      } catch (err) {
        console.warn('Could not load app config, continuing offline:', err);
      }

      // 2. Load standard screens
      try {
        const onboardingCompleted = await AsyncStorage.getItem('hasCompletedOnboarding') === 'true';
        const isLoggedIn = await AsyncStorage.getItem('isAuthenticated') === 'true';

        if (!onboardingCompleted) {
          setCurrentScreen('onboarding');
        } else if (!isLoggedIn) {
          setCurrentScreen('login');
        } else {
          setCurrentScreen('home');
        }
      } catch (err) {
        setCurrentScreen('onboarding');
      }
    };

    initApp();
  }, []);

  const handleOnboardingComplete = () => {
    setCurrentScreen('login');
  };

  const handleLogin = async () => {
    await AsyncStorage.setItem('isAuthenticated', 'true');
    setCurrentScreen('home');
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('isAuthenticated');
    setCurrentScreen('login');
  };

  const handleSelectPuja = (id: number) => {
    setSelectedPujaId(id);
    setCurrentScreen('pujaDetail');
  };

  const handleOpenUpdate = () => {
    const url = appConfig?.update_url || 'https://play.google.com/store';
    Linking.openURL(url).catch((err) => console.error("Couldn't open store page", err));
  };

  // Rendering under maintenance screen
  if (isMaintenance) {
    return (
      <View style={styles.fullscreenOverlay}>
        <StatusBar style="dark" />
        <View style={styles.overlayCard}>
          <View style={[styles.iconWrapper, { backgroundColor: '#ffedd5' }]}>
            <AlertTriangle size={36} color="#ea580c" />
          </View>
          <Text style={styles.overlayTitle}>Under Maintenance</Text>
          <Text style={styles.overlayMessage}>
            We are currently optimizing our systems to serve you better. We will be back shortly.
          </Text>
          <Text style={styles.overlayPhilosophy}>मन से, डर से नहीं।</Text>
        </View>
      </View>
    );
  }

  // Rendering force update screen
  if (isUpdateRequired) {
    return (
      <View style={styles.fullscreenOverlay}>
        <StatusBar style="dark" />
        <View style={styles.overlayCard}>
          <View style={[styles.iconWrapper, { backgroundColor: '#dbeafe' }]}>
            <RefreshCw size={36} color="#2563eb" />
          </View>
          <Text style={styles.overlayTitle}>Update Required</Text>
          <Text style={styles.overlayMessage}>
            A new version of Astrai is available. Please update the application to the latest version to continue.
          </Text>
          <TouchableOpacity style={styles.updateButton} onPress={handleOpenUpdate}>
            <Text style={styles.updateButtonText}>Update Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (currentScreen === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ea580c" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Determine if we should show the bottom navigation tab bar
  const showTabs = ['home', 'jaap', 'palmReading', 'puja', 'profile'].includes(currentScreen);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return <OnboardingScreen onComplete={handleOnboardingComplete} />;
      case 'login':
        return <LoginScreen onLogin={handleLogin} />;
      case 'home':
        return <HomeScreen onNavigate={(screen) => setCurrentScreen(screen as Screen)} />;
      case 'jaap':
        return <JaapScreen />;
      case 'palmReading':
        return <PalmReadingScreen />;
      case 'puja':
        return <PujaScreen onSelectPuja={handleSelectPuja} />;
      case 'pujaDetail':
        return <PujaDetailScreen pujaId={selectedPujaId || 1} onBack={() => setCurrentScreen('puja')} />;
      case 'profile':
        return <ProfileScreen onNavigate={(screen) => setCurrentScreen(screen as Screen)} onLogout={handleLogout} />;
      case 'subscription':
        return <SubscriptionScreen onBack={() => setCurrentScreen('profile')} />;
      default:
        return <HomeScreen onNavigate={(screen) => setCurrentScreen(screen as Screen)} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Screen Render */}
      <View style={styles.content}>
        {renderScreen()}
      </View>

      {/* Announcement Popup Modal */}
      {announcement && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={showAnnouncementModal}
          onRequestClose={() => setShowAnnouncementModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.announcementCard}>
              <View style={styles.announcementHeader}>
                <Bell size={20} color="#ea580c" />
                <Text style={styles.announcementHeaderTitle}>Announcement</Text>
              </View>
              <Text style={styles.announcementTitle}>{announcement.title}</Text>
              <Text style={styles.announcementMessage}>{announcement.message}</Text>
              <TouchableOpacity
                style={styles.closeAnnouncementButton}
                onPress={() => setShowAnnouncementModal(false)}
              >
                <Text style={styles.closeAnnouncementButtonText}>Dismiss</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Custom Bottom Tab Bar */}
      {showTabs && (
        <SafeAreaView style={styles.tabBarContainer}>
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setCurrentScreen('home')}
            >
              <Home size={22} color={currentScreen === 'home' ? '#ea580c' : '#a8a29e'} />
              <Text style={[styles.tabLabel, currentScreen === 'home' && styles.tabLabelActive]}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setCurrentScreen('jaap')}
            >
              <CircleDot size={22} color={currentScreen === 'jaap' ? '#ea580c' : '#a8a29e'} />
              <Text style={[styles.tabLabel, currentScreen === 'jaap' && styles.tabLabelActive]}>Jaap</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setCurrentScreen('palmReading')}
            >
              <Sparkles size={22} color={currentScreen === 'palmReading' ? '#ea580c' : '#a8a29e'} />
              <Text style={[styles.tabLabel, currentScreen === 'palmReading' && styles.tabLabelActive]}>Astro</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setCurrentScreen('puja')}
            >
              <BookOpen size={22} color={currentScreen === 'puja' ? '#ea580c' : '#a8a29e'} />
              <Text style={[styles.tabLabel, currentScreen === 'puja' && styles.tabLabelActive]}>Puja</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setCurrentScreen('profile')}
            >
              <User size={22} color={currentScreen === 'profile' ? '#ea580c' : '#a8a29e'} />
              <Text style={[styles.tabLabel, currentScreen === 'profile' && styles.tabLabelActive]}>Profile</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFBF7',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDFBF7',
  },
  loadingText: {
    fontSize: 16,
    color: '#78716c',
    marginTop: 8,
  },
  tabBarContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 0 : 4,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 10,
    color: '#a8a29e',
    marginTop: 4,
  },
  tabLabelActive: {
    color: '#ea580c',
    fontWeight: '600',
  },
  // Dynamic configs overlays
  fullscreenOverlay: {
    flex: 1,
    backgroundColor: '#FDFBF7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  overlayCard: {
    backgroundColor: '#ffffff',
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f5f5f4',
    shadowColor: '#1c1917',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    width: '100%',
    maxWidth: 340,
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  overlayTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1c1917',
    marginBottom: 12,
    textAlign: 'center',
  },
  overlayMessage: {
    fontSize: 14,
    color: '#78716c',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  overlayPhilosophy: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ea580c',
    fontStyle: 'italic',
  },
  updateButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal Style
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  announcementCard: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    borderWidth: 1,
    borderColor: '#f5f5f4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  announcementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  announcementHeaderTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ea580c',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  announcementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1c1917',
    marginBottom: 8,
  },
  announcementMessage: {
    fontSize: 14,
    color: '#78716c',
    lineHeight: 20,
    marginBottom: 20,
  },
  closeAnnouncementButton: {
    backgroundColor: '#f5f5f4',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeAnnouncementButtonText: {
    color: '#1c1917',
    fontWeight: '600',
    fontSize: 14,
  },
});
