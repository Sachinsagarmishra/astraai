import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowRight, Check, MapPin, Bell, Heart, Star, Sparkles, BookOpen } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(0);
  const [city, setCity] = useState('');
  const [deity, setDeity] = useState('');

  const deities = ['Shiva', 'Vishnu', 'Krishna', 'Rama', 'Hanuman', 'Durga', 'Ganesha'];

  const steps = [
    {
      title: "Dharma Path",
      subtitle: "Your Daily Spiritual Guide",
      content: "Welcome to a journey of inner peace and devotion.",
      icon: <Text style={styles.largeEmoji}>🕉️</Text>,
      bgColor: '#FFEEDD'
    },
    {
      title: "मन से, डर से नहीं",
      subtitle: "Philosophy",
      content: "Connect with the divine through love and devotion, not fear. We guide you to perform rituals with understanding and pure intent.",
      icon: <Heart size={64} color="#f43f5e" fill="#f43f5e" />,
      bgColor: '#FFE4E6'
    },
    {
      title: "Core Features",
      subtitle: "Everything you need",
      contentView: (
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <View style={[styles.featureIconContainer, { backgroundColor: '#FFEDD5' }]}><Text style={styles.featureEmoji}>📅</Text></View>
            <Text style={styles.featureText}>Daily Panchang</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureIconContainer, { backgroundColor: '#FFEDD5' }]}><Text style={styles.featureEmoji}>📿</Text></View>
            <Text style={styles.featureText}>Digital Jaap Mala</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureIconContainer, { backgroundColor: '#FFEDD5' }]}><Text style={styles.featureEmoji}>✨</Text></View>
            <Text style={styles.featureText}>AI Palmistry</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureIconContainer, { backgroundColor: '#FFEDD5' }]}><Text style={styles.featureEmoji}>📖</Text></View>
            <Text style={styles.featureText}>Puja Vidhi Library</Text>
          </View>
        </View>
      ),
      icon: null,
      bgColor: '#FFF7ED'
    },
    {
      title: "Personalize",
      subtitle: "Tell us about yourself",
      contentView: (
        <View style={styles.formContainer}>
          <Text style={styles.label}>City (for Panchang)</Text>
          <View style={styles.inputWrapper}>
            <MapPin size={20} color="#78716c" style={styles.inputIcon} />
            <TextInput
              placeholder="e.g. New Delhi"
              placeholderTextColor="#a8a29e"
              style={styles.input}
              value={city}
              onChangeText={setCity}
            />
          </View>

          <Text style={styles.label}>Primary Deity</Text>
          <View style={styles.deityGrid}>
            {deities.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.deityButton,
                  deity === item && styles.deityButtonActive
                ]}
                onPress={() => setDeity(item)}
              >
                <Text style={[
                  styles.deityText,
                  deity === item && styles.deityTextActive
                ]}>Lord {item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ),
      icon: null,
      bgColor: '#FAF7F5'
    },
    {
      title: "Stay Connected",
      subtitle: "Permissions",
      contentView: (
        <View style={styles.permissionsContainer}>
          <View style={styles.permissionCard}>
            <Bell size={24} color="#ea580c" />
            <View style={styles.permissionInfo}>
              <Text style={styles.permissionTitle}>Notifications</Text>
              <Text style={styles.permissionDesc}>Get daily reminders for your Jaap and family events.</Text>
            </View>
          </View>
          <View style={styles.permissionCard}>
            <MapPin size={24} color="#ea580c" />
            <View style={styles.permissionInfo}>
              <Text style={styles.permissionTitle}>Location</Text>
              <Text style={styles.permissionDesc}>For accurate sunrise/sunset times in your Panchang.</Text>
            </View>
          </View>
        </View>
      ),
      icon: null,
      bgColor: '#FFEDD5'
    }
  ];

  const handleNext = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      const prefs = {
        city: city || 'New Delhi',
        deity: deity || 'Shiva',
      };
      await AsyncStorage.setItem('userPreferences', JSON.stringify(prefs));
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      onComplete();
    }
  };

  const current = steps[step];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cardContainer}>
        <View style={[styles.card, { backgroundColor: '#FFFFFF' }]}>
          {current.icon && (
            <View style={[styles.iconContainer, { backgroundColor: current.bgColor }]}>
              {current.icon}
            </View>
          )}
          
          <Text style={styles.subtitle}>{current.subtitle.toUpperCase()}</Text>
          <Text style={styles.title}>{current.title}</Text>
          
          {current.contentView ? (
            current.contentView
          ) : (
            <Text style={styles.description}>{current.content}</Text>
          )}
        </View>
      </View>

      {/* Progress Dots & Buttons */}
      <View style={styles.footer}>
        <View style={styles.dotsRow}>
          {steps.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === step ? styles.dotActive : null
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {step === steps.length - 1 ? 'Get Started' : 'Continue'}
          </Text>
          {step === steps.length - 1 ? (
            <Check size={20} color="#fff" />
          ) : (
            <ArrowRight size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFBF7',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    padding: 32,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#f5f5f4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  largeEmoji: {
    fontSize: 56,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
    color: '#ea580c',
    marginBottom: 8,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1c1917',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#57534e',
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 36,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e7e5e4',
    marginHorizontal: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: '#ea580c',
  },
  button: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 16,
    backgroundColor: '#ea580c',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  // Feature List styles
  featuresList: {
    width: '100%',
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureEmoji: {
    fontSize: 20,
  },
  featureText: {
    fontSize: 16,
    color: '#44403c',
    fontWeight: '500',
  },
  // Personalize Screen Styles
  formContainer: {
    width: '100%',
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#44403c',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e7e5e4',
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1c1917',
  },
  deityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  deityButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e7e5e4',
    backgroundColor: '#fff',
  },
  deityButtonActive: {
    backgroundColor: '#fff7ed',
    borderColor: '#ffedd5',
  },
  deityText: {
    fontSize: 13,
    color: '#57534e',
  },
  deityTextActive: {
    color: '#c2410c',
    fontWeight: '600',
  },
  // Permissions Screen Styles
  permissionsContainer: {
    width: '100%',
    marginTop: 8,
  },
  permissionCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#fff7ed',
    borderColor: '#ffedd5',
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 16,
  },
  permissionInfo: {
    marginLeft: 16,
    flex: 1,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1c1917',
  },
  permissionDesc: {
    fontSize: 13,
    color: '#78716c',
    marginTop: 2,
    lineHeight: 18,
  }
});
