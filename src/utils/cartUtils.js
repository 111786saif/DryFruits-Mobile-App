import AsyncStorage from '@react-native-async-storage/async-storage';

const GUEST_UUID_KEY = 'guest_uuid';

// Simple, dependency-free unique ID generator for the guest session
const generateSimpleId = () => {
  return 'guest-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now();
};

export const getGuestUuid = async () => {
  try {
    let uuid = await AsyncStorage.getItem(GUEST_UUID_KEY);
    if (!uuid) {
      uuid = generateSimpleId();
      await AsyncStorage.setItem(GUEST_UUID_KEY, uuid);
    }
    return uuid;
  } catch (error) {
    console.error('Error handling guest uuid:', error);
    return 'default-guest-uuid';
  }
};
