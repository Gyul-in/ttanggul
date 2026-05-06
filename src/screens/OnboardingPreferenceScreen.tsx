import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';

const TAGS = [
  { id: 'sympathy', label: '#공감', desc: '내 마음이랑 똑같은 글이 필요할 때' },
  { id: 'comfort', label: '#위로', desc: '"괜찮아"라는 말이 듣고 싶을 때' },
  { id: 'motivation', label: '#동기부여', desc: '자극 받고 다시 움직이고 싶을 때' },
  { id: 'advice', label: '#현실조언', desc: '뼈 때리는 팩트 체크가 필요할 때' },
  { id: 'quote', label: '#명언', desc: '검증된 인생 지혜가 궁금할 때' },
];

export default function OnboardingPreferenceScreen({ navigation }: any) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (id: string) => {
    if (selectedTags.includes(id)) {
      setSelectedTags(selectedTags.filter((t) => t !== id));
    } else {
      setSelectedTags([...selectedTags, id]);
    }
  };

  const handleNext = () => {
    if (selectedTags.length > 0) {
      navigation.navigate('OnboardingNotification');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Navigation Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            {/* Pagination Tag */}
            <View style={styles.tagBadge}>
              <Text style={styles.tagBadgeText}>2/3</Text>
            </View>

            {/* Title */}
            <Text style={styles.title}>{'가장 힘이 되는 말을\n선택해 주세요'}</Text>
          </View>

          {/* Selectable Cards */}
          <View style={styles.cardList}>
            {TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag.id);
              return (
                <TouchableOpacity
                  key={tag.id}
                  style={[styles.card, isSelected && styles.cardSelected]}
                  onPress={() => toggleTag(tag.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.cardContent}>
                    <Text style={[styles.cardLabel, isSelected && styles.cardLabelSelected]}>
                      {tag.label}
                    </Text>
                    <Text style={[styles.cardDesc, isSelected && styles.cardDescSelected]}>
                      {tag.desc}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Bottom CTA Button */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[styles.ctaButton, selectedTags.length === 0 && styles.ctaButtonDisabled]}
            onPress={handleNext}
            disabled={selectedTags.length === 0}
          >
            <Text style={styles.ctaButtonText}>다음</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.brown100 },
  container: { flex: 1 },
  navBar: {
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 7,
  },
  backButton: { padding: 10, marginLeft: -10 },
  backButtonText: { fontSize: 24, color: theme.colors.gray900 },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    gap: 30,
  },
  headerSection: {
    alignItems: 'center',
    gap: 16,
  },
  tagBadge: {
    backgroundColor: theme.colors.brown200,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagBadgeText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.brown500,
    letterSpacing: -0.3,
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 26,
    lineHeight: 39,
    color: theme.colors.black,
    textAlign: 'center',
  },
  cardList: {
    gap: 12,
    alignItems: 'center',
  },
  card: {
    width: 362,
    height: 76,
    backgroundColor: '#FFFCF7',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  cardSelected: {
    backgroundColor: theme.colors.brown500,
  },
  cardContent: {
    gap: 2,
  },
  cardLabel: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    lineHeight: 27,
    color: '#6A6F6B', // Gray Scale/600
  },
  cardLabelSelected: {
    color: theme.colors.white,
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    lineHeight: 27,
  },
  cardDesc: {
    fontFamily: 'Pretendard-SemiBold',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
    color: '#858885', // Gray Scale/500
  },
  cardDescSelected: {
    color: theme.colors.white,
  },
  bottomContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 10,
  },
  ctaButton: {
    height: 56,
    backgroundColor: theme.colors.gray900,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaButtonDisabled: {
    opacity: 0.5,
  },
  ctaButtonText: {
    ...theme.typography.bodyXL_SB,
    color: theme.colors.white,
  },
});
