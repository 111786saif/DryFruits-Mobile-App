import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Switch, ActivityIndicator, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addAddress } from '../../store/slices/addressSlice';
import Button from '../../components/atoms/Button';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import { commonStyles } from '../../styles/commonStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

const AddAddressScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'USA',
    type: 'shipping', // Using 'shipping' as default to match API expectations
    is_default: false,
  });

  const handleSave = async () => {
    // Basic Validation
    const requiredFields = ['name', 'email', 'phone', 'address_line_1', 'city', 'state', 'postal_code'];
    for (let field of requiredFields) {
      if (!formData[field]) {
        Toast.show({
          type: 'error',
          text1: 'Missing Information',
          text2: `Please fill in your ${field.replace('_', ' ')}`,
        });
        return;
      }
    }

    setLoading(true);
    try {
      await dispatch(addAddress(formData)).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Address Saved',
        text2: 'Your delivery address has been added.',
      });
      navigation.goBack();
    } catch (error) {
      // Extract error message from API response if possible
      const errorMsg = typeof error === 'object' ? (error.message || JSON.stringify(error)) : error;
      Toast.show({
        type: 'error',
        text1: 'Failed to Save',
        text2: errorMsg || 'Please check your inputs.',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label, field, placeholder, keyboardType = 'default') => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={formData[field]}
        onChangeText={(text) => setFormData({ ...formData, [field]: text })}
        keyboardType={keyboardType}
        placeholderTextColor={colors.gray[400]}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Address</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Details</Text>
            {renderInput('Full Name', 'name', 'e.g. John Doe')}
            {renderInput('Email Address', 'email', 'e.g. john@example.com', 'email-address')}
            {renderInput('Phone Number', 'phone', 'e.g. +1 234 567 890', 'phone-pad')}
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address Details</Text>
            {renderInput('Address Line 1', 'address_line_1', 'Street name, House/Apt No.')}
            {renderInput('Address Line 2 (Optional)', 'address_line_2', 'Landmark, Building name')}
            
            <View style={styles.row}>
                <View style={{ flex: 1, marginRight: spacing.sm }}>
                    {renderInput('City', 'city', 'e.g. New York')}
                </View>
                <View style={{ flex: 1 }}>
                    {renderInput('State', 'state', 'e.g. NY')}
                </View>
            </View>

            <View style={styles.row}>
                <View style={{ flex: 1, marginRight: spacing.sm }}>
                    {renderInput('Postal Code', 'postal_code', 'e.g. 10001', 'number-pad')}
                </View>
                <View style={{ flex: 1 }}>
                    {renderInput('Country', 'country', 'e.g. USA')}
                </View>
            </View>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address Category</Text>
            <View style={styles.typeContainer}>
                {[
                  { label: 'Shipping', value: 'shipping' },
                  { label: 'Billing', value: 'billing' }
                ].map(item => (
                    <TouchableOpacity 
                        key={item.value}
                        style={[styles.typeBtn, formData.type === item.value && styles.typeBtnActive]}
                        onPress={() => setFormData({ ...formData, type: item.value })}
                    >
                        <Text style={[styles.typeBtnText, formData.type === item.value && styles.typeBtnTextActive]}>{item.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>

        <View style={styles.defaultContainer}>
            <View>
                <Text style={styles.defaultTitle}>Set as Default Address</Text>
                <Text style={styles.defaultSubtitle}>Use this address for all future orders</Text>
            </View>
            <Switch
                value={formData.is_default}
                onValueChange={(val) => setFormData({ ...formData, is_default: val })}
                trackColor={{ false: colors.gray[300], true: colors.primary + '80' }}
                thumbColor={formData.is_default ? colors.primary : colors.gray[100]}
            />
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>

      <View style={styles.footer}>
        <Button 
            title="Save Address" 
            onPress={handleSave} 
            loading={loading}
            icon="content-save-outline"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[100],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  scrollContent: {
    padding: spacing.md,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    paddingLeft: 8,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.gray[100],
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 16,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  row: {
    flexDirection: 'row',
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray[300],
    marginHorizontal: 4,
  },
  typeBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[600],
  },
  typeBtnTextActive: {
    color: colors.white,
  },
  defaultContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 16,
    marginBottom: spacing.md,
  },
  defaultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  defaultSubtitle: {
    fontSize: 12,
    color: colors.gray[500],
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingBottom: Platform.OS === 'ios' ? 30 : spacing.lg,
  },
});

export default AddAddressScreen;
