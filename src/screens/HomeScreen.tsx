import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  Dimensions,
  FlatList,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList, Product} from '../../App';

const {width} = Dimensions.get('window');
const CARD_WIDTH = (width - 28 * 2 - 12) / 2;

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
interface Props {navigation: HomeScreenNavigationProp}

const CATEGORIES = ['All', 'Fashion', 'Electronics', 'Beauty', 'Home', 'Sports'];

const PRODUCTS: Product[] = [
  {id:'1', name:'Silk Wrap Dress', price:189, originalPrice:240, category:'Fashion', emoji:'👗', rating:4.8, reviews:234, badge:'BESTSELLER'},
  {id:'2', name:'Pro Wireless Buds', price:299, originalPrice:349, category:'Electronics', emoji:'🎧', rating:4.9, reviews:891, badge:'NEW'},
  {id:'3', name:'Rose Gold Watch', price:459, category:'Fashion', emoji:'⌚', rating:4.7, reviews:128},
  {id:'4', name:'Vitamin C Serum', price:68, originalPrice:85, category:'Beauty', emoji:'💆', rating:4.8, reviews:567, badge:'HOT'},
  {id:'5', name:'Ceramic Diffuser', price:79, category:'Home', emoji:'🕯️', rating:4.6, reviews:203},
  {id:'6', name:'Running Shoes', price:145, originalPrice:180, category:'Sports', emoji:'👟', rating:4.9, reviews:445, badge:'SALE'},
  {id:'7', name:'Leather Tote Bag', price:225, category:'Fashion', emoji:'👜', rating:4.7, reviews:167},
  {id:'8', name:'Smart Air Purifier', price:389, originalPrice:440, category:'Electronics', emoji:'🌬️', rating:4.5, reviews:312},
  {id:'9', name:'Gold Hoop Earrings', price:89, category:'Fashion', emoji:'💛', rating:4.8, reviews:89},
  {id:'10', name:'Yoga Mat Pro', price:75, category:'Sports', emoji:'🧘', rating:4.9, reviews:723},
];

const FEATURED = PRODUCTS.slice(0, 3);

const badgeColors: Record<string, string> = {
  BESTSELLER: '#C9A84C',
  NEW: '#4CAF50',
  HOT: '#FF5C5C',
  SALE: '#9C27B0',
};

