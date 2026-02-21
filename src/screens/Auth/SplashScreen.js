import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../../styles/colors';
import { textStyles } from '../../styles/typography';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={[textStyles.h1, { color: colors.primary, letterSpacing: 4 }]}>EVEREST</Text>
      <Text style={[textStyles.caption, { marginTop: 5, color: colors.gray[500] }]}>PREMIUM DRY FRUITS</Text>
      <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
});

export default SplashScreen;
