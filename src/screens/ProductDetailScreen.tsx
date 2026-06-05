import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../App';

type ProductDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductDetail'>;
type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

interface Props {
  navigation: ProductDetailNavigationProp;
  route: ProductDetailRouteProp;
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const COLORS = ['#2C2C2C', '#C9A84C', '#8B6914', '#FFFFFF', '#FF5C5C'];

const ProductDetailScreen: React.FC<Props> = ({navigation, route}) => {
  const {product} = route.params;
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const heartAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {toValue: 1, duration: 500, useNativeDriver: true}),
      Animated.timing(slideAnim, {toValue: 0, duration: 450, useNativeDriver: true}),
    ]).start();
  }, []);

  const toggleWishlist = () => {
    setWishlisted(v => !v);
    Animated.sequence([
      Animated.spring(heartAnim, {toValue: 1.5, useNativeDriver: true, friction: 3}),
      Animated.spring(heartAnim, {toValue: 1, useNativeDriver: true, friction: 5}),
    ]).start();
  };

  const handleAddToCart = () => {
    Alert.alert(
      '✦ Added to Cart',
      `${product.name} (Qty: ${quantity}) added to your cart!`,
      [{text: 'Continue Shopping'}, {text: 'View Cart', onPress: () => navigation.navigate('Cart')}],
    );
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const hasSizes = ['Fashion', 'Sports'].includes(product.category);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{product.category}</Text>
          <Animated.View style={{transform: [{scale: heartAnim}]}}>
            <TouchableOpacity style={styles.wishlistBtn} onPress={toggleWishlist}>
              <Text style={styles.wishlistIcon}>{wishlisted ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Product hero */}
          <Animated.View style={[styles.heroSection, {opacity: fadeAnim}]}>
            <View style={styles.emojiContainer}>
              <Text style={styles.productEmoji}>{product.emoji}</Text>
            </View>

            {/* Color swatches */}
            <View style={styles.colorRow}>
              {COLORS.map((color, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.colorSwatch,
                    {backgroundColor: color},
                    selectedColor === i && styles.colorSwatchSelected,
                  ]}
                  onPress={() => setSelectedColor(i)}
                />
              ))}
            </View>
          </Animated.View>

          <Animated.View
            style={[
              styles.detailSection,
              {opacity: fadeAnim, transform: [{translateY: slideAnim}]},
            ]}>
            {/* Name & rating */}
            <View style={styles.nameRow}>
              <Text style={styles.productName}>{product.name}</Text>
            </View>

            <View style={styles.ratingRow}>
              <View style={styles.stars}>
                {[1,2,3,4,5].map(s => (
                  <Text key={s} style={[styles.star, {opacity: s <= Math.floor(product.rating) ? 1 : 0.3}]}>
                    ★
                  </Text>
                ))}
              </View>
              <Text style={styles.ratingText}>{product.rating}</Text>
              <Text style={styles.reviewsText}>({product.reviews} reviews)</Text>
            </View>

            {/* Price */}
            <View style={styles.priceRow}>
              <Text style={styles.price}>${product.price}</Text>
              {product.originalPrice && (
                <>
                  <Text style={styles.originalPrice}>${product.originalPrice}</Text>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>-{discount}%</Text>
                  </View>
                </>
              )}
            </View>

            {/* Sizes */}
            {hasSizes && (
              <View style={styles.optionSection}>
                <Text style={styles.optionLabel}>SIZE</Text>
                <View style={styles.sizesRow}>
                  {SIZES.map(size => (
                    <TouchableOpacity
                      key={size}
                      style={[
                        styles.sizeBtn,
                        selectedSize === size && styles.sizeBtnActive,
                      ]}
                      onPress={() => setSelectedSize(size)}>
                      <Text
                        style={[
                          styles.sizeBtnText,
                          selectedSize === size && styles.sizeBtnTextActive,
                        ]}>
                        {size}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Description */}
            <View style={styles.descSection}>
              <Text style={styles.optionLabel}>ABOUT THIS PRODUCT</Text>
              <Text style={styles.description}>
                Experience unparalleled quality with our {product.name}. Crafted with
                premium materials and designed for those who appreciate the finer
                things in life. This piece combines timeless elegance with modern
                functionality, making it the perfect addition to your collection.
              </Text>
            </View>

            {/* Features */}
            <View style={styles.featuresGrid}>
              {[
                {icon: '🚚', label: 'Free Shipping', sub: 'Orders over $50'},
                {icon: '↩️', label: 'Easy Returns', sub: '30-day policy'},
                {icon: '✦', label: 'Authentic', sub: '100% guaranteed'},
                {icon: '💳', label: 'Secure Pay', sub: 'SSL encrypted'},
              ].map((f, i) => (
                <View key={i} style={styles.featureItem}>
                  <Text style={styles.featureIcon}>{f.icon}</Text>
                  <Text style={styles.featureLabel}>{f.label}</Text>
                  <Text style={styles.featureSub}>{f.sub}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
          <View style={{height: 100}} />
        </ScrollView>

        {/* Bottom bar */}
        <View style={styles.bottomBar}>
          <View style={styles.quantityControl}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity(q => Math.max(1, q - 1))}>
              <Text style={styles.qtyBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qtyText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity(q => q + 1)}>
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.addToCartBtn}
            onPress={handleAddToCart}
            activeOpacity={0.85}>
            <Text style={styles.addToCartText}>Add to Cart</Text>
            <Text style={styles.addToCartPrice}>${(product.price * quantity).toFixed(2)}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#0A0A0F'},
  safeArea: {flex: 1},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: '#111118', borderWidth: 1, borderColor: '#1E1E2E',
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow: {color: '#FFFFFF', fontSize: 20},
  headerTitle: {color: '#888', fontSize: 13, letterSpacing: 2, fontWeight: '600'},
  wishlistBtn: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: '#111118', borderWidth: 1, borderColor: '#1E1E2E',
    alignItems: 'center', justifyContent: 'center',
  },
  wishlistIcon: {fontSize: 20},
  // Hero
  heroSection: {
    backgroundColor: '#111118',
    borderRadius: 24,
    marginHorizontal: 24,
    marginTop: 8,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E1E2E',
  },
  emojiContainer: {
    width: 160, height: 160,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
  },
  productEmoji: {fontSize: 110},
  colorRow: {flexDirection: 'row', gap: 12},
  colorSwatch: {
    width: 28, height: 28, borderRadius: 14,
    borderWidth: 2, borderColor: 'transparent',
  },
  colorSwatchSelected: {borderColor: '#C9A84C'},
  // Detail section
  detailSection: {paddingHorizontal: 24, paddingTop: 24},
  nameRow: {marginBottom: 10},
  productName: {color: '#FFFFFF', fontSize: 24, fontWeight: '700', lineHeight: 30},
  ratingRow: {flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16},
  stars: {flexDirection: 'row', gap: 2},
  star: {color: '#C9A84C', fontSize: 14},
  ratingText: {color: '#FFFFFF', fontWeight: '700', fontSize: 14},
  reviewsText: {color: '#555', fontSize: 13},
  priceRow: {flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 24},
  price: {color: '#C9A84C', fontSize: 28, fontWeight: '900'},
  originalPrice: {color: '#444', fontSize: 18, textDecorationLine: 'line-through'},
  discountBadge: {
    backgroundColor: '#1A1A10', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 4,
    borderWidth: 1, borderColor: '#C9A84C44',
  },
  discountText: {color: '#C9A84C', fontSize: 12, fontWeight: '700'},
  // Options
  optionSection: {marginBottom: 24},
  optionLabel: {
    color: '#C9A84C', fontSize: 10, letterSpacing: 2,
    fontWeight: '700', marginBottom: 12, fontFamily: 'Courier',
  },
  sizesRow: {flexDirection: 'row', gap: 10},
  sizeBtn: {
    width: 50, height: 50, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#111118', borderWidth: 1, borderColor: '#1E1E2E',
  },
  sizeBtnActive: {backgroundColor: '#C9A84C', borderColor: '#C9A84C'},
  sizeBtnText: {color: '#888', fontSize: 13, fontWeight: '700'},
  sizeBtnTextActive: {color: '#0A0A0F'},
  // Description
  descSection: {marginBottom: 24},
  description: {color: '#888', fontSize: 14, lineHeight: 22},
  // Features
  featuresGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20,
  },
  featureItem: {
    flex: 1, minWidth: '45%',
    backgroundColor: '#111118',
    borderRadius: 14, borderWidth: 1, borderColor: '#1E1E2E',
    padding: 14, alignItems: 'center', gap: 4,
  },
  featureIcon: {fontSize: 22},
  featureLabel: {color: '#FFFFFF', fontSize: 12, fontWeight: '700'},
  featureSub: {color: '#555', fontSize: 10},
  // Bottom bar
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#0A0A0F',
    borderTopWidth: 1, borderTopColor: '#1E1E2E',
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 24, paddingVertical: 16, paddingBottom: 28,
  },
  quantityControl: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#111118', borderRadius: 14,
    borderWidth: 1, borderColor: '#1E1E2E',
    overflow: 'hidden',
  },
  qtyBtn: {
    width: 44, height: 52,
    alignItems: 'center', justifyContent: 'center',
  },
  qtyBtnText: {color: '#C9A84C', fontSize: 20, fontWeight: '300'},
  qtyText: {
    color: '#FFFFFF', fontSize: 16, fontWeight: '700',
    paddingHorizontal: 16,
  },
  addToCartBtn: {
    flex: 1, backgroundColor: '#C9A84C', borderRadius: 14,
    paddingVertical: 16, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20,
    shadowColor: '#C9A84C', shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  addToCartText: {color: '#0A0A0F', fontSize: 15, fontWeight: '800', letterSpacing: 0.5},
  addToCartPrice: {color: '#0A0A0F', fontSize: 15, fontWeight: '900'},
});

export default ProductDetailScreen;