const HomeScreen: React.FC<Props> = ({navigation}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const cartAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {toValue: 1, duration: 600, useNativeDriver: true}).start();
  }, []);

  const filtered = PRODUCTS.filter(p => {
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchText.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = () => {
    setCartCount(c => c + 1);
    Animated.sequence([
      Animated.spring(cartAnim, {toValue: 1.4, useNativeDriver: true, friction: 3}),
      Animated.spring(cartAnim, {toValue: 1, useNativeDriver: true, friction: 5}),
    ]).start();
  };

  const renderProduct = ({item}: {item: Product}) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', {product: item})}
      activeOpacity={0.88}>
      {item.badge && (
        <View style={[styles.badge, {backgroundColor: badgeColors[item.badge]}]}>
          <Text style={styles.badgeText}>{item.badge}</Text>
        </View>
      )}
      <View style={styles.productEmoji}>
        <Text style={styles.productEmojiText}>{item.emoji}</Text>
      </View>
      <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
      <View style={styles.ratingRow}>
        <Text style={styles.star}>★</Text>
        <Text style={styles.ratingText}>{item.rating}</Text>
        <Text style={styles.reviewsText}>({item.reviews})</Text>
      </View>
      <View style={styles.priceRow}>
        <Text style={styles.price}>${item.price}</Text>
        {item.originalPrice && (
          <Text style={styles.originalPrice}>${item.originalPrice}</Text>
        )}
      </View>
      <TouchableOpacity style={styles.addBtn} onPress={addToCart} activeOpacity={0.8}>
        <Text style={styles.addBtnText}>+ Add</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning ✦</Text>
            <Text style={styles.headerTitle}>
              <Text style={styles.headerBold}>LUX</Text>
              <Text style={styles.headerLight}>CART</Text>
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Animated.View style={{transform: [{scale: cartAnim}]}}>
              <TouchableOpacity
                style={styles.cartBtn}
                onPress={() => navigation.navigate('Cart')}>
                <Text style={styles.cartIcon}>🛒</Text>
                {cartCount > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{cartCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search luxury products..."
            placeholderTextColor="#555"
            value={searchText}
            onChangeText={setSearchText}
            selectionColor="#C9A84C"
          />
        </View>

        <Animated.View style={[{flex: 1}, {opacity: fadeAnim}]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Featured Banner */}
            {!searchText && selectedCategory === 'All' && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Featured</Text>
                  <TouchableOpacity>
                    <Text style={styles.seeAll}>See all →</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.featuredRow}>
                    {FEATURED.map(item => (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.featuredCard}
                        onPress={() =>
                          navigation.navigate('ProductDetail', {product: item})
                        }
                        activeOpacity={0.88}>
                        <Text style={styles.featuredEmoji}>{item.emoji}</Text>
                        <Text style={styles.featuredName}>{item.name}</Text>
                        <Text style={styles.featuredPrice}>${item.price}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}

            {/* Categories */}
            <View style={styles.categoriesWrap}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.categoriesRow}>
                  {CATEGORIES.map(cat => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryPill,
                        selectedCategory === cat && styles.categoryPillActive,
                      ]}
                      onPress={() => setSelectedCategory(cat)}>
                      <Text
                        style={[
                          styles.categoryText,
                          selectedCategory === cat && styles.categoryTextActive,
                        ]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Products grid */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {selectedCategory === 'All' ? 'All Products' : selectedCategory}
                </Text>
                <Text style={styles.countText}>{filtered.length} items</Text>
              </View>

              {filtered.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyEmoji}>🔍</Text>
                  <Text style={styles.emptyText}>No products found</Text>
                </View>
              ) : (
                <View style={styles.grid}>
                  {filtered.map((item, i) => (
                    <View key={item.id}>{renderProduct({item})}</View>
                  ))}
                </View>
              )}
            </View>

            <View style={{height: 32}} />
          </ScrollView>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#0A0A0F'},
  safeArea: {flex: 1},
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 12,
    paddingBottom: 16,
  },
  greeting: {color: '#666', fontSize: 12, letterSpacing: 1, marginBottom: 2},
  headerTitle: {fontSize: 26, letterSpacing: 4},
  headerBold: {color: '#FFFFFF', fontWeight: '900'},
  headerLight: {color: '#C9A84C', fontWeight: '200'},
  headerRight: {flexDirection: 'row', gap: 12},
  cartBtn: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: '#111118',
    borderWidth: 1,
    borderColor: '#1E1E2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartIcon: {fontSize: 20},
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#C9A84C',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {color: '#0A0A0F', fontSize: 10, fontWeight: '800'},
  // Search
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111118',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E1E2E',
    paddingHorizontal: 16,
    height: 52,
    marginHorizontal: 28,
    marginBottom: 8,
    gap: 10,
  },
  searchIcon: {fontSize: 16},
  searchInput: {flex: 1, color: '#FFFFFF', fontSize: 15},
  // Sections
  section: {paddingHorizontal: 28, marginTop: 16},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  seeAll: {color: '#C9A84C', fontSize: 13},
  countText: {color: '#555', fontSize: 13},
  // Featured cards
  featuredRow: {flexDirection: 'row', gap: 12, paddingRight: 28},
  featuredCard: {
    width: 160,
    backgroundColor: '#111118',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1E1E2E',
    padding: 16,
    alignItems: 'center',
  },
  featuredEmoji: {fontSize: 44, marginBottom: 10},
  featuredName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 6,
  },
  featuredPrice: {color: '#C9A84C', fontWeight: '800', fontSize: 15},
  // Categories
  categoriesWrap: {marginTop: 8},
  categoriesRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 28,
    paddingVertical: 4,
  },
  categoryPill: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 50,
    backgroundColor: '#111118',
    borderWidth: 1,
    borderColor: '#1E1E2E',
  },
  categoryPillActive: {
    backgroundColor: '#C9A84C',
    borderColor: '#C9A84C',
  },
  categoryText: {color: '#888', fontSize: 13, fontWeight: '600'},
  categoryTextActive: {color: '#0A0A0F'},
  // Product grid
  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: 12},
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: '#111118',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1E1E2E',
    padding: 14,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
  },
  badgeText: {color: '#0A0A0F', fontSize: 9, fontWeight: '800', letterSpacing: 1},
  productEmoji: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  productEmojiText: {fontSize: 52},
  productName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 6,
  },
  ratingRow: {flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 6},
  star: {color: '#C9A84C', fontSize: 11},
  ratingText: {color: '#FFFFFF', fontSize: 11, fontWeight: '700'},
  reviewsText: {color: '#555', fontSize: 10},
  priceRow: {flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10},
  price: {color: '#C9A84C', fontSize: 16, fontWeight: '800'},
  originalPrice: {
    color: '#444',
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  addBtn: {
    backgroundColor: '#1A1A26',
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C9A84C',
  },
  addBtnText: {color: '#C9A84C', fontSize: 12, fontWeight: '700'},
  // Empty
  emptyState: {alignItems: 'center', paddingVertical: 60},
  emptyEmoji: {fontSize: 48, marginBottom: 12},
  emptyText: {color: '#555', fontSize: 16},
});

export default HomeScreen;
