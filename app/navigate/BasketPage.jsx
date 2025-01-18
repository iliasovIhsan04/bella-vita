import { stylesAll } from "@/style";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import Header from "../../components/Main/HeaderAll";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ButtonLayouts from "@/assets/tabs/buttonLayouts";
import { colors } from "@/assets/styles/components/colors";
import TextContent from "@/assets/styles/components/TextContent";
import BasketImg from "../../assets/svg/basketImg";
import Column from "@/assets/styles/components/Column";
import Button from "@/assets/customs/Button";

const BasketProducts = () => {
  const [cart, setCart] = useState([]);
  const [plus, setPlus] = useState({});
  const [shopCart, setShopCart] = useState([]);
  const [count, setCount] = useState(0);
  const [basket, setBasket] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const fetchBasketData = async () => {
      const storedBasket = await AsyncStorage.getItem("cartsBasket");
      const storedCart = (await AsyncStorage.getItem("cart")) || "[]";
      const storedShopCart = (await AsyncStorage.getItem("shopCart")) || "[]";
      const storedPlus = (await AsyncStorage.getItem("plus")) || "{}";
      setCart(JSON.parse(storedCart));
      setBasket(storedBasket ? JSON.parse(storedBasket) : []);
      setShopCart(JSON.parse(storedShopCart));
      setPlus(JSON.parse(storedPlus));
    };
    fetchBasketData();
  }, []);

  const handlePlus = async (id) => {
    try {
      const itemTo = basket.find((el) => el.id === id);
      const itemToLocal = shopCart.find((el) => el.id === id);

      const item = itemTo || itemToLocal;
      if (!item) {
        console.error(`Элемент с id ${id} не найден в корзине или магазине`);
        return;
      }
      const updatedCart = [
        ...shopCart.filter((cartItem) => cartItem.id !== id),
        item,
      ];
      await AsyncStorage.setItem("shopCart", JSON.stringify(updatedCart));
      setShopCart(updatedCart);

      const newPlus = { ...plus, [id]: (plus[id] || 0) + 1 };
      await AsyncStorage.setItem("plus", JSON.stringify(newPlus));
      setPlus(newPlus);
      PriceCalculation();
    } catch (error) {
      console.error("Ошибка добавления элемента:", error);
    }
  };
  const handleMinus = async (id) => {
    try {
      const currentPlus = { ...plus };
      const currentCount = currentPlus[id] || 0;

      if (currentCount > 0) {
        currentPlus[id] = currentCount - 1;
        await AsyncStorage.setItem("plus", JSON.stringify(currentPlus));
        setPlus(currentPlus);

        if (currentPlus[id] === 0) {
          await handleRemoveItem(id);
        } else {
          const updatedCart = shopCart.map((item) =>
            item.id === id ? { ...item } : item
          );
          await AsyncStorage.setItem("shopCart", JSON.stringify(updatedCart));
          setShopCart(updatedCart);
        }
        PriceCalculation();
      }
    } catch (error) {
      console.error("Ошибка уменьшения элемента:", error);
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      const currentCartString = await AsyncStorage.getItem("cartsBasket");
      const currentCart = currentCartString
        ? JSON.parse(currentCartString)
        : [];
      AsyncStorage.removeItem(`activeItemsBasket_${id}`);
      const updatedCart = currentCart.filter((item) => item.id !== id);
      await AsyncStorage.setItem("cartsBasket", JSON.stringify(updatedCart));
      setBasket(updatedCart);
      const updatedShopCart = shopCart.filter((item) => item.id !== id);
      await AsyncStorage.setItem("shopCart", JSON.stringify(updatedShopCart));
      setShopCart(updatedShopCart);
      const newPlus = { ...plus };
      delete newPlus[id];
      await AsyncStorage.setItem("plus", JSON.stringify(newPlus));
      setPlus(newPlus);

      PriceCalculation();
    } catch (error) {
      console.error("Ошибка удаления элемента:", error);
    }
  };
  const PriceCalculation = async () => {
    try {
      const shopCartString = await AsyncStorage.getItem("shopCart");
      const shopCart = shopCartString ? JSON.parse(shopCartString) : [];

      const price = shopCart.reduce((acc, item) => acc + item.price, 0);
      let total = 0;
      shopCart.forEach((item) => {
        const itemCount = plus[item.id] || 0;
        total += item.price * itemCount;
      });
      setCount(total);
    } catch (error) {
      console.error("Ошибка вычисления цены:", error);
    }
  };
  useEffect(() => {
    PriceCalculation();
  }, [shopCart, plus]);
  basket_count = basket?.length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <Header container={true} back={true}>
        Корзина
      </Header>
      {basket.length > 0 ? (
        <ButtonLayouts
          handle={() => router.push("/navigate/PlacingOrder")}
          title={"К оформлению"}
          end_bot={true}
          kuren={count}
          total_amount={count}
          product_count={basket_count}
          name_product_count={'Товары:'}
          all_count_name={'Общая сумма:'}
        >
          <View style={[stylesAll.background_block]}>
            <View style={styles.basket_block}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                style={{
                  paddingTop: 8,
                  paddingHorizontal: 20,
                  height: "100%",
                }}
              >
                <View style={{ paddingBottom: 500 }}>
                  {basket.map((item) => (
                    <View style={styles.product_block} key={item?.id}>
                      <View style={styles.product_image_block}>
                          <Image
                            style={styles.product_image}
                            source={{ uri: item?.img[0]?.img
                             }}
                          />
                      </View>
                      <View style={styles.product_info}>
                        <TextContent
                          fontSize={14}
                          fontWeight={400}
                          color={colors.black}
                        >
                          {item?.title}
                        </TextContent>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <TextContent
                            fontSize={18}
                            fontWeight={600}
                            color={colors.feuillet}
                          >
                            {item?.price} сом
                          </TextContent>
                          <View style={styles.buttons_block}>
                            <TouchableOpacity
                              style={styles.add_remove}
                              onPress={() => handleMinus(item.id)}
                            >
                              <Ionicons
                                color="black"
                                style={{ width: 24, height: 24 }}
                                name="remove"
                                size={24}
                              />
                            </TouchableOpacity>
                            <Text style={styles.basketTxt}>
                              {plus[item?.id] || 0}
                            </Text>
                            {plus[item?.id] === 0 && (
                              <TouchableOpacity
                                onPress={() => handleRemoveItem(item?.id)}
                              />
                            )}
                            <TouchableOpacity
                              style={styles.add_remove}
                              onPress={() => handlePlus(item?.id)}
                            >
                              <Ionicons
                                color="black"
                                style={{ width: 24, height: 24 }}
                                name="add"
                                size={24}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </ButtonLayouts>
      ) : (
        <View style={stylesAll.empty_block}>
          <View style={stylesAll.purchase_history}>
            <View style={stylesAll.history_image_box}>
              <BasketImg />
            </View>
            <Column gap={12}>
            <TextContent
              fontSize={22}
              fontWeight={600}
              color={colors.black}
              style={{ textAlign: "center" }}
            >
             Пока тут пусто
            </TextContent>
            <Text style={stylesAll.history_text_two}>
            Добавьте в корзину всё, что душе угодно, а мы доставим заказ от 150 сом
            </Text>
            </Column>
            <View style={{width:'100%'}}>
            <Button color={colors.feuillet} handle={() => router.push("/(tabs)/catalog")}>Перейти в каталог</Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  total_text: {
    color: "#FE211F",
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
  basket_container: {
    width: "100%",
  },
  basket_block: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  basketTxt: {
    fontSize: 16,
    fontWeight: "600",
    color: "#121213",
  },
  add_remove: {
    width: 32,
    height: 32,
    borderRadius: 50,
    backgroundColor: colors.phon,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  product_block: {
    width: "100%",
    borderRadius: 8,
    gap: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical:14,
    borderBottomWidth:2,
    borderBottomColor:colors.phon

  },
  product_info: {
    flex: 1,
    borderRadius: 8,
    flexDirection: "column",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  product_image_block: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: colors.phon,
  },
  product_image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  buttons_block: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 100,
  },
});

export default BasketProducts;
