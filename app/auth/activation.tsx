import React, { useState } from "react";
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
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";

import {
  registerFailure,
  registerSuccess,
} from "@/Redux/reducer/slice/ActivationReducerSlice";
import { router } from "expo-router";
import axios from "axios";
import { url } from "@/Api";
import OTPTextInput from "react-native-otp-textinput";
import { stylesAll } from "../../style";

interface ActivationCodeProps {}

const ActivationCode: React.FC<ActivationCodeProps> = () => {
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleCode = async () => {
    const phone = await AsyncStorage.getItem("phone");
    if (phone) {
      await axios.post(`${url}/auth/send-code`, { phone });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!code) {
      Alert.alert("Ошибка!", "Введите код подтверждения!");
      setLoading(false);
      return;
    }
    if (code.length === 6) {
      try {
        const phone = await AsyncStorage.getItem("phone");
        if (phone) {
          const response = await axios.post(`${url}/auth/verify-phone`, {
            phone,
            code,
          });
          dispatch(registerSuccess(response.data));
          if (response.data.response === false) {
            Alert.alert("Ошибка", response.data.message + "!");
          }
          if (response.data.token) {
            await AsyncStorage.setItem("tokenActivation", response.data.token);
          }
          if (response.data.response === true) {
            router.push({
              pathname: "/",
              params: { showModal: true },
            });
          }
          if (response.data.code) {
            Alert.alert("Ошибка!", response.data.code + "!");
          }
        }
      } catch (error) {
        dispatch(registerFailure((error as Error).message));
        Alert.alert("Ошибка", "Произошла ошибка.");
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert("Ошибка!", "Заполните все поля!");
      setLoading(false);
    }
  };

  return (
    <View style={stylesAll.container}>
      <View style={[stylesAll.header]}>
        <TouchableOpacity
          style={stylesAll.header_back_btn}
          onPress={() => router.push("/(tabs)/profile")}
        >
          <Image
            style={{ width: 24, height: 24 }}
            source={require("../../assets/images/moreLeft.png")}
          />
        </TouchableOpacity>
        <Text style={stylesAll.header_name}>Код потверждения</Text>
        <View style={stylesAll.header_back_btn}></View>
      </View>
      <Text style={[stylesAll.auth_text, { marginTop: 12 }]}>
        Мы отправили 6х значный код на ваш номер телефона
      </Text>
      <View style={{ gap: 20, marginTop: 20 }}>
        <View>
          <Text style={[stylesAll.label, styles.activation_label]}>
            Код потверждения
          </Text>
          <View style={styles.otpContainer}>
            <OTPTextInput
              inputCount={6}
              handleTextChange={(otp) => setCode(otp)}
              containerStyle={styles.otpContainer}
              textInputStyle={styles.otpInput}
              tintColor={"rgba(55, 9, 238, 1)"}
              defaultValue={code}
            />
          </View>
        </View>
        <View style={{ flexDirection: "column", gap: 10 }}>
          <Pressable
            style={stylesAll.button}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={stylesAll.button_text}>Потвердить код</Text>
            )}
          </Pressable>
          <Text style={styles.send_again} onPress={handleCode}>
            Отправить снова
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  otpInput: {
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderWidth: 1,
    textAlign: "center",
    color: "#000",
    width: "15%",
    margin: 0,
    padding: 0,
  },
  otpContainer: {
    width: "100%",
    flexWrap: "nowrap",
  },
  activation_label: {
    fontSize: 14,
  },
  send_again: {
    fontSize: 12,
    fontWeight: "400",
    color: "#DC0200",
    textAlign: "center",
  },
});

export default ActivationCode;
