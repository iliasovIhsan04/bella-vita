import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
  Pressable,
  Animated,
  RefreshControl,
  Dimensions,
} from "react-native";
import BonusCart from "./BonusCart";
import Header from "./Header";
import HurryUpToBuy from "./HurryUpToBuy";
import Promotion from "./Promotion";
import { stylesAll } from "@/style";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { fetchUserInfo } from "@/Redux/reducer/UserInfo";
import StoryComponent from "./StorisBlock";
import { router } from "expo-router";
import { useRoute } from "@react-navigation/native";
import Wrapper from "../../assets/styles/components/Wrapper";
import Column from "../../assets/styles/components/Column";
import { colors } from "@/assets/styles/components/colors";
import Flex from "../../assets/styles/components/Flex";
import Scanner from "../../assets/svg/imgScanner";
import Favorite from "../../assets/svg/favoriteImg";
import TextContent from "@/assets/styles/components/TextContent";
import Wave from "@/assets/styles/components/Wave";
import { url } from "@/Api";
import axios from "axios";
import Button from "@/assets/customs/Button";
import CartImg from "../../assets/svg/cartimg";

const containerWidth = (Dimensions.get("window").width - 32) / 2 - 5;

export default function Main() {
  const dispatch = useDispatch();
  const [modalRegistration, setModalRegistration] = useState(false);
  const scaleValueModal2 = useRef(new Animated.Value(0)).current;
  const opacityValueModal2 = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);
  const [brendData, setBrendData] = useState([]);
  useEffect(() => {
    const fetchBrendData = async () => {
      try {
        const response = await axios.get(url + "/brand/");
        setBrendData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchBrendData();
  }, []);
  const route = useRoute();
  const { showModal } = route.params || {};
  useEffect(() => {
    if (showModal) {
      setModalRegistration(true);
    }
  }, [showModal]);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchUserInfo());
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (modalRegistration) {
      Animated.parallel([
        Animated.spring(scaleValueModal2, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValueModal2, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleValueModal2, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValueModal2, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [modalRegistration]);

  return (
    <>
      <Modal
        visible={modalRegistration}
        transparent={true}
        animationType="none"
      >
        <Pressable
          style={stylesAll.content_modal}
          onPress={() => setModalRegistration(false)}
        >
          <Animated.View
            style={[
              stylesAll.modal_block_placing,
              {
                transform: [{ scale: scaleValueModal2 }],
                opacity: opacityValueModal2,
              },
            ]}
          >
            <Ionicons
              onPress={() => setModalRegistration(false)}
              size={24}
              style={stylesAll.icon_close}
              name="close"
            />
            <View style={styles.modal_block_img}>
              <CartImg />
            </View>
            <Text style={styles.modal_text_title}>
              Ваша карта успешно создана!
            </Text>
            <Text style={styles.modal_text}>
              Теперь вы можете экономить на покупках, получать скидки, подарки и
              многое другое
            </Text>
            <View style={{ width: "100%" }}>
              <Button
                color={colors.feuillet}
                handle={() => setModalRegistration(false)}
              >
                Понятно
              </Button>
            </View>
          </Animated.View>
        </Pressable>
      </Modal>
      <Header />
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            colors={["#9519AD"]}
            tintColor={"#9519AD"}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <StoryComponent />
        <Column gap={10} style={{ marginBottom: 50 }}>
          <Wrapper padding={[20, 24]}>
            <Column gap={10}>
              <BonusCart />
              <View style={styles.apple_check_price}>
                <Wave
                  style={styles.apple_box}
                  handle={() => router.push("(tabs)/catalog")}
                >
                  <TextContent
                    color={colors.black}
                    fontSize={16}
                    fontWeight={600}
                    style={{ width: "60%", paddingTop: 16, paddingLeft: 16 }}
                  >
                    Трендовая косметика в Bella Vita
                  </TextContent>
                  <Image
                    style={styles.image_apple}
                    source={require("../../assets/images/trend.png")}
                  />
                </Wave>
                <View style={styles.check_price_block}>
                  <Flex gap={8}>
                    <Wave
                      style={styles.check_price_box}
                      handle={() => router.push("/navigate/ProductGiven")}
                    >
                      <Column gap={6} style={{ alignItems: "center" }}>
                        <Scanner />
                        <TextContent
                          fontSize={11}
                          fontWeight={500}
                          color={colors.black}
                          style={{ textAlign: "center" }}
                        >
                          Проверить цену
                        </TextContent>
                      </Column>
                    </Wave>
                    <Wave
                      style={styles.check_price_box}
                      handle={() => router.push("navigate/FeaturedProducts")}
                    >
                      <Column gap={6} style={{ alignItems: "center" }}>
                        <Favorite />
                        <TextContent
                          fontSize={11}
                          fontWeight={500}
                          color={colors.black}
                          style={{ textAlign: "center" }}
                        >
                          Избранные товары
                        </TextContent>
                      </Column>
                    </Wave>
                  </Flex>
                  <View style={{ flex: 1 }}>
                    <Wave handle={() => router.push("navigate/BrendList")}>
                      <Column style={styles.brend_block}>
                        <TextContent
                          fontSize={16}
                          fontWeight={600}
                          color={colors.black}
                        >
                          Бренды
                        </TextContent>
                        <View style={styles.catalog_brend}>
                          {brendData.slice(0, 4).map((el, id) => (
                            <View
                              style={[
                                styles.brend_box,
                                { marginLeft: id > 0 ? -14 : 0 },
                              ]}
                              key={id}
                            >
                              <Image
                                style={styles.box_img}
                                source={{ uri: el.img }}
                              />
                            </View>
                          ))}
                          {brendData.length > 4 && (
                            <View style={styles.remaining_brend_box}>
                              <View style={styles.breand_box}>
                                <TextContent
                                  fontSize={12}
                                  fontWeight={500}
                                  color={colors.white}
                                >
                                  +{brendData.length - 4}8
                                </TextContent>
                              </View>
                            </View>
                          )}
                        </View>
                      </Column>
                    </Wave>
                  </View>
                </View>
              </View>
            </Column>
          </Wrapper>
          <HurryUpToBuy />
          <Promotion />
        </Column>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  box_img: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  brend_box: {
    position: "relative",
    width: 38,
    height: 38,
    borderRadius: 50,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    backgroundColor: colors.white,
  },
  block_brend: {
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },
  catalog_brend: {
    width: "100%",
    height: 38,
    flexDirection: "row",
  },
  remaining_brend_box: {
    position: "absolute",
    bottom: 0,
    left: 94,
    minWidth: 38,
    height: 38,
    borderRadius: 50,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
  },
  breand_box: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.black,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  favorite_box: {
    width: 36,
    height: 36,
    borderRadius: 50,
    backgroundColor: colors.feuilletOpacity,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  brend_block: {
    height: "100%",
    backgroundColor: colors.phon,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  modal_text_title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#191919",
    textAlign: "center",
  },
  modal_text: {
    fontSize: 14,
    fontWeight: "400",
    color: "#6B6B6B",
    textAlign: "center",
  },
  modal_block_img: {
    width: 170,
  },
  image_modal: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  apple_check_price: {
    flexDirection: "row",
    gap: 8,
  },
  apple_box: {
    width: containerWidth,
    height: 200,
    borderRadius: 10,
    backgroundColor: colors.phon,
    position: "relative",
  },
  image_apple: {
    width: "100%",
    height: 190,
    borderRadius: 10,
    bottom: 65,
  },
  check_price_block: {
    width: containerWidth,
    backgroundColor: colors.white,
    flexDirection: "column",
    gap: 8,
  },
  check_price_box: {
    flex: 1,
    height: 96,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 14,
    backgroundColor: colors.phon,
  },
});
