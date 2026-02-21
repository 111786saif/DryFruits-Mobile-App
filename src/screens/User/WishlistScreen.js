import React, { useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWishlist, removeFromWishlist } from '../../store/slices/wishlistSlice';
import { addToCart } from '../../store/slices/cartSlice';
import Button from '../../components/atoms/Button';
import { colors } from '../../styles/colors';
import { textStyles } from '../../styles/typography';
import { spacing } from '../../styles/spacing';
import { commonStyles } from '../../styles/commonStyles';
import Toast from 'react-native-toast-message';

const WishlistScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items: wishlist, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleMoveToCart = async (item) => {
    const result = await dispatch(addToCart({ productId: item.product.id, quantity: 1 }));
    if (addToCart.fulfilled.match(result)) {
      dispatch(removeFromWishlist(item.product.id));
      Toast.show({
        type: 'success',
        text1: 'Moved to Cart',
        text2: `${item.product.name} is ready for checkout!`,
      });
    }
  };

  const renderWishlistItem = ({ item }) => {
    const { product } = item;
    return (
      <View style={styles.wishlistCard}>
        <Image source={{ uri: product.image }} style={styles.productImage} />
        <View style={styles.productInfo}>
          <View style={commonStyles.spaceBetween}>
            <Text style={[textStyles.body, { fontWeight: 'bold' }]}>{product.name}</Text>
            <TouchableOpacity onPress={() => dispatch(removeFromWishlist(product.id))}>
               <Text style={{color: colors.error, fontSize: 18}}>×</Text>
            </TouchableOpacity>
          </View>
          <Text style={[textStyles.caption, { color: colors.gray[500] }]}>{product.category?.name}</Text>
          <Text style={[textStyles.body, { color: colors.primary, fontWeight: '700', marginTop: 4 }]}>
            {product.price?.formatted || `$${product.price}`}
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
          keyExtractor={(item) => item.id}
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
