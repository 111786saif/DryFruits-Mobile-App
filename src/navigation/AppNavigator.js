import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import ProductDetailsScreen from '../screens/Main/ProductDetailsScreen';
import SearchScreen from '../screens/Main/SearchScreen';
import CheckoutScreen from '../screens/Cart/CheckoutScreen';
import WishlistScreen from '../screens/User/WishlistScreen';
import OrdersScreen from '../screens/User/OrdersScreen';
import OrderDetailsScreen from '../screens/User/OrderDetailsScreen';
import AddressScreen from '../screens/User/AddressScreen';
import AddAddressScreen from '../screens/User/AddAddressScreen';
import { restoreToken } from '../store/slices/authSlice';
import { getStorageItem, StorageKeys } from '../utils/storage';
import SplashScreen from '../screens/Auth/SplashScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isInitializing, setIsInitializing] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const bootstrapAsync = async () => {
      let token, user;
      try {
        token = await getStorageItem(StorageKeys.TOKEN);
        user = await getStorageItem(StorageKeys.USER);
      } catch (e) {
        // Restoring token failed
      }
      dispatch(restoreToken({ token, user }));
      setIsInitializing(false);
    };

    bootstrapAsync();
  }, [dispatch]);

  if (isInitializing) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          cardStyle: { backgroundColor: '#F8F9FA' }
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="Wishlist" component={WishlistScreen} />
            <Stack.Screen name="Orders" component={OrdersScreen} />
            <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
            <Stack.Screen name="Addresses" component={AddressScreen} />
            <Stack.Screen name="AddAddress" component={AddAddressScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
