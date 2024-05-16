import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import {CardField, useConfirmPayment} from '@stripe/stripe-react-native';
import { supabase } from '../../supabase'; // Ensure this is correctly imported

const Store = () => {
  const navigation = useNavigation(); // Access navigation object using useNavigation hook

  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchStoreItems();
  }, []);

  const fetchStoreItems = async () => {
    try {
      const { data, error } = await supabase.from('store').select('*');
      if (error) {
        throw error;
      }

      // Map through the fetched data and extract image URLs
      const itemsWithImageUrls = data.map(item => ({
        ...item,
        imageUrl: item.image, // Assuming the column name is 'image_url'
      }));

      setItems(itemsWithImageUrls);
    } catch (error) {
      Alert.alert('Error fetching store items', error.message);
    }
  };

  const addToCart = (item) => {
    const itemIndex = cart.findIndex((cartItem) => cartItem.id === item.id);
    if (itemIndex !== -1) {
      const newCart = [...cart];
      newCart[itemIndex].quantity += 1;
      setCart(newCart);
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    const itemIndex = cart.findIndex((item) => item.id === itemId);
    if (itemIndex !== -1) {
      const newCart = [...cart];
      if (newCart[itemIndex].quantity === 1) {
        newCart.splice(itemIndex, 1);
      } else {
        newCart[itemIndex].quantity -= 1;
      }
      setCart(newCart);
    }
  };

  const openCart = () => {
    setModalVisible(true);
  };

  const getSubtotal = () => {
    return cart.reduce((acc, item) => acc + item.item_price, 0).toFixed(2);
  };

  const buyNow = () => {
    setModalVisible(false);
    setShowPaymentOptions(true);
    Animated.timing(fadeAnim, {
      toValue: 0.4,
      duration: 500,
      useNativeDriver: true,
    }).start();
    Animated.spring(paymentOptionsY, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 5,
    }).start();
  };

  // const renderItem = ({ item }) => (
  //   <View style={styles.itemContainer}>
  //     <Image source={{ uri: item.image }} style={styles.itemImage} />
  //     <Text style={styles.itemName}>{item.item_name}</Text>
  //     <Text style={styles.itemPrice}>{item.item_price} PKR</Text>
  //     <TouchableOpacity
  //       style={styles.buyButton}
  //       onPress={() => addToCart(item)}
  //     >
  //       <Text style={styles.buyButtonText}>Add to Cart</Text>
  //     </TouchableOpacity>

  //   </TouchableOpacity>
    
  // );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>{'Back'}</Text>
      </TouchableOpacity>
      <Text style={styles.pageTitle}>Gym Store</Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
      />
      <TouchableOpacity style={styles.cartButton} onPress={openCart}>
        <Text style={styles.cartButtonText}>View Cart ({getSubtotal()} PKR)</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Cart Subtotal: {getSubtotal()} PKR
            </Text>
            <View style={{backgroundColor:"#ff8c00",borderRadius:25}}>
            <TouchableOpacity onPress={buyNow} style={{padding:8}} >
              <Text style={{color:'#fff'}}>Buy Now</Text>
            </TouchableOpacity>
            </View>
            <View style={{backgroundColor:"#ff8c00",borderRadius:25,top:12}}>
              
            <TouchableOpacity onPress={() => setModalVisible(false)} style={{padding:8}} >
              <Text style={{color:'#fff'}}>Close Cart</Text>
            </TouchableOpacity>
            </View>
              
          </View>
        </View>
      </Modal>
      {showPaymentOptions && (
        <Animated.View
          style={[
            styles.paymentOptionsContainer,
            { transform: [{ translateY: paymentOptionsY }] },
          ]}
        >
          <View style={styles.inputContainer}>
            <CardField
              postalCodeEnabled={false}
              placeholders={{ number: '4242 4242 4242 4242', }}
              cardStyle={{
                backgroundColor: '#FFFFFF',
                textColor: '#000000',
                borderColor: 'black'
              }}
              style={styles.cardField}
              onCardChange={(cardDetails) => {
                setCardData(cardDetails)
              }}
              onFocus={(focusedField) => {
                console.log('focusField', focusedField);
              }}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button onPress={handlePayPress} title="Pay" />
          </View>
        </Animated.View>
      )}
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
    margin: 10,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CA9329',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '45%',
    
  },
  itemImage: {
    width: 120,
    height: 120,
    marginBottom: 10,
    borderRadius: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cartButton: {
    backgroundColor: '#CA9329',
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
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 22,
  },
  modalView: {
    marginVertical: 20,
    backgroundColor: "black",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityButton: {
    backgroundColor: '#CA9329',
    borderRadius: 25, // Increased borderRadius
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 18,
  },
  quantityText: {
    fontSize: 18,
    color: 'white',
  },
  backButton: {
    position: 'absolute',
    top: 25,
    left: 10,
    zIndex: 1,
  },
  backButtonText: {
    color: '#CA9329',
    fontSize: 20,
  },
});

export default Store;
