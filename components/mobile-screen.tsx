import { ReactNode } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import { AmbientBackground } from '@/components/ui/ambient-background';

export function MobileScreen({ children }: { children: ReactNode }) {
  return (
    <AmbientBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>{children}</View>
      </SafeAreaView>
    </AmbientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    flex: 1,
    maxWidth: 820,
    paddingHorizontal: 18,
    paddingTop: 12,
    width: '100%',
  },
  safeArea: {
    flex: 1,
  },
});
