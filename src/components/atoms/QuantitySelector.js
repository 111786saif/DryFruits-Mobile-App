import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';

const QuantitySelector = ({ quantity, onIncrease, onDecrease, style }) => {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={onDecrease}
        disabled={quantity <= 1}
      >
        <Icon name="minus" size={20} color={quantity <= 1 ? colors.gray[400] : colors.primary} />
      </TouchableOpacity>
      
      <Text style={styles.quantity}>{quantity}</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={onIncrease}
      >
        <Icon name="plus" size={20} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    padding: 4,
  },
  button: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 6,
    elevation: 1,
  },
  quantity: {
    paddingHorizontal: spacing.md,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
});

export default QuantitySelector;
