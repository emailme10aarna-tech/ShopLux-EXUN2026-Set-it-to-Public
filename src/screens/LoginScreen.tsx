import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {toValue: 1, duration: 600, useNativeDriver: true}),
      Animated.timing(slideAnim, {toValue: 0, duration: 500, useNativeDriver: true}),
    ]).start();
  }, []);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter your email and password.');
      return;
    }
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled">
            {/* Header */}
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>

            <Animated.View
              style={[
                styles.content,
                {opacity: fadeAnim, transform: [{translateY: slideAnim}]},
              ]}>
              {/* Logo */}
              <View style={styles.logoRow}>
                <View style={styles.logoMark}>
                  <Text style={styles.logoSymbol}>✦</Text>
                </View>
                <Text style={styles.logoText}>
                  <Text style={styles.logoBold}>LUX</Text>
                  <Text style={styles.logoLight}>CART</Text>
                </Text>
              </View>

              <Text style={styles.heading}>Welcome back</Text>
              <Text style={styles.subheading}>Sign in to your account</Text>

              {/* Form */}
              <View style={styles.form}>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>EMAIL ADDRESS</Text>
                  <View
                    style={[
                      styles.inputWrap,
                      focusedField === 'email' && styles.inputFocused,
                    ]}>
                    <Text style={styles.inputIcon}>✉</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="you@example.com"
                      placeholderTextColor="#444"
                      value={email}
                      onChangeText={setEmail}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      selectionColor="#C9A84C"
                    />
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>PASSWORD</Text>
                  <View
                    style={[
                      styles.inputWrap,
                      focusedField === 'password' && styles.inputFocused,
                    ]}>
                    <Text style={styles.inputIcon}>🔒</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter password"
                      placeholderTextColor="#444"
                      value={password}
                      onChangeText={setPassword}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      secureTextEntry={!showPassword}
                      selectionColor="#C9A84C"
                    />
                    <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
                      <Text style={styles.eyeIcon}>
                        {showPassword ? '👁' : '🙈'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity style={styles.forgotRow}>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={handleLogin}
                  activeOpacity={0.85}>
                  <Text style={styles.primaryBtnText}>Sign In</Text>
                  <Text style={styles.primaryBtnArrow}>→</Text>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Social login */}
                <View style={styles.socialRow}>
                  {['G', 'f', 'in'].map((s, i) => (
                    <TouchableOpacity key={i} style={styles.socialBtn}>
                      <Text style={styles.socialBtnText}>{s}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.registerRow}>
                <Text style={styles.registerText}>Don't have an account? </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.registerLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#0A0A0F'},
  safeArea: {flex: 1},
  scroll: {flexGrow: 1, paddingHorizontal: 28},
  backBtn: {paddingTop: 16, paddingBottom: 8, alignSelf: 'flex-start'},
  backArrow: {color: '#888', fontSize: 22},
  content: {flex: 1, paddingTop: 12},
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 32,
  },
  logoMark: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#C9A84C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoSymbol: {fontSize: 18, color: '#0A0A0F'},
  logoText: {fontSize: 22, letterSpacing: 4},
  logoBold: {color: '#FFFFFF', fontWeight: '900'},
  logoLight: {color: '#C9A84C', fontWeight: '200'},
  heading: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  subheading: {color: '#666', fontSize: 15, marginBottom: 36},
  form: {gap: 0},
  fieldGroup: {marginBottom: 20},
  label: {
    color: '#C9A84C',
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: '700',
    marginBottom: 8,
    fontFamily: 'Courier',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111118',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#1E1E2E',
    paddingHorizontal: 16,
    height: 56,
    gap: 10,
  },
  inputFocused: {borderColor: '#C9A84C'},
  inputIcon: {fontSize: 16},
  input: {flex: 1, color: '#FFFFFF', fontSize: 15},
  eyeIcon: {fontSize: 16},
  forgotRow: {alignItems: 'flex-end', marginTop: -8, marginBottom: 28},
  forgotText: {color: '#C9A84C', fontSize: 13},
  primaryBtn: {
    backgroundColor: '#C9A84C',
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#C9A84C',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 8,
  },
  primaryBtnText: {
    color: '#0A0A0F',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  primaryBtnArrow: {color: '#0A0A0F', fontSize: 18, fontWeight: '700'},
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 24,
  },
  dividerLine: {flex: 1, height: 1, backgroundColor: '#1E1E2E'},
  dividerText: {color: '#444', fontSize: 13},
  socialRow: {flexDirection: 'row', justifyContent: 'center', gap: 16},
  socialBtn: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#111118',
    borderWidth: 1.5,
    borderColor: '#1E1E2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialBtnText: {color: '#FFFFFF', fontSize: 16, fontWeight: '700'},
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  registerText: {color: '#666', fontSize: 14},
  registerLink: {color: '#C9A84C', fontWeight: '700', fontSize: 14},
});

export default LoginScreen;
