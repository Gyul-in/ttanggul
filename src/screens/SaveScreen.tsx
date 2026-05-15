import { View, StyleSheet, FlatList, Pressable, Image, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path } from 'react-native-svg';
import { AppText } from '../components/AppText';
import { colors } from '../theme';

const CATEGORIES = [
  { id: '공감', name: '공감', image: require('../assets/illustrations/save-dudue-gongam.png') },
  { id: '위로', name: '위로', image: require('../assets/illustrations/save-dudue-wiro.png') },
  { id: '명언', name: '명언', image: require('../assets/illustrations/save-dudue-myungon.png') },
  { id: '동기부여', name: '동기부여', image: require('../assets/illustrations/save-dudue-donggi.png') },
  { id: '현실조언', name: '현실조언', image: require('../assets/illustrations/save-dudue-hyunsil.png') },
];

type Category = (typeof CATEGORIES)[0];

function FolderBackground({ size }: { size: number }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 174 174"
      fill="none"
      style={StyleSheet.absoluteFillObject}
    >
      <Path
        d="M174 28V73H68V12H158C166.837 12 174 19.163 174 28Z"
        fill="#EDE2CE"
      />
      <Path
        d="M0 158V16C0 7.16344 7.16344 0 16 0H82.7793C89.9945 0 96.317 4.82913 98.2155 11.7901L104.99 36.6312C106.177 40.9818 110.128 44 114.638 44H158C166.837 44 174 51.1634 174 60V158C174 166.837 166.837 174 158 174H16C7.16344 174 0 166.837 0 158Z"
        fill="#FFFCF7"
      />
    </Svg>
  );
}

function CategoryCard({ item, cardSize, scale }: { item: Category; cardSize: number; scale: number }) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const pad = Math.round(16 * scale);
  const illustSize = Math.round(90 * scale);

  return (
    <Pressable
      style={{ width: cardSize, height: cardSize }}
      onPress={() => navigation.navigate('CategoryDetail', { categoryName: item.name })}
    >
      <FolderBackground size={cardSize} />
      <View style={[styles.cardContent, { padding: pad }]}>
        <AppText variant="subTitle" color="black">{item.name}</AppText>
        <View style={styles.illustRow}>
          <Image
            source={item.image}
            style={{ width: illustSize, height: illustSize }}
            resizeMode="contain"
          />
        </View>
      </View>
    </Pressable>
  );
}

export default function SaveScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const scale = width / 402;
  const gap = Math.round(20 * scale);
  const padH = Math.round(20 * scale);
  const cardSize = Math.floor((width - padH * 2 - gap) / 2);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <AppText variant="subTitle" color="black">보관함</AppText>
      </View>
      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap }}
        ItemSeparatorComponent={() => <View style={{ height: gap }} />}
        renderItem={({ item }) => (
          <CategoryCard item={item} cardSize={cardSize} scale={scale} />
        )}
        contentContainerStyle={{
          paddingHorizontal: padH,
          paddingTop: Math.round(10 * scale),
          paddingBottom: Math.round(20 * scale),
        }}
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
  cardContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  illustRow: {
    alignItems: 'flex-end',
  },
});
