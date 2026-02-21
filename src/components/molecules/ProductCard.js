import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../styles/colors';
import { textStyles } from '../../styles/typography';
import { spacing, layout } from '../../styles/spacing';
import { commonStyles } from '../../styles/commonStyles';

const ProductCard = ({ product, onPress }) => {
  return (
    <TouchableOpacity style={[commonStyles.card, styles.container, commonStyles.shadow]} onPress={onPress}>
      <Image 
        source={{ uri: product.image || 'https://via.placeholder.com/150' }} 
        style={styles.image} 
        resizeMode="contain"
      />
      <View style={styles.details}>
        <Text style={[textStyles.body, { fontWeight: '600' }]} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={[textStyles.caption, { marginVertical: spacing.xs }]}>
          {product.category?.name || 'Category'}
        </Text>
        <View style={commonStyles.row}>
          <Text style={[textStyles.h3, { color: colors.primary }]}>
            {product.price?.formatted || `$${product.price}`}
          </Text>
          {product.old_price && (
            <Text style={[textStyles.caption, styles.oldPrice]}>
              {product.old_price?.formatted || `$${product.old_price}`}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    padding: spacing.sm,
    backgroundColor: colors.white,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: layout.borderRadius.sm,
  },
  details: {
    marginTop: spacing.sm,
  },
  oldPrice: {
    textDecorationLine: 'line-through',
    marginLeft: spacing.sm,
  },
});

export default ProductCard;
