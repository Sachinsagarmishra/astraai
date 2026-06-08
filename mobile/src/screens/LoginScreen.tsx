import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Phone, Lock, ArrowRight } from 'lucide-react-native';

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = () => {
    if (phone.length < 10) return;
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 1000);
  };

  const handleVerifyOtp = () => {
    if (otp.length < 6) return;
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Logo/Icon */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>🕉️</Text>
        </View>

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to continue your spiritual journey</Text>

        {step === 'phone' ? (
          <View style={styles.form}>
            <Text style={styles.label}>Mobile Number</Text>
            <View style={styles.inputWrapper}>
              <Phone size={20} color="#78716c" />
              <View style={styles.divider} />
              <Text style={styles.countryCode}>+91</Text>
              <TextInput
                placeholder="Enter 10 digit number"
                placeholderTextColor="#a8a29e"
                keyboardType="phone-pad"
                maxLength={10}
                style={styles.input}
                value={phone}
                onChangeText={(val) => setPhone(val.replace(/\D/g, ''))}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, phone.length < 10 && styles.buttonDisabled]}
              onPress={handleSendOtp}
              disabled={phone.length < 10 || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.buttonText}>Send OTP</Text>
                  <ArrowRight size={20} color="#fff" />
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={styles.label}>Enter OTP</Text>
            <View style={styles.inputWrapper}>
              <Lock size={20} color="#78716c" />
              <View style={styles.divider} />
              <TextInput
                placeholder="Enter 6 digit OTP"
                placeholderTextColor="#a8a29e"
                keyboardType="number-pad"
                maxLength={6}
                style={[styles.input, styles.otpInput]}
                value={otp}
                onChangeText={(val) => setOtp(val.replace(/\D/g, ''))}
              />
            </View>

            <Text style={styles.infoText}>
              Sent to +91 {phone} •{' '}
              <Text style={styles.editText} onPress={() => setStep('phone')}>
                Edit
              </Text>
            </Text>

            <TouchableOpacity
              style={[styles.button, otp.length < 6 && styles.buttonDisabled]}
              onPress={handleVerifyOtp}
              disabled={otp.length < 6 || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.buttonText}>Verify & Login</Text>
                  <ArrowRight size={20} color="#fff" />
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFBF7',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FFEDD5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  logoText: {
    fontSize: 44,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1c1917',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#78716c',
    marginBottom: 44,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#f5f5f4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.03,
    shadowRadius: 16,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#44403c',
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e7e5e4',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: '#fff',
    marginBottom: 24,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: '#e7e5e4',
    marginHorizontal: 12,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#44403c',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1c1917',
  },
  otpInput: {
    letterSpacing: 4,
    fontWeight: '600',
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
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#78716c',
    textAlign: 'center',
    marginBottom: 20,
  },
  editText: {
    color: '#ea580c',
    fontWeight: '600',
  },
});
