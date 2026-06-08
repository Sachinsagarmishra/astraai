import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Home, CircleDot, Sparkles, BookOpen, User } from 'lucide-react-native';

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

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen | null>(null);
  const [selectedPujaId, setSelectedPujaId] = useState<number | null>(null);

  useEffect(() => {
    const checkState = async () => {
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
    checkState();
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

  if (currentScreen === null) {
    return (
      <View style={styles.loadingContainer}>
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
});
