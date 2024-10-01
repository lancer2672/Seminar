import React, { useState } from 'react';
import { Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CartScreen from './Cart';
import LoginScreen from './Login';
import products from './mock'; // Import mock products
const HomeScreen = () => {
  const [quantity, setQuantity] = useState(1); // State cho số lượng
  const [modalVisible, setModalVisible] = useState(false); // State cho Modal sản phẩm
  const [loginModalVisible, setLoginModalVisible] = useState(false); // State cho Modal sản phẩm
  const [successModalVisible, setSuccessModalVisible] = useState(false); // State cho Modal thành công
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const openModal = () => {
    setModalVisible(true);
  };

  const addToCart = () => {
    setModalVisible(false); // Ẩn modal sản phẩm
    setSuccessModalVisible(true); // Hiển thị modal thành công
    setTimeout(() => {
      setSuccessModalVisible(false); // Tự động ẩn sau 2 giây
    }, 2000);
  };
  const accountBalance = 200
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
      {isLoggedIn ? (
          <View>
          <Image source={require('./DefaultAvatar.png')} style={styles.profileImage} />
          <Text style={styles.accountBalance}>${accountBalance.toFixed(2)}</Text>
        </View>
        ) : (
          <Icon name="menu-outline" size={24} color="#000" />
        )}
        <Text style={styles.headerTitle}>Explore</Text>
        <TouchableOpacity onPress={() => openModal()}>

        <Icon name="cart-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      
      <ScrollView>
        <View style={styles.searchBar}>
          <Icon name="search-outline" size={20} color="#999" />
          <Text style={styles.searchText}>Looking for shoes</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Icon name="options-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.categories}>
          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryText}>All Shoes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.categoryButton, styles.activeCategory]}>
            <Text style={[styles.categoryText, styles.activeCategoryText]}>Outdoor</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryText}>Tennis</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Shoes</Text>
            <Text style={styles.seeAll}>See all</Text>
          </View>
          <View style={styles.productList}>
            {products.map((product) => (
              <View key={product.id} style={styles.productCard}>
                <Image source={product.image} style={styles.productImage} />
                {product.bestSeller && (
                  <Text style={styles.bestSeller}>BEST SELLER</Text>
                )}
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>{product.price}</Text>
                <TouchableOpacity onPress={()=>{
                    if (!isLoggedIn) {

                        setLoginModalVisible(true);
                     }
                }}  style={styles.addButton}>
                  <Icon name="add" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>New Arrivals</Text>
            <Text style={styles.seeAll}>See all</Text>
          </View>
          {/* New arrivals content */}
        </View>
      </ScrollView>
      
      <View style={styles.bottomNav}>
        <Icon name="home-outline" size={24} color="#4A80F0" />
        <Icon name="heart-outline" size={24} color="#999" />
        <Icon name="bag-outline" size={24} color="#999" />
        <Icon name="person-outline" size={24} color="#999" />
      </View>
      <Modal
        animationType="fadeIn"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
            <CartScreen onPayment={()=>{
                setModalVisible(false);
            }}></CartScreen>

      </Modal>
      <Modal
        animationType="fadeIn"
        transparent={true}
        visible={loginModalVisible}
        onRequestClose={() => setLoginModalVisible(false)}
      >
            <LoginScreen onLogin={()=>{
                setIsLoggedIn(true);
                setLoginModalVisible(false);
            }}></LoginScreen>

      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={successModalVisible}
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModalContainer}>
            <Icon name="checkmark-circle" size={50} color="#4A80F0" />
            <Text style={styles.successText}>Thêm vào giỏ hàng thành công!</Text>
          </View>
        </View>
      </Modal>
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
  accountBalance: {
    marginLeft: 0,
    fontSize: 16,
    color:"#000",
    marginRight:-30,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    color:"#000",
    fontWeight: 'bold',
  },
  profileImage: {
    width: 30,
    height: 30,
    marginBottom:4,
    borderRadius: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  searchText: {
    marginLeft: 8,
    color:"#000",

    color: '#999',
  },
  filterButton: {
    marginLeft: 'auto',
    backgroundColor: '#4A80F0',
    padding: 8,
    borderRadius: 8,
  },
  categories: {
    flexDirection: 'row',
    padding: 16,
    color:"#000",

  },
  categoryButton: {
    marginRight: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  activeCategory: {
    backgroundColor: '#4A80F0',
  },
  categoryText: {
    color: '#000',
  },
  activeCategoryText: {
    color: '#fff',
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color:"#000",

  },
  seeAll: {
    color: '#4A80F0',
  },
  productList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 8,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  bestSeller: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#4A80F0',
    color: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 10,
  },
  productName: {
    marginTop: 8,
    fontWeight: 'bold',
  },
  productPrice: {
    marginTop: 4,
    color: '#4A80F0',
  },
  addButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#4A80F0',
    borderRadius: 20,
    padding: 4,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
});

export default HomeScreen;