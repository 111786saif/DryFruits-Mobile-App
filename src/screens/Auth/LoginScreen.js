import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import { colors } from '../../styles/colors';
import { commonStyles } from '../../styles/commonStyles';
import { textStyles } from '../../styles/typography';
import { spacing } from '../../styles/spacing';
import Button from '../../components/atoms/Button';
import Toast from 'react-native-toast-message';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    
    const resultAction = await dispatch(login({ email, password }));
    if (login.fulfilled.match(resultAction)) {
      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: 'Welcome back to Everest!',
      });
    } else {
      const errorMessage = typeof resultAction.payload === 'string' 
        ? resultAction.payload 
        : 'Something went wrong';
      
      const title = errorMessage.includes('Network Error') ? 'Connection Failed' : 'Login Failed';
      const detail = errorMessage.includes('Network Error') 
        ? 'Please check your internet connection or try again later.' 
        : errorMessage;

      Alert.alert(title, detail);
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.content}>
        <Text style={[textStyles.h1, { marginBottom: spacing.xs }]}>Login</Text>
        <Text style={[textStyles.caption, { marginBottom: spacing.xxl }]}>Sign in to continue shopping</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={commonStyles.input}
            placeholder="example@mail.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={commonStyles.input}
            placeholder="********"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={[textStyles.caption, { color: colors.primary, textAlign: 'right' }]}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <Button 
          title="Login" 
          onPress={handleLogin}
          loading={loading}
          style={{ marginTop: spacing.lg }}
        />

        <TouchableOpacity 
          onPress={() => navigation.navigate('Register')} 
          style={styles.footerLink}
        >
          <Text style={textStyles.caption}>
            Don't have an account? <Text style={styles.linkText}>Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    flex: 1,
    justifyContent: 'center',
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    ...textStyles.caption,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  forgotPassword: {
    marginTop: spacing.xs,
  },
  mockHint: {
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.gray[100],
    borderRadius: 8,
  },
  footerLink: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  linkText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
