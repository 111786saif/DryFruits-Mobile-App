import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import { colors } from '../../styles/colors';
import { textStyles } from '../../styles/typography';
import { spacing, layout } from '../../styles/spacing';
import { commonStyles } from '../../styles/commonStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProductCard = ({ product, onPress }) => {
  const dispatch = useDispatch();
  const { items: wishlistItems, pendingIds } = useSelector((state) => state.wishlist);
  
  const isWishlisted = Array.isArray(wishlistItems) && wishlistItems.some(item => 
    String(item.product?.id || item.id) === String(product.id)
  );

  const isPending = Array.isArray(pendingIds) && pendingIds.includes(String(product.id));

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (isPending) return;
    dispatch(toggleWishlist(product));
  };

  return (
    <TouchableOpacity style={[commonStyles.card, styles.container, commonStyles.shadow]} onPress={onPress}>
      <View>
        <Image 
          source={{ uri: product.image || 'https://via.placeholder.com/150' }} 
          style={styles.image} 
          resizeMode="contain"
        />
        <TouchableOpacity 
          style={[styles.wishlistBtn, isPending && { opacity: 0.7 }]} 
          onPress={handleWishlist}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Icon 
              name={isWishlisted ? "heart" : "heart-outline"} 
              size={20} 
              color={isWishlisted ? colors.error : colors.gray[500]} 
            />
          )}
        </TouchableOpacity>
      </View>
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
  wishlistBtn: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
