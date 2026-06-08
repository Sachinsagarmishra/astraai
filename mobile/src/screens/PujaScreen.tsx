import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Search, Filter, BookOpen, Clock, Star, CheckCircle, ChevronRight } from 'lucide-react-native';

interface PujaScreenProps {
  onSelectPuja: (id: number) => void;
}

export default function PujaScreen({ onSelectPuja }: PujaScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const categories = ['All', 'Daily', 'Deity', 'Occasion', 'Festival'];

  const pujas = [
    { id: 1, title: 'Daily Shiva Puja', category: 'Daily', deity: 'Shiva', duration: '15 mins', rating: 4.8, verified: true },
    { id: 2, title: 'Satyanarayan Katha', category: 'Occasion', deity: 'Vishnu', duration: '90 mins', rating: 4.9, verified: true },
    { id: 3, title: 'Ganesh Chaturthi Sthapana', category: 'Festival', deity: 'Ganesha', duration: '45 mins', rating: 5.0, verified: true },
    { id: 4, title: 'Navratri Ghatasthapana', category: 'Festival', deity: 'Durga', duration: '60 mins', rating: 4.7, verified: true },
    { id: 5, title: 'Hanuman Chalisa Path', category: 'Daily', deity: 'Hanuman', duration: '10 mins', rating: 4.9, verified: false },
  ];

  const filteredPujas = pujas.filter(puja => 
    (activeCategory === 'All' || puja.category === activeCategory) &&
    puja.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (!verifiedOnly || puja.verified)
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Puja Vidhi</Text>
          <Text style={styles.headerSubtitle}>Authentic step-by-step guides</Text>
        </View>
        <View style={styles.headerIconCircle}>
          <BookOpen size={20} color="#ea580c" />
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBarRow}>
        <View style={styles.searchContainer}>
          <Search size={18} color="#a8a29e" style={styles.searchIcon} />
          <TextInput
            placeholder="Search pujas, deities..."
            placeholderTextColor="#a8a29e"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilters(!showFilters)}>
            <Filter size={16} color={showFilters ? '#ea580c' : '#78716c'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Options Panel */}
      {showFilters && (
        <View style={styles.filterPanel}>
          <Text style={styles.filterLabel}>Verified Pujas Only</Text>
          <TouchableOpacity 
            style={[styles.toggleBtn, verifiedOnly && styles.toggleBtnActive]}
            onPress={() => setVerifiedOnly(!verifiedOnly)}
          >
            <View style={[styles.toggleCircle, verifiedOnly && styles.toggleCircleActive]} />
          </TouchableOpacity>
        </View>
      )}

      {/* Categories Horizontal Scroll */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryPill, activeCategory === cat && styles.categoryPillActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Puja Cards List */}
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filteredPujas.map((puja) => (
          <TouchableOpacity 
            key={puja.id} 
            style={styles.pujaCard}
            onPress={() => onSelectPuja(puja.id)}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleCol}>
                <View style={styles.tagRow}>
                  <Text style={styles.categoryTag}>{puja.category.toUpperCase()}</Text>
                  {puja.verified && (
                    <View style={styles.verifiedBadge}>
                      <CheckCircle size={10} color="#15803d" />
                      <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.pujaTitle}>{puja.title}</Text>
                <Text style={styles.deityText}>Deity: {puja.deity}</Text>
              </View>
              
              <View style={styles.omBadge}>
                <Text style={styles.omText}>🕉️</Text>
              </View>
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Clock size={12} color="#78716c" />
                  <Text style={styles.statText}>{puja.duration}</Text>
                </View>
                <View style={[styles.statItem, { marginLeft: 16 }]}>
                  <Star size={12} color="#eab308" fill="#eab308" />
                  <Text style={styles.statText}>{puja.rating}</Text>
                </View>
              </View>

              <View style={styles.startBtn}>
                <Text style={styles.startBtnText}>Start</Text>
                <ChevronRight size={14} color="#ea580c" />
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {filteredPujas.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No pujas found matching your filters.</Text>
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
  headerTitleContainer: {
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
  headerIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBarRow: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f4',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1c1917',
  },
  filterBtn: {
    padding: 6,
  },
  filterPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#f5f5f4',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#44403c',
  },
  toggleBtn: {
    width: 40,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#e7e5e4',
    position: 'relative',
    padding: 2,
  },
  toggleBtnActive: {
    backgroundColor: '#ea580c',
  },
  toggleCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff',
    position: 'absolute',
    left: 2,
    top: 2,
  },
  toggleCircleActive: {
    left: 20,
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#f5f5f4',
    paddingVertical: 10,
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f5f5f4',
  },
  categoryPillActive: {
    backgroundColor: '#ea580c',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#57534e',
  },
  categoryTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
    gap: 16,
  },
  pujaCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f5f5f4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.01,
    shadowRadius: 8,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#f5f5f4',
    paddingBottom: 12,
  },
  cardTitleCol: {
    flex: 1,
    paddingRight: 8,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  categoryTag: {
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
  pujaTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1c1917',
    marginBottom: 4,
  },
  deityText: {
    fontSize: 12,
    color: '#78716c',
  },
  omBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#fff7ed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  omText: {
    fontSize: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
  },
  statsRow: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#78716c',
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  startBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ea580c',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#78716c',
  },
});
