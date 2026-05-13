import { View, Text, FlatList, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography } from '../theme';

// 임시 고정 카테고리 - 추후 실제 데이터로 교체 예정
const CATEGORIES = [
  { id: '위로', name: '위로' },
  { id: '공감', name: '공감' },
  { id: '동기부여', name: '동기부여' },
  { id: '현실조언', name: '현실조언' },
  { id: '명언', name: '명언' },
];

type Category = { id: string; name: string };

function CategoryCard({ item, cardWidth }: { item: Category; cardWidth: number }) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  return (
    <Pressable
      style={[styles.card, { width: cardWidth, height: cardWidth }]}
      onPress={() => navigation.navigate('CategoryDetail', { categoryName: item.name })}
    >
      <Text style={styles.cardName}>{item.name}</Text>
    </Pressable>
  );
}

export default function SaveScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const cardWidth = Math.floor((width - 20 * 2 - 20) / 2);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>보관함</Text>
      </View>

      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        renderItem={({ item }) => <CategoryCard item={item} cardWidth={cardWidth} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain,
  },
  header: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    ...typography.subTitle,
    color: colors.black,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  row: {
    gap: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 17,
    padding: 12,
  },
  cardName: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    lineHeight: 27,
    color: colors.black,
  },
});
