import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import Button from '../../components/atoms/Button';
import { colors } from '../../styles/colors';
import { textStyles } from '../../styles/typography';
import { spacing } from '../../styles/spacing';
import { commonStyles } from '../../styles/commonStyles';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProductDetailsScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const dispatch = useDispatch();
  const { items: wishlistItems, pendingIds } = useSelector((state) => state.wishlist);
  const [selectedVariant, setSelectedVariant] = useState(product.variants && product.variants.length > 0 ? product.variants[0] : null);

  const isWishlisted = Array.isArray(wishlistItems) && wishlistItems.some(item => 
    String(item.product?.id || item.id) === String(product.id)
  );

  const isPending = Array.isArray(pendingIds) && pendingIds.includes(String(product.id));

  const handleAddToCart = async () => {
    // Robust Variant Selection:
    // 1. Explicitly selected variant
    // 2. First variant in the list
    // 3. default_variant_id from product
    // 4. product.id as a final master-variant fallback
    const variantId = 
      selectedVariant?.id || 
      (product.variants && product.variants.length > 0 ? product.variants[0].id : null) ||
      product.default_variant_id || 
      product.id;

    if (!variantId) {
       Alert.alert('Error', 'This product cannot be added to cart (Missing ID).');
       return;
    }

    const resultAction = await dispatch(addToCart({ 
      productId: product.id, 
      quantity: 1,
      variantId: variantId
    }));
    
    if (addToCart.fulfilled.match(resultAction)) {
      Toast.show({
        type: 'success',
        text1: 'Added to Cart',
        text2: `${product.name} has been added to your shopping cart.`,
      });
    } else {
       const errorMsg = resultAction.payload || 'Failed to add to cart';
       Alert.alert('Add to Cart Failed', typeof errorMsg === 'string' ? errorMsg : 'Check your connection');
    }
  };

  const handleWishlistToggle = async () => {
    const result = await dispatch(toggleWishlist(product));
    if (toggleWishlist.fulfilled.match(result)) {
      Toast.show({
        type: 'success',
        text1: isWishlisted ? 'Removed from Wishlist' : 'Added to Wishlist',
        position: 'bottom'
      });
    }
  };

  const currentPrice = selectedVariant ? (selectedVariant.price?.formatted || selectedVariant.price) : (product.price?.formatted || product.price);

  return (
    <View style={commonStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Image source={{ uri: product.image }} style={styles.image} />
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-left" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.wishlistFloat, isPending && { opacity: 0.7 }]} 
            onPress={handleWishlistToggle}
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Icon 
                name={isWishlisted ? "heart" : "heart-outline"} 
                size={24} 
                color={isWishlisted ? colors.error : colors.gray[600]} 
              />
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          <View style={commonStyles.spaceBetween}>
            <View style={{ flex: 1 }}>
              <Text style={textStyles.h2}>{product.name}</Text>
              <Text style={[textStyles.caption, { color: colors.primary, marginTop: 4 }]}>
                {product.brand?.name || 'Everest Premium'}
              </Text>
            </View>
            <Text style={[textStyles.h2, { color: colors.primary }]}>
              {typeof currentPrice === 'string' ? currentPrice : `$${Number(currentPrice).toFixed(2)}`}
            </Text>
          </View>
          
          <View style={styles.metaRow}>
            <Text style={[textStyles.caption, { color: colors.gray[600] }]}>
              Category: {product.category?.name}
            </Text>
            {product.rating && (
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>★ {product.rating} ({product.reviews} reviews)</Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          {product.variants && product.variants.length > 0 && (
            <View style={styles.variantSection}>
              <Text style={textStyles.h3}>Select Option</Text>
              <View style={styles.variantContainer}>
                {product.variants.map((variant) => (
                  <TouchableOpacity
                    key={variant.id}
                    style={[
                      styles.variantButton,
                      selectedVariant?.id === variant.id && styles.selectedVariant
                    ]}
                    onPress={() => setSelectedVariant(variant)}
                  >
                    <Text style={[
                      styles.variantText,
                      selectedVariant?.id === variant.id && styles.selectedVariantText
                    ]}>
                      {variant.name || variant.weight || variant.size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.divider} />
            </View>
          )}

          <Text style={textStyles.h3}>Description</Text>
          <Text style={[textStyles.body, { marginTop: spacing.sm, color: colors.text.secondary }]}>
            Premium quality {product.name} sourced from the best farms. Rich in nutrients and perfect for healthy snacking. 
            Enjoy the authentic taste and nutritional benefits of our hand-picked dry fruits.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title="Add to Cart" 
          onPress={handleAddToCart}
          style={styles.cartButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 350,
    backgroundColor: colors.gray[100],
  },
  backButton: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  wishlistFloat: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  content: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  ratingBadge: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    ...textStyles.caption,
    color: colors.gray[800],
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  cartButton: {
    width: '100%',
  },
  variantSection: {
    marginBottom: spacing.md,
  },
  variantContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  variantButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[300],
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    backgroundColor: colors.white,
  },
  selectedVariant: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  variantText: {
    ...textStyles.body,
    color: colors.text.primary,
  },
  selectedVariantText: {
    color: colors.white,
    fontWeight: 'bold',
  },
});

export default ProductDetailsScreen;
