import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders } from '../../store/slices/orderSlice';
import EmptyState from '../../components/molecules/EmptyState';
import Skeleton from '../../components/atoms/Skeleton';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import { commonStyles } from '../../styles/commonStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const OrdersScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items: orders = [], loading } = useSelector((state) => state.orders || {});

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === 'delivered' || s === 'completed') return colors.success;
    if (s === 'processing' || s === 'pending') return colors.warning;
    if (s === 'cancelled') return colors.error;
    return colors.info;
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity 
        style={[styles.orderCard, commonStyles.shadow]}
        onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
    >
      <View style={styles.cardHeader}>
        <View>
            <Text style={styles.orderNumber}>Order #{item.id}</Text>
            <Text style={styles.orderDate}>{item.date || 'Today'}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status || 'Pending'}</Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.orderContent}>
        <View style={styles.itemPreview}>
            <Icon name="package-variant" size={24} color={colors.gray[400]} />
            <Text style={styles.itemCount}>
                {item.items_count || item.items?.length || 0} { (item.items_count || item.items?.length) === 1 ? 'Item' : 'Items'}
            </Text>
        </View>
        <View style={styles.priceContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{item.formatted_total || `$${item.total}`}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.detailsBtn}>View Details</Text>
        <Icon name="chevron-right" size={20} color={colors.primary} />
      </View>
    </TouchableOpacity>
  );

  const renderLoading = () => (
    <View style={{ padding: spacing.md }}>
        {[1, 2, 3].map(i => (
            <Skeleton key={i} width="100%" height={150} borderRadius={16} style={{ marginBottom: 16 }} />
        ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="arrow-left" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading && orders.length === 0 ? (
        renderLoading()
      ) : orders.length === 0 ? (
        <EmptyState 
            icon="clipboard-text-outline"
            title="No orders yet"
            subtitle="Explore our premium collection and place your first order."
            buttonText="Shop Now"
            onButtonPress={() => navigation.navigate('Home')}
        />
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={() => dispatch(fetchOrders())}
        />
      )}
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
    padding: spacing.md,
    backgroundColor: colors.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
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
  listContent: {
    padding: spacing.md,
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[100],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  orderDate: {
    fontSize: 12,
    color: colors.gray[500],
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[100],
    marginVertical: spacing.md,
  },
  orderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemCount: {
    fontSize: 14,
    color: colors.gray[600],
    fontWeight: '600',
    marginLeft: 8,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 11,
    color: colors.gray[500],
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.primary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray[50],
  },
  detailsBtn: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: 4,
  },
});

export default OrdersScreen;
