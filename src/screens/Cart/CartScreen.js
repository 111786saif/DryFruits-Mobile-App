import React, { useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart, updateQuantity, removeFromCart } from '../../store/slices/cartSlice';
import Button from '../../components/atoms/Button';
import { colors } from '../../styles/colors';
import { textStyles } from '../../styles/typography';
import { spacing } from '../../styles/spacing';
import { commonStyles } from '../../styles/commonStyles';

const CartScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items, totals, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(fetchCart());
    });
    return unsubscribe;
  }, [navigation, dispatch]);

  const { subtotal, formatted_subtotal } = totals || {};

  const handleUpdateQuantity = (itemId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty >= 1) {
      // Immediate dispatch for a snappy UI
      dispatch(updateQuantity({ itemId, quantity: newQty }));
    }
  };

  const renderCartItem = ({ item }) => {
    // API schema: item.product, item.variant, item.quantity, item.line_total
    const product = item.product;
    const variant = item.variant;
    return (
      <View style={styles.cartCard}>
        <Image source={{ uri: product?.image }} style={styles.itemImage} />
        <View style={styles.itemInfo}>
          <View style={commonStyles.spaceBetween}>
            <Text style={[textStyles.body, { fontWeight: 'bold' }]} numberOfLines={1}>{product?.name}</Text>
            <TouchableOpacity onPress={() => dispatch(removeFromCart(item.id))}>
              <Text style={{ color: colors.error, fontSize: 12 }}>Remove</Text>
            </TouchableOpacity>
          </View>
          <Text style={[textStyles.caption, { color: colors.gray[500] }]}>
            {variant?.name || product?.category?.name || 'Standard'}
          </Text>
          
          <View style={[commonStyles.spaceBetween, { marginTop: spacing.sm }]}>
            <Text style={[textStyles.body, { color: colors.primary, fontWeight: '700' }]}>
              {item.line_total || `$${(variant?.price_amount || product?.price?.amount || 0) * item.quantity}`}
            </Text>
            
            <View style={styles.quantityContainer}>
              <TouchableOpacity 
                style={styles.qtyBtn} 
                onPress={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                disabled={loading}
              >
                <Text style={[styles.qtyBtnText, loading && {color: colors.gray[400]}]}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyText}>{item.quantity}</Text>
              <TouchableOpacity 
                style={styles.qtyBtn} 
                onPress={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                disabled={loading}
              >
                <Text style={[styles.qtyBtnText, loading && {color: colors.gray[400]}]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (loading && items.length === 0) {
    return (
      <View style={[commonStyles.container, commonStyles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (items.length === 0) {
// ... existing empty state code
    return (
      <SafeAreaView style={[commonStyles.container, commonStyles.center, { padding: spacing.xl }]}>
        <View style={styles.emptyIconContainer}>
            <Text style={{fontSize: 50}}>🛒</Text>
        </View>
        <Text style={[textStyles.h2, { marginBottom: spacing.xs }]}>Your Cart is Empty</Text>
        <Text style={[textStyles.body, { textAlign: 'center', color: colors.gray[500], marginBottom: spacing.xl }]}>
          Looks like you haven't added anything to your cart yet.
        </Text>
        <Button 
          title="Start Shopping" 
          onPress={() => navigation.navigate('Home')} 
          style={{ width: '100%' }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.header}>
        <Text style={textStyles.h2}>Shopping Cart</Text>
        <Text style={[textStyles.caption, { color: colors.gray[500] }]}>{items.length} items</Text>
      </View>

      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>{formatted_subtotal || '$0.00'}</Text>
        </View>
        <View style={[styles.summaryRow, { marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.gray[100] }]}>
          <Text style={[styles.summaryLabel, { fontWeight: 'bold', color: colors.text.primary }]}>Total Amount</Text>
          <Text style={[styles.summaryValue, { fontWeight: 'bold', color: colors.primary, fontSize: 18 }]}>
            {formatted_subtotal || '$0.00'}
          </Text>
        </View>
        
        <Button 
          title="Proceed to Checkout" 
          onPress={() => navigation.navigate('Checkout')} 
          style={styles.checkoutBtn}
        />
      </View>
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
  cartCard: {
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
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
    backgroundColor: colors.gray[100],
  },
  itemInfo: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'space-between',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: 20,
    paddingHorizontal: 4,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  qtyText: {
    paddingHorizontal: spacing.sm,
    fontWeight: 'bold',
    minWidth: 30,
    textAlign: 'center',
  },
  summaryContainer: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  summaryLabel: {
    color: colors.gray[500],
    ...textStyles.body,
  },
  summaryValue: {
    ...textStyles.body,
    fontWeight: '600',
  },
  checkoutBtn: {
    marginTop: spacing.md,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  }
});

export default CartScreen;
