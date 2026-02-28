import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, RefreshControl, Dimensions, Image, FlatList, TouchableOpacity, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ProductGrid from '../../components/organisms/ProductGrid';
import { fetchProducts, fetchCategories, fetchTopProducts, fetchSpecialOffers } from '../../store/slices/productSlice';
import { fetchWishlist } from '../../store/slices/wishlistSlice';
import { MOCK_BANNERS } from '../../api/mockData';
import { commonStyles } from '../../styles/commonStyles';
import { textStyles } from '../../styles/typography';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import SearchBar from '../../components/molecules/SearchBar';
import CategoryBubble from '../../components/molecules/CategoryBubble';
import ProductSkeleton from '../../components/molecules/ProductSkeleton';
import ProductCard from '../../components/molecules/ProductCard';

const { width } = Dimensions.get('window');

const BannerSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      let nextIndex = activeIndex + 1;
      if (nextIndex >= MOCK_BANNERS.length) {
        nextIndex = 0;
      }
      
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setActiveIndex(nextIndex);
    }, 4000);

    return () => clearInterval(timer);
  }, [activeIndex]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50
  }).current;

  return (
    <View style={styles.sliderContainer}>
      <FlatList
        ref={flatListRef}
        data={MOCK_BANNERS}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item }) => (
          <View style={styles.bannerItem}>
            <Image source={{ uri: item.image }} style={styles.bannerImage} />
            <View style={styles.bannerOverlay}>
              <Text style={styles.bannerTitle}>{item.title}</Text>
              <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
              <TouchableOpacity style={styles.shopNowBtn}>
                <Text style={styles.shopNowText}>Shop Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.pagination}>
        {MOCK_BANNERS.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items: products, topItems, specialOffers, categories, loading, categoriesLoading, topLoading, error } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    dispatch(fetchTopProducts());
    dispatch(fetchSpecialOffers());
    dispatch(fetchWishlist());
  }, [dispatch]);

  const onRefresh = () => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    dispatch(fetchTopProducts());
    dispatch(fetchSpecialOffers());
    dispatch(fetchWishlist());
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const renderHeader = () => (
    <View style={{ backgroundColor: colors.white }}>
      <View style={styles.searchContainer}>
        <SearchBar editable={false} onSearch={(text) => console.log('Search:', text)} />
      </View>

      <BannerSlider />

      <View style={styles.sectionHeader}>
        <Text style={textStyles.h3}>Top Categories</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
          <Text style={[textStyles.caption, { color: colors.primary, fontWeight: '700' }]}>See All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesList}
        renderItem={({ item }) => (
          <CategoryBubble 
            category={item} 
            isActive={activeCategory === item.id}
            onPress={() => setActiveCategory(item.id === activeCategory ? null : item.id)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      {topItems.length > 0 && (
        <View>
          <View style={styles.sectionHeader}>
            <Text style={textStyles.h3}>Top Rated</Text>
          </View>
          <FlatList
            data={topItems}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.topItemsList}
            renderItem={({ item }) => (
              <View style={{ width: 160, marginRight: spacing.md }}>
                <ProductCard product={item} onPress={() => navigation.navigate('ProductDetails', { product: item })} />
              </View>
            )}
            keyExtractor={(item) => `top-${item.id}`}
          />
        </View>
      )}

      {specialOffers.length > 0 && (
        <View>
          <View style={styles.sectionHeader}>
            <Text style={textStyles.h3}>Special Offers</Text>
          </View>
          <FlatList
            data={specialOffers}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.topItemsList}
            renderItem={({ item }) => (
              <View style={{ width: 160, marginRight: spacing.md }}>
                <ProductCard product={item} onPress={() => navigation.navigate('ProductDetails', { product: item })} />
              </View>
            )}
            keyExtractor={(item) => `offer-${item.id}`}
          />
        </View>
      )}

      <View style={styles.sectionHeader}>
        <Text style={textStyles.h3}>Featured Products</Text>
      </View>
    </View>
  );

  const renderLoading = () => (
    <View style={styles.skeletonGrid}>
      {[1, 2, 3, 4].map((i) => (
        <ProductSkeleton key={i} />
      ))}
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      {error ? (
        <View style={{ alignItems: 'center' }}>
          <Text style={[textStyles.body, { color: colors.error }]}>Unable to connect to server</Text>
          <TouchableOpacity onPress={onRefresh} style={styles.retryBtn}>
            <Text style={{ color: colors.white, fontWeight: 'bold' }}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={textStyles.body}>No products found</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.header}>
        <View>
          <Text style={[textStyles.h2, { color: colors.primary, fontWeight: '900', letterSpacing: 1 }]}>EVEREST</Text>
          <Text style={[textStyles.caption, { color: colors.gray[500], marginTop: -4 }]}>Premium Dry Fruits & Nuts</Text>
        </View>
        <TouchableOpacity style={styles.profileBadge} onPress={() => navigation.navigate('User')}>
          <Text style={{ color: colors.white, fontWeight: 'bold' }}>{getInitials(user?.name)}</Text>
        </TouchableOpacity>
      </View>

      {loading && products.length === 0 ? (
        <ScrollView style={{ flex: 1 }}>
           {renderHeader()}
           {renderLoading()}
        </ScrollView>
      ) : (
        <ProductGrid
          products={products}
          onProductPress={(product) => navigation.navigate('ProductDetails', { product })}
          ListHeaderComponent={renderHeader}
          refreshing={loading}
          onRefresh={onRefresh}
          ListEmptyComponent={renderEmpty}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.white,
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
  },
  profileBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  sliderContainer: {
    height: 190,
    marginVertical: spacing.sm,
  },
  bannerItem: {
    width: width,
    paddingHorizontal: spacing.md,
  },
  bannerImage: {
    width: width - (spacing.md * 2),
    height: 180,
    borderRadius: 16,
    backgroundColor: colors.gray[200],
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: spacing.md,
    borderRadius: 12,
  },
  bannerTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '900',
  },
  bannerSubtitle: {
    color: colors.white,
    fontSize: 14,
    opacity: 0.9,
    marginTop: 4,
  },
  shopNowBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  shopNowText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  activeDot: {
    width: 20,
    backgroundColor: colors.primary,
  },
  inactiveDot: {
    width: 6,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  categoriesList: {
    paddingLeft: spacing.md,
    paddingBottom: spacing.sm,
  },
  topItemsList: {
    paddingLeft: spacing.md,
    paddingBottom: spacing.sm,
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  emptyContainer: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  retryBtn: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
});

export default HomeScreen;
