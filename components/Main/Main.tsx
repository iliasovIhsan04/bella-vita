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
  Platform,
  Linking,
} from "react-native";
import BonusCart from "./BonusCart";
import Header from "./Header";
import HurryUpToBuy from "./HurryUpToBuy";
import Promotion from "./Promotion";
import { stylesAll } from "@/style";
import { Ionicons } from "@expo/vector-icons";
import { AppDispatch } from "@/Redux/reducer/store";
import { useDispatch } from "react-redux";
import { fetchUserInfo } from "@/Redux/reducer/UserInfo";
import StoryComponent from "./StorisBlock";
import { router } from "expo-router";
import { useRoute } from "@react-navigation/native";

export default function Main() {
  const dispatch: AppDispatch = useDispatch();
  const scaleValueModal1 = useRef(new Animated.Value(0)).current;
  const opacityValueModal1 = useRef(new Animated.Value(0)).current;
  const [modalRegistration, setModalRegistration] = useState(false);
  const scaleValueModal2 = useRef(new Animated.Value(0)).current;
  const opacityValueModal2 = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);
  const handlePress = () => {
    const androidUrl = 'https://play.google.com/store/apps/details?id=com.alma.go';
    const iosUrl = 'https://apps.apple.com/kg/app/alma-go-%D0%B4%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BA%D0%B0-%D0%BF%D1%80%D0%BE%D0%B4%D1%83%D0%BA%D1%82%D0%BE%D0%B2/id6477783621';

    const url = Platform.OS === 'android' ? androidUrl : iosUrl;
    Linking.openURL(url).catch((err) => console.error('URL ачууда каталар:', err));
  };


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
            colors={["#DC0200"]}
            tintColor={"#DC0200"}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <StoryComponent />
        <View style={{ marginBottom: 50 }}>
          <BonusCart />
          <View style={styles.apple_check_price}>
            <TouchableOpacity
              style={styles.apple_box}
              onPress={handlePress}
            >
              <Image
                style={styles.image_apple}
                source={require("../../assets/images/alma_go.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.check_price_box}
              onPress={() => router.push("/navigate/ProductGiven")}
            >
              <Image
                style={{ width: 24, height: 24 }}
                source={require("../../assets/images/scanning.png")}
              />
              <Text>Проверить цену</Text>
            </TouchableOpacity>
          </View>
          <HurryUpToBuy />
          <Promotion />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
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
    alignItems: "center",
    gap: 10,
    paddingHorizontal:20
  },
  apple_box: {
    flex: 1,  
    height: 58,
    borderRadius: 10,
    backgroundColor:'red'
  },
  image_apple: {
    width: "100%",
    height: "100%",
    overflow:'hidden',
    borderRadius:10
  },
  check_price_box: {
    flex: 1,  
    height:58,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
    gap: 10,
    backgroundColor: "#f5f7fa",
  },
});
