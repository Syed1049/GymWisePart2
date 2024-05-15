import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Button,
  Animated,
  Modal,
  Alert,
} from 'react-native';
import {CardField, useConfirmPayment} from '@stripe/stripe-react-native';
import { supabase } from '../../supabase'; // Ensure this is correctly imported

const StorePage = () => {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [cardData, setCardData] = useState();
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const paymentOptionsY = useRef(new Animated.Value(1000)).current; // Start off-screen
  const { confirmPayment, loading } = useConfirmPayment();

  useEffect(() => {
    fetchStoreItems();
  }, []);

  const fetchStoreItems = async () => {
    const { data, error } = await supabase.from('store').select('*');
      console.log(data,"tg5yt5");
    if (error) {
      Alert.alert('Error fetching store items', error.message);
    } else {
      setItems(data);
    }
  };

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const handlePayPress = async () => {
    const billingDetails = {
      email: "123@gmail.com",
    };

    console.log(cardData);
    if (cardData?.expiryYear != null && cardData?.validCVC != 'Incomplete') {
      setShowPaymentOptions(false)
      Alert.alert('Payment Success');
      setCardData(null)
    } else {
      Alert.alert('Invalid Card Data', 'Enter valid card data');
    }
  };

  const openCart = () => {
    setModalVisible(true);
  };

  const getSubtotal = () => {
    return cart.reduce((acc, item) => acc + item.price, 0).toFixed(2);
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

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <Text style={styles.itemName}>{item.item_name}</Text>
      <Text style={styles.itemPrice}>${item.price}</Text>
      <TouchableOpacity
        style={styles.buyButton}
        onPress={() => addToCart(item)}
      >
        <Text style={styles.buyButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
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
        <Text style={styles.cartButtonText}>View Cart (${getSubtotal()})</Text>
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
              Cart Subtotal: ${getSubtotal()}
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
    backgroundColor: "black",
  },
  
  paymentOptionsContainer: {
    flex: 1,
    flexDirection: "column",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "black",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginVertical: 20,
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  itemContainer: {
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    padding: 10,
    backgroundColor: "#333",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "orange",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 160,
    maxWidth: 160,
    flexBasis: "48%",
  },
  itemImage: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
  itemPrice: {
    fontSize: 15,
    color: "white",
    marginBottom: 10,
  },
  buyButton: {
    marginVertical: 10,
    paddingVertical: 6,
    paddingHorizontal: 20,
    backgroundColor: "#0066cc",
    borderRadius: 20,
  },
  buyButtonText: {
    color: "white",
    fontSize: 15,
  },
  cartButton: {
    backgroundColor: "#ff8c00",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
  },
  cartButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
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
    marginBottom: 20,
  },
  cardField: {
    flex: 1,
    borderColor: 'black',
    height: 50,
    marginHorizontal: 0,
  },
  verticalLine: {
    height: '100%',
    width: 1,
    backgroundColor: '#CCCCCC',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
});

export default StorePage;
