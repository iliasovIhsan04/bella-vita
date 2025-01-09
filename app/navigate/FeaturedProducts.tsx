import { stylesAll } from "@/style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
}

const FeaturedProducts = () => {
  const [cart, setCart] = useState<Product[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartAndFavorites = async () => {
      try {
        const cartData = await AsyncStorage.getItem("cartFeatured");
        const favoritesData = await AsyncStorage.getItem("favorites");
        if (cartData) setCart(JSON.parse(cartData));
        if (favoritesData) setFavoriteItems(JSON.parse(favoritesData));
      } catch (error) {
        console.error("Failed to load cart or favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartAndFavorites();
  }, []);

  const deleteItem = async (id: number) => {
    try {
      setLoading(true);
      const cartData = await AsyncStorage.getItem("cartFeatured");
      const cart = JSON.parse(cartData) || [];
      const newCart = cart.filter((el: Product) => el.id !== id);
      await AsyncStorage.setItem("cartFeatured", JSON.stringify(newCart));
      await AsyncStorage.removeItem(`activeItemFeatured${id}`);
      setCart(newCart);
    } catch (error) {
      console.error("Failed to delete item:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={stylesAll.container}>
      <View style={[stylesAll.header, stylesAll.header_nav_gray]}>
        <TouchableOpacity
          style={stylesAll.header_back_btn}
          onPress={() => router.push("/(tabs)/profile")}
        >
          <Image
            style={{ width: 24, height: 24 }}
            source={require("../../assets/images/moreLeft.png")}
          />
        </TouchableOpacity>
        <Text style={stylesAll.header_name}>Избранные товары</Text>
        <View style={stylesAll.header_back_btn}></View>
      </View>
      {loading ? (
        <View style={stylesAll.loading_catalog_page}>
          <ActivityIndicator size="small" color="#DC0200" />
        </View>
      ) : cart.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.catalog_block_all}>
            {cart.map((el, id: number) => (
              <Pressable
                style={styles.catalog_box}
                key={id}
                onPress={() => router.push(`/details/ProductId/${el.id}`)}
              >
                <Pressable
                  onPress={() => deleteItem(el.id)}
                  style={styles.heart_img_box}
                >
                  <Image
                    style={styles.heart_img}
                    source={
                      favoriteItems.includes(el.id)
                        ? require("../../assets/images/heart_card.png")
                        : require("../../assets/images/heart_card_new.png")
                    }
                  />
                </Pressable>
                <View style={styles.catgalog_img_box}>
                  <Image
                    source={{ uri: el.preview_img }}
                    style={styles.catgalog_img}
                  />
                </View>
                <Text style={styles.catalog_title} numberOfLines={1}>
                  {el.title}
                </Text>
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.catalog_name}>1 {el.price_for}</Text>
                    <Text style={styles.catlaog_price}>{el.price} сом</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.catalog_name}>По карте</Text>
                    <Text style={styles.catlaog_old_price}>
                      {el.old_price} сом
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={stylesAll.purchase_history}>
          <View style={stylesAll.history_image_box}>
            <Image
              style={stylesAll.image_all}
              source={require("../../assets/images/empty_favorites.png")}
            />
          </View>
          <Text style={stylesAll.history_text_one}>Пока тут пусто</Text>
          <Text style={stylesAll.history_text_two}>
            Добавьте в избранное всё, что душе угодно, а мы доставим заказ
            от 150 сом
          </Text>
          <TouchableOpacity
            style={stylesAll.button}
            onPress={() => router.push("/(tabs)/catalog")}
          >
            <Text style={stylesAll.button_text}>Перейти в каталог</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  catalog_block_all: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 150,
  },
  heart_img_box: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    zIndex: 9999,
  },
  heart_img: {
    width: "100%",
    height: "100%",
  },
  catlaog_price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#191919",
  },
  catlaog_old_price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FE211F",
  },
  catalog_name: {
    fontSize: 12,
    fontWeight: "400",
    color: "#6B6B6B",
  },

  catalog_title: {
    fontSize: 14,
    fontWeight: "400",
    color: "#191919",
  },
  catgalog_img: {
    width: "100%",
    height: "100%",
  },
  catgalog_img_box: {
    width: "100%",
    height: 140,
    borderRadius: 14,
    overflow: "hidden",
  },
  catalog_box: {
    width: "48%",
    height: 230,
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 14,
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
  },
});

export default FeaturedProducts;
