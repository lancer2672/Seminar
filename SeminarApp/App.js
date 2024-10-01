import React, { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  View
} from 'react-native';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import HomeScreen from './src/screens/Home';

function App() {
  const [biometricType, setBiometricType] = useState('');
  const [isFaceIDAvailable, setIsFaceIDAvailable] = useState(false);

  useEffect(() => {
    checkBiometrics();
  }, []);

  const checkBiometrics = async () => {
    const rnBiometrics = new ReactNativeBiometrics();
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();

    if (available) {
      setBiometricType(biometryType);
      setIsFaceIDAvailable(biometryType === BiometryTypes.FaceID);
    } else {
      Alert.alert('Biometrics not available on this device');
    }
  };

  const authenticate = async () => {
    const rnBiometrics = new ReactNativeBiometrics();
    let promptMessage = isFaceIDAvailable
      ? 'Authenticate with Face ID'
      : 'Authenticate to continue';

    try {
      const { success, error } = await rnBiometrics.simplePrompt({
        promptMessage,
      });

      if (success) {
        Alert.alert('Authentication successful');
      } else {
        throw new Error(error);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Authentication failed', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
         <HomeScreen></HomeScreen>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
 
});

export default App;