import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrderDetails } from '../../store/slices/orderSlice';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import { textStyles } from '../../styles/typography';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const OrderDetailsScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const dispatch = useDispatch();
  const { currentOrder: order, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderDetails(orderId));
  }, [dispatch, orderId]);

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === 'delivered' || s === 'completed') return colors.success;
    if (s === 'processing' || s === 'pending') return colors.warning;
    if (s === 'cancelled') return colors.error;
    return colors.info;
  };

  if (loading || !order) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Status Section */}
        <View style={styles.section}>
          <View style={styles.statusRow}>
            <View>
                <Text style={styles.orderId}>Order #{order.id}</Text>
                <Text style={styles.orderDate}>{order.date || 'Today'}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '15' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>{order.status}</Text>
            </View>
          </View>
        </View>

        {/* Items Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {order.items?.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Image source={{ uri: item.product?.image }} style={styles.itemImage} resizeMode="contain" />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>{item.product?.name}</Text>
                <Text style={styles.itemVariant}>{item.variant?.name || 'Standard'}</Text>
                <View style={styles.itemFooter}>
                    <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
                    <Text style={styles.itemPrice}>{item.formatted_line_total || `$${item.line_total}`}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Shipping Address */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Icon name="map-marker-outline" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { marginLeft: 8, marginBottom: 0 }]}>Shipping Address</Text>
          </View>
          <View style={styles.addressBox}>
            <Text style={styles.addressName}>{order.address?.name || 'Recipient Name'}</Text>
            <Text style={styles.addressText}>{order.address?.address_line_1}</Text>
            <Text style={styles.addressText}>{order.address?.city}, {order.address?.state} {order.address?.postal_code}</Text>
            <Text style={styles.addressPhone}>Phone: {order.address?.phone}</Text>
          </View>
        </View>

        {/* Summary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{order.formatted_subtotal || `$${order.subtotal}`}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>{order.formatted_tax || `$${order.tax || 0}`}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>{order.formatted_shipping || 'Free'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>{order.formatted_total || `$${order.total}`}</Text>
          </View>
          <View style={styles.paymentMethod}>
            <Text style={styles.methodLabel}>Paid via:</Text>
            <Text style={styles.methodValue}>{order.payment_method?.toUpperCase() || 'COD'}</Text>
          </View>
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[100],
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.white,
    elevation: 2,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text.primary,
  },
  orderDate: {
    fontSize: 13,
    color: colors.gray[500],
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: colors.gray[50],
  },
  itemInfo: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  itemVariant: {
    fontSize: 12,
    color: colors.gray[500],
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemQty: {
    fontSize: 13,
    color: colors.gray[600],
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary,
  },
  addressBox: {
    backgroundColor: colors.gray[50],
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray[100],
  },
  addressName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: colors.gray[600],
    lineHeight: 20,
  },
  addressPhone: {
    fontSize: 14,
    color: colors.gray[600],
    marginTop: 4,
    fontWeight: '600',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.gray[500],
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[100],
    marginVertical: spacing.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.primary,
  },
  paymentMethod: {
    flexDirection: 'row',
    marginTop: spacing.md,
    backgroundColor: colors.gray[50],
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  methodLabel: {
    fontSize: 12,
    color: colors.gray[500],
    fontWeight: 'bold',
  },
  methodValue: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  }
});

export default OrderDetailsScreen;
