import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';

const SearchBar = ({ onSearch, placeholder = "Search for Dry Fruits...", style, editable = true, autoFocus = false }) => {
  const [query, setQuery] = useState('');
  const navigation = useNavigation();

  const handlePress = () => {
    if (!editable) {
        navigation.navigate('Search');
    }
  };

  return (
    <TouchableOpacity 
        activeOpacity={1} 
        onPress={handlePress} 
        style={[styles.container, style]}
    >
      <Icon name="magnify" size={24} color={colors.gray[500]} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={query}
        editable={editable}
        autoFocus={autoFocus}
        onChangeText={(text) => {
          setQuery(text);
          onSearch && onSearch(text);
        }}
        placeholderTextColor={colors.gray[400]}
      />
      {query.length > 0 && editable && (
        <TouchableOpacity onPress={() => {
            setQuery('');
            onSearch && onSearch('');
        }}>
          <Icon name="close-circle" size={20} color={colors.gray[500]} />
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.filterBtn}>
        <Icon name="tune" size={22} color={colors.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    height: 50,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  input: {
    flex: 1,
    height: '100%',
    marginLeft: spacing.xs,
    fontSize: 16,
    color: colors.text.primary,
    paddingVertical: 0, // Fix for Android vertical alignment
  },
  filterBtn: {
    marginLeft: spacing.sm,
    paddingLeft: spacing.sm,
    borderLeftWidth: 1,
    borderLeftColor: colors.gray[300],
  }
});

export default SearchBar;
