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

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Register'
>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<Props> = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
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

  const handleRegister = () => {
    if (!name || !email || !password || !confirm) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }
    navigation.navigate('Home');
  };

  const getStrength = () => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 1;
    if (password.length < 10) return 2;
    return 3;
  };

  const strengthColors = ['#333', '#FF5C5C', '#F5A623', '#4CAF50'];
  const strengthLabels = ['', 'Weak', 'Medium', 'Strong'];
  const strength = getStrength();

  const fields = [
    {key: 'name', label: 'FULL NAME', icon: '👤', placeholder: 'Your name', value: name, setter: setName, type: 'default'},
    {key: 'email', label: 'EMAIL ADDRESS', icon: '✉', placeholder: 'you@example.com', value: email, setter: setEmail, type: 'email-address'},
    {key: 'password', label: 'PASSWORD', icon: '🔒', placeholder: 'Min. 8 characters', value: password, setter: setPassword, type: 'default', secure: true},
    {key: 'confirm', label: 'CONFIRM PASSWORD', icon: '🔒', placeholder: 'Repeat password', value: confirm, setter: setConfirm, type: 'default', secure: true},
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled">
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
              <View style={styles.logoRow}>
                <View style={styles.logoMark}>
                  <Text style={styles.logoSymbol}>✦</Text>
                </View>
                <Text style={styles.logoText}>
                  <Text style={styles.logoBold}>LUX</Text>
                  <Text style={styles.logoLight}>CART</Text>
                </Text>
              </View>

              <Text style={styles.heading}>Create account</Text>
              <Text style={styles.subheading}>Join thousands of happy shoppers</Text>

              <View style={styles.form}>
                {fields.map(field => (
                  <View key={field.key} style={styles.fieldGroup}>
                    <Text style={styles.label}>{field.label}</Text>
                    <View
                      style={[
                        styles.inputWrap,
                        focusedField === field.key && styles.inputFocused,
                      ]}>
                      <Text style={styles.inputIcon}>{field.icon}</Text>
                      <TextInput
                        style={styles.input}
                        placeholder={field.placeholder}
                        placeholderTextColor="#444"
                        value={field.value}
                        onChangeText={field.setter}
                        onFocus={() => setFocusedField(field.key)}
                        onBlur={() => setFocusedField(null)}
                        keyboardType={field.type as any}
                        autoCapitalize={field.key === 'name' ? 'words' : 'none'}
                        secureTextEntry={field.secure && !showPassword}
                        selectionColor="#C9A84C"
                      />
                      {field.secure && (
                        <TouchableOpacity
                          onPress={() => setShowPassword(v => !v)}>
                          <Text style={styles.eyeIcon}>
                            {showPassword ? '👁' : '🙈'}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    {field.key === 'password' && password.length > 0 && (
                      <View style={styles.strengthRow}>
                        {[1, 2, 3].map(i => (
                          <View
                            key={i}
                            style={[
                              styles.strengthBar,
                              {
                                backgroundColor:
                                  i <= strength
                                    ? strengthColors[strength]
                                    : '#1E1E2E',
                              },
                            ]}
                          />
                        ))}
                        <Text
                          style={[
                            styles.strengthLabel,
                            {color: strengthColors[strength]},
                          ]}>
                          {strengthLabels[strength]}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}

                {/* Benefits */}
                <View style={styles.benefitsBox}>
                  {[
                    '✦ Free shipping on your first order',
                    '✦ Exclusive member-only deals',
                    '✦ Early access to new arrivals',
                  ].map((b, i) => (
                    <Text key={i} style={styles.benefitText}>
                      {b}
                    </Text>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={handleRegister}
                  activeOpacity={0.85}>
                  <Text style={styles.primaryBtnText}>Create Account</Text>
                  <Text style={styles.primaryBtnArrow}>→</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.loginRow}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.loginLink}>Sign In</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.termsText}>
                By creating an account, you agree to our{' '}
                <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
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
  scroll: {flexGrow: 1, paddingHorizontal: 28, paddingBottom: 40},
  backBtn: {paddingTop: 16, paddingBottom: 8, alignSelf: 'flex-start'},
  backArrow: {color: '#888', fontSize: 22},
  content: {flex: 1, paddingTop: 12},
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 28,
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
  subheading: {color: '#666', fontSize: 15, marginBottom: 32},
  form: {gap: 0},
  fieldGroup: {marginBottom: 18},
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
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  strengthBar: {flex: 1, height: 3, borderRadius: 2},
  strengthLabel: {fontSize: 11, fontWeight: '600', width: 50, textAlign: 'right'},
  benefitsBox: {
    backgroundColor: '#111118',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E1E2E',
    padding: 16,
    marginBottom: 24,
    gap: 8,
  },
  benefitText: {color: '#AAAAAA', fontSize: 13, lineHeight: 20},
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
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 24,
    paddingBottom: 12,
  },
  loginText: {color: '#666', fontSize: 14},
  loginLink: {color: '#C9A84C', fontWeight: '700', fontSize: 14},
  termsText: {
    color: '#444',
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 18,
    paddingBottom: 8,
  },
  termsLink: {color: '#C9A84C'},
});

export default RegisterScreen;
