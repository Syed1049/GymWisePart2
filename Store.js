import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView, Modal, Button, Animated, Alert } from 'react-native';

// Mock data for gym items
const GYM_ITEMS = [
  { id: '1', name: 'Yoga Mat', price: 19.99, image: { uri: 'https://via.placeholder.com/100' } },
  { id: '2', name: 'Dumbbell Set', price: 35.99, image: { uri: 'https://via.placeholder.com/100' } },
  { id: '3', name: 'Resistance Bands', price: 9.99, image: { uri: 'https://via.placeholder.com/100' } },
  { id: '4', name: 'Kettlebell', price: 25.99, image: { uri: 'https://via.placeholder.com/100' } },
  { id: '5', name: 'Foam Roller', price: 15.99, image: { uri: 'https://via.placeholder.com/100' } },
  { id: '6', name: 'Skipping Rope', price: 9.99, image: { uri: 'https://via.placeholder.com/100' } },
  { id: '7', name: 'Punching Bag', price: 120.99, image: { uri: 'https://via.placeholder.com/100' } },
];

const StorePage = () => {
  const [cart, setCart] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const openCart = () => {
    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  };

  const getSubtotal = () => {
    return cart.reduce((acc, item) => acc + item.price, 0).toFixed(2);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <Image source={item.image} style={styles.itemImage} />
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemPrice}>${item.price}</Text>
      <TouchableOpacity style={styles.buyButton} onPress={() => addToCart(item)}>
        <Text style={styles.buyButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.pageTitle}>Gym Store</Text>
      <FlatList
        data={GYM_ITEMS}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
      />
      <TouchableOpacity style={styles.cartButton} onPress={openCart}>
        <Text style={styles.cartButtonText}>View Cart (${getSubtotal()})</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true
          }).start(() => setModalVisible(!modalVisible));
        }}
      >
        <View style={styles.centeredView}>
          <Animated.View style={[styles.modalView, {opacity: fadeAnim}]}>
            <Text style={styles.modalText}>Cart Subtotal: ${getSubtotal()}</Text>
            <Button
              title="Buy Now"
              onPress={() => {
                Alert.alert('Purchase', 'Total purchase: $' + getSubtotal(), [{ text: 'OK' }]);
                setCart([]);  // Clear cart after purchase
                setModalVisible(false);
              }}
            />
            <Button
              title="Close Cart"
              onPress={() => {
                Animated.timing(fadeAnim, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: true
                }).start(() => setModalVisible(!modalVisible));
              }}
            />
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginVertical: 20,
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'orange',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 160,
    maxWidth: 160,
    flexBasis: '48%',
  },
  itemImage: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  itemPrice: {
    fontSize: 15,
    color: 'white',
    marginBottom: 10,
  },
  buyButton: {
    marginVertical: 10,
    paddingVertical: 6,
    paddingHorizontal: 20,
    backgroundColor: '#0066cc',
    borderRadius: 20,
  },
  buyButtonText: {
    color: 'white',
    fontSize: 15,
  },
  cartButton: {
    backgroundColor: '#ff8c00',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  cartButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'black',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StorePage;
