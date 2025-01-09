import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Images from "./Images";
import { url } from "@/Api";
import { useRoute } from "@react-navigation/native";
import { stylesAll } from "@/style";

interface Product {
  id: number;
  title: string;
  preview_img: string;
  price: number;
  old_price: string;
  wholesale_price: number;
  description: string;
  sales: number;
  status: boolean;
  sub_cat: number;
  created_at: string;
  updated_at: string;
  quantity: number | null;
  price_for: string;
  code: number;
  img: {
    id: number;
    img: string;
  }[];
}

const Productid = () => {
  const route = useRoute();
  const { id } = route.params as { id: number };
  const [data, setData] = useState<Product | null>(null);
  const [isInBasket, setIsInBasket] = useState<boolean>(false);
  const [favoriteItems, setFavoriteItems] = useState<Set<number>>(new Set());
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    const initializeData = async () => {
      const cartItems = await AsyncStorage.getItem("cartFeatured");
      if (cartItems) {
        setCart(JSON.parse(cartItems));
      }
      const favoriteItemsKeys = await AsyncStorage.getAllKeys();
      const favoriteIds = favoriteItemsKeys
        .filter((key) => key.startsWith("activeItemFeatured"))
        .map((key) => parseInt(key.replace("activeItemFeatured", "")));
      setFavoriteItems(new Set(favoriteIds));
    };

    initializeData();
  }, []);

  useEffect(() => {
    const checkFavoritesAndBasket = async () => {
      try {
        const activeItem = await AsyncStorage.getItem(
          `activeItemsBasket_${id}`
        );
        setIsInBasket(!!activeItem);
        const itemExists = await AsyncStorage.getItem(
          `activeItemFeatured${id}`
        );
        setFavoriteItems((prev) => {
          const updatedFavorites = new Set(prev);
          if (itemExists) {
            updatedFavorites.add(id);
          } else {
            updatedFavorites.delete(id);
          }
          return updatedFavorites;
        });
      } catch (error) {
        console.error("Ошибка при проверке избранного или корзины:", error);
      }
    };

    checkFavoritesAndBasket();
  }, [id]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get<Product>(
          `${url}/product/detail/${id}`
        );
        setData(response.data);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };
    fetchUserData();
  }, [id]);

  const Basket = async (id: number, datas: Product) => {
    setIsInBasket(true);
    try {
      const prevIDString = await AsyncStorage.getItem("plus");
      const prevID = prevIDString !== null ? JSON.parse(prevIDString) : {};
      const updatedPrevID = { ...prevID, [id]: 1 };
      await AsyncStorage.setItem("plus", JSON.stringify(updatedPrevID));
      await AsyncStorage.setItem("plusOne", JSON.stringify(updatedPrevID));
      const prevShopCartString = await AsyncStorage.getItem("shopCart");
      const prevShopCart =
        prevShopCartString !== null ? JSON.parse(prevShopCartString) : [];
      const updatedShopCart = [...prevShopCart, datas];
      await AsyncStorage.setItem("shopCart", JSON.stringify(updatedShopCart));
      const prevCartsString = await AsyncStorage.getItem("cartsBasket");
      const prevCarts =
        prevCartsString !== null ? JSON.parse(prevCartsString) : [];
      const updatedCarts = [...prevCarts, datas];
      await AsyncStorage.setItem("cartsBasket", JSON.stringify(updatedCarts));
      await AsyncStorage.setItem(`activeItemsBasket_${id}`, JSON.stringify(id));
      const activeItem = await AsyncStorage.getItem(`activeItemsBasket_${id}`);
      if (activeItem) {
        Alert.alert("Ваш товар успешно добавлен в корзину!");
      } else {
        Alert.alert("Ошибка", "Не удалось добавить товар в корзину");
      }
    } catch (error) {
      Alert.alert("Ошибка", "Произошла ошибка при добавлении товара в корзину");
      console.error(error);
    }
  };

  if (!data) {
    return (
      <View style={stylesAll.loading}>
        <ActivityIndicator color="red" size="small" />
      </View>
    );
  }
  const saveToAsyncStorage = async (id: number) => {
    if (!data) return;

    const updatedCart = cart.some((item) => item.id === data.id)
      ? cart.filter((item) => item.id !== data.id)
      : [...cart, data];

    setCart(updatedCart);
    await AsyncStorage.setItem("cartFeatured", JSON.stringify(updatedCart));
  };
  const toggleFavorite = async (id: number) => {
    const itemExists = await AsyncStorage.getItem(`activeItemFeatured${id}`);
    const updatedFavorites = new Set(favoriteItems);
    if (itemExists) {
      await AsyncStorage.removeItem(`activeItemFeatured${id}`);
      updatedFavorites.delete(id);
    } else {
      await AsyncStorage.setItem(`activeItemFeatured${id}`, `${id}`);
      updatedFavorites.add(id);
    }
    setFavoriteItems(updatedFavorites);
  };

  return (
    <View style={stylesAll.background_block}>
      <View style={stylesAll.container}>
        <View style={stylesAll.header}>
          <TouchableOpacity
            style={stylesAll.header_back_btn}
            onPress={() => router.push("/(tabs)/catalog")}
          >
            <Image
              style={{ width: 24, height: 24 }}
              source={require("../../../assets/images/moreLeft.png")}
            />
          </TouchableOpacity>
          <Text style={stylesAll.header_name}></Text>
          <Pressable
            onPress={() => {
              toggleFavorite(id);
              saveToAsyncStorage(id);
            }}
            style={styles.heart_img_box}
          >
            <Image
              style={styles.heart_img}
              source={
                favoriteItems.has(id)
                  ? require("../../../assets/images/heart_card_new.png")
                  : require("../../../assets/images/heart_card.png")
              }
            />
          </Pressable>
        </View>
      </View>
      <Images data={data.img} />
      <View style={[styles.product_block, stylesAll.container]}>
        <Text style={styles.product_title}>{data.title}</Text>
        <View style={{ flexDirection: "column", gap: 5, marginTop: 16 }}>
          <View style={styles.row}>
            <Text style={styles.product_name}>Артикул:</Text>
            <Text style={styles.product_code}>{data.code}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.product_name}>1 {data.price_for}</Text>
            <Text style={[styles.product_old_price, styles.price]}>
              {data.price}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.product_name}>По карте</Text>
            <Text style={styles.product_old_price}>{data.old_price}</Text>
          </View>
        </View>
        <View style={{ flexDirection: "column", gap: 10, marginTop: 30 }}>
          <Text style={styles.description_name}>Описание:</Text>
          <Text style={styles.description_text}>{data.description}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={[stylesAll.button, styles.btn_product]}
        onPress={() =>
          isInBasket
            ? router.push(`navigate/BasketPage`)
            : Basket(data.id, data)
        }
      >
        <Text style={stylesAll.button_text}>
          {isInBasket ? "В корзине" : "Добавить в корзину"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  btn_product: {
    position: "absolute",
    width: "90%",
    bottom: 30,
    margin: "auto",
    alignSelf: "center",
  },
  description_name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#191919",
  },
  product_block: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  description_text: {
    fontSize: 16,
    fontWeight: "400",
    color: "#191919",
  },
  price: {
    color: "#191919",
  },
  product_old_price: {
    fontSize: 20,
    fontWeight: "700",
    color: "#DC0200",
  },
  product_code: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B6B6B",
  },
  product_title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#191919",
  },
  product_name: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B6B6B",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heart_img_box: {
    alignItems: "center",
  },
  heart_img: {
    width: 24,
    height: 24,
  },
});

export default Productid;
