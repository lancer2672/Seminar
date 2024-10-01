import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import Icon from 'react-native-vector-icons/Ionicons';

const baseURL = 'http://192.168.202.104:3000';
const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});
const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => (
  <View style={styles.cartItem}>
    <Image source={item.image} style={styles.productImage} />
    <View style={styles.productInfo}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
    </View>
    <View style={styles.quantityControl}>
      <TouchableOpacity onPress={() => onDecrease(item.id)} style={styles.quantityButton}>
        <Text style={styles.quantityButtonText}>-</Text>
      </TouchableOpacity>
      <Text style={styles.quantity}>{item.quantity}</Text>
      <TouchableOpacity onPress={() => onIncrease(item.id)} style={styles.quantityButton}>
        <Text style={styles.quantityButtonText}>+</Text>
      </TouchableOpacity>
    </View>
    <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.removeButton}>
      <Icon name="trash-outline" size={24} color="#FF1900" />
    </TouchableOpacity>
  </View>
);

const CartScreen = ({onPayment}) => {
  const [cartItems, setCartItems] = useState([
    { id: '1', name: 'Nike Club Max', price: 594.95, quantity: 1, image: require('./shoe1.jpeg') },
    { id: '2', name: 'Nike Air Max 200', price: 94.05, quantity: 1, image: require('./shoe2.jpeg') },
    { id: '3', name: 'Nike Air Max 270 Essential', price: 74.95, quantity: 1, image: require('./shoe3.jpeg') },
  ]);

  const [subtotal, setSubtotal] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(60.20);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    calculateTotals();
  }, [cartItems]);

  const calculateTotals = () => {
    const newSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setSubtotal(newSubtotal);
    setTotal(newSubtotal + deliveryFee);
  };

  const handleIncrease = (id) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const handleDecrease = (id) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
    ));
  };

  const handleRemove = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };
  const authenticate = async () => {
    const rnBiometrics = new ReactNativeBiometrics();
    try {
      // 3. Tạo chữ ký sinh trắc học
      const payload = 'Payment';
      const { success, signature } = await rnBiometrics.createSignature({
        promptMessage: 'Xác thực để thanh toán',
        payload: payload,
      });
      console.log('Biometric signature:', signature);
      if (success) {
        // 4. Xác thực chữ ký ở phía server (mô phỏng)
        const isVerified = await  verifySignatureOnServer( signature, payload);
        if (isVerified) {
          Alert.alert('Thành công', 'Thanh toán thành công');
          // Tiến hành đăng nhập
          onPayment();
        } else {
          Alert.alert('Thất bại', 'Xác thực sinh trắc học không hợp lệ');
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Xác thực sinh trắc học thất bại');
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
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        <View style={styles.placeholder} />
      </View>

      <Text style={styles.itemCount}>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</Text>

      <FlatList
        data={cartItems}
        renderItem={({ item }) => (
          <CartItem 
            item={item} 
            onIncrease={handleIncrease} 
            onDecrease={handleDecrease} 
            onRemove={handleRemove}
          />
        )}
        keyExtractor={item => item.id}
      />

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Subtotal</Text>
          <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Delivery</Text>
          <Text style={styles.summaryValue}>${deliveryFee.toFixed(2)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalText}>Total Cost</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>
      </View>

      <TouchableOpacity onPress={authenticate} style={styles.checkoutButton}>
        <Text style={styles.checkoutButtonText}>Checkout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    color: '#2B2B2B',
    fontWeight: 'bold',
  },
  placeholder: {
    width: 24,
  },
  itemCount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 16,
    color: '#2B2B2B',

    marginBottom: 16,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical:4,
    color: '#2B2B2B',

    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 16,
  },
  productName: {
    fontSize: 16,
    color: '#2B2B2B',

    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 4,
    color: '#2B2B2B',

  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    color: '#2B2B2B',

  },
  quantityButton: {
    backgroundColor: '#E5E7EB',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantity: {
    marginHorizontal: 8,
    fontSize: 16,
    color: '#2B2B2B',

  },
  removeButton: {
    padding: 8,
    backgroundColor:"#F7F7F9",
    borderRadius:8,
    
  },
  summary: {
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryText: {
    color: '#2B2B2B',

    fontSize: 16,
    color: '#4B5563',
  },
  summaryValue: {
    fontSize: 16,
    color: '#2B2B2B',

    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A80F0',
  },
  checkoutButton: {
    backgroundColor: '#4A80F0',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CartScreen;