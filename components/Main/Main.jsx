import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
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

const containerWidth = (Dimensions.get("window").width - 32) / 2 - 5;

export default function Main() {
  const dispatch = useDispatch();
  const [modalRegistration, setModalRegistration] = useState(false);
  const scaleValueModal2 = useRef(new Animated.Value(0)).current;
  const opacityValueModal2 = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);

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
              <Image
                style={styles.image_modal}
                source={require("../../assets/images/modal_img.png")}
              />
            </View>
            <Text style={styles.modal_text_title}>
              Ваша карта успешно создана!
            </Text>
            <Text style={styles.modal_text}>
              Теперь вы можете экономить на покупках, получать скидки, подарки и
              многое другое
            </Text>
            <TouchableOpacity
              style={stylesAll.button}
              onPress={() => setModalRegistration(false)}
            >
              <Text style={stylesAll.buttonText}> Понятно</Text>
            </TouchableOpacity>
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
                <Wave style={styles.apple_box} handle={() => router.push("(tabs)/catalog")}>
                  <Image
                    style={styles.image_apple}
                    source={require("../../assets/images/brendLogo.png")}
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
                        Избранные
                        товары
                        </TextContent>
                      </Column>
                    </Wave>
                  </Flex>
                  <Column style={styles.brend_block}>
                    <TextContent
                      fontSize={16}
                      fontWeight={600}
                      color={colors.black}
                    >
                      Бренды
                    </TextContent>
                    <View style={styles.brend_img_block}></View>
                  </Column>
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
  brend_img_block: {
    width: "100%",
    height: 46,
    backgroundColor: colors.white,
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
    flex: 1,
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
    height: 140,
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
    height: 230,
    borderRadius: 10,
  },
  image_apple: {
    width: "100%",
    height: 230,
    overflow: "hidden",
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
