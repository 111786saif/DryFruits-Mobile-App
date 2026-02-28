import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import SearchBar from '../../components/molecules/SearchBar';
import ProductCard from '../../components/molecules/ProductCard';
import EmptyState from '../../components/molecules/EmptyState';
import { searchProducts, clearSearch } from '../../store/slices/productSlice';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import { textStyles } from '../../styles/typography';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { searchResults, searchLoading } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  // Debounced API search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      dispatch(clearSearch());
      return;
    }
    
    const timer = setTimeout(() => {
      dispatch(searchProducts({ search: searchQuery.trim() }));
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery, dispatch]);

  useEffect(() => {
    return () => dispatch(clearSearch());
  }, [dispatch]);

  const renderProductItem = ({ item }) => (
    <View style={styles.productWrapper}>
      <ProductCard product={item} onPress={() => navigation.navigate('ProductDetails', { product: item })} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <SearchBar 
          style={styles.searchBar} 
          autoFocus={true} 
          onSearch={(text) => setSearchQuery(text)} 
        />
      </View>

      <View style={styles.content}>
        {searchQuery.trim() === '' ? (
          <View style={styles.recentSearch}>
             <Text style={styles.sectionTitle}>Popular Categories</Text>
             <View style={styles.tagContainer}>
               {['Cashews', 'Almonds', 'Walnuts', 'Dates', 'Pistachios'].map(tag => (
                 <TouchableOpacity 
                    key={tag} 
                    style={styles.tag}
                    onPress={() => setSearchQuery(tag)}
                 >
                   <Text style={styles.tagText}>{tag}</Text>
                 </TouchableOpacity>
               ))}
             </View>
          </View>
        ) : searchLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <EmptyState 
            icon="magnify-close"
            title="No results found"
            subtitle={`We couldn't find anything matching "${searchQuery}"`}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: colors.white,
  },
  backBtn: {
    padding: 8,
    marginRight: 4,
  },
  searchBar: {
    flex: 1,
    marginVertical: 0,
  },
  content: {
    flex: 1,
  },
  recentSearch: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  tagText: {
    fontSize: 14,
    color: colors.gray[700],
    fontWeight: '600',
  },
  listContent: {
    padding: spacing.md,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  productWrapper: {
    width: '48%',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default SearchScreen;
