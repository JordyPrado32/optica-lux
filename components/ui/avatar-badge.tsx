import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/palette';

type AvatarBadgeProps = {
  name: string;
  avatarUrl?: string;
};

export function AvatarBadge({ name, avatarUrl }: AvatarBadgeProps) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((value) => value[0]?.toUpperCase())
    .join('');

  if (avatarUrl) {
    return <Image source={avatarUrl} style={styles.image} contentFit="cover" />;
  }

  return (
    <View style={styles.fallback}>
      <Text style={styles.initials}>{initials || 'OL'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    backgroundColor: 'rgba(199, 165, 106, 0.16)',
    borderColor: 'rgba(199, 165, 106, 0.3)',
    borderRadius: 28,
    borderWidth: 1,
    height: 74,
    justifyContent: 'center',
    width: 74,
  },
  image: {
    borderRadius: 28,
    height: 74,
    width: 74,
  },
  initials: {
    color: palette.accentSoft,
    fontSize: 22,
    fontWeight: '800',
  },
});
