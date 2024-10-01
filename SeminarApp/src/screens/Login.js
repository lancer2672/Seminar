import axios from 'axios';
import React, {
  useEffect,
  useState
} from 'react';
import { Alert, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import Icon from 'react-native-vector-icons/Ionicons';



const baseURL = 'http://192.168.202.104:3000';
const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const LoginScreen = ({onLogin}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
 
  useEffect(() => {
    checkBiometricAvailability().then(()=>{
        return authenticate()
    });
  }, []);
  console.log("test")
  const checkBiometricAvailability = async () => {
    const rnBiometrics = new ReactNativeBiometrics();
    const { available, biometryType,error } = await rnBiometrics.isSensorAvailable();
    console.log('Biometry type:', biometryType, error);

  };

  const authenticate = async () => {
    const rnBiometrics = new ReactNativeBiometrics();
    await rnBiometrics.deleteKeys();
    try {
      // 1. Kiểm tra xem đã có khóa hay chưa
      const { keysExist } = await rnBiometrics.biometricKeysExist();
      if (!keysExist) {
        // 2. Nếu chưa có, tạo cặp khóa mới
        const { publicKey } = await rnBiometrics.createKeys();
        console.log('New public key created:', publicKey);
        await sendKeyToServer(publicKey);
      }

      // 3. Tạo chữ ký sinh trắc học
      const payload = 'Login to MyApp';
      const { success, signature } = await rnBiometrics.createSignature({
        promptMessage: 'Xác thực để đăng nhập',
        payload: payload,
      });
      console.log('Biometric signature:', signature);
      if (success) {
        // 4. Xác thực chữ ký ở phía server (mô phỏng)
        const isVerified = await  verifySignatureOnServer( signature, payload);
        if (isVerified) {
          Alert.alert('Thành công', 'Đăng nhập thành công');
          // Tiến hành đăng nhập
          onLogin();
        } else {
          Alert.alert('Thất bại', 'Xác thực sinh trắc học không hợp lệ');
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Xác thực sinh trắc học thất bại');
    }
  };
  const sendKeyToServer = async (publicKey) => {
    try {
      const response = await axiosClient.post('/public-key', {
        key: publicKey,
      });
      console.log('Send public key to server success', response.data);
    } catch (error) {
      console.error('Error sending public key to server:', error);
    }
  };
  
  const verifySignatureOnServer = async (signature, message) => {
    try {
      const response = await axiosClient.post('/verify-signature', {
        signature,
        message,
      });
      console.log('Is signature valid?', response.data.isValid);
      return response.data.isValid
    } catch (error) {
      console.error('Error verifying signature on server:', error);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
   
      <View style={styles.content}>
        <Text style={styles.title}>Hello Again!</Text>
        <Text style={styles.subtitle}>Fill Your Details Or Continue With Social Media</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          
          <TouchableOpacity 
            style={styles.eyeIcon} 
            onPress={() => setShowPassword(!showPassword)}
          >
            <Icon name={showPassword ? "eye-off" : "eye"} size={24} color="#000" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Recovery Password</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={onLogin} style={styles.signInButton}>
          <Text style={styles.signInButtonText}>Sign in</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.googleButton}>
          <Image source={require('./google.png')} style={styles.googleIcon} />
          <Text style={styles.googleButtonText}>Sign in With Google</Text>
        </TouchableOpacity>
        
        <View style={styles.createAccountContainer}>
          <Text style={styles.createAccountText}>New User? </Text>
          <TouchableOpacity>
            <Text style={styles.createAccountLink}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 12,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#666',
  },
  signInButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 20,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    color: '#000',
  },
  createAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  createAccountText: {
    color: '#666',
  },
  createAccountLink: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default LoginScreen;