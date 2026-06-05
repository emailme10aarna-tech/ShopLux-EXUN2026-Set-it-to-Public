import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';

type CartScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Cart'>;
interface Props {navigation: CartScreenNavigationProp}

const CART_ITEMS = [
  {id: '1', name: 'Silk Wrap Dress', price: 189, qty: 1, emoji: '👗', size: 'M'},
  {id: '2', name: 'Pro Wireless Buds', price: 299, qty: 1, emoji: '🎧', size: '-'},
  {id: '6', name: 'Running Shoes', price: 145, qty: 2, emoji: '👟', size: 'L'},
];

const CartScreen: React.FC<Props> = ({navigation}) => {
  const [items, setItems] = useState(CART_ITEMS);
  const [promoCode, setPromoCode] = useState('');

  const updateQty = (id: string, delta: number) => {
    setItems(prev =>
      prev
        .map(item =>
          item.id === id ? {...item, qty: item.qty + delta} : item,
        )
        .filter(item => item.qty > 0),
    );
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    Alert.alert(
      '✦ Order Placed!',
      `Your order of $${total.toFixed(2)} has been placed successfully. Thank you for shopping with LUXCART!`,
      [{text: 'Continue Shopping', onPress: () => navigation.navigate('Home')}],
    );
  };

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🛒</Text>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySubtitle}>Add some luxury to your life</Text>
            <TouchableOpacity
              style={styles.shopBtn}
              onPress={() => navigation.navigate('Home')}>
              <Text style={styles.shopBtnText}>Start Shopping →</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Cart</Text>
          <View style={styles.itemCountBadge}>
            <Text style={styles.itemCountText}>{items.length}</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Free shipping progress */}
          {subtotal < 50 && (
            <View style={styles.shippingBanner}>
              <Text style={styles.shippingBannerText}>
                🚚 Add ${(50 - subtotal).toFixed(2)} more for FREE shipping!
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {width: `${Math.min((subtotal / 50) * 100, 100)}%`},
                  ]}
                />
              </View>
            </View>
          )}

          {subtotal >= 50 && (
            <View style={[styles.shippingBanner, {borderColor: '#4CAF5044'}]}>
              <Text style={[styles.shippingBannerText, {color: '#4CAF50'}]}>
                🎉 You've unlocked FREE shipping!
              </Text>
            </View>
          )}

          {/* Cart items */}
          <View style={styles.itemsSection}>
            {items.map(item => (
              <View key={item.id} style={styles.cartItem}>
                <View style={styles.itemEmoji}>
                  <Text style={styles.itemEmojiText}>{item.emoji}</Text>
                </View>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemSize}>
                    {item.size !== '-' ? `Size: ${item.size}` : 'One size'}
                  </Text>
                  <Text style={styles.itemPrice}>${item.price}</Text>
                </View>
                <View style={styles.qtyControl}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQty(item.id, -1)}>
                    <Text style={styles.qtyBtnText}>
                      {item.qty === 1 ? '🗑' : '−'}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{item.qty}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQty(item.id, 1)}>
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* Promo code */}
          <View style={styles.promoSection}>
            <Text style={styles.promoLabel}>PROMO CODE</Text>
            <View style={styles.promoRow}>
              <View style={styles.promoInput}>
                <Text style={styles.promoIcon}>🏷️</Text>
                <Text style={styles.promoText}>
                  {promoCode || 'Enter code...'}
                </Text>
              </View>
              <TouchableOpacity style={styles.promoBtn}>
                <Text style={styles.promoBtnText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Order summary */}
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text
                style={[
                  styles.summaryValue,
                  shipping === 0 && {color: '#4CAF50'},
                ]}>
                {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax (8%)</Text>
              <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>

          <View style={{height: 120}} />
        </ScrollView>

        {/* Checkout bar */}
        <View style={styles.checkoutBar}>
          <View style={styles.checkoutInfo}>
            <Text style={styles.checkoutLabel}>Total</Text>
            <Text style={styles.checkoutTotal}>${total.toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={handleCheckout}
            activeOpacity={0.85}>
            <Text style={styles.checkoutBtnText}>Checkout →</Text>
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
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: '#111118', borderWidth: 1, borderColor: '#1E1E2E',
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow: {color: '#FFFFFF', fontSize: 20},
  headerTitle: {flex: 1, color: '#FFFFFF', fontSize: 20, fontWeight: '700'},
  itemCountBadge: {
    backgroundColor: '#C9A84C', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  itemCountText: {color: '#0A0A0F', fontSize: 13, fontWeight: '800'},
  // Shipping banner
  shippingBanner: {
    marginHorizontal: 24, marginTop: 8,
    backgroundColor: '#111118', borderRadius: 14,
    borderWidth: 1, borderColor: '#C9A84C44',
    padding: 14, gap: 10,
  },
  shippingBannerText: {color: '#C9A84C', fontSize: 13, fontWeight: '600'},
  progressBar: {
    height: 4, backgroundColor: '#1E1E2E', borderRadius: 2, overflow: 'hidden',
  },
  progressFill: {height: '100%', backgroundColor: '#C9A84C', borderRadius: 2},
  // Items
  itemsSection: {paddingHorizontal: 24, paddingTop: 20, gap: 12},
  cartItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#111118', borderRadius: 18,
    borderWidth: 1, borderColor: '#1E1E2E',
    padding: 14, gap: 14,
  },
  itemEmoji: {
    width: 64, height: 64, borderRadius: 14,
    backgroundColor: '#1A1A2A',
    alignItems: 'center', justifyContent: 'center',
  },
  itemEmojiText: {fontSize: 36},
  itemDetails: {flex: 1, gap: 3},
  itemName: {color: '#FFFFFF', fontSize: 14, fontWeight: '600'},
  itemSize: {color: '#555', fontSize: 12},
  itemPrice: {color: '#C9A84C', fontSize: 16, fontWeight: '800'},
  qtyControl: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1A1A26', borderRadius: 12,
    borderWidth: 1, borderColor: '#1E1E2E',
  },
  qtyBtn: {
    width: 36, height: 40, alignItems: 'center', justifyContent: 'center',
  },
  qtyBtnText: {color: '#C9A84C', fontSize: 16},
  qtyText: {color: '#FFFFFF', fontWeight: '700', paddingHorizontal: 4},
  // Promo
  promoSection: {paddingHorizontal: 24, paddingTop: 24},
  promoLabel: {
    color: '#C9A84C', fontSize: 10, letterSpacing: 2,
    fontWeight: '700', marginBottom: 10, fontFamily: 'Courier',
  },
  promoRow: {flexDirection: 'row', gap: 10},
  promoInput: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#111118', borderRadius: 12,
    borderWidth: 1, borderColor: '#1E1E2E',
    paddingHorizontal: 14, height: 50, gap: 8,
  },
  promoIcon: {fontSize: 16},
  promoText: {color: '#444', fontSize: 14},
  promoBtn: {
    backgroundColor: '#1E1E2E', borderRadius: 12,
    paddingHorizontal: 20, height: 50,
    alignItems: 'center', justifyContent: 'center',
  },
  promoBtnText: {color: '#C9A84C', fontWeight: '700', fontSize: 14},
  // Summary
  summarySection: {
    marginHorizontal: 24, marginTop: 24,
    backgroundColor: '#111118', borderRadius: 18,
    borderWidth: 1, borderColor: '#1E1E2E',
    padding: 20, gap: 12,
  },
  summaryTitle: {color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginBottom: 4},
  summaryRow: {flexDirection: 'row', justifyContent: 'space-between'},
  summaryLabel: {color: '#666', fontSize: 14},
  summaryValue: {color: '#AAAAAA', fontSize: 14, fontWeight: '600'},
  divider: {height: 1, backgroundColor: '#1E1E2E'},
  totalRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  totalLabel: {color: '#FFFFFF', fontSize: 16, fontWeight: '700'},
  totalValue: {color: '#C9A84C', fontSize: 22, fontWeight: '900'},
  // Checkout
  checkoutBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#0A0A0F', borderTopWidth: 1, borderTopColor: '#1E1E2E',
    flexDirection: 'row', alignItems: 'center', gap: 16,
    paddingHorizontal: 24, paddingVertical: 16, paddingBottom: 28,
  },
  checkoutInfo: {gap: 2},
  checkoutLabel: {color: '#555', fontSize: 11},
  checkoutTotal: {color: '#FFFFFF', fontSize: 20, fontWeight: '900'},
  checkoutBtn: {
    flex: 1, backgroundColor: '#C9A84C', borderRadius: 16,
    paddingVertical: 17, alignItems: 'center',
    shadowColor: '#C9A84C', shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  checkoutBtnText: {color: '#0A0A0F', fontSize: 16, fontWeight: '800', letterSpacing: 1},
  // Empty
  emptyState: {flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12},
  emptyEmoji: {fontSize: 72},
  emptyTitle: {color: '#FFFFFF', fontSize: 22, fontWeight: '700'},
  emptySubtitle: {color: '#555', fontSize: 15},
  shopBtn: {
    marginTop: 12, backgroundColor: '#C9A84C', borderRadius: 16,
    paddingVertical: 16, paddingHorizontal: 36,
  },
  shopBtnText: {color: '#0A0A0F', fontSize: 15, fontWeight: '800'},
});

export default CartScreen;
