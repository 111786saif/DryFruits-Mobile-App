import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CategoryBubble = ({ category, onPress, isActive }) => {
  // Map category names to icons if available, otherwise use a default
  const getIcon = (name) => {
    const iconMap = {
      'Cashews': 'leaf',
      'Almonds': 'nut',
      'Walnuts': 'seed',
      'Pistachios': 'sprout',
      'Dates': 'food-apple',
      'Raisins': 'dots-horizontal',
      'Gift Boxes': 'gift',
    };
    return iconMap[name] || 'food-variant';
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        isActive && styles.activeContainer
      ]} 
      onPress={onPress}
    >
      <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
        <Icon 
          name={getIcon(category.name)} 
          size={24} 
          color={isActive ? colors.white : colors.primary} 
        />
      </View>
      <Text style={[styles.label, isActive && styles.activeLabel]} numberOfLines={1}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: spacing.md,
    width: 80,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  activeIconContainer: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  label: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  activeLabel: {
    color: colors.primary,
    fontWeight: '700',
  },
});

export default CategoryBubble;
