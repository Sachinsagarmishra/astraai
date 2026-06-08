import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, ActivityIndicator, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Sparkles, Upload, ArrowLeft, Heart, Coins, Activity, AlertCircle } from 'lucide-react-native';
import { api } from '../services/api';

// Simple Markdown Parser Component for React Native to avoid installing heavy external packages
const MarkdownRenderer = ({ text }: { text: string }) => {
  const lines = text.split('\n');

  return (
    <View style={styles.markdownContainer}>
      {lines.map((line, idx) => {
        // Headers: ### Header
        if (line.startsWith('###')) {
          return (
            <Text key={idx} style={styles.mdH3}>
              {line.replace('###', '').trim()}
            </Text>
          );
        }
        if (line.startsWith('##')) {
          return (
            <Text key={idx} style={styles.mdH2}>
              {line.replace('##', '').trim()}
            </Text>
          );
        }
        if (line.startsWith('#')) {
          return (
            <Text key={idx} style={styles.mdH1}>
              {line.replace('#', '').trim()}
            </Text>
          );
        }

        // Bullet point: * Point or - Point
        if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
          const content = line.trim().substring(1).trim();
          return (
            <View key={idx} style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{renderBoldText(content)}</Text>
            </View>
          );
        }

        // Empty line
        if (line.trim() === '') {
          return <View key={idx} style={{ height: 8 }} />;
        }

        // Regular line
        return (
          <Text key={idx} style={styles.mdParagraph}>
            {renderBoldText(line)}
          </Text>
        );
      })}
    </View>
  );
};

// Function to parse and style bold text "**text**" in React Native Text component
const renderBoldText = (text: string) => {
  const parts = text.split('**');
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return (
        <Text key={i} style={styles.boldText}>
          {part}
        </Text>
      );
    }
    return part;
  });
};

