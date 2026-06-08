import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { ArrowLeft, Clock, Star, CheckCircle, Circle, Info, Play } from 'lucide-react-native';

const pujaDetailsDB = {
  1: {
    title: 'Daily Shiva Puja', deity: 'Shiva', duration: '15 mins', rating: 4.8, verified: true,
    overview: 'A simple daily puja dedicated to Lord Shiva for peace, prosperity, and spiritual growth. Best performed in the morning after a bath.',
    samagri: [
      { id: 1, name: 'Shiva Linga or Idol', checked: false },
      { id: 2, name: 'Fresh Water (Jal) in a copper vessel', checked: false },
      { id: 3, name: 'Raw Milk', checked: false },
      { id: 4, name: 'Bilva Patra (Bael leaves)', checked: false },
      { id: 5, name: 'Sandalwood paste (Chandan)', checked: false },
      { id: 6, name: 'Incense sticks (Agarbatti) & Diya', checked: false }
    ],
    steps: [
      { step: 1, title: 'Achamana (Purification)', instruction: 'Take three sips of water from your right hand, chanting:', mantra: 'Om Keshavaya Namah, Om Narayanaya Namah, Om Madhavaya Namah' },
      { step: 2, title: 'Sankalpa', instruction: 'Take some water and rice in your right hand and state your intent for the puja.' },
      { step: 3, title: 'Abhishekam', instruction: 'Bathe the Shiva Linga with water, then milk, and again with water while chanting:', mantra: 'Om Namah Shivaya' },
      { step: 4, title: 'Offering (Upachara)', instruction: 'Apply Chandan, offer Bilva Patra (with the smooth side facing down), and light the Diya and Agarbatti.' },
      { step: 5, title: 'Aarti & Kshama Prarthana', instruction: 'Perform Aarti and ask for forgiveness for any mistakes made during the puja.' }
    ]
  }
};

interface PujaDetailScreenProps {
  pujaId: number;
  onBack: () => void;
}

