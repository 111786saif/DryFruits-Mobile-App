import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAddresses, removeAddress } from '../../store/slices/addressSlice';
import Button from '../../components/atoms/Button';
import { colors } from '../../styles/colors';
import { textStyles } from '../../styles/typography';
import { spacing } from '../../styles/spacing';
import { commonStyles } from '../../styles/commonStyles';

const AddressScreen = () => {
  const dispatch = useDispatch();
  const { items: addresses, loading } = useSelector((state) => state.addresses);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const renderAddressItem = ({ item }) => (
    <View 
      style={[styles.addressCard, item.is_default && styles.defaultCard]}
    >
      <View style={commonStyles.spaceBetween}>
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{item.type || 'Home'}</Text>
        </View>
        {item.is_default && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultText}>Default</Text>
          </View>
        )}
      </View>
      
      <Text style={[textStyles.body, { marginTop: spacing.sm, fontWeight: '600' }]}>{item.address_line_1}</Text>
      <Text style={[textStyles.caption, { color: colors.gray[500] }]}>{item.city}, {item.state} {item.postal_code}</Text>
      
      <View style={styles.cardActions}>
        <TouchableOpacity onPress={() => dispatch(removeAddress(item.id))}>
          <Text style={{ color: colors.error, fontSize: 12 }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.header}>
        <Text style={textStyles.h2}>Saved Addresses</Text>
      </View>

      {loading && addresses.length === 0 ? (
        <View style={commonStyles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={addresses}
          renderItem={renderAddressItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}

      <View style={styles.footer}>
        <Button 
          title="Add New Address" 
          onPress={() => {}} // Could open a modal or new screen
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
  addressCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[100],
  },
  defaultCard: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(74, 144, 226, 0.02)',
  },
  typeBadge: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.gray[700],
    textTransform: 'uppercase',
  },
  defaultBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.white,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.md,
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
});

export default AddressScreen;
