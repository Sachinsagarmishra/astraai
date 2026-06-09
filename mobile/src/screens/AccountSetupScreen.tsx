import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User,
  Calendar,
  Clock,
  MapPin,
  Heart,
  Target,
  Globe,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
} from 'lucide-react-native';
import { api } from '../services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AccountSetupScreenProps {
  phone: string;
  onComplete: () => void;
}

// Design system colors
const Colors = {
  primary: '#ea580c',
  primaryDark: '#c2410c',
  primaryLight: '#fb923c',
  background: '#FDFBF7',
  surface: '#FFFFFF',
  surfaceTint: '#FFF7ED',
  surfaceWarm: '#FFEDD5',
  border: '#f5f5f4',
  borderStrong: '#e7e5e4',
  textPrimary: '#1c1917',
  textSecondary: '#44403c',
  textMuted: '#78716c',
  textDisabled: '#a8a29e',
  success: '#16a34a',
  successBg: '#f0fdf4',
  danger: '#dc2626',
  dangerBg: '#fef2f2',
};

// Step definitions
const STEP_CONFIG = [
  {
    key: 'name',
    title: 'What\'s Your Name?',
    subtitle: 'YOUR IDENTITY',
    description: 'This is how we\'ll address you on your spiritual journey.',
    icon: User,
    iconColor: '#ea580c',
    iconBg: '#FFEDD5',
  },
  {
    key: 'gender',
    title: 'Your Gender',
    subtitle: 'ABOUT YOU',
    description: 'Astrological charts differ based on your gender.',
    icon: Sparkles,
    iconColor: '#9333ea',
    iconBg: '#F3E8FF',
  },
  {
    key: 'dob',
    title: 'Date of Birth',
    subtitle: 'BIRTH DETAILS',
    description: 'Your birth date is the key to your Kundli and life path.',
    icon: Calendar,
    iconColor: '#2563eb',
    iconBg: '#DBEAFE',
  },
  {
    key: 'birthTime',
    title: 'Birth Time',
    subtitle: 'OPTIONAL',
    description: 'Approximate time of birth helps with accurate planetary positions.',
    icon: Clock,
    iconColor: '#d97706',
    iconBg: '#FEF3C7',
  },
  {
    key: 'birthPlace',
    title: 'Birth Place',
    subtitle: 'LOCATION',
    description: 'Your birth city helps calculate geographical coordinates for your chart.',
    icon: MapPin,
    iconColor: '#dc2626',
    iconBg: '#FEE2E2',
  },
  {
    key: 'maritalStatus',
    title: 'Marital Status',
    subtitle: 'RELATIONSHIP',
    description: 'Helps personalize relationship and compatibility readings.',
    icon: Heart,
    iconColor: '#f43f5e',
    iconBg: '#FFE4E6',
  },
  {
    key: 'concerns',
    title: 'What Matters Most?',
    subtitle: 'PRIMARY CONCERNS',
    description: 'Select the areas where you seek divine guidance.',
    icon: Target,
    iconColor: '#16a34a',
    iconBg: '#DCFCE7',
  },
  {
    key: 'language',
    title: 'Preferred Language',
    subtitle: 'COMMUNICATION',
    description: 'Choose how you\'d like to receive your readings and content.',
    icon: Globe,
    iconColor: '#0891b2',
    iconBg: '#CFFAFE',
  },
];

const GENDERS = ['Male', 'Female', 'Other'];
const MARITAL_STATUSES = ['Single', 'Married', 'Divorced', 'Widowed'];
const CONCERNS = ['Career', 'Love', 'Health', 'Finance', 'Spiritual Growth', 'Family'];
const CONCERN_EMOJIS: Record<string, string> = {
  Career: '💼',
  Love: '💕',
  Health: '🏥',
  Finance: '💰',
  'Spiritual Growth': '🕉️',
  Family: '👨‍👩‍👧‍👦',
};
const LANGUAGES = ['Hindi', 'English', 'Both'];
const LANGUAGE_LABELS: Record<string, string> = {
  Hindi: 'हिंदी',
  English: 'English',
  Both: 'Both / दोनों',
};

