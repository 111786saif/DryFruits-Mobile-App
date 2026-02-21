import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
  TOKEN: 'auth_token',
  USER: 'user_data',
  THEME: 'app_theme',
};

export const setStorageItem = async (key, value) => {
  try {
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
    await AsyncStorage.setItem(key, stringValue);
  } catch (e) {
    console.error('Error saving to storage', e);
  }
};

export const getStorageItem = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    try {
      return value ? JSON.parse(value) : null;
    } catch (e) {
      return value;
    }
  } catch (e) {
    console.error('Error reading from storage', e);
    return null;
  }
};

export const removeStorageItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error('Error removing from storage', e);
  }
};

export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    console.error('Error clearing storage', e);
  }
};
