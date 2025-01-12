import { stylesAll } from "@/style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";

const Header = () => {
  const [totalQuantity, setTotalQuantity] = useState(0);

  useEffect(() => {
    const getItems = async () => {
      try {
        const storedBasket = await AsyncStorage.getItem("cartsBasket");
        const parsedBasket = storedBasket ? JSON.parse(storedBasket) : [];
        setTotalQuantity(parsedBasket.length);
      } catch (error) {
        console.error("Ошибка при получении товаров из корзины:", error);
      }
    };
    getItems();
  }, []);
  return (
    <View style={[styles.header, stylesAll.header_nav, stylesAll.container ]}>
      <Pressable onPress={() => router.push("/navigate/Notifications")}>
        <Image
          style={stylesAll.icons}
          source={require("../../assets/images/notifications.png")}
        />
      </Pressable>
      <Image
        style={stylesAll.logotip}
        source={require("../../assets/images/logotipCenter.png")}
      />
      <Pressable
        onPress={() => router.push("/navigate/BasketPage")}
        style={{ position: "relative" }}
      >
        <Image
          style={stylesAll.icons}
          source={require("../../assets/images/cart_gray.png")}
        />
        {totalQuantity > 0 && (
          <View style={styles.border_basket_not}>
            <Text style={styles.border_basket_text}>{totalQuantity}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  border_basket_not: {
    position: "absolute",
    width: 18,
    height: 18,
    borderRadius: 50,
    backgroundColor: "#DC0200",
    left: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  border_basket_text: {
    fontSize: 11,
    fontWeight: "400",
    color: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 60 : 42,
  },
});

export default Header;
