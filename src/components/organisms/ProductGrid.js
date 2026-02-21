import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ProductCard from '../molecules/ProductCard';
import { spacing } from '../../styles/spacing';

const ProductGrid = ({ products, onProductPress, ...props }) => {
  return (
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <ProductCard product={item} onPress={() => onProductPress(item)} />
      )}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
});

export default ProductGrid;
