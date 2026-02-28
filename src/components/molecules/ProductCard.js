import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { colors } from '../../styles/colors';
import { textStyles } from '../../styles/typography';
import { spacing, layout } from '../../styles/spacing';
import { commonStyles } from '../../styles/commonStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

const ProductCard = ({ product, onPress }) => {
  const dispatch = useDispatch();
  const { items: wishlistItems, pendingIds } = useSelector((state) => state.wishlist);
  const { loading: cartLoading } = useSelector((state) => state.cart);
  
  const isWishlisted = Array.isArray(wishlistItems) && wishlistItems.some(item => 
    String(item.product?.id || item.id) === String(product.id)
  );

  const isPending = Array.isArray(pendingIds) && pendingIds.includes(String(product.id));

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (isPending) return;
    dispatch(toggleWishlist(product));
  };

  const handleQuickAdd = async (e) => {
    e.stopPropagation();
    const variantId = product.default_variant_id || product.variants?.[0]?.id || product.id;
    const result = await dispatch(addToCart({ 
        productId: product.id, 
        quantity: 1, 
        variantId: variantId 
    }));
    if (addToCart.fulfilled.match(result)) {
      Toast.show({
          type: 'success',
          text1: 'Added to Cart',
          text2: `${product.name} has been added.`,
          position: 'bottom'
      });
    } else {
      Toast.show({
          type: 'error',
          text1: 'Failed to add',
          text2: 'Please try again.',
          position: 'bottom'
      });
    }
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      style={[styles.container, commonStyles.shadow]} 
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: product.image || 'https://via.placeholder.com/150' }} 
          style={styles.image} 
          resizeMode="contain"
        />
        
        {/* Badges */}
        {product.is_organic && (
            <View style={styles.badge}>
                <Text style={styles.badgeText}>Organic</Text>
            </View>
        )}

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
              size={18} 
              color={isWishlisted ? colors.error : colors.gray[500]} 
            />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.details}>
        <Text style={[textStyles.caption, { color: colors.gray[500] }]} numberOfLines={1}>
          {product.category?.name || 'Nuts & Seeds'}
        </Text>
        <Text style={[textStyles.body, { fontWeight: '700', marginVertical: 2 }]} numberOfLines={1}>
          {product.name}
        </Text>
        
        <View style={styles.footer}>
          <View>
            <Text style={[textStyles.h3, { color: colors.primary, fontWeight: '800' }]}>
              {product.price?.formatted || `$${product.price}`}
            </Text>
            {product.old_price && (
              <Text style={[textStyles.caption, styles.oldPrice]}>
                {product.old_price?.formatted || `$${product.old_price}`}
              </Text>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.addBtn} 
            onPress={handleQuickAdd}
          >
            <Icon name="plus" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.sm,
    marginBottom: spacing.xs,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.gray[100],
  },
  imageContainer: {
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '90%',
    height: '90%',
  },
  badge: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  wishlistBtn: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: colors.white,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  details: {
    marginTop: spacing.sm,
    paddingHorizontal: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: spacing.xs,
  },
  addBtn: {
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  oldPrice: {
    textDecorationLine: 'line-through',
    color: colors.gray[500],
    fontSize: 10,
  },
});

export default ProductCard;
