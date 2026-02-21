import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../store/slices/authSlice';
import { colors } from '../../styles/colors';
import { commonStyles } from '../../styles/commonStyles';
import { textStyles } from '../../styles/typography';
import { spacing } from '../../styles/spacing';
import Button from '../../components/atoms/Button';
import Toast from 'react-native-toast-message';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
  });

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async () => {
    const { name, email, password, password_confirmation, phone } = formData;

    if (!name || !email || !password || !password_confirmation || !phone) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== password_confirmation) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    const resultAction = await dispatch(register(formData));
    if (register.fulfilled.match(resultAction)) {
      Toast.show({
        type: 'success',
        text1: 'Registration Successful',
        text2: 'You can now login with your credentials',
      });
      navigation.navigate('Login');
    } else {
      Alert.alert('Registration Failed', resultAction.payload || 'Something went wrong');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} style={commonStyles.container}>
      <View style={styles.content}>
        <Text style={[textStyles.h1, { marginBottom: spacing.lg }]}>Create Account</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={commonStyles.input}
            placeholder="John Doe"
            value={formData.name}
            onChangeText={(val) => handleInputChange('name', val)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={commonStyles.input}
            placeholder="example@mail.com"
            value={formData.email}
            onChangeText={(val) => handleInputChange('email', val)}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={commonStyles.input}
            placeholder="1234567890"
            value={formData.phone}
            onChangeText={(val) => handleInputChange('phone', val)}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={commonStyles.input}
            placeholder="********"
            value={formData.password}
            onChangeText={(val) => handleInputChange('password', val)}
            secureTextEntry
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={commonStyles.input}
            placeholder="********"
            value={formData.password_confirmation}
            onChangeText={(val) => handleInputChange('password_confirmation', val)}
            secureTextEntry
          />
        </View>

        <Button 
          title="Register" 
          onPress={handleRegister} 
          loading={loading}
          style={{ marginTop: spacing.lg }}
        />

        <TouchableOpacity 
          onPress={() => navigation.navigate('Login')} 
          style={styles.footerLink}
        >
          <Text style={textStyles.caption}>
            Already have an account? <Text style={styles.linkText}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: spacing.xxl,
  },
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
  footerLink: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  linkText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
