import React, { useEffect, useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart, updateQuantity, removeFromCart } from '../../store/slices/cartSlice';
import Button from '../../components/atoms/Button';
import EmptyState from '../../components/molecules/EmptyState';
import { colors } from '../../styles/colors';
import { textStyles } from '../../styles/typography';
import { spacing } from '../../styles/spacing';
import { commonStyles } from '../../styles/commonStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CartScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items, totals, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(fetchCart());
    });
    return unsubscribe;
  }, [navigation, dispatch]);

  const { subtotal, formatted_subtotal, tax, shipping, total, formatted_total } = totals || {};

  const handleUpdateQuantity = (itemId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty >= 1) {
      dispatch(updateQuantity({ itemId, quantity: newQty }));
    }
  };

  const renderCartItem = ({ item }) => {
    const product = item.product;
    const variant = item.variant;
    return (
      <View style={styles.cartCard}>
        <View style={styles.imageWrapper}>
            <Image source={{ uri: product?.image }} style={styles.itemImage} resizeMode="contain" />
        </View>
        <View style={styles.itemInfo}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
                <Text style={styles.itemName} numberOfLines={1}>{product?.name}</Text>
                <Text style={styles.itemVariant}>
                    {variant?.name || variant?.weight || product?.category?.name || 'Standard'}
                </Text>
            </View>
            <TouchableOpacity 
                style={styles.removeBtn}
                onPress={() => dispatch(removeFromCart(item.id))}
            >
              <Icon name="trash-can-outline" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.itemFooter}>
            <Text style={styles.itemPrice}>
              {item.formatted_line_total || item.line_total || `$${(variant?.price_amount || product?.price?.amount || 0) * item.quantity}`}
            </Text>
            
            <View style={styles.quantityContainer}>
              <TouchableOpacity 
                style={styles.qtyBtn} 
                onPress={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                disabled={item.quantity <= 1}
              >
                <Icon name="minus" size={16} color={item.quantity <= 1 ? colors.gray[400] : colors.primary} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{item.quantity}</Text>
              <TouchableOpacity 
                style={styles.qtyBtn} 
                onPress={() => handleUpdateQuantity(item.id, item.quantity, 1)}
              >
                <Icon name="plus" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (loading && items.length === 0) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Shopping Cart</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ marginTop: 12, color: colors.gray[500], fontSize: 14 }}>Loading your cart...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (items.length === 0) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
        </View>
        <EmptyState 
            icon="cart-outline"
            title="Your cart is empty"
            subtitle="Looks like you haven't added any delicious dry fruits yet."
            buttonText="Start Shopping"
            onButtonPress={() => navigation.navigate('Home')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <Text style={styles.headerSubtitle}>{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</Text>
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
          <Text style={styles.summaryValue}>{totals?.formatted_subtotal || `$${totals?.subtotal || 0}`}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>{totals?.formatted_shipping || 'Free'}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tax</Text>
          <Text style={styles.summaryValue}>{totals?.formatted_tax || '$0.00'}</Text>
        </View>
        
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>
            {formatted_total || formatted_subtotal || `$${subtotal}`}
          </Text>
        </View>
        
        <Button 
          title="Proceed to Checkout" 
          onPress={() => navigation.navigate('Checkout')} 
          style={styles.checkoutBtn}
          icon="credit-card-outline"
        />
      </View>
      
      {/* Spacer for floating tab bar */}
      <View style={{ height: 80 }} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: spacing.lg,
    backgroundColor: colors.white,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.gray[500],
    marginTop: 4,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: 20,
  },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.sm,
    marginBottom: spacing.md,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[100],
  },
  imageWrapper: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImage: {
    width: '80%',
    height: '80%',
  },
  itemInfo: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  itemVariant: {
    fontSize: 12,
    color: colors.gray[500],
    marginTop: 2,
  },
  removeBtn: {
    padding: 4,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: 10,
    padding: 4,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    elevation: 1,
  },
  qtyText: {
    paddingHorizontal: spacing.md,
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.text.primary,
  },
  summaryContainer: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    color: colors.gray[500],
    fontSize: 14,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  totalRow: {
    marginTop: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text.primary,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.primary,
  },
  checkoutBtn: {
    marginTop: spacing.lg,
  },
});

export default CartScreen;
