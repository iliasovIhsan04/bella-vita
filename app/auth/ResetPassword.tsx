import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { stylesAll } from "../../style";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  registerFailure,
  registerStart,
  registerSuccess,
} from "@/Redux/reducer/slice/ActivationReducerSlice";
import { url } from "@/Api";

interface ErrorActivation {
  password?: string[];
  confirm_password?: string[];
}

const ResetPassword = () => {
  const [errorActivation, setErrorActivation] = useState<ErrorActivation>({});
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localToken, setLocalToken] = useState<string | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchToken = async () => {
      const token = await AsyncStorage.getItem("token_block");
      setLocalToken(token);
    };
    fetchToken();
  }, []);

  const headers = {
    Authorization: `Token ${localToken}`,
  };

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      Alert.alert("Ошибка", "Пожалуйста, введите оба пароля.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Ошибка", "Пароли не совпадают.");
      return;
    }

    setIsLoading(true);
    const newPasswordCredential = {
      password,
      confirm_password: confirmPassword,
    };

    dispatch(registerStart());
    try {
      const response = await axios.post(
        `${url}/auth/change-password`,
        newPasswordCredential,
        { headers }
      );

      dispatch(registerSuccess(response.data));

      if (response.data.response === true) {
        Alert.alert("Успешно!", response.data.message);
        router.push("auth/Login");
      } else {
        Alert.alert("Ошибка", response.data.message || "Произошла ошибка");
        setErrorActivation(response.data);
      }
    } catch (error) {
      dispatch(registerFailure(error.message));
      Alert.alert("Ошибка", error.message || "Произошла непредвиденная ошибка");
    } finally {
      setIsLoading(false);
    }
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
        <Text style={stylesAll.auth_text}>Придумайте новый пароль</Text>
        <View style={styles.input_block}>
          <Text style={stylesAll.label}>Пароль</Text>
          <TextInput
            style={[stylesAll.input, styles.input_box]}
            placeholder="Введите пароль"
            placeholderTextColor="#888"
            onChangeText={setPassword}
            value={password}
          />
          {errorActivation.password && (
            <Text style={styles.error_text_registr}>
              {errorActivation.password[0]}
            </Text>
          )}
        </View>

        <View style={styles.input_block}>
          <Text style={stylesAll.label}>Повторите пароль</Text>
          <TextInput
            style={[stylesAll.input, styles.input_box]}
            placeholder="Повторите пароль"
            placeholderTextColor="#888"
            onChangeText={setConfirmPassword}
            value={confirmPassword}
          />
          {errorActivation.confirm_password && (
            <Text style={styles.error_text_registr}>
              {errorActivation.confirm_password[0]}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={stylesAll.button}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={stylesAll.button_text}>Сохранить</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input_block: {
    flexDirection: "column",
    marginVertical: 10,
  },
  input_box: {
    backgroundColor: "#F5F7FA",
  },
  error_text_registr: {
    color: "#DC0200",
    fontSize: 12,
    marginTop: 5,
  },
});

export default ResetPassword;
