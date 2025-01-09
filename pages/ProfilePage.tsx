import { stylesAll } from "@/style";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalDown from "@/Modal";
import { fetchUserInfo } from "@/Redux/reducer/UserInfo";
import { AppDispatch, RootState } from "@/Redux/reducer/store";

const ProfilePage = () => {
  const dispatch: AppDispatch = useDispatch();
  const [token, setToken] = useState<string | null>(null);
  const [modal, setModal] = useState(false);

  const getToken = async (): Promise<void> => {
    try {
      const storedToken = await AsyncStorage.getItem("tokenActivation");
      setToken(storedToken);
    } catch (error) {
      console.error("Error retrieving token:", error);
      setToken(null);
    }
  };

  useEffect(() => {
    const loadUserInfo = async () => {
      await getToken();
      if (token) {
        dispatch(fetchUserInfo());
      }
    };
    loadUserInfo();
  }, [dispatch, token]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("tokenActivation");
      await AsyncStorage.removeItem("token_block");
      setToken(null);
      router.push("auth/Login");
    } catch (error) {
      console.error("Error deleting token:", error);
    }
  };

  const data = useSelector((state: RootState) => state.users);
  const user = data?.user;

  return (
    <View style={{ backgroundColor: "white", height: "100%" }}>
      <View style={styles.headerWrapper}>
        <ImageBackground
          source={require("../assets/images/fon_profile.png")}
          style={styles.header_profile}
        >
          <View style={stylesAll.container}>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
                paddingLeft: 16,
              }}
            >
              <Image
                style={{ width: 77, height: 29 }}
                source={require("../assets/images/vector.png")}
              />
              {token ? (
                <Text style={styles.profile_text}>
                  {user?.first_name} {user?.last_name}!
                </Text>
              ) : (
                ""
              )}
            </View>
          </View>
        </ImageBackground>
      </View>
      <View style={stylesAll.container}>
        <View style={styles.area_block_all}>
          <View style={styles.area_block}>
            <TouchableOpacity
              style={styles.area_box}
              onPress={() => router.push("navigate/MyDetails")}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <View style={styles.area_box_red}>
                  <Image
                    source={require("../assets/images/profile_gray.png")}
                    style={{ width: 20, height: 20 }}
                    tintColor={"white"}
                  />
                </View>
                <Text style={styles.profile_box_name}>Мои данные</Text>
              </View>
              <Image
                style={{ width: 24, height: 24, tintColor: "#B3B4B4" }}
                source={require("../assets/images/moreRight.png")}
              />
            </TouchableOpacity>
            <Image
              style={styles.line}
              source={require("../assets/images/line.png")}
            />
            <Pressable
              style={styles.area_box}
              onPress={() => router.push("navigate/SettingPage")}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <View style={styles.area_box_red}>
                  <Image
                    source={require("../assets/images/setting-twoo.png")}
                    style={{ width: 20, height: 20 }}
                  />
                </View>
                <Text style={styles.profile_box_name}>Настройки</Text>
              </View>
              <Image
                style={{ width: 24, height: 24, tintColor: "#B3B4B4" }}
                source={require("../assets/images/moreRight.png")}
              />
            </Pressable>
          </View>
          <View style={styles.area_block}>
            <TouchableOpacity
              style={styles.area_box}
              onPress={() => router.push("navigate/FeaturedProducts")}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <View style={styles.area_box_red}>
                  <Image
                    source={require("../assets/images/heart_card1.png")}
                    style={{ width: 20, height: 20 }}
                  />
                </View>
                <Text style={styles.profile_box_name}>Избранные товары</Text>
              </View>
              <Image
                style={{ width: 24, height: 24, tintColor: "#B3B4B4" }}
                source={require("../assets/images/moreRight.png")}
              />
            </TouchableOpacity>
            <Image
              style={styles.line}
              source={require("../assets/images/line.png")}
            />
            <TouchableOpacity
              style={styles.area_box}
              onPress={() => router.push("navigate/PurchaseHistory")}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <View style={styles.area_box_red}>
                  <Image
                    source={require("../assets/images/order-history.png")}
                    style={{ width: 20, height: 20 }}
                  />
                </View>
                <Text style={styles.profile_box_name}>История покупок</Text>
              </View>
              <Image
                style={{ width: 24, height: 24, tintColor: "#B3B4B4" }}
                source={require("../assets/images/moreRight.png")}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.area_block}>
            <TouchableOpacity
              style={styles.area_box}
              onPress={() => router.push("navigate/ToHelp")}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <View style={styles.area_box_red}>
                  <Image
                    source={require("../assets/images/help.png")}
                    style={{ width: 20, height: 20 }}
                  />
                </View>
                <Text style={styles.profile_box_name}>Помощь</Text>
              </View>
              <Image
                style={{ width: 24, height: 24, tintColor: "#B3B4B4" }}
                source={require("../assets/images/moreRight.png")}
              />
            </TouchableOpacity>
            <Image
              style={styles.line}
              source={require("../assets/images/line.png")}
            />
            <TouchableOpacity
              style={styles.area_box}
              onPress={() => router.push("navigate/AboutTheApplication")}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <View style={styles.area_box_red}>
                  <Image
                    source={require("../assets/images/info.png")}
                    style={{ width: 20, height: 20 }}
                  />
                </View>
                <Text style={styles.profile_box_name}>О приложении</Text>
              </View>
              <Image
                style={{ width: 24, height: 24, tintColor: "#B3B4B4" }}
                source={require("../assets/images/moreRight.png")}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.area_box, styles.area_box_get_out]}
            onPress={() => setModal(true)}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <View style={styles.area_box_red}>
                <Image
                  source={require("../assets/images/logout.png")}
                  style={{ width: 20, height: 20 }}
                />
              </View>
              <Text style={styles.profile_box_name}>Выйти</Text>
            </View>
            <Image
              style={{ width: 24, height: 24, tintColor: "#B3B4B4" }}
              source={require("../assets/images/moreRight.png")}
            />
          </TouchableOpacity>
          <ModalDown modal={modal} setModal={setModal}>
            <Text style={styles.modal_title}>Выйти с аккаунта?</Text>
            <Text style={styles.modal_text}>
              Вам придется повторно выполнить авторизацию
            </Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                style={styles.btn_cancel}
                onPress={() => setModal(false)}
              >
                <Text style={styles.btn_cancel_text}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn_cancel, styles.btn_confirm]}
                onPress={async () => {
                  await handleLogout();
                  setModal(false);
                }}
              >
                <Text style={[styles.btn_cancel_text, styles.btn_text]}>
                  Выйти
                </Text>
              </TouchableOpacity>
            </View>
          </ModalDown>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  btn_confirm: {
    backgroundColor: "#DC0200",
  },
  btn_text: {
    color: "#FFFFFF",
  },
  btn_cancel_text: {
    fontSize: 16,
    fontWeight: "600",
    color: "#191919",
  },
  btn_cancel: {
    width: "48%",
    height: 45,
    backgroundColor: "#E4E4E4",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  modal_title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#191919",
  },
  modal_text: {
    width: "80%",
    fontSize: 14,
    fontWeight: "400",
    color: "#6B6B6B",
    marginTop: 12,
    marginBottom: 20,
  },
  headerWrapper: {
    overflow: "hidden",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  header_profile: {
    width: "100%",
    height: 160,
    paddingTop: 50,
    paddingBottom: 24,
  },
  profile_text: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  area_block: {
    width: "100%",
    height: 112,
    backgroundColor: "#F5F7FA",
    borderRadius: 14,
    flexDirection: "column",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  area_box: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  area_box_get_out: {
    backgroundColor: "#F5F7FA",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  area_box_red: {
    width: 36,
    height: 36,
    backgroundColor: "#DC0200",
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  line: {
    width: "81%",
    marginLeft: "auto",
  },
  profile_box_name: {
    color: "#191919",
    fontSize: 17,
    fontWeight: "700",
  },
  area_block_all: {
    marginTop: 40,
    flexDirection: "column",
    gap: 24,
  },
});

export default ProfilePage;
