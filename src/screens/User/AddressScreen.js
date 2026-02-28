import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAddresses, removeAddress } from '../../store/slices/addressSlice';
import Button from '../../components/atoms/Button';
import EmptyState from '../../components/molecules/EmptyState';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import { commonStyles } from '../../styles/commonStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AddressScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items: addresses = [], loading } = useSelector((state) => state.addresses || {});

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const renderAddressItem = ({ item }) => {
    if (!item) return null;
    return (
      <View 
        style={[styles.addressCard, item.is_default && styles.defaultCard, commonStyles.shadow]}
      >
      <View style={styles.cardHeader}>
        <View style={styles.typeBadge}>
          <Icon 
            name={
              item.type === 'shipping' ? 'truck-delivery-outline' : 
              item.type === 'billing' ? 'credit-card-outline' : 
              item.type === 'Office' ? 'briefcase-outline' : 'home-outline'
            } 
            size={14} 
            color={colors.primary} 
          />
          <Text style={styles.typeText}>{item.type || 'shipping'}</Text>
        </View>
        {item.is_default && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultText}>DEFAULT</Text>
          </View>
        )}
      </View>
      
      <View style={styles.addressInfo}>
        <Text style={styles.recipientName}>{item.name || 'Recipient'}</Text>
        <Text style={styles.addressLine}>{item.address_line_1}</Text>
        <Text style={styles.addressSub}>{item.city}, {item.state} {item.postal_code}</Text>
        <Text style={styles.phoneText}>
            <Icon name="phone-outline" size={12} color={colors.gray[500]} /> {item.phone || 'No phone'}
        </Text>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.cardActions}>
        <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => {}} // Could implement Edit
        >
          <Icon name="pencil-outline" size={18} color={colors.primary} />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
            style={[styles.actionBtn, { marginLeft: spacing.lg }]}
            onPress={() => dispatch(removeAddress(item.id))}
        >
          <Icon name="trash-can-outline" size={18} color={colors.error} />
          <Text style={[styles.actionText, { color: colors.error }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="arrow-left" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Addresses</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading && addresses.length === 0 ? (
        <View style={commonStyles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : addresses.length === 0 ? (
        <EmptyState 
            icon="map-marker-off-outline"
            title="No Addresses Saved"
            subtitle="Please add a delivery address to proceed with your orders."
            buttonText="Add New Address"
            onButtonPress={() => navigation.navigate('AddAddress')}
        />
      ) : (
        <FlatList
          data={addresses.filter(a => a && a.id)}
          renderItem={renderAddressItem}
          keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View style={styles.footer}>
        <Button 
          title="Add New Address" 
          onPress={() => navigation.navigate('AddAddress')} 
          icon="plus"
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
  addressCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  defaultCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '05',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
    marginLeft: 4,
  },
  defaultBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  defaultText: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 0.5,
  },
  addressInfo: {
    marginBottom: spacing.sm,
  },
  recipientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  addressLine: {
    fontSize: 14,
    color: colors.gray[700],
    fontWeight: '500',
  },
  addressSub: {
    fontSize: 14,
    color: colors.gray[500],
    marginTop: 2,
  },
  phoneText: {
    fontSize: 13,
    color: colors.gray[600],
    marginTop: 8,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[100],
    marginVertical: spacing.sm,
  },
  cardActions: {
    flexDirection: 'row',
    marginTop: spacing.xs,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: 6,
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingBottom: Platform.OS === 'ios' ? 30 : spacing.lg,
  },
});

export default AddressScreen;
