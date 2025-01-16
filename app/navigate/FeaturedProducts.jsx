import { stylesAll } from "@/style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import Header from "../../components/Main/HeaderAll";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors } from "@/assets/styles/components/colors";
import Wave from "@/assets/styles/components/Wave";
import Column from "@/assets/styles/components/Column";
import TextContent from "@/assets/styles/components/TextContent";
import Button from "@/assets/customs/Button";
import FeaturedImg from "../../assets/svg/featuredImg";
import Flex from "@/assets/styles/components/Flex";
import FavoriteActive from "@/assets/svg/favoriteSctive";
import Shopping from "../../assets/svg/shopping";
const containerWidth = (Dimensions.get("window").width - 32) / 2 - 5;

const FeaturedProducts = () => {
  const [cartFeat, setCartFeat] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartAndFavorites = async () => {
      try {
        const cartData = await AsyncStorage.getItem("cartFeatured");
        const favoritesData = await AsyncStorage.getItem("favorites");
        if (cartData) setCartFeat(JSON.parse(cartData));
        if (favoritesData) setFavoriteItems(JSON.parse(favoritesData));
      } catch (error) {
        console.error("Failed to load cart or favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartAndFavorites();
  }, []);

  const deleteItem = async (id) => {
    try {
      setLoading(true);
      const cartData = await AsyncStorage.getItem("cartFeatured");
      const cart = JSON.parse(cartData) || [];
      const newCart = cart.filter((el) => el.id !== id);
      await AsyncStorage.setItem("cartFeatured", JSON.stringify(newCart));
      await AsyncStorage.removeItem(`activeItemFeatured${id}`);
      setCartFeat(newCart);
    } catch (error) {
      console.error("Failed to delete item:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <Header container={true} back={true}>
        Избранные
      </Header>
      {loading ? (
        <View style={stylesAll.loading_catalog_page}>
          <ActivityIndicator size="small" color="#DC0200" />
        </View>
      ) : cartFeat.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={{ paddingHorizontal: 16 }}
        >
          <View style={styles.catalog_block_all}>
            {cartFeat.map((el, id) => (
              <Wave style={styles.cardContainer} key={id} handle={() => router.push(`/details/ProductId/${el.id}`)}>
                <Column gap={10}>
                  <View style={styles.img_block}>
                    <Image
                      style={styles.img_box}
                      source={{ uri: el.preview_img }}
                    />
                    <Flex gap={2}>
                      {el.new && (
                        <View style={styles.new_block}>
                          <TextContent
                            fontSize={10}
                            fontWeight={500}
                            color={colors.white}
                          >
                            NEW
                          </TextContent>
                        </View>
                      )}
                      {
                        el.discount_percentage && (
                          <View style={[styles.new_block, styles.present_box]}>
                          <TextContent
                            fontSize={10}
                            fontWeight={400}
                            color={colors.white}
                          >
                            {el.discount_percentage}%
                          </TextContent>
                        </View>
                        )
                      }
                    </Flex>
                    <Wave
                      style={styles.favorite_box}
                      handle={() => deleteItem(el.id)}
                    >
                      <FavoriteActive />
                    </Wave>
                    <Wave style={styles.cart_box}>
                      <Shopping />
                    </Wave>
                  </View>
                  <Column gap={8}>
                    <Column gap={6}>
                      <TextContent
                        fontSize={14}
                        fontWeight={500}
                        color={colors.black}
                        numberOfLines={1}
                        style={{ width: "80%" }}
                      >
                        {el.title}
                      </TextContent>
                      <TextContent
                        fontSize={13}
                        fontWeight={400}
                        color={colors.gray}
                        numberOfLines={2}
                        style={{ minHeight: 33 }}
                      >
                        {el.description}
                      </TextContent>
                    </Column>
                    <Flex gap={10}>
                      <TextContent
                        fontSize={15}
                        fontWeight={600}
                        color={colors.black}
                      >
                        {el.price} сом
                      </TextContent>
                      {el.discount_price && (
                        <View style={{ position: "relative" }}>
                          <TextContent
                            fontSize={14}
                            fontWeight={600}
                            color={colors.gray2}
                          >
                            {el.discount_price} сом
                          </TextContent>
                          <View style={styles.line_price}></View>
                        </View>
                      )}
                    </Flex>
                  </Column>
                </Column>
              </Wave>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={stylesAll.empty_block}>
          <View style={stylesAll.purchase_history}>
            <View style={stylesAll.history_image_box}>
              <FeaturedImg />
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
                Добавьте в избранное всё, что душе угодно, а мы доставим заказ
                от 150 сом
              </Text>
            </Column>
            <View style={{ width: "100%" }}>
              <Button
                color={colors.feuillet}
                handle={() => router.push("/(tabs)/catalog")}
              >
                Перейти в каталог
              </Button>
            </View>
          </View>
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
    marginTop: 8,
  },
  line_price: {
    width: "100%",
    height: 1,
    backgroundColor: colors.gray2,
    position: "absolute",
    top: 10,
  },
  cart_box: {
    width: 32,
    height: 32,
    borderRadius: 50,
    backgroundColor: colors.feuillet,
    position: "absolute",
    bottom: -14,
    right: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    width: containerWidth,
    marginBottom: 6,
  },
  present_box: {
    backgroundColor: colors.late,
    minWidth: 34,
  },
  new_block: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  img_block: {
    width: "100%",
    backgroundColor: colors.phon,
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 8,
    position: "relative",
  },
  img_box: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
    borderRadius: 6,
  },
  favorite_box: {
    position: "absolute",
    top: 5,
    right: 5,
  },
});

export default FeaturedProducts;