export default function PalmReadingScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reading, setReading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePickImage = async () => {
    // Request permission first
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library is required to select a palm photo!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      const asset = result.assets[0];
      setImageUri(asset.uri);
      if (asset.base64) {
        setImageBase64(`data:image/jpeg;base64,${asset.base64}`);
      }
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access the camera is required to take a photo of your palm!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      const asset = result.assets[0];
      setImageUri(asset.uri);
      if (asset.base64) {
        setImageBase64(`data:image/jpeg;base64,${asset.base64}`);
      }
    }
  };

  const handleGetReading = async () => {
    if (!imageBase64) return;
    setIsAnalyzing(true);
    setError(null);
    setReading(null);

    try {
      const res = await api.post<{ reading: string }>('/palm-reading', { imageBase64 });
      setReading(res.reading);
    } catch (err: any) {
      setError(err.message || 'Failed to get palm reading from server.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setImageUri(null);
    setImageBase64(null);
    setReading(null);
    setError(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTextCol}>
          <Text style={styles.headerTitle}>AI Palmistry</Text>
          <Text style={styles.headerSubtitle}>Discover your Vedic destiny</Text>
        </View>
        <Sparkles size={24} color="#9333ea" />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {!imageUri ? (
          <View style={styles.uploadCard}>
            <View style={styles.uploadIconCircle}>
              <Sparkles size={32} color="#9333ea" />
            </View>
            <Text style={styles.uploadTitle}>Unlock Your Future</Text>
            <Text style={styles.uploadDesc}>
              Upload a clear photo of your dominant palm. Our AI, combined with Vedic astrology, will analyze your life, heart, head, and fate lines.
            </Text>

            <TouchableOpacity style={styles.uploadBtn} onPress={handlePickImage}>
              <Upload size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.uploadBtnText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.uploadBtn, styles.cameraBtn]} onPress={handleTakePhoto}>
              <Text style={styles.cameraBtnText}>Take a Photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.previewContainer}>
            <View style={styles.imageWrapper}>
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
              <TouchableOpacity style={styles.backBtn} onPress={handleReset}>
                <ArrowLeft size={16} color="#fff" />
              </TouchableOpacity>
            </View>

            {error && (
              <View style={styles.errorCard}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {!reading && !isAnalyzing && (
              <TouchableOpacity style={styles.analyzeBtn} onPress={handleGetReading}>
                <Sparkles size={18} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.analyzeBtnText}>Analyze My Destiny</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {isAnalyzing && (
          <View style={styles.loaderCard}>
            <ActivityIndicator size="large" color="#9333ea" />
            <Text style={styles.loaderTitle}>Connecting with cosmic energies...</Text>
            <Text style={styles.loaderDesc}>Mapping life and fate lines</Text>
          </View>
        )}

        {reading && (
          <View style={styles.readingCard}>
            <View style={styles.readingHeader}>
              <Sparkles size={20} color="#9333ea" />
              <Text style={styles.readingTitle}>Your Vedic Reading</Text>
            </View>
            <MarkdownRenderer text={reading} />

            <TouchableOpacity style={styles.newReadingBtn} onPress={handleReset}>
              <Text style={styles.newReadingBtnText}>New Scan</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Feature Cards Grid (How it works) */}
        {!imageUri && !reading && (
          <View style={styles.howItWorks}>
            <Text style={styles.sectionTitle}>HOW IT WORKS</Text>
            <View style={styles.featuresGrid}>
              <View style={styles.featureBox}>
                <Heart size={20} color="#f43f5e" />
                <Text style={styles.featureTitle}>Love & Relationships</Text>
                <Text style={styles.featureDesc}>Analyzes the Heart Line for emotional depth and bonds.</Text>
              </View>
              <View style={styles.featureBox}>
                <Coins size={20} color="#eab308" />
                <Text style={styles.featureTitle}>Wealth & Career</Text>
                <Text style={styles.featureDesc}>Traces the Fate Line for financial stability and success.</Text>
              </View>
              <View style={styles.featureBox}>
                <Activity size={20} color="#10b981" />
                <Text style={styles.featureTitle}>Health & Vitality</Text>
                <Text style={styles.featureDesc}>Examines the Life Line for energy levels and well-being.</Text>
              </View>
              <View style={styles.featureBox}>
                <AlertCircle size={20} color="#6366f1" />
                <Text style={styles.featureTitle}>Doshas & Hurdles</Text>
                <Text style={styles.featureDesc}>Identifies cosmic markings to overcome life's challenges.</Text>
              </View>
            </View>
          </View>
        )}
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
  headerTextCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1c1917',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#78716c',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  uploadCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f5f5f4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  uploadIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FAF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1c1917',
    marginBottom: 8,
  },
  uploadDesc: {
    fontSize: 14,
    color: '#78716c',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  uploadBtn: {
    flexDirection: 'row',
    width: '100%',
    height: 52,
    borderRadius: 12,
    backgroundColor: '#9333ea',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  uploadBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cameraBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d8b4fe',
  },
  cameraBtnText: {
    color: '#9333ea',
    fontSize: 16,
    fontWeight: '600',
  },
  previewContainer: {
    width: '100%',
    marginBottom: 24,
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e7e5e4',
    marginBottom: 16,
  },
  previewImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  backBtn: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyzeBtn: {
    flexDirection: 'row',
    height: 52,
    borderRadius: 12,
    backgroundColor: '#9333ea',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#9333ea',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 3,
  },
  analyzeBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loaderCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f5f5f4',
    marginBottom: 24,
  },
  loaderTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#44403c',
    marginTop: 16,
    marginBottom: 4,
  },
  loaderDesc: {
    fontSize: 12,
    color: '#78716c',
  },
  errorCard: {
    backgroundColor: '#fff1f2',
    borderColor: '#ffe4e6',
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#be123c',
    fontSize: 14,
    textAlign: 'center',
  },
  readingCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f3e8ff',
    shadowColor: '#9333ea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.02,
    shadowRadius: 16,
    elevation: 3,
    marginBottom: 24,
  },
  readingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#f3e8ff',
    paddingBottom: 12,
    marginBottom: 16,
    gap: 8,
  },
  readingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1c1917',
  },
  newReadingBtn: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f5f5f4',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  newReadingBtnText: {
    color: '#57534e',
    fontSize: 15,
    fontWeight: '600',
  },
  // Feature Cards How it works
  howItWorks: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#78716c',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureBox: {
    width: '48%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f5f5f4',
    borderRadius: 16,
    padding: 14,
    minHeight: 120,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1c1917',
    marginTop: 8,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 10,
    color: '#78716c',
    lineHeight: 14,
  },
  // Custom Markdown CSS classes
  markdownContainer: {
    width: '100%',
  },
  mdH1: {
    fontSize: 22,
    fontWeight: '700',
    color: '#581c87',
    marginTop: 16,
    marginBottom: 8,
  },
  mdH2: {
    fontSize: 18,
    fontWeight: '700',
    color: '#581c87',
    marginTop: 14,
    marginBottom: 6,
  },
  mdH3: {
    fontSize: 15,
    fontWeight: '700',
    color: '#581c87',
    marginTop: 12,
    marginBottom: 4,
  },
  mdParagraph: {
    fontSize: 14,
    color: '#44403c',
    lineHeight: 22,
    marginBottom: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    paddingLeft: 8,
  },
  bulletDot: {
    fontSize: 14,
    color: '#9333ea',
    marginRight: 6,
    marginTop: 1,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: '#44403c',
    lineHeight: 20,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#1c1917',
  },
});
