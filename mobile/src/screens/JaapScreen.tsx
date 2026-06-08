import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Vibration, SafeAreaView } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { Settings, RotateCcw, Play, Pause, ChevronDown, CheckCircle } from 'lucide-react-native';

export default function JaapScreen() {
  const [count, setCount] = useState(0);
  const [goal, setGoal] = useState(108);
  const [mantra, setMantra] = useState('Om Namah Shivaya');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const mantras = [
    'Om Namah Shivaya',
    'Om Bhur Bhuva Swaha (Gayatri)',
    'Hare Krishna Hare Rama',
    'Om Gan Ganapataye Namo Namah',
    'Om Namo Bhagavate Vasudevaya'
  ];

  const goals = [108, 216, 540, 1080];

  const handleTap = () => {
    if (count < goal) {
      setCount(prev => prev + 1);
      Vibration.vibrate(50);
    }
  };

  useEffect(() => {
    if (count === goal && count > 0) {
      setShowCelebration(true);
      setIsPlaying(false);
      Vibration.vibrate([0, 100, 50, 100, 50, 200]);
      setTimeout(() => setShowCelebration(false), 4000);
    }
  }, [count, goal]);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCount(prev => {
          if (prev < goal) {
            Vibration.vibrate(40);
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 600);
    }
    return () => clearInterval(interval);
  }, [isPlaying, goal]);

  const handleResetRequest = () => {
    if (count > 0) {
      setShowConfirmReset(true);
    }
  };

  const confirmReset = () => {
    setCount(0);
    setIsPlaying(false);
    setShowConfirmReset(false);
  };

  const progress = (count / goal) * 100;
  const totalBeads = 108;
  const activeBeads = Math.floor((count / goal) * totalBeads);

  // Generate coordinates for 108 beads on a circle of radius 110, center (125, 125)
  const beadsCoords = [];
  const cx = 125;
  const cy = 125;
  const r = 105;

  for (let i = 0; i < totalBeads; i++) {
    // Start from top (-90 degrees / -PI/2)
    const angle = (i / totalBeads) * Math.PI * 2 - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    beadsCoords.push({ x, y, active: i < activeBeads });
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Digital Mala</Text>
          <Text style={styles.headerSubtitle}>Focus your mind</Text>
        </View>
        <TouchableOpacity style={styles.settingsBtn} onPress={() => setIsSettingsOpen(true)}>
          <Settings size={20} color="#78716c" />
        </TouchableOpacity>
      </View>

      {/* Main Counter & Mala Track */}
      <View style={styles.counterContainer}>
        <Text style={styles.mantraLabel}>{mantra}</Text>
        <Text style={styles.goalLabel}>Goal: {goal}</Text>

        <TouchableOpacity activeOpacity={0.9} style={styles.tapArea} onPress={handleTap}>
          {/* SVG Mala */}
          <Svg style={styles.svgTrack} width={250} height={250} viewBox="0 0 250 250">
            {/* Background Circle */}
            <Circle cx={125} cy={125} r={105} fill="none" stroke="#f5f5f4" strokeWidth={3} />
            
            {/* Active Progress Circle Arc */}
            {/* A simple circle with strokeDasharray is easier, but here we can render individual beads for true Mala feel */}
            {beadsCoords.map((bead, i) => (
              <Circle
                key={i}
                cx={bead.x}
                cy={bead.y}
                r={bead.active ? 3 : 2}
                fill={bead.active ? '#ea580c' : '#d6d3d1'}
              />
            ))}
            
            {/* Guru Bead (Top Bead) */}
            <Circle cx={125} cy={20} r={5} fill="#c2410c" />
          </Svg>

          {/* Center Text */}
          <View style={styles.centerDisc}>
            <Text style={styles.countText}>{count}</Text>
            <Text style={styles.tapHelperText}>TAP TO COUNT</Text>
          </View>
        </TouchableOpacity>

        {/* Controls */}
        <View style={styles.controlsRow}>
          <TouchableOpacity style={styles.controlBtn} onPress={handleResetRequest}>
            <RotateCcw size={20} color="#78716c" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.playBtn, isPlaying && styles.pauseActiveBtn]}
            onPress={() => setIsPlaying(!isPlaying)}
            disabled={count >= goal}
          >
            {isPlaying ? (
              <Pause size={24} color="#fff" />
            ) : (
              <Play style={{ marginLeft: 2 }} size={24} color="#fff" />
            )}
          </TouchableOpacity>

          <View style={{ width: 44, height: 44 }} />
        </View>
      </View>

      {/* Settings Modal */}
      <Modal visible={isSettingsOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Mantra & Goal Settings</Text>

            <Text style={styles.modalLabel}>Select Mantra</Text>
            {mantras.map((m) => (
              <TouchableOpacity
                key={m}
                style={[styles.optionItem, mantra === m && styles.optionItemActive]}
                onPress={() => setMantra(m)}
              >
                <Text style={[styles.optionText, mantra === m && styles.optionTextActive]}>{m}</Text>
              </TouchableOpacity>
            ))}

            <Text style={[styles.modalLabel, { marginTop: 20 }]}>Select Goal</Text>
            <View style={styles.goalsRow}>
              {goals.map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.goalBtn, goal === g && styles.goalBtnActive]}
                  onPress={() => {
                    setGoal(g);
                    setCount(0);
                  }}
                >
                  <Text style={[styles.goalBtnText, goal === g && styles.goalBtnTextActive]}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={() => setIsSettingsOpen(false)}>
              <Text style={styles.closeBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Reset Confirmation Modal */}
      <Modal visible={showConfirmReset} transparent animationType="fade">
        <View style={styles.alertOverlay}>
          <View style={styles.alertCard}>
            <Text style={styles.alertTitle}>Reset Count?</Text>
            <Text style={styles.alertDesc}>Are you sure you want to reset your Jaap count back to zero?</Text>
            <View style={styles.alertActions}>
              <TouchableOpacity style={styles.alertCancel} onPress={() => setShowConfirmReset(false)}>
                <Text style={styles.alertCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.alertConfirm} onPress={confirmReset}>
                <Text style={styles.alertConfirmText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Celebration Modal */}
      <Modal visible={showCelebration} transparent animationType="fade">
        <View style={styles.celebrationOverlay}>
          <View style={styles.celebrationCard}>
            <CheckCircle size={56} color="#16a34a" />
            <Text style={styles.celebrationTitle}>Goal Reached!</Text>
            <Text style={styles.celebrationDesc}>
              You have successfully completed {goal} jaaps of {mantra}.
            </Text>
            <TouchableOpacity
              style={styles.celebrationClose}
              onPress={() => {
                setShowCelebration(false);
                setCount(0);
              }}
            >
              <Text style={styles.celebrationCloseText}>Start New Session</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  headerSubtitle: {
    fontSize: 12,
    color: '#78716c',
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  mantraLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1c1917',
    textAlign: 'center',
    marginBottom: 4,
  },
  goalLabel: {
    fontSize: 14,
    color: '#78716c',
    marginBottom: 40,
  },
  tapArea: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  svgTrack: {
    position: 'absolute',
  },
  centerDisc: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#ffedd5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
  },
  countText: {
    fontSize: 52,
    fontWeight: '700',
    color: '#1c1917',
  },
  tapHelperText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ea580c',
    letterSpacing: 1,
    marginTop: 4,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 56,
    gap: 32,
  },
  controlBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e7e5e4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ea580c',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  pauseActiveBtn: {
    backgroundColor: '#c2410c',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1c1917',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#78716c',
    letterSpacing: 1,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  optionItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e7e5e4',
    marginBottom: 8,
  },
  optionItemActive: {
    borderColor: '#ffedd5',
    backgroundColor: '#fff7ed',
  },
  optionText: {
    fontSize: 14,
    color: '#44403c',
  },
  optionTextActive: {
    color: '#c2410c',
    fontWeight: '600',
  },
  goalsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  goalBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e7e5e4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalBtnActive: {
    borderColor: '#ffedd5',
    backgroundColor: '#fff7ed',
  },
  goalBtnText: {
    fontSize: 14,
    color: '#57534e',
  },
  goalBtnTextActive: {
    color: '#c2410c',
    fontWeight: '600',
  },
  closeBtn: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#ea580c',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  closeBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Alert Styles
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertCard: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1c1917',
    marginBottom: 8,
  },
  alertDesc: {
    fontSize: 14,
    color: '#78716c',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  alertActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  alertCancel: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f5f5f4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#44403c',
  },
  alertConfirm: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertConfirmText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  // Celebration Styles
  celebrationOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  celebrationCard: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  celebrationTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1c1917',
    marginTop: 16,
    marginBottom: 8,
  },
  celebrationDesc: {
    fontSize: 14,
    color: '#78716c',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  celebrationClose: {
    height: 48,
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#ea580c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  celebrationCloseText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
