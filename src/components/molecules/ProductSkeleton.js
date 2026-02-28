import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Skeleton from '../atoms/Skeleton';
import { spacing } from '../../styles/spacing';
import { colors } from '../../styles/colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - spacing.md * 3) / 2;

const ProductSkeleton = () => {
  return (
    <View style={styles.container}>
      <Skeleton width="100%" height={150} borderRadius={12} />
      <View style={styles.details}>
        <Skeleton width="80%" height={20} style={{ marginBottom: spacing.xs }} />
        <Skeleton width="40%" height={16} style={{ marginBottom: spacing.sm }} />
        <View style={styles.row}>
          <Skeleton width="50%" height={24} />
          <Skeleton width="30%" height={24} style={{ marginLeft: 'auto' }} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginBottom: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  details: {
    marginTop: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default ProductSkeleton;