export default function PujaDetailScreen({ pujaId, onBack }: PujaDetailScreenProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'samagri' | 'vidhi'>('overview');
  
  const basePuja = pujaDetailsDB[pujaId as keyof typeof pujaDetailsDB] || {
    title: 'Puja Vidhi', deity: 'Various', duration: '30 mins', rating: 4.5, verified: false,
    overview: 'Detailed instructions for this puja will be available soon.',
    samagri: [{ id: 1, name: 'Basic Puja Samagri Kit', checked: false }],
    steps: [{ step: 1, title: 'Preparation', instruction: 'Clean the puja area and gather all materials.' }]
  };

  const [samagri, setSamagri] = useState(basePuja.samagri);

  const toggleSamagri = (id: number) => {
    setSamagri(samagri.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const allChecked = samagri.every(s => s.checked);

  const handleComplete = () => {
    Alert.alert(
      "Puja Completed!",
      "May you be blessed with peace and prosperity.",
      [{ text: "OK", onPress: onBack }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color="#78716c" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <View style={styles.tagRow}>
            <Text style={styles.deityTag}>{basePuja.deity.toUpperCase()}</Text>
            {basePuja.verified && (
              <View style={styles.verifiedBadge}>
                <CheckCircle size={10} color="#15803d" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>
          <Text style={styles.headerTitle}>{basePuja.title}</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {(['overview', 'samagri', 'vidhi'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'overview' && (
          <View style={styles.tabContent}>
            <View style={styles.overviewCard}>
              <Text style={styles.sectionTitle}>About this Puja</Text>
              <Text style={styles.overviewText}>{basePuja.overview}</Text>
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Clock size={16} color="#78716c" />
                  <Text style={styles.statLabel}>Duration</Text>
                  <Text style={styles.statValue}>{basePuja.duration}</Text>
                </View>
                <View style={styles.statBox}>
                  <Star size={16} color="#eab308" fill="#eab308" />
                  <Text style={styles.statLabel}>Rating</Text>
                  <Text style={styles.statValue}>{basePuja.rating}</Text>
                </View>
              </View>
            </View>

            <View style={styles.infoCard}>
              <Info size={24} color="#ea580c" />
              <View style={styles.infoCardContent}>
                <Text style={styles.infoCardTitle}>Before you begin</Text>
                <Text style={styles.infoCardDesc}>
                  Ensure you have taken a bath, wear clean clothes, and sit facing East or North. Keep all Samagri ready before starting the Vidhi.
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={() => setActiveTab('samagri')}>
              <Text style={styles.primaryBtnText}>Check Samagri List</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'samagri' && (
          <View style={styles.tabContent}>
            <View style={styles.checklistHeader}>
              <Text style={styles.sectionTitle}>Required Items</Text>
              <Text style={styles.checklistCounter}>
                {samagri.filter(s => s.checked).length} / {samagri.length} Ready
              </Text>
            </View>

            <View style={styles.checklistCard}>
              {samagri.map((item, idx) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.checklistItem,
                    item.checked && styles.checklistItemChecked,
                    idx === samagri.length - 1 && { borderBottomWidth: 0 }
                  ]}
                  onPress={() => toggleSamagri(item.id)}
                >
                  {item.checked ? (
                    <CheckCircle size={20} color="#10b981" />
                  ) : (
                    <Circle size={20} color="#d6d3d1" />
                  )}
                  <Text style={[styles.checklistText, item.checked && styles.checklistTextChecked]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, !allChecked && styles.disabledBtn]}
              onPress={() => setActiveTab('vidhi')}
              disabled={!allChecked}
            >
              <Text style={styles.primaryBtnText}>
                {allChecked ? 'Start Vidhi' : 'Gather all items to start'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'vidhi' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Step-by-Step Guide</Text>
            
            {basePuja.steps.map((step, idx) => (
              <View key={step.step} style={styles.stepContainer}>
                {/* Visual Line */}
                {idx !== basePuja.steps.length - 1 && <View style={styles.stepLine} />}
                
                {/* Step Circle */}
                <View style={styles.stepNumberCircle}>
                  <Text style={styles.stepNumberText}>{step.step}</Text>
                </View>

                {/* Step Details */}
                <View style={styles.stepDetailsCard}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepInstruction}>{step.instruction}</Text>
                  
                  {step.mantra && (
                    <View style={styles.mantraBox}>
                      <View style={styles.mantraHeader}>
                        <Play size={12} color="#ea580c" fill="#ea580c" />
                        <Text style={styles.mantraTag}>CHANT</Text>
                      </View>
                      <Text style={styles.mantraText}>"{step.mantra}"</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}

            <TouchableOpacity style={[styles.primaryBtn, styles.successBtn]} onPress={handleComplete}>
              <CheckCircle size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.primaryBtnText}>Complete Puja</Text>
            </TouchableOpacity>
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
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderColor: '#f5f5f4',
    backgroundColor: '#fff',
  },
  backBtn: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitleContainer: {
    marginLeft: 8,
    flex: 1,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  deityTag: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#ea580c',
    letterSpacing: 1,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  verifiedText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#15803d',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1c1917',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f4',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 4,
    borderRadius: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#78716c',
  },
  tabTextActive: {
    color: '#1c1917',
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  tabContent: {
    gap: 16,
  },
  overviewCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f5f5f4',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1c1917',
    marginBottom: 8,
  },
  overviewText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#57534e',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f5f5f4',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: '#78716c',
    marginTop: 4,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1c1917',
    marginTop: 2,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#ffedd5',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  infoCardContent: {
    flex: 1,
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#c2410c',
    marginBottom: 4,
  },
  infoCardDesc: {
    fontSize: 13,
    lineHeight: 18,
    color: '#7c2d12',
  },
  primaryBtn: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#ea580c',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  successBtn: {
    backgroundColor: '#059669',
    shadowColor: '#059669',
    flexDirection: 'row',
    marginTop: 16,
  },
  disabledBtn: {
    backgroundColor: '#e7e5e4',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Checklist tab styles
  checklistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  checklistCounter: {
    fontSize: 13,
    fontWeight: '500',
    color: '#78716c',
  },
  checklistCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f5f5f4',
    overflow: 'hidden',
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#f5f5f4',
    gap: 12,
  },
  checklistItemChecked: {
    backgroundColor: '#FAF9F6',
  },
  checklistText: {
    fontSize: 14,
    color: '#44403c',
    flex: 1,
  },
  checklistTextChecked: {
    color: '#a8a29e',
    textDecorationLine: 'line-through',
  },
  // Step/Vidhi tab styles
  stepContainer: {
    flexDirection: 'row',
    position: 'relative',
    paddingLeft: 36,
    marginBottom: 20,
  },
  stepLine: {
    position: 'absolute',
    left: 14,
    top: 28,
    bottom: -20,
    width: 1,
    backgroundColor: '#e7e5e4',
  },
  stepNumberCircle: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffedd5',
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ea580c',
  },
  stepDetailsCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f5f5f4',
    borderRadius: 16,
    padding: 16,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1c1917',
    marginBottom: 4,
  },
  stepInstruction: {
    fontSize: 13,
    color: '#57534e',
    lineHeight: 18,
  },
  mantraBox: {
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#ffedd5',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
  },
  mantraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  mantraTag: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#ea580c',
    letterSpacing: 1,
  },
  mantraText: {
    fontSize: 13,
    fontWeight: '600',
    fontStyle: 'italic',
    color: '#7c2d12',
    lineHeight: 18,
  },
});
