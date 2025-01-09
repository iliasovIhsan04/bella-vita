import React, { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { stylesAll } from "../../style";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalDown from "@/Modal";
import axios from "axios";
import { url } from "@/Api";
const SettingPage = () => {
  const [isPetONe, setIsPetOne] = useState(false);
  const [isPetTwo, setIsPetTwo] = useState(false);
  const [modal, setModal] = useState(false);

  const deleteAccount = async () => {
    try {
      const local = await AsyncStorage.getItem("tokenActivation");
      const headers = {
        Authorization: `Token ${local}`,
      };
      const response = await axios.get(url + "/auth/delete-account", {
        headers,
      });
      if (response.data.response === true) {
        Alert.alert("Success", response.data.message);
        await AsyncStorage.removeItem("tokenActivation");
        await AsyncStorage.removeItem("token_block");
        router.push("/navigate/OnBoarding");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const toggleSwitchOne = async () => {
    const newValue = !isPetONe;
    setIsPetOne(newValue);
    try {
      if (newValue) {
        await AsyncStorage.setItem("notifications", JSON.stringify(newValue));
      } else {
        await AsyncStorage.removeItem("notifications");
      }
    } catch (error) {
      console.error("Failed to save switch state to AsyncStorage:", error);
    }
  };
  const toggleSwitchTwo = async () => {
    const newValue = !isPetTwo;
    setIsPetTwo(newValue);
    try {
      if (newValue) {
        await AsyncStorage.setItem("auto_brightness", JSON.stringify(newValue));
      } else {
        await AsyncStorage.removeItem("auto_brightness");
      }
    } catch (error) {
      console.error("Failed to save switch state to AsyncStorage:", error);
    }
  };

  return (
    <View style={styles.settings_block}>
      <View style={stylesAll.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.header_back_btn}
            onPress={() => router.push("/(tabs)/profile")}
          >
            <Image
              style={{ width: 24, height: 24 }}
              source={require("../../assets/images/moreLeft.png")}
            />
          </TouchableOpacity>
          <Text style={stylesAll.header_name}>Настройки</Text>
          <View style={styles.header_back_btn}></View>
        </View>
        <View style={styles.settings_cart_block}>
          <View style={styles.settings_box}>
            <View
              style={{
                flexDirection: "column",
                gap: 6,
                width: 240,
              }}
            >
              <Text style={styles.setting_notifications}>Уведомления</Text>
              <Text style={styles.setting_notifications_text}>
                Получайте уведомления об акциях и социальных предложениях
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#3e3e3e", true: "#25D366" }}
              thumbColor={isPetONe ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitchOne}
              value={isPetONe}
            />
          </View>
          <View style={styles.settings_box}>
            <View
              style={{
                flexDirection: "column",
                gap: 10,
                width: 240,
              }}
            >
              <Text style={styles.setting_notifications}>Автояркость</Text>
              <Text style={styles.setting_notifications_text}>
                Автояркость нужна для корректного считывания шрихкода
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#3e3e3e", true: "#25D366" }}
              thumbColor={isPetTwo ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitchTwo}
              value={isPetTwo}
            />
          </View>
        </View>
        <Pressable style={{ marginTop: 20 }} onPress={() => setModal(true)}>
          <Text style={styles.remove_accaunt}>Удалить аккаунт</Text>
        </Pressable>
        <ModalDown modal={modal} setModal={setModal}>
          <Text style={styles.modal_title}>Удалить аккаунт?</Text>
          <Text style={styles.modal_text}>
            Ваш аккаунт удалится насвегда, и вам придется заново
            зарегистрироваться
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
                await deleteAccount();
                setModal(false);
              }}
            >
              <Text style={[styles.btn_cancel_text, styles.btn_text]}>
                Удалить
              </Text>
            </TouchableOpacity>
          </View>
        </ModalDown>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
  },
  header_back_btn: {
    width: 30,
    height: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  settings_box: {
    width: "100%",
    backgroundColor: "#F5F7FA",
    borderRadius: 10,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  settings_block: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },
  settings_cart_block: {
    flexDirection: "column",
    gap: 10,
    marginTop: 30,
  },
  setting_notifications: {
    fontSize: 16,
    fontWeight: "700",
    color: "#191919",
  },
  setting_notifications_text: {
    fontSize: 14,
    fontWeight: "400",
    color: "#6B6B6B",
    lineHeight: 16,
  },
  remove_accaunt: {
    fontSize: 16,
    fontWeight: "700",
    color: "#DC0200",
  },
});

export default SettingPage;
