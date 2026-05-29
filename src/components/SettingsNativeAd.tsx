import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { NativeAd, NativeAdView, NativeAsset, NativeAssetType } from 'react-native-google-mobile-ads';
import { colors } from '../theme';
import { AppText } from './AppText';

const AD_UNIT_ID = 'ca-app-pub-2984118511359695/6312205593';

export default function SettingsNativeAd() {
  const [nativeAd, setNativeAd] = useState<NativeAd | null>(null);

  useEffect(() => {
    NativeAd.createForAdRequest(AD_UNIT_ID)
      .then(setNativeAd)
      .catch(() => {});
  }, []);

  if (!nativeAd) return <View style={styles.wrapper} />;

  return (
    <View style={styles.wrapper}>
      <NativeAdView nativeAd={nativeAd} style={styles.container}>
        {/* 아이콘 */}
        {nativeAd.icon?.url && (
          <NativeAsset assetType={NativeAssetType.ICON}>
            <Image source={{ uri: nativeAd.icon.url }} style={styles.icon} />
          </NativeAsset>
        )}

        {/* 텍스트 영역 */}
        <View style={styles.textArea}>
          <NativeAsset assetType={NativeAssetType.HEADLINE}>
            <Text style={styles.headline} numberOfLines={1}>{nativeAd.headline}</Text>
          </NativeAsset>
          {nativeAd.advertiser ? (
            <NativeAsset assetType={NativeAssetType.ADVERTISER}>
              <Text style={styles.advertiser} numberOfLines={1}>{nativeAd.advertiser}</Text>
            </NativeAsset>
          ) : nativeAd.body ? (
            <NativeAsset assetType={NativeAssetType.BODY}>
              <Text style={styles.advertiser} numberOfLines={1}>{nativeAd.body}</Text>
            </NativeAsset>
          ) : null}
        </View>

        {/* AD 배지 */}
        <View style={styles.adBadge}>
          <AppText variant="bodyXS_SB" style={styles.adBadgeText}>AD</AppText>
        </View>
      </NativeAdView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: 62,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.bgCard,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 12,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  textArea: {
    flex: 1,
    gap: 2,
  },
  headline: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray900,
    letterSpacing: -0.2,
  },
  advertiser: {
    fontSize: 12,
    color: colors.gray500,
    letterSpacing: -0.2,
  },
  adBadge: {
    backgroundColor: colors.brown200,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  adBadgeText: {
    color: colors.gray500,
  },
});
