import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const AUTH_TOKEN_KEY = '@circle_auth_token';
const USER_EMAIL_KEY = '@circle_user_email';

export async function saveAuthData(token: string, email: string) {
  try {
    await AsyncStorage.multiSet([
      [AUTH_TOKEN_KEY, token],
      [USER_EMAIL_KEY, email],
    ]);
  } catch (error) {
    console.error('Error saving auth data:', error);
  }
}

export async function getAuthData() {
  try {
    const [token, email] = await AsyncStorage.multiGet([AUTH_TOKEN_KEY, USER_EMAIL_KEY]);
    return {
      token: token[1],
      email: email[1],
    };
  } catch (error) {
    console.error('Error getting auth data:', error);
    return { token: null, email: null };
  }
}

export async function clearAuthData() {
  try {
    await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_EMAIL_KEY]);
    router.replace('/');
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
}