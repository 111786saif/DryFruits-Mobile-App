import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, Platform, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../../store/slices/cartSlice';
import { fetchAddresses } from '../../store/slices/addressSlice';
import { checkout } from '../../store/slices/orderSlice';
import promocodeService from '../../api/services/promocodeService';
import Button from '../../components/atoms/Button';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import { commonStyles } from '../../styles/commonStyles';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CheckoutScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items = [], totals = {} } = useSelector((state) => state.cart || {});
  const { items: addresses = [], loading: addressesLoading = false } = useSelector((state) => state.addresses || {});
  const { checkoutLoading } = useSelector((state) => state.orders || {});
  
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [promocode, setPromocode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  useEffect(() => {
    if (addresses?.length > 0 && !selectedAddress) {
      const defaultAddr = addresses.find(a => a && a.is_default) || addresses[0];
      setSelectedAddress(defaultAddr);
    }
  }, [addresses]);

  const formattedTotal = totals?.formatted_total || totals?.formatted_subtotal || '$0.00';

  const handleApplyPromocode = async () => {
    if (!promocode.trim()) return;
    setPromoLoading(true);
    setPromoError('');
    try {
      const subtotalAmount = totals?.subtotal || 0;
      const result = await promocodeService.validate(promocode.trim(), subtotalAmount);
      if (result?.valid) {
        setPromoDiscount({
          amount: result.discount_amount,
          formatted: result.formatted_discount,
          code: promocode.trim(),
        });
        Toast.show({
          type: 'success',
          text1: 'Promo Applied!',
          text2: `You saved ${result.formatted_discount}`,
        });
      } else {
        setPromoError(result?.message || 'Invalid promo code');
        setPromoDiscount(null);
      }
    } catch (error) {
      setPromoError(typeof error === 'string' ? error : 'Invalid or expired promo code');
      setPromoDiscount(null);
    } finally {
      setPromoLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Toast.show({
        type: 'error',
        text1: 'Address Required',
        text2: 'Please select a delivery address.',
      });
      return;
    }

    const resultAction = await dispatch(checkout({
      address: {
        name: selectedAddress.name,
        email: selectedAddress.email,
        phone: selectedAddress.phone,
        type: selectedAddress.type || 'shipping',
        address_line_1: selectedAddress.address_line_1,
        address_line_2: selectedAddress.address_line_2 || '',
        city: selectedAddress.city,
        state: selectedAddress.state,
        postal_code: selectedAddress.postal_code,
        country: selectedAddress.country || 'USA',
      },
      payment_method: paymentMethod,
      promocode: promocode || null
    }));

    if (checkout.fulfilled.match(resultAction)) {
      dispatch(clearCart());
      Toast.show({
        type: 'success',
        text1: 'Order Placed Successfully!',
        text2: 'Your premium selection will be delivered soon.',
        position: 'bottom',
        visibilityTime: 4000,
      });
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } else {
      const errorMsg = resultAction.payload || 'Checkout failed. Please try again.';
      Toast.show({
        type: 'error',
        text1: 'Checkout Error',
        text2: typeof errorMsg === 'string' ? errorMsg : 'Check your network connection',
      });
    }
  };

  const renderSectionHeader = (title, icon) => (
    <View style={styles.sectionHeader}>
        <Icon name={icon} size={22} color={colors.primary} />
        <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Address Section */}
        <View style={styles.section}>
          {renderSectionHeader('Delivery Address', 'map-marker-outline')}
          
          {addressesLoading ? (
            <ActivityIndicator color={colors.primary} style={{ margin: 20 }} />
          ) : addresses?.length > 0 ? (
            <View>
              {addresses.filter(a => a && a.id).map((addr) => (
                <TouchableOpacity 
                  key={addr.id} 
                  style={[styles.addressItem, selectedAddress?.id === addr.id && styles.selectedItem]}
                  onPress={() => setSelectedAddress(addr)}
                >
                  <View style={styles.radio}>
                    {selectedAddress?.id === addr.id && <View style={styles.radioInner} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.addressType}>{addr.type || 'Home'}</Text>
                    <Text style={styles.addressText}>{addr.address_line_1}</Text>
                    <Text style={styles.addressSubText}>{addr.city}, {addr.state} {addr.postal_code}</Text>
                  </View>
                </TouchableOpacity>
              ))}
              <TouchableOpacity 
                style={styles.addAddressBtn}
                onPress={() => navigation.navigate('Addresses')}
              >
                <Icon name="plus" size={18} color={colors.primary} />
                <Text style={styles.addAddressText}>Add New Address</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.emptyAddress}
              onPress={() => navigation.navigate('Addresses')}
            >
                <Text style={styles.emptyAddressText}>No addresses found. Click to add one.</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Payment Section */}
        <View style={styles.section}>
          {renderSectionHeader('Payment Method', 'credit-card-outline')}
          
          {[
            { id: 'cod', label: 'Cash on Delivery', icon: 'cash-marker' },
            { id: 'card', label: 'Credit / Debit Card', icon: 'credit-card' },
            { id: 'upi', label: 'UPI / Net Banking', icon: 'bank' }
          ].map((method) => (
            <TouchableOpacity 
              key={method.id}
              style={[styles.paymentItem, paymentMethod === method.id && styles.selectedItem]}
              onPress={() => setPaymentMethod(method.id)}
            >
              <Icon name={method.icon} size={24} color={paymentMethod === method.id ? colors.primary : colors.gray[500]} />
              <Text style={[styles.paymentText, paymentMethod === method.id && styles.selectedPaymentText]}>
                {method.label}
              </Text>
              <View style={[styles.radio, { marginLeft: 'auto' }]}>
                {paymentMethod === method.id && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Promo Code Section */}
        <View style={styles.section}>
          {renderSectionHeader('Promo Code', 'tag-outline')}
          <View style={styles.promoRow}>
            <TextInput
              style={styles.promoInput}
              placeholder="Enter promo code"
              placeholderTextColor={colors.gray[400]}
              value={promocode}
              onChangeText={(text) => {
                setPromocode(text);
                setPromoError('');
              }}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={[styles.promoApplyBtn, promoLoading && { opacity: 0.7 }]}
              onPress={handleApplyPromocode}
              disabled={promoLoading}
            >
              {promoLoading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.promoApplyText}>Apply</Text>
              )}
            </TouchableOpacity>
          </View>
          {promoError ? <Text style={styles.promoErrorText}>{promoError}</Text> : null}
          {promoDiscount ? (
            <View style={styles.promoSuccessRow}>
              <Icon name="check-circle" size={16} color={colors.success} />
              <Text style={styles.promoSuccessText}>
                Code "{promoDiscount.code}" applied — You save {promoDiscount.formatted}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Order Summary Section */}
        <View style={styles.section}>
          {renderSectionHeader('Order Summary', 'text-box-check-outline')}
          
          {items.map(item => (
            <View key={item.id} style={styles.summaryRow}>
              <Text style={styles.summaryItemName}>{item.product?.name} x {item.quantity}</Text>
              <Text style={styles.summaryItemPrice}>
                {item.formatted_line_total || item.line_total || `$${(item.variant?.price_amount || 0) * item.quantity}`}
              </Text>
            </View>
          ))}
          
          {promoDiscount && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryItemName, { color: colors.success }]}>Discount</Text>
              <Text style={[styles.summaryItemPrice, { color: colors.success }]}>-{promoDiscount.formatted}</Text>
            </View>
          )}
          
          <View style={styles.divider} />
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>{formattedTotal}</Text>
          </View>
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerInfo}>
            <Text style={styles.footerLabel}>Grand Total</Text>
            <Text style={styles.footerPrice}>{formattedTotal}</Text>
        </View>
        <Button 
          title="Confirm Order" 
          onPress={handlePlaceOrder}
          loading={checkoutLoading}
          style={styles.confirmBtn}
          icon="check-circle-outline"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[100],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  scrollContent: {
    padding: spacing.md,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginLeft: 8,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray[200],
    marginBottom: spacing.sm,
  },
  selectedItem: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '08',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  addressType: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
    textTransform: 'uppercase',
  },
  addressText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  addressSubText: {
    fontSize: 12,
    color: colors.gray[500],
  },
  addAddressBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
    marginTop: spacing.xs,
  },
  addAddressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: 4,
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray[200],
    marginBottom: spacing.sm,
  },
  paymentText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[700],
    marginLeft: spacing.md,
  },
  selectedPaymentText: {
    color: colors.text.primary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summaryItemName: {
    fontSize: 14,
    color: colors.gray[600],
    flex: 1,
  },
  summaryItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[100],
    marginVertical: spacing.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.primary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingBottom: Platform.OS === 'ios' ? 30 : spacing.lg,
  },
  footerInfo: {
    flex: 1,
  },
  footerLabel: {
    fontSize: 12,
    color: colors.gray[500],
    fontWeight: '600',
  },
  footerPrice: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.primary,
  },
  confirmBtn: {
    flex: 1.5,
  },
  emptyAddress: {
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.gray[400],
    borderRadius: 12,
  },
  emptyAddressText: {
    color: colors.gray[500],
    fontSize: 14,
  },
  promoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text.primary,
    marginRight: spacing.sm,
  },
  promoApplyBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderRadius: 10,
  },
  promoApplyText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  promoErrorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  promoSuccessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  promoSuccessText: {
    color: colors.success,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default CheckoutScreen;
