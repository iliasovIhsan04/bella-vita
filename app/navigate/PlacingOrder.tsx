import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { stylesAll } from "../../style";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { url } from "@/Api";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/reducer/store";
import { Modal } from "react-native";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { ScrollView } from "react-native";

const PlacingOrder = () => {
  const [local, setLocal] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [plus, setPlus] = useState<any>({});
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [date1, setDate1] = useState<boolean>(true);
  const [show, setShow] = useState<boolean>(false);
  const [datePicker, setDatePicker] = useState<boolean>(false);
  const scaleValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;
  const selectedAddressId = useSelector(
    (state: RootState) => state.selectedAddress.selectedAddress
  );
  const addressId = useSelector(
    (state: RootState) => state.selectedAddress.selectedId
  );
  const [address, setAddress] = useState({
    address_to: "",
    get_date: "",
    comment: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const tokens = await AsyncStorage.getItem("tokenActivation");
        const cartData = await AsyncStorage.getItem("cartFeatured");
        setLocal(tokens);
        setCart(cartData ? JSON.parse(cartData) : []);
      } catch (error) {
        console.error("Error loading data", error);
      }
    };
    loadData();
  }, []);
  useEffect(() => {
    const fetchTotalPrice = async () => {
      try {
        const plusData = await AsyncStorage.getItem("plus");
        const parsedPlus = plusData ? JSON.parse(plusData) : {};
        setPlus(parsedPlus);
      } catch (error) {
        console.error("Error fetching total price:", error);
      }
    };
    fetchTotalPrice();
  }, []);
  const headers = {
    Authorization: `Token ${local}`,
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const shopCart = await AsyncStorage.getItem("shopCart");
      const parsedShopCart = shopCart ? JSON.parse(shopCart) : [];

      const productsForOrder = parsedShopCart.map((el) => ({
        product_id: el.id,
        count: plus[el.id] || 0,
      }));
      const dataToSend = {
        address_to: addressId ? addressId : address.address_to,
        get_date: address.get_date || null,
        comment: address.comment,
        product: productsForOrder.filter((item) => item.count > 0),
      };

      const response = await axios.post(url + "/order/create", dataToSend, {
        headers,
      });
      if (response.data.response === true) {
        await AsyncStorage.multiRemove([
          "plus",
          "plusOne",
          "shopCart",
          "cartsBasket",
          "cartFeatured",
        ]);
        for (const el of parsedShopCart) {
          await AsyncStorage.removeItem(`activePlus_${el.id}`);
          await AsyncStorage.removeItem(`activeItemsBasket_${el.id}`);
        }
        for (const el of cart) {
          await AsyncStorage.removeItem(`activeItemFeatured${el.id}`);
        }
        setOpenModal(true);
      } else {
        Alert.alert("Ошибка", "Не удалось создать заказ");
      }
    } catch (error) {
      console.error("Error during order placement:", error);
      if (!address.get_date && !date1) {
        Alert.alert("Ошибка", "Выберите время получения");
      } else if (!address.address_to) {
        Alert.alert("Ошибка", "Добавьте адрес прежде чем заказать!");
      }
      setIsLoading(false);
    }
  };

  const calculateTotalPrice = async () => {
    const shopCart = await AsyncStorage.getItem("shopCart");
    const parsedCart = shopCart ? JSON.parse(shopCart) : [];

    const total = parsedCart.reduce((acc: number, item: any) => {
      const itemTotal = item.price * plus[item.id];
      return acc + itemTotal;
    }, 0);

    setTotalPrice(total);
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [cart]);

  useEffect(() => {
    if (openModal) {
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [openModal]);

  return (
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}> 
   <ScrollView contentContainerStyle={{flexGrow:1}}>
    <View style={stylesAll.background_block}>
      <Modal visible={openModal} transparent={true} animationType="none">
        <Pressable style={stylesAll.content_modal}>
          <Animated.View
            style={[
              stylesAll.modal_block_placing,
              {
                transform: [{ scale: scaleValue }],
                opacity: opacityValue,
              },
            ]}
          >
            <Ionicons
              onPress={() => {
                setOpenModal(false);
                router.push("/");
              }}
              size={24}
              style={stylesAll.icon_close}
              name="close"
            />
            <View style={stylesAll.icon_check}>
              <Image
                style={{ width: 20, height: 16 }}
                source={require("../../assets/images/Icon_true.png")}
              />
            </View>
            <View style={{ flexDirection: "column", gap: 12 }}>
              <Text style={stylesAll.promtion_title_placing}>
                Ваш заказ успешно оформлен!
              </Text>
              <Text style={stylesAll.promtion_text_placing}>
                Наш менеджер скоро свяжется с вами
              </Text>
            </View>
            <TouchableOpacity
              style={stylesAll.button}
              onPress={() => {
                setOpenModal(false);
                router.push("/");
              }}
            >
              <Text style={stylesAll.button_text}>Понятно</Text>
            </TouchableOpacity>
          </Animated.View>
        </Pressable>
      </Modal>
      <View style={stylesAll.container}>
        <View style={stylesAll.header}>
          <TouchableOpacity
            style={stylesAll.header_back_btn}
            onPress={() => router.push("/navigate/BasketPage")}
          >
            <Image
              style={{ width: 24, height: 24 }}
              source={require("../../assets/images/moreLeft.png")}
            />
          </TouchableOpacity>
          <Text style={stylesAll.header_name}>Оформление заказа</Text>
          <View style={stylesAll.header_back_btn}></View>
        </View>
        <View style={stylesAll.input_block_all}>
          <View>
            <Text style={stylesAll.label}>Адрес доставки</Text>
            <TouchableOpacity
              style={[stylesAll.input, styles.input_box]}
              onPress={() => router.push("/navigate/EmptyAddress")}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
              >
                <Image
                  style={stylesAll.icons}
                  source={require("../../assets/images/address.png")}
                />
                {selectedAddressId ? (
                  <Text style={styles.placeholder_static}>
                    {selectedAddressId}
                  </Text>
                ) : (
                  <Text style={styles.placeholder_static}>
                    Выберите адрес доставки
                  </Text>
                )}
              </View>
              <Image
                style={[stylesAll.icons, { tintColor: "#CFCFCF" }]}
                source={require("../../assets/images/moreRight.png")}
              />
            </TouchableOpacity>
          </View>
          <View>
            <Text style={stylesAll.label}>Время получения</Text>
            <TouchableOpacity
              style={[stylesAll.input, styles.input_box]}
              onPress={() => {
                if (!date1) {
                  setShow(false);
                  setDate1(true);
                }
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
              >
                <View style={stylesAll.cell_box}>
                  <View style={[date1 && stylesAll.active_cell_box]}></View>
                </View>
                <Text style={styles.placeholder_static}>Как можно быстрее</Text>
              </View>
            </TouchableOpacity>
            <Pressable>
              <TouchableOpacity
                style={[stylesAll.input, styles.input_box, { marginTop: 10 }]}
                onPress={() => {
                  if (!show) {
                    setShow(true);
                    setDate1(false);
                  }
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <View style={stylesAll.cell_box}>
                    <View style={[show && stylesAll.active_cell_box]}></View>
                  </View>
                  <Text style={styles.placeholder_static}>
                    Выбрать дату и время
                  </Text>
                </View>
              </TouchableOpacity>
              {show && (
                <Pressable
                  style={styles.input_box_date}
                  onPress={() => setDatePicker(true)}
                >
                  <Image
                    style={styles.calendar}
                    source={require("../../assets/images/calendar_days.png")}
                  />
                  <Text style={[styles.placeholder_static, styles.date_text]}>
                    {address.get_date
                      ? new Date(address.get_date).toLocaleString()
                      : new Date().toLocaleString()}
                  </Text>
                </Pressable>
              )}

              {datePicker && (
                <DateTimePickerModal
                  isVisible={datePicker}
                  mode="datetime"
                  onConfirm={(selectedDate) => {
                    const currentDate = selectedDate || new Date();
                    setAddress((prevAddress) => ({
                      ...prevAddress,
                      get_date: currentDate.toISOString(),
                    }));
                    setDatePicker(false);
                  }}
                  onCancel={() => setDatePicker(false)}
                />
              )}
            </Pressable>
          </View>
          <View>
            <Text style={[stylesAll.label, show ? { marginTop: 0 } : {}]}>
              Комментарий к заказу( 0-2000)
            </Text>
            <TextInput
              style={[stylesAll.input, styles.input_box_textarea]}
              placeholder="Напишите комментарий"
              placeholderTextColor={"#6B6B6B"}
              multiline
              numberOfLines={10}
              onChangeText={(text) =>
                setAddress((prevAddress) => ({
                  ...prevAddress,
                  comment: text,
                }))
              }
            />
          </View>
          <View style={{ marginTop: 75 }}>
            <Text style={stylesAll.label}>Способ оплаты</Text>
            <TouchableOpacity style={[stylesAll.input, styles.input_box]}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
              >
                <Image
                  style={stylesAll.icons}
                  source={require("../../assets/images/wallet.png")}
                />
                <Text style={styles.placeholder_static}>Наличными</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.placing_order_bottom}>
        <View style={{ flexDirection: "column", gap: 10 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.placing_price_name}>Сумма:</Text>
            <Text style={styles.placing_price_result}>{totalPrice} сом</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.placing_price_name}>Доставка:</Text>
            <Text style={styles.placing_price_result}>0 сом</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderTopWidth: 1,
              borderColor: "#CFCFCF",
              paddingTop: 10,
            }}
          >
            <Text style={styles.placing_price_name}>Итого:</Text>
            <Text style={[styles.placing_price_result, styles.total_text]}>
              {totalPrice} сом
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[stylesAll.button, styles.btn_placing]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={stylesAll.button_text}>Оформить заказ</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
    </ScrollView>
    </KeyboardAvoidingView>
 

  );
};

const styles = StyleSheet.create({
  calendar: {
    width: 24,
    height: 24,
  },
  date_text: {
    marginLeft: 10,
  },
  placeholder_static: {
    fontSize: 16,
    fontWeight: "400",
    color: "#191919",
  },
  input_box_textarea: {
    backgroundColor: "#F5F7FA",
    minHeight: 120,
    textAlignVertical: "top",
    paddingVertical: 10,
  },
  input_box: {
    backgroundColor: "#F5F7FA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input_box_date: {
    width: "100%",
    height: 45,
    backgroundColor: "#F5F7FA",
    borderRadius: 10,
    marginTop: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  date_picker: {
    height: 45,
    marginTop: 10,
    tintColor: "red",
    marginLeft: -10,
  },
  btn_placing: {
    backgroundColor: "#DC0200",
    marginTop: 15,
  },
  total_text: {
    color: "#FE211F",
  },
  placing_order_bottom: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    minHeight: 180,
    backgroundColor: "#F5F7FA",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    zIndex: 1,
    paddingBottom: 30,
  },
  placing_price_result: {
    fontSize: 18,
    fontWeight: "700",
    color: "#191919",
  },
  placing_price_name: {
    fontSize: 14,
    fontWeight: "400",
    color: "#6B6B6B",
  },
});

export default PlacingOrder;
