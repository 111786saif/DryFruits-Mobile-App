import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, SafeAreaView, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../store/slices/productSlice';
import Skeleton from '../../components/atoms/Skeleton';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import { commonStyles } from '../../styles/commonStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - spacing.md * 3) / 2;

const CategoriesScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { categories = [], categoriesLoading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity 
      activeOpacity={0.9}
      style={[styles.categoryCard, commonStyles.shadow]}
      onPress={() => navigation.navigate('Home', { categoryId: item.id })}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.categoryImage} resizeMode="contain" />
      </View>
      <View style={styles.info}>
        <Text style={styles.categoryName}>{item.name}</Text>
        <View style={styles.countBadge}>
            <Text style={styles.countText}>{Math.floor(Math.random() * 20) + 5} Items</Text>
        </View>
      </View>
      <View style={styles.arrowBtn}>
        <Icon name="chevron-right" size={20} color={colors.white} />
      </View>
    </TouchableOpacity>
  );

  const renderLoading = () => (
    <View style={styles.grid}>
        {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} width={COLUMN_WIDTH} height={180} borderRadius={20} style={{ marginBottom: spacing.md }} />
        ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <Text style={styles.subtitle}>Discover nature's goodness</Text>
      </View>

      {categoriesLoading && categories.length === 0 ? (
        renderLoading()
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={!categoriesLoading && (
            <View style={styles.center}>
                <Icon name="package-variant-closed" size={64} color={colors.gray[300]} />
                <Text style={{ marginTop: 16, color: colors.gray[500] }}>No categories found</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray[500],
    fontWeight: '600',
    marginTop: 2,
  },
  listContainer: {
    padding: spacing.md,
    paddingBottom: 100, // Space for tab bar
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  categoryCard: {
    width: COLUMN_WIDTH,
    height: 200,
    backgroundColor: colors.white,
    borderRadius: 24,
    marginBottom: spacing.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.gray[100],
    position: 'relative',
  },
  imageContainer: {
    height: 110,
    backgroundColor: colors.gray[100],
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryImage: {
    width: '70%',
    height: '70%',
  },
  info: {
    marginTop: spacing.sm,
    paddingHorizontal: 4,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  countBadge: {
    backgroundColor: colors.primary + '15',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  countText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: 'bold',
  },
  arrowBtn: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  }
});

export default CategoriesScreen;
