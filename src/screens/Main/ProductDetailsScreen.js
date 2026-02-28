import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Dimensions, FlatList, SafeAreaView, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import { fetchRelatedProducts, clearRelated } from '../../store/slices/productSlice';
import Button from '../../components/atoms/Button';
import QuantitySelector from '../../components/atoms/QuantitySelector';
import ProductCard from '../../components/molecules/ProductCard';
import { colors } from '../../styles/colors';
import { textStyles } from '../../styles/typography';
import { spacing } from '../../styles/spacing';
import { commonStyles } from '../../styles/commonStyles';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const ProductDetailsScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const dispatch = useDispatch();
  const { items: wishlistItems, pendingIds } = useSelector((state) => state.wishlist);
  const { relatedItems, relatedLoading } = useSelector((state) => state.products);
  
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(fetchRelatedProducts(product.id));
    return () => dispatch(clearRelated());
  }, [dispatch, product.id]);

  const isWishlisted = Array.isArray(wishlistItems) && wishlistItems.some(item => 
    String(item.product?.id || item.id) === String(product.id)
  );

  const isPending = Array.isArray(pendingIds) && pendingIds.includes(String(product.id));

  const handleAddToCart = async () => {
    const variantId = selectedVariant?.id || product.default_variant_id || product.variants?.[0]?.id || product.id;

    if (!variantId) {
       Alert.alert('Error', 'This product cannot be added to cart.');
       return;
    }

    const resultAction = await dispatch(addToCart({ 
      productId: product.id, 
      quantity: quantity,
      variantId: variantId
    }));
    
    if (addToCart.fulfilled.match(resultAction)) {
      Toast.show({
        type: 'success',
        text1: 'Added to Cart',
        text2: `${quantity} x ${product.name} added.`,
      });
    }
  };

  const handleWishlistToggle = async () => {
    dispatch(toggleWishlist(product));
  };

  const currentPrice = selectedVariant 
    ? (selectedVariant.price?.amount || selectedVariant.price) 
    : (product.price?.amount || product.price);

  const formattedPrice = selectedVariant?.price?.formatted || product.price?.formatted || `$${currentPrice}`;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
          
          <SafeAreaView style={styles.headerOverlay}>
            <TouchableOpacity 
                style={styles.iconBtn} 
                onPress={() => navigation.goBack()}
            >
                <Icon name="arrow-left" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={styles.iconBtn} 
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
          </SafeAreaView>
        </View>
        
        <View style={styles.content}>
          <View style={styles.topInfo}>
            <View style={{ flex: 1 }}>
                <Text style={styles.brandText}>{product.brand?.name || 'EVEREST PREMIUM'}</Text>
                <Text style={textStyles.h2}>{product.name}</Text>
            </View>
            <View style={styles.ratingBadge}>
                <Icon name="star" size={16} color={colors.accent} />
                <Text style={styles.ratingText}>{product.rating || '4.8'}</Text>
            </View>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceText}>{formattedPrice}</Text>
            {product.old_price && (
                <Text style={styles.oldPriceText}>{product.old_price.formatted}</Text>
            )}
            <View style={styles.stockBadge}>
                <Text style={styles.stockText}>In Stock</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {product.variants && product.variants.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Weight</Text>
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
                      {variant.name || variant.weight || 'Default'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this product</Text>
            <Text style={styles.description}>
              {product.description || `Indulge in the premium quality of our ${product.name}. Hand-picked and carefully processed to ensure maximum nutritional value and authentic taste. Perfect for healthy snacking or as a nutritious addition to your favorite recipes.`}
            </Text>
          </View>

          <View style={styles.featuresRow}>
            <View style={styles.featureItem}>
                <Icon name="leaf" size={20} color={colors.success} />
                <Text style={styles.featureText}>100% Organic</Text>
            </View>
            <View style={styles.featureItem}>
                <Icon name="shield-check" size={20} color={colors.info} />
                <Text style={styles.featureText}>Quality Assured</Text>
            </View>
            <View style={styles.featureItem}>
                <Icon name="truck-delivery" size={20} color={colors.primary} />
                <Text style={styles.featureText}>Fast Delivery</Text>
            </View>
          </View>

          {relatedItems.length > 0 && (
            <View style={styles.relatedSection}>
                <Text style={styles.sectionTitle}>You might also like</Text>
                <FlatList
                    data={relatedItems}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingVertical: spacing.sm }}
                    renderItem={({ item }) => (
                        <View style={{ width: 150, marginRight: spacing.md }}>
                            <ProductCard product={item} onPress={() => navigation.push('ProductDetails', { product: item })} />
                        </View>
                    )}
                    keyExtractor={(item) => `related-${item.id}`}
                />
            </View>
          )}
          
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <QuantitySelector 
            quantity={quantity} 
            onIncrease={() => setQuantity(q => q + 1)}
            onDecrease={() => setQuantity(q => Math.max(1, q - 1))}
            style={styles.quantityContainer}
        />
        <Button 
          title="Add to Cart" 
          onPress={handleAddToCart}
          style={styles.cartButton}
          icon="cart-plus"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  imageContainer: {
    width: width,
    height: 300,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '80%',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: Platform.OS === 'ios' ? 0 : spacing.md,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  topInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  brandText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
    color: colors.gray[800],
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  priceText: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.primary,
  },
  oldPriceText: {
    fontSize: 16,
    color: colors.gray[500],
    textDecorationLine: 'line-through',
    marginLeft: spacing.sm,
  },
  stockBadge: {
    marginLeft: 'auto',
    backgroundColor: colors.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  stockText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginVertical: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  variantContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  variantButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray[300],
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  selectedVariant: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  variantText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[700],
  },
  selectedVariantText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.secondary,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.gray[100],
    padding: spacing.md,
    borderRadius: 16,
    marginBottom: spacing.xl,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.gray[600],
    marginTop: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingBottom: Platform.OS === 'ios' ? 30 : spacing.md,
  },
  quantityContainer: {
    marginRight: spacing.md,
  },
  cartButton: {
    flex: 1,
  },
  relatedSection: {
    marginTop: spacing.md,
  }
});

export default ProductDetailsScreen;
