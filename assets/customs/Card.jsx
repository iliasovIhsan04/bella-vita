import React, { useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import Column from "../../assets/styles/components/Column";
import TextContent from "../styles/components/TextContent";
import image from "../../assets/images/imgTest.png";
import { colors } from "../styles/components/colors";
import Wave from "../../assets/styles/components/Wave";
import Flex from "../styles/components/Flex";
import Favorite from "../../assets/svg/favorite";
import FavoriteActive from "../../assets/svg/favoriteSctive";
import Shopping from "../../assets/svg/shopping";
import AsyncStorage from "@react-native-async-storage/async-storage";
const containerWidth = (Dimensions.get("window").width - 32) / 2 - 5;

const Card = ({
  newBlock,
  percentage,
  title,
  mini_description,
  price,
  old_price,
  id,
  handle,
  data,
  harry,
  love,
  loveDelete,
  deleteFavorite
}) => {
  const [cart, setCart] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState(new Set());
  const saveToAsyncStorage = async (id) => {
    const itemToAdd = (harry || data).find((item) => item.id === id);
    if (itemToAdd) {
      let updatedCart = [...cart];
      if (!updatedCart.some((item) => item.id === itemToAdd.id)) {
        updatedCart.push(itemToAdd);
      } else {
        updatedCart = updatedCart.filter((item) => item.id !== itemToAdd.id);
      }
      setCart(updatedCart);
      await AsyncStorage.setItem("cartFeatured", JSON.stringify(updatedCart));
    }
  };
  const toggleFavorite = async (id) => {
    const itemExists = await AsyncStorage.getItem(`activeItemFeatured${id}`);
    let updatedFavorites = new Set(favoriteItems);
    if (itemExists) {
      await AsyncStorage.removeItem(`activeItemFeatured${id}`);
      updatedFavorites.delete(id);
    } else {
      await AsyncStorage.setItem(`activeItemFeatured${id}`, `${id}`);
      updatedFavorites.add(id);
    }
    setFavoriteItems(updatedFavorites);
  };

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
  useEffect(() => {
    initializeData();
  }, []);

  const handleFavoriteToggle = () => {
    toggleFavorite(id);
    saveToAsyncStorage(id);
  };


  return (
    <Wave style={styles.cardContainer} key={id} handle={handle}>
      <Column gap={10}>
        <View style={styles.img_block}>
          <Image style={styles.img_box} source={image} />
          <Flex gap={2}>
            {newBlock && (
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
            <View style={[styles.new_block, styles.present_box]}>
              <TextContent fontSize={10} fontWeight={400} color={colors.white}>
                {percentage}
              </TextContent>
            </View>
          </Flex>
          {love && (
            <Wave style={styles.favorite_box} handle={handleFavoriteToggle}>
              {favoriteItems.has(id) ? <FavoriteActive /> : <Favorite />}
            </Wave>
          )}
          {loveDelete && (
            <Wave style={styles.favorite_box} handle={deleteFavorite}>
              <FavoriteActive /> 
            </Wave>
          )}
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
              {title}
            </TextContent>
            <TextContent
              fontSize={13}
              fontWeight={400}
              color={colors.gray}
              numberOfLines={2}
            >
              {mini_description}
            </TextContent>
          </Column>
          <Flex gap={10}>
            <TextContent fontSize={15} fontWeight={600} color={colors.black}>
              {old_price} сом
            </TextContent>
            <View style={{ position: "relative" }}>
              <TextContent fontSize={14} fontWeight={600} color={colors.gray2}>
                {price} сом
              </TextContent>
              <View style={styles.line_price}></View>
            </View>
          </Flex>
        </Column>
      </Column>
    </Wave>
  );
};
const styles = StyleSheet.create({
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
export default Card;
