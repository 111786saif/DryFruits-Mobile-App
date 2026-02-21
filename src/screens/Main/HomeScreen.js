import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, ScrollView, RefreshControl, Dimensions, Image, FlatList, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ProductGrid from '../../components/organisms/ProductGrid';
import { fetchProducts, fetchCategories } from '../../store/slices/productSlice';
import { MOCK_BANNERS } from '../../api/mockData';
import { commonStyles } from '../../styles/commonStyles';
import { textStyles } from '../../styles/typography';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';

const { width } = Dimensions.get('window');

const BannerSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50
  };

  return (
    <View style={styles.sliderContainer}>
      <FlatList
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
              { backgroundColor: index === activeIndex ? colors.primary : colors.gray[300] },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const onRefresh = () => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const renderHeader = () => (
    <View>
      <BannerSlider />
      <View style={styles.sectionHeader}>
        <Text style={textStyles.h3}>Top Categories</Text>
        <Text style={[textStyles.caption, { color: colors.primary }]} onPress={() => navigation.navigate('Categories')}>See All</Text>
      </View>
      <View style={styles.sectionHeader}>
        <Text style={textStyles.h3}>Featured Products</Text>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.loaderContainer}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : error ? (
        <View style={{alignItems: 'center'}}>
           <Text style={[textStyles.body, {color: colors.error}]}>Unable to connect to server</Text>
           <Text style={textStyles.caption}>{error}</Text>
           <TouchableOpacity onPress={onRefresh} style={{marginTop: 10}}>
              <Text style={{color: colors.primary, fontWeight: 'bold'}}>Try Again</Text>
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
          <Text style={[textStyles.h2, { color: colors.primary, fontWeight: '800' }]}>EVEREST</Text>
          <Text style={[textStyles.caption, { color: colors.gray[500] }]}>Nature's Finest Selection</Text>
        </View>
        <TouchableOpacity style={styles.profileBadge} onPress={() => navigation.navigate('User')}>
            <Text style={{color: colors.white, fontWeight: 'bold'}}>{getInitials(user?.name)}</Text>
        </TouchableOpacity>
      </View>
      
      <ProductGrid 
        products={products} 
        onProductPress={(product) => navigation.navigate('ProductDetails', { product })}
        ListHeaderComponent={renderHeader}
        refreshing={loading}
        onRefresh={onRefresh}
        ListEmptyComponent={renderEmpty}
      />
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
  profileBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderContainer: {
    height: 200,
    marginVertical: spacing.md,
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
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: spacing.sm,
    borderRadius: 8,
  },
  bannerTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  bannerSubtitle: {
    color: colors.white,
    fontSize: 12,
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  loaderContainer: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
});

export default HomeScreen;
