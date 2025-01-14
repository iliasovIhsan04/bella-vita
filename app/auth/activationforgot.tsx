import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { stylesAll } from "../../style";
import { router } from "expo-router";
import OTPTextInput from "react-native-otp-textinput";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import {
  registerFailure,
  registerSuccess,
} from "@/Redux/reducer/slice/ActivationReducerSlice";
import axios from "axios";
import { url } from "@/Api";

const ForgotActivationCode = () => {
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    setLoading(true);
    if (!code) {
      Alert.alert("Ошибка", "Введите код подтверждения!");
      setLoading(false);
      return;
    }
    if (code.length === 6) {
      const phone = await AsyncStorage.getItem("phone");
      if (!phone) {
        Alert.alert("Ошибка", "Phone number not found!");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.post(`${url}/auth/reset-password-verify`, {
          phone,
          code,
        });
        dispatch(registerSuccess(response.data));
        if (response.data.response === true) {
          await router.push("auth/ResetPassword");
          Alert.alert("Успешно!", response.data.message, [{ text: "OK" }]);
        }
        setLoading(false);
        if (response.data.response === false) {
          Alert.alert("Ошибка!", response.data.message + "!");
        }
        if (response.data.code) {
          setError(response.data);
        }
        if (response.data.token) {
          await AsyncStorage.setItem("token_block", response.data.token);
        }
      } catch (error) {
        setError(error.response?.data);
        dispatch(registerFailure(error.message));
        Alert.alert("Ошибка", "Произошла ошибка, повторите попытку позже.");
      }
    } else {
      Alert.alert("Ошибка", "Заполните все поля!");
    }
    setLoading(false);
  };
  return (
    <View style={stylesAll.background_block}>
      <View style={stylesAll.container}>
        <View style={stylesAll.header}>
          <TouchableOpacity
            style={stylesAll.header_back_btn}
            onPress={() => router.back()}
          >
            <Image
              style={{ width: 24, height: 24 }}
              source={require("../../assets/images/moreLeft.png")}
            />
          </TouchableOpacity>
          <Text style={stylesAll.header_name}>Новый пароль</Text>
          <View style={stylesAll.header_back_btn}></View>
        </View>
        <Text style={stylesAll.auth_text}>
          Мы отправили 6х значный код на ваш номер телефона
        </Text>
        <View style={{ marginTop: 20, gap: 20 }}>
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
          <TouchableOpacity
            style={[stylesAll.button]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={stylesAll.button_text}>Подтвердить</Text>
            )}
          </TouchableOpacity>
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
});

export default ForgotActivationCode;
