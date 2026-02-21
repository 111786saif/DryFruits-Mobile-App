import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { useSelector } from 'react-redux';
import { commonStyles } from '../../styles/commonStyles';
import { textStyles } from '../../styles/typography';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';

const OrdersScreen = () => {
  const { items: orders } = useSelector((state) => state.orders);

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={[textStyles.body, { fontWeight: 'bold' }]}>Order #{item.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'Delivered' ? '#E8F5E9' : '#FFF3E0' }]}>
          <Text style={[styles.statusText, { color: item.status === 'Delivered' ? '#2E7D32' : '#EF6C00' }]}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.orderInfo}>
        <Text style={textStyles.caption}>Date: {item.date}</Text>
        <Text style={textStyles.caption}>Items: {item.items.length}</Text>
      </View>

      <View style={[commonStyles.spaceBetween, { marginTop: spacing.sm }]}>
        <Text style={[textStyles.body, { fontWeight: '700' }]}>Total Amount</Text>
        <Text style={[textStyles.body, { color: colors.primary, fontWeight: '800' }]}>${item.total.toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.header}>
        <Text style={textStyles.h2}>My Orders</Text>
      </View>

      {orders.length === 0 ? (
        <View style={commonStyles.center}>
          <Text style={textStyles.body}>No orders found.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
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
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[100],
    marginVertical: spacing.sm,
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
});

export default OrdersScreen;
