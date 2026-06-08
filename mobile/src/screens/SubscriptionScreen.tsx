import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Check, Star, Shield, Crown, ArrowLeft } from 'lucide-react-native';

interface SubscriptionScreenProps {
  onBack: () => void;
}

export default function SubscriptionScreen({ onBack }: SubscriptionScreenProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const plans = [
    {
      id: 'seeker',
      name: 'Seeker',
      price: 'Free',
      features: ['5 Puja Vidhis', '5 Family Members', 'Basic Jaap Counter', 'Ad-supported'],
      icon: <Star size={20} color="#78716c" />,
      colorClass: '#f5f5f4',
      iconColorClass: '#78716c',
    },
    {
      id: 'devotee',
      name: 'Devotee',
      price: billingCycle === 'annual' ? '₹1,000/yr' : '₹101/mo',
      savings: billingCycle === 'annual' ? 'Save 17%' : null,
      features: ['All Puja Vidhis', 'Unlimited Family Members', 'Ad-free Experience', 'Full Jaap History'],
      icon: <Shield size={20} color="#10b981" />,
      colorClass: '#d1fae5',
      iconColorClass: '#10b981',
      popular: true,
    },
    {
      id: 'sadhak',
      name: 'Sadhak',
      price: billingCycle === 'annual' ? '₹2,500/yr' : '₹251/mo',
      savings: billingCycle === 'annual' ? 'Save 17%' : null,
      features: ['Everything in Devotee', 'Priority Support', 'Custom Reminders', 'Unlimited AI Palmistry'],
      icon: <Crown size={20} color="#f59e0b" fill="#f59e0b" />,
      colorClass: '#fef3c7',
      iconColorClass: '#f59e0b',
    },
    {
      id: 'guru',
      name: 'Guru Dakshina',
      price: billingCycle === 'annual' ? '₹5,000/yr' : '₹501/mo',
      savings: billingCycle === 'annual' ? 'Save 17%' : null,
      features: ['Everything in Sadhak', 'Monthly Panditji Consult', 'Physical Tulsi Mala Gift', 'Exclusive Content'],
      icon: <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#ea580c' }}>ॐ</Text>,
      colorClass: '#ffedd5',
      iconColorClass: '#ea580c',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color="#78716c" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Premium Plans</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Deepen Your Practice</Text>
          <Text style={styles.heroSubtitle}>Choose a plan that fits your spiritual journey.</Text>
        </View>

        {/* Billing Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleBtn, billingCycle === 'monthly' && styles.toggleBtnActive]}
            onPress={() => setBillingCycle('monthly')}
          >
            <Text style={[styles.toggleText, billingCycle === 'monthly' && styles.toggleTextActive]}>Monthly</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.toggleBtn, billingCycle === 'annual' && styles.toggleBtnActive, { position: 'relative' }]}
            onPress={() => setBillingCycle('annual')}
          >
            <Text style={[styles.toggleText, billingCycle === 'annual' && styles.toggleTextActive]}>Annual</Text>
            <View style={styles.saveBadge}>
              <Text style={styles.saveBadgeText}>SAVE 17%</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Plans List */}
        <View style={styles.plansList}>
          {plans.map((plan) => (
            <View
              key={plan.id}
              style={[
                styles.planCard,
                plan.popular && styles.planCardPopular
              ]}
            >
              {plan.popular && (
                <View style={styles.popularRibbon}>
                  <Text style={styles.popularRibbonText}>MOST POPULAR</Text>
                </View>
              )}

              <View style={styles.planHeader}>
                <View style={[styles.planIconCircle, { backgroundColor: plan.colorClass }]}>
                  {plan.icon}
                </View>
                <View style={styles.planHeaderInfo}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.planPrice}>{plan.price}</Text>
                    {plan.savings && (
                      <View style={styles.savingsBadge}>
                        <Text style={styles.savingsBadgeText}>{plan.savings}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.featuresList}>
                {plan.features.map((feature, idx) => (
                  <View key={idx} style={styles.featureItem}>
                    <Check size={16} color={plan.iconColorClass} style={styles.checkIcon} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={[
                  styles.selectBtn,
                  plan.id === 'seeker' && styles.seekerBtn,
                  plan.popular && styles.popularBtn,
                  plan.id === 'guru' && styles.guruBtn
                ]}
              >
                <Text
                  style={[
                    styles.selectBtnText,
                    plan.id === 'seeker' && styles.seekerBtnText,
                    (plan.popular || plan.id === 'guru') && styles.popularBtnText
                  ]}
                >
                  {plan.id === 'seeker' ? 'Current Plan' : 'Select Plan'}
                </Text>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1c1917',
    marginLeft: 8,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1c1917',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#78716c',
    textAlign: 'center',
    paddingHorizontal: 24,
    lineHeight: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f4',
    padding: 4,
    borderRadius: 12,
    maxWidth: 280,
    alignSelf: 'center',
    marginBottom: 32,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleBtnActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#78716c',
  },
  toggleTextActive: {
    color: '#1c1917',
    fontWeight: '600',
  },
  saveBadge: {
    position: 'absolute',
    top: -12,
    right: -10,
    backgroundColor: '#d1fae5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  saveBadgeText: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#065f46',
  },
  plansList: {
    gap: 20,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    borderColor: '#f5f5f4',
    position: 'relative',
    overflow: 'hidden',
  },
  planCardPopular: {
    borderColor: '#f97316',
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  popularRibbon: {
    position: 'absolute',
    top: 12,
    right: -24,
    backgroundColor: '#ea580c',
    paddingVertical: 4,
    paddingHorizontal: 24,
    transform: [{ rotate: '45deg' }],
  },
  popularRibbonText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planHeaderInfo: {
    marginLeft: 16,
    flex: 1,
  },
  planName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1c1917',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 6,
  },
  planPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#44403c',
  },
  savingsBadge: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  savingsBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#0369a1',
  },
  divider: {
    height: 1,
    backgroundColor: '#f5f5f4',
    marginVertical: 20,
  },
  featuresList: {
    gap: 12,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    marginRight: 10,
  },
  featureText: {
    fontSize: 14,
    color: '#57534e',
  },
  selectBtn: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#1c1917',
    justifyContent: 'center',
    alignItems: 'center',
  },
  seekerBtn: {
    backgroundColor: '#f5f5f4',
  },
  popularBtn: {
    backgroundColor: '#ea580c',
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  guruBtn: {
    backgroundColor: '#1c1917',
  },
  selectBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  seekerBtnText: {
    color: '#78716c',
  },
  popularBtnText: {
    color: '#fff',
  },
});
