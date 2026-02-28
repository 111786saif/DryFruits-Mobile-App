import React, { useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWishlist, toggleWishlist } from '../../store/slices/wishlistSlice';
import { addToCart } from '../../store/slices/cartSlice';
import Button from '../../components/atoms/Button';
import { colors } from '../../styles/colors';
import { textStyles } from '../../styles/typography';
import { spacing } from '../../styles/spacing';
import { commonStyles } from '../../styles/commonStyles';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const WishlistScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items: wishlist, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleMoveToCart = async (item) => {
    const product = item.product || item;
    if (!product?.id) return;

    const variantId = product.default_variant_id || product.variants?.[0]?.id || product.id;
    const result = await dispatch(addToCart({ productId: product.id, quantity: 1, variantId }));
    if (addToCart.fulfilled.match(result)) {
      dispatch(toggleWishlist(product));
      Toast.show({
        type: 'success',
        text1: 'Moved to Cart',
        text2: `${product.name} is ready for checkout!`,
      });
    }
  };

  const renderWishlistItem = ({ item }) => {
    // API schema: item.product contains the product details
    // Fallback to 'item' if product is missing (defensive programming)
    const product = item.product || item;

    if (!product) return null;

    return (
      <View style={styles.wishlistCard}>
        <Image 
          source={{ uri: product.image || 'https://via.placeholder.com/150' }} 
          style={styles.productImage} 
        />
        <View style={styles.productInfo}>
          <View style={commonStyles.spaceBetween}>
            <Text style={[textStyles.body, { fontWeight: 'bold' }]} numberOfLines={1}>
              {product.name || 'Unknown Product'}
            </Text>
            <TouchableOpacity onPress={() => dispatch(toggleWishlist(product))}>
               <Icon name="close" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
          <Text style={[textStyles.caption, { color: colors.gray[500] }]}>
            {product.category?.name || 'Standard'}
          </Text>
          <Text style={[textStyles.body, { color: colors.primary, fontWeight: '700', marginTop: 4 }]}>
            {product.price?.formatted || `$${product.price || 0}`}
          </Text>
          
          <TouchableOpacity 
            style={styles.addToCartSmall}
            onPress={() => handleMoveToCart(item)}
          >
            <Text style={styles.addToCartText}>Move to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.header}>
        <Text style={textStyles.h2}>My Wishlist</Text>
      </View>

      {wishlist.length === 0 ? (
        <View style={[commonStyles.center, { padding: spacing.xl }]}>
          <Text style={{fontSize: 40, marginBottom: 10}}>❤️</Text>
          <Text style={textStyles.h3}>Wishlist is empty</Text>
          <Text style={[textStyles.body, { textAlign: 'center', color: colors.gray[500], marginTop: 10 }]}>
            Save your favorite dry fruits to buy them later.
          </Text>
        </View>
      ) : (
        <FlatList
          data={wishlist}
          renderItem={renderWishlistItem}
          keyExtractor={(item) => String(item.product?.id || item.id)}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: spacing.md,
    backgroundColor: colors.white,
  },
  listContent: {
    padding: spacing.md,
  },
  wishlistCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.sm,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.gray[100],
  },
  productInfo: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  addToCartSmall: {
    marginTop: 8,
    backgroundColor: colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  addToCartText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default WishlistScreen;
