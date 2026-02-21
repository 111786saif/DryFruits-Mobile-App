import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import Button from '../../components/atoms/Button';
import { colors } from '../../styles/colors';
import { textStyles } from '../../styles/typography';
import { spacing, layout } from '../../styles/spacing';
import { commonStyles } from '../../styles/commonStyles';
import Toast from 'react-native-toast-message';

const ProductDetailsScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const dispatch = useDispatch();

  const handleAddToCart = async () => {
    const resultAction = await dispatch(addToCart({ productId: product.id, quantity: 1 }));
    if (addToCart.fulfilled.match(resultAction)) {
      Toast.show({
        type: 'success',
        text1: 'Added to Cart',
        text2: `${product.name} has been added to your shopping cart.`,
      });
    }
  };

  return (
    <View style={commonStyles.container}>
      <ScrollView>
        <Image source={{ uri: product.image }} style={styles.image} />
        
        <View style={styles.content}>
          <View style={commonStyles.spaceBetween}>
            <Text style={textStyles.h2}>{product.name}</Text>
            <Text style={[textStyles.h2, { color: colors.primary }]}>
              {product.price?.formatted || `$${product.price}`}
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
    height: 300,
    backgroundColor: colors.gray[100],
  },
  content: {
    padding: spacing.lg,
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
});

export default ProductDetailsScreen;
