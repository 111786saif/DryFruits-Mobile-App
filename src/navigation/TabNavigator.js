import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../screens/Main/HomeScreen';
import CategoriesScreen from '../screens/Main/CategoriesScreen';
import CartScreen from '../screens/Cart/CartScreen';
import ProfileScreen from '../screens/User/ProfileScreen';
import { colors } from '../styles/colors';
import { spacing } from '../styles/spacing';

const Tab = createBottomTabNavigator();

const CartBadge = ({ count }) => {
  if (count === 0) return null;
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{count}</Text>
    </View>
  );
};

const TabNavigator = () => {
  const { items: cartItems } = useSelector((state) => state.cart);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home-variant' : 'home-variant-outline';
          else if (route.name === 'Categories') iconName = focused ? 'view-grid' : 'view-grid-outline';
          else if (route.name === 'Cart') iconName = focused ? 'cart' : 'cart-outline';
          else if (route.name === 'Profile') iconName = focused ? 'account' : 'account-outline';
          
          return (
            <View>
              <Icon name={iconName} size={28} color={color} />
              {route.name === 'Cart' && <CartBadge count={cartItems.length} />}
            </View>
          );
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray[500],
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Categories" component={CategoriesScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    right: spacing.md,
    elevation: 8,
    backgroundColor: colors.white,
    borderRadius: 20,
    height: 70,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    borderTopWidth: 0,
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -2,
    backgroundColor: colors.error,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  badgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: 'bold',
  },
});

export default TabNavigator;
