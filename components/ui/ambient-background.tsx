import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { palette } from '@/constants/palette';

export function AmbientBackground({ children }: { children: ReactNode }) {
  return (
    <View style={styles.container}>
      <View style={[styles.orb, styles.orbTop]} />
      <View style={[styles.orb, styles.orbMiddle]} />
      <View style={[styles.orb, styles.orbBottom]} />
      <View style={styles.overlay} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.background,
    flex: 1,
  },
  content: {
    flex: 1,
  },
  orb: {
    borderRadius: 999,
    position: 'absolute',
  },
  orbBottom: {
    backgroundColor: 'rgba(97, 130, 255, 0.12)',
    bottom: -80,
    height: 260,
    left: -50,
    width: 260,
  },
  orbMiddle: {
    backgroundColor: 'rgba(199, 165, 106, 0.18)',
    height: 280,
    right: -60,
    top: 260,
    width: 280,
  },
  orbTop: {
    backgroundColor: 'rgba(35, 181, 211, 0.16)',
    height: 240,
    right: -40,
    top: -40,
    width: 240,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(4, 9, 16, 0.18)',
  },
});
