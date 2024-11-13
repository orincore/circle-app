import React, { useState } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import CustomInput from './components/CustomInput';
import PrimaryButton from './components/PrimaryButton';
import { login } from './utils/api';
import { saveAuthData } from './utils/auth';

export default function Password() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await login(email, password);
      await saveAuthData(response.token, email);
      router.replace('/dashboard');
    } catch (err) {
      setError('Invalid password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Enter Password</Text>
          <Text style={styles.subtitle}>{email}</Text>
        </View>

        <CustomInput
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError('');
          }}
          placeholder="Password"
          error={error}
        />

        <PrimaryButton
          title="Login"
          onPress={handleLogin}
          isLoading={isLoading}
          disabled={!password.trim()}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
});