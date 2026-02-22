import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../../store/slices/cartSlice';
import Button from '../../components/atoms/Button';
import { colors } from '../../styles/colors';
import { textStyles } from '../../styles/typography';
import { spacing } from '../../styles/spacing';
import { commonStyles } from '../../styles/commonStyles';
import Toast from 'react-native-toast-message';

const CheckoutScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items, totals } = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const formattedTotal = totals?.formatted_subtotal || '$0.00';

  const handlePlaceOrder = () => {
    if (!address) {
      Alert.alert('Missing Information', 'Please provide a delivery address.');
      return;
    }

    setLoading(true);
    // Simulate API call for now (Will be replaced with orderService.checkout)
    setTimeout(() => {
      setLoading(false);
      dispatch(clearCart());
      Toast.show({
        type: 'success',
        text1: 'Order Placed!',
        text2: 'Your Everest premium selection is on its way.',
      });
      navigation.navigate('Home');
    }, 2000);
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ... existing address and payment sections */}
        
        <View style={styles.section}>
          <Text style={[textStyles.h3, styles.sectionTitle]}>Order Summary</Text>
          {items.map(item => (
            <View key={item.id} style={styles.summaryItem}>
              <Text style={textStyles.body}>{item.product?.name} x {item.quantity}</Text>
              <Text style={textStyles.body}>{item.line_total || `$${(item.variant?.price_amount || 0) * item.quantity}`}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={textStyles.h3}>Total to Pay</Text>
            <Text style={[textStyles.h3, { color: colors.primary }]}>{formattedTotal}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title={`Place Order - ${formattedTotal}`} 
          onPress={handlePlaceOrder}
          loading={loading}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.md,
  },
  section: {
    marginBottom: spacing.xl,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 12,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: spacing.sm,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  paymentOptionActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(74, 144, 226, 0.05)',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  paymentText: {
    ...textStyles.body,
    fontWeight: '600',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  }
});

export default CheckoutScreen;
