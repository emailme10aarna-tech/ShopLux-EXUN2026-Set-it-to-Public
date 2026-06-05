import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';

const {width, height} = Dimensions.get('window');

type LandingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Landing'
>;

interface Props {
  navigation: LandingScreenNavigationProp;
}

const LandingScreen: React.FC<Props> = ({navigation}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(60)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const taglineAnim = useRef(new Animated.Value(0)).current;
  const btnAnim = useRef(new Animated.Value(0)).current;
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulsing decorative dots
    const pulse = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 2000,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ).start();

    pulse(dot1, 0);
    pulse(dot2, 600);
    pulse(dot3, 1200);

    // Logo entrance
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(taglineAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(btnAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background decorative orbs */}
      <Animated.View
        style={[
          styles.orb,
          styles.orb1,
          {
            opacity: dot1.interpolate({
              inputRange: [0, 1],
              outputRange: [0.15, 0.35],
            }),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.orb,
          styles.orb2,
          {
            opacity: dot2.interpolate({
              inputRange: [0, 1],
              outputRange: [0.1, 0.25],
            }),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.orb,
          styles.orb3,
          {
            opacity: dot3.interpolate({
              inputRange: [0, 1],
              outputRange: [0.08, 0.2],
            }),
          },
        ]}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Top badge */}
        <Animated.View style={[styles.topBadge, {opacity: fadeAnim}]}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>FREE SHIPPING ON ORDERS OVER $50</Text>
        </Animated.View>

        {/* Center content */}
        <View style={styles.centerContent}>
          {/* Logo mark */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [{scale: scaleAnim}, {translateY: slideAnim}],
              },
            ]}>
            <View style={styles.logoMark}>
              <Text style={styles.logoSymbol}>✦</Text>
            </View>
            <Text style={styles.logoText}>
              <Text style={styles.logoTextBold}>LUX</Text>
              <Text style={styles.logoTextLight}>CART</Text>
            </Text>
            <View style={styles.logoUnderline} />
          </Animated.View>

          {/* Tagline */}
          <Animated.View style={[styles.taglineContainer, {opacity: taglineAnim}]}>
            <Text style={styles.tagline}>
              Where Luxury Meets{'\n'}
              <Text style={styles.taglineAccent}>Everyday Living</Text>
            </Text>
            <Text style={styles.subTagline}>
              Curated collections. Unmatched quality.{'\n'}Delivered to your door.
            </Text>
          </Animated.View>

          {/* Feature pills */}
          <Animated.View style={[styles.pillsRow, {opacity: taglineAnim}]}>
            {['✦ 10K+ Products', '⚡ Fast Delivery', '★ Top Rated'].map(
              (pill, i) => (
                <View key={i} style={styles.pill}>
                  <Text style={styles.pillText}>{pill}</Text>
                </View>
              ),
            )}
          </Animated.View>
        </View>

        {/* Bottom CTA */}
        <Animated.View style={[styles.bottomSection, {opacity: btnAnim}]}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>Create Account</Text>
            <Text style={styles.primaryBtnArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.75}>
            <Text style={styles.secondaryBtnText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.6}>
            <Text style={styles.guestText}>Browse as Guest →</Text>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            By continuing you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text>
          </Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 28,
  },
  // Orbs
  orb: {
    position: 'absolute',
    borderRadius: 999,
  },
  orb1: {
    width: 380,
    height: 380,
    backgroundColor: '#C9A84C',
    top: -100,
    right: -120,
  },
  orb2: {
    width: 300,
    height: 300,
    backgroundColor: '#8B6914',
    bottom: 100,
    left: -100,
  },
  orb3: {
    width: 200,
    height: 200,
    backgroundColor: '#C9A84C',
    top: height * 0.4,
    right: -60,
  },
  // Top badge
  topBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 6,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#C9A84C',
  },
  badgeText: {
    color: '#C9A84C',
    fontSize: 11,
    letterSpacing: 2,
    fontFamily: 'Courier',
    fontWeight: '600',
  },
  // Center content
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoMark: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#C9A84C',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#C9A84C',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  logoSymbol: {
    fontSize: 32,
    color: '#0A0A0F',
  },
  logoText: {
    fontSize: 44,
    letterSpacing: 6,
    color: '#FFFFFF',
  },
  logoTextBold: {
    fontWeight: '900',
    color: '#FFFFFF',
  },
  logoTextLight: {
    fontWeight: '200',
    color: '#C9A84C',
  },
  logoUnderline: {
    width: 60,
    height: 2,
    backgroundColor: '#C9A84C',
    marginTop: 10,
  },
  // Tagline
  taglineContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  tagline: {
    fontSize: 26,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '300',
    lineHeight: 36,
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  taglineAccent: {
    color: '#C9A84C',
    fontWeight: '700',
    fontStyle: 'italic',
  },
  subTagline: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: 0.3,
  },
  // Pills
  pillsRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  pill: {
    borderWidth: 1,
    borderColor: '#2A2A3A',
    borderRadius: 50,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#111118',
  },
  pillText: {
    color: '#AAAAAA',
    fontSize: 11,
    letterSpacing: 1,
  },
  // Bottom section
  bottomSection: {
    paddingBottom: 24,
    gap: 14,
  },
  primaryBtn: {
    backgroundColor: '#C9A84C',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C9A84C',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
    gap: 8,
  },
  primaryBtnText: {
    color: '#0A0A0F',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  primaryBtnArrow: {
    color: '#0A0A0F',
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryBtn: {
    borderWidth: 1.5,
    borderColor: '#2A2A3A',
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
    backgroundColor: '#111118',
  },
  secondaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  guestText: {
    color: '#888888',
    textAlign: 'center',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  termsText: {
    color: '#555555',
    textAlign: 'center',
    fontSize: 11,
    letterSpacing: 0.3,
    lineHeight: 18,
  },
  termsLink: {
    color: '#C9A84C',
    textDecorationLine: 'underline',
  },
});

export default LandingScreen;
