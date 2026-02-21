import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { commonStyles } from '../../styles/commonStyles';
import { textStyles } from '../../styles/typography';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProfileOption = ({ icon, title, subtitle, onPress, color = colors.text.primary }) => (
  <TouchableOpacity style={styles.optionItem} onPress={onPress}>
    <View style={[styles.iconContainer, { backgroundColor: color + '10' }]}>
      <Icon name={icon} size={24} color={color} />
    </View>
    <View style={styles.optionTextContainer}>
      <Text style={[textStyles.body, { fontWeight: '600' }]}>{title}</Text>
      {subtitle && <Text style={[textStyles.caption, { color: colors.gray[500] }]}>{subtitle}</Text>}
    </View>
    <Icon name="chevron-right" size={24} color={colors.gray[400]} />
  </TouchableOpacity>
);

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const menuOptions = [
    { icon: 'package-variant-closed', title: 'My Orders', subtitle: 'Check your order status', screen: 'Orders', color: '#4CAF50' },
    { icon: 'heart-outline', title: 'Wishlist', subtitle: 'Your favorite items', screen: 'Wishlist', color: '#E91E63' },
    { icon: 'map-marker-outline', title: 'Addresses', subtitle: 'Manage delivery locations', screen: 'Addresses', color: '#2196F3' },
    { icon: 'credit-card-outline', title: 'Payment Methods', subtitle: 'Saved cards & UPI', screen: '', color: '#FF9800' },
    { icon: 'bell-outline', title: 'Notifications', subtitle: 'Stay updated', screen: '', color: '#9C27B0' },
  ];

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{user?.name?.substring(0, 1) || 'U'}</Text>
            </View>
            <View style={{ marginLeft: spacing.md }}>
              <Text style={textStyles.h3}>{user?.name || 'Everest User'}</Text>
              <Text style={[textStyles.caption, { color: colors.gray[500] }]}>{user?.email || 'user@everest.com'}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Icon name="pencil" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.menuContainer}>
          <Text style={[textStyles.caption, styles.menuLabel]}>ACCOUNT SETTINGS</Text>
          {menuOptions.map((option, index) => (
            <ProfileOption 
              key={index}
              icon={option.icon}
              title={option.title}
              subtitle={option.subtitle}
              color={option.color}
              onPress={() => option.screen && navigation.navigate(option.screen)}
            />
          ))}
        </View>

        <View style={styles.menuContainer}>
          <Text style={[textStyles.caption, styles.menuLabel]}>SUPPORT</Text>
          <ProfileOption icon="help-circle-outline" title="Help Center" color={colors.gray[600]} />
          <ProfileOption icon="information-outline" title="About Everest" color={colors.gray[600]} />
        </View>

        <TouchableOpacity 
          style={styles.logoutBtn}
          onPress={() => dispatch(logout())}
        >
          <Icon name="logout" size={22} color={colors.error} />
          <Text style={[textStyles.body, { color: colors.error, fontWeight: 'bold', marginLeft: spacing.sm }]}>
            Logout
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>Version 1.0.0 (Everest Premium)</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.xl,
    backgroundColor: colors.white,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  editBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: colors.white,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
  menuLabel: {
    paddingVertical: spacing.md,
    color: colors.gray[400],
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[50],
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTextContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.white,
  },
  versionText: {
    textAlign: 'center',
    color: colors.gray[300],
    fontSize: 10,
    marginBottom: spacing.xxl,
  },
});

export default ProfileScreen;