export default function AccountSetupScreen({ phone, onComplete }: AccountSetupScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form data
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [birthTimeHour, setBirthTimeHour] = useState('');
  const [birthTimeMinute, setBirthTimeMinute] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [preferredLanguage, setPreferredLanguage] = useState('');

  // Animations
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentStep + 1) / STEP_CONFIG.length,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  const animateTransition = (direction: 'next' | 'prev', callback: () => void) => {
    const toValue = direction === 'next' ? -30 : 30;
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback();
      slideAnim.setValue(direction === 'next' ? 30 : -30);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 0: return fullName.trim().length >= 2;
      case 1: return gender !== '';
      case 2: return dobDay !== '' && dobMonth !== '' && dobYear.length === 4;
      case 3: return true; // Birth time is optional
      case 4: return birthPlace.trim().length >= 2;
      case 5: return maritalStatus !== '';
      case 6: return selectedConcerns.length > 0;
      case 7: return preferredLanguage !== '';
      default: return false;
    }
  };

  const handleNext = () => {
    setError('');
    if (currentStep < STEP_CONFIG.length - 1) {
      animateTransition('next', () => setCurrentStep(currentStep + 1));
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setError('');
    if (currentStep > 0) {
      animateTransition('prev', () => setCurrentStep(currentStep - 1));
    }
  };

  const toggleConcern = (concern: string) => {
    setSelectedConcerns((prev) =>
      prev.includes(concern)
        ? prev.filter((c) => c !== concern)
        : [...prev, concern]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      // Format date of birth
      const dob = `${dobYear}-${dobMonth.padStart(2, '0')}-${dobDay.padStart(2, '0')}`;

      // Format birth time (optional)
      let birthTime: string | null = null;
      if (birthTimeHour && birthTimeMinute) {
        birthTime = `${birthTimeHour.padStart(2, '0')}:${birthTimeMinute.padStart(2, '0')}`;
      }

      const profileData = {
        phone,
        full_name: fullName.trim(),
        gender,
        date_of_birth: dob,
        birth_time: birthTime,
        birth_place: birthPlace.trim(),
        marital_status: maritalStatus,
        primary_concerns: selectedConcerns.join(','),
        preferred_language: preferredLanguage,
      };

      await api.post('/profile', profileData);

      // Save profile completion flag locally
      await AsyncStorage.setItem('profileCompleted', 'true');
      await AsyncStorage.setItem('userPhone', phone);
      await AsyncStorage.setItem('userName', fullName.trim());

      onComplete();
    } catch (err: any) {
      console.error('Profile submission error:', err);
      setError(err.message || 'Failed to save profile. Please try again.');
      setIsSubmitting(false);
    }
  };

  const step = STEP_CONFIG[currentStep];
  const IconComponent = step.icon;

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Full Name
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <User size={20} color={Colors.textMuted} />
              <View style={styles.inputDivider} />
              <TextInput
                placeholder="Enter your full name"
                placeholderTextColor={Colors.textDisabled}
                style={styles.textInput}
                value={fullName}
                onChangeText={setFullName}
                maxLength={100}
                autoCapitalize="words"
                autoFocus
              />
            </View>
          </View>
        );

      case 1: // Gender
        return (
          <View style={styles.chipGrid}>
            {GENDERS.map((g) => (
              <TouchableOpacity
                key={g}
                style={[styles.chip, gender === g && styles.chipActive]}
                onPress={() => setGender(g)}
              >
                <Text style={styles.chipEmoji}>
                  {g === 'Male' ? '👨' : g === 'Female' ? '👩' : '🧑'}
                </Text>
                <Text style={[styles.chipText, gender === g && styles.chipTextActive]}>{g}</Text>
                {gender === g && (
                  <View style={styles.chipCheck}>
                    <Check size={14} color={Colors.primary} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        );

      case 2: // Date of Birth
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Date of Birth</Text>
            <View style={styles.dateRow}>
              <View style={[styles.dateInputWrapper, { flex: 1 }]}>
                <TextInput
                  placeholder="DD"
                  placeholderTextColor={Colors.textDisabled}
                  style={styles.dateInput}
                  value={dobDay}
                  onChangeText={(val) => setDobDay(val.replace(/\D/g, '').slice(0, 2))}
                  keyboardType="number-pad"
                  maxLength={2}
                />
              </View>
              <Text style={styles.dateSeparator}>/</Text>
              <View style={[styles.dateInputWrapper, { flex: 1 }]}>
                <TextInput
                  placeholder="MM"
                  placeholderTextColor={Colors.textDisabled}
                  style={styles.dateInput}
                  value={dobMonth}
                  onChangeText={(val) => setDobMonth(val.replace(/\D/g, '').slice(0, 2))}
                  keyboardType="number-pad"
                  maxLength={2}
                />
              </View>
              <Text style={styles.dateSeparator}>/</Text>
              <View style={[styles.dateInputWrapper, { flex: 2 }]}>
                <TextInput
                  placeholder="YYYY"
                  placeholderTextColor={Colors.textDisabled}
                  style={styles.dateInput}
                  value={dobYear}
                  onChangeText={(val) => setDobYear(val.replace(/\D/g, '').slice(0, 4))}
                  keyboardType="number-pad"
                  maxLength={4}
                />
              </View>
            </View>
          </View>
        );

      case 3: // Birth Time (Optional)
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Approximate Birth Time</Text>
            <View style={styles.dateRow}>
              <View style={[styles.dateInputWrapper, { flex: 1 }]}>
                <TextInput
                  placeholder="HH"
                  placeholderTextColor={Colors.textDisabled}
                  style={styles.dateInput}
                  value={birthTimeHour}
                  onChangeText={(val) => setBirthTimeHour(val.replace(/\D/g, '').slice(0, 2))}
                  keyboardType="number-pad"
                  maxLength={2}
                />
              </View>
              <Text style={styles.dateSeparator}>:</Text>
              <View style={[styles.dateInputWrapper, { flex: 1 }]}>
                <TextInput
                  placeholder="MM"
                  placeholderTextColor={Colors.textDisabled}
                  style={styles.dateInput}
                  value={birthTimeMinute}
                  onChangeText={(val) => setBirthTimeMinute(val.replace(/\D/g, '').slice(0, 2))}
                  keyboardType="number-pad"
                  maxLength={2}
                />
              </View>
            </View>
            <View style={styles.optionalBadge}>
              <Text style={styles.optionalText}>Skip if you don't know</Text>
            </View>
          </View>
        );

      case 4: // Birth Place
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Birth City / Place</Text>
            <View style={styles.inputWrapper}>
              <MapPin size={20} color={Colors.textMuted} />
              <View style={styles.inputDivider} />
              <TextInput
                placeholder="e.g. Varanasi, Jaipur, Mumbai"
                placeholderTextColor={Colors.textDisabled}
                style={styles.textInput}
                value={birthPlace}
                onChangeText={setBirthPlace}
                maxLength={100}
                autoCapitalize="words"
              />
            </View>
          </View>
        );

      case 5: // Marital Status
        return (
          <View style={styles.chipGrid}>
            {MARITAL_STATUSES.map((status) => (
              <TouchableOpacity
                key={status}
                style={[styles.chip, maritalStatus === status && styles.chipActive]}
                onPress={() => setMaritalStatus(status)}
              >
                <Text style={[styles.chipText, maritalStatus === status && styles.chipTextActive]}>
                  {status}
                </Text>
                {maritalStatus === status && (
                  <View style={styles.chipCheck}>
                    <Check size={14} color={Colors.primary} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        );

      case 6: // Primary Concerns (Multi-select)
        return (
          <View style={styles.chipGrid}>
            {CONCERNS.map((concern) => {
              const isSelected = selectedConcerns.includes(concern);
              return (
                <TouchableOpacity
                  key={concern}
                  style={[styles.chip, isSelected && styles.chipActive]}
                  onPress={() => toggleConcern(concern)}
                >
                  <Text style={styles.chipEmoji}>{CONCERN_EMOJIS[concern]}</Text>
                  <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                    {concern}
                  </Text>
                  {isSelected && (
                    <View style={styles.chipCheck}>
                      <Check size={14} color={Colors.primary} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
            <Text style={styles.multiSelectHint}>Select one or more</Text>
          </View>
        );

      case 7: // Preferred Language
        return (
          <View style={styles.chipGrid}>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[styles.chipLarge, preferredLanguage === lang && styles.chipActive]}
                onPress={() => setPreferredLanguage(lang)}
              >
                <Text style={styles.languageEmoji}>
                  {lang === 'Hindi' ? '🇮🇳' : lang === 'English' ? '🌐' : '🔄'}
                </Text>
                <Text style={[styles.chipTextLarge, preferredLanguage === lang && styles.chipTextActive]}>
                  {LANGUAGE_LABELS[lang]}
                </Text>
                {preferredLanguage === lang && (
                  <View style={styles.chipCheck}>
                    <Check size={14} color={Colors.primary} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {currentStep + 1} of {STEP_CONFIG.length}
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={[
              styles.cardContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            {/* Icon */}
            <View style={[styles.iconContainer, { backgroundColor: step.iconBg }]}>
              <IconComponent size={32} color={step.iconColor} />
            </View>

            {/* Title */}
            <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepDescription}>{step.description}</Text>

            {/* Step Content */}
            <View style={styles.stepContent}>
              {renderStepContent()}
            </View>

            {/* Error Message */}
            {error !== '' && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
          </Animated.View>
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.footer}>
          <View style={styles.buttonRow}>
            {currentStep > 0 ? (
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <ArrowLeft size={20} color={Colors.textSecondary} />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.backButtonPlaceholder} />
            )}

            <TouchableOpacity
              style={[
                styles.nextButton,
                !canProceed() && styles.nextButtonDisabled,
              ]}
              onPress={handleNext}
              disabled={!canProceed() || isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.nextButtonText}>
                    {currentStep === STEP_CONFIG.length - 1 ? 'Complete Setup' : 'Continue'}
                  </Text>
                  {currentStep === STEP_CONFIG.length - 1 ? (
                    <Check size={20} color="#fff" />
                  ) : (
                    <ArrowRight size={20} color="#fff" />
                  )}
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },

  // Progress
  progressContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
  },

  // Scroll
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },

  // Card
  cardContainer: {
    alignItems: 'center',
  },

  // Icon
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },

  // Titles
  stepSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
    maxWidth: 280,
  },

  // Step content
  stepContent: {
    width: '100%',
  },

  // Inputs
  inputContainer: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: Colors.surface,
  },
  inputDivider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.borderStrong,
    marginHorizontal: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
  },

  // Date inputs
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateInputWrapper: {
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: 16,
    height: 56,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  dateInput: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  dateSeparator: {
    fontSize: 24,
    fontWeight: '300',
    color: Colors.textDisabled,
  },

  // Optional badge
  optionalBadge: {
    marginTop: 16,
    alignItems: 'center',
  },
  optionalText: {
    fontSize: 13,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },

  // Chips
  chipGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    backgroundColor: Colors.surface,
    gap: 8,
    minWidth: '45%',
    flex: 1,
  },
  chipActive: {
    backgroundColor: Colors.surfaceTint,
    borderColor: Colors.primaryLight,
  },
  chipEmoji: {
    fontSize: 20,
  },
  chipText: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  chipTextActive: {
    color: Colors.primaryDark,
    fontWeight: '600',
  },
  chipCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.surfaceWarm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    backgroundColor: Colors.surface,
    gap: 12,
    width: '100%',
  },
  chipTextLarge: {
    fontSize: 17,
    color: Colors.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  languageEmoji: {
    fontSize: 24,
  },
  multiSelectHint: {
    width: '100%',
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textDisabled,
    marginTop: 4,
    fontStyle: 'italic',
  },

  // Error
  errorContainer: {
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.dangerBg,
    width: '100%',
  },
  errorText: {
    fontSize: 13,
    color: Colors.danger,
    textAlign: 'center',
  },

  // Footer
  footer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 8 : 24,
    paddingTop: 8,
    backgroundColor: Colors.background,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: Colors.border,
    gap: 4,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  backButtonPlaceholder: {
    width: 0,
  },
  nextButton: {
    flex: 1,
    flexDirection: 'row',
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
    gap: 8,
  },
  nextButtonDisabled: {
    opacity: 0.4,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
