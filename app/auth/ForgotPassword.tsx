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
import { TextInputMask } from "react-native-masked-text";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { url } from "@/Api";

interface ErrorActivation {
  phone?: string[];
}

const ForgotPassword = () => {
  const [phone, setPhone] = useState("");
  const [errorActivation, setErrorActivation] = useState<ErrorActivation>({});
  const [loading, setLoading] = useState(false);

  const handleLoginEvent = async () => {
    if (!phone.trim()) {
      setErrorActivation({ phone: ["Пожалуйста, введите номер телефона."] });
      return;
    }
    setLoading(true);
    const phoneNumber =
      "+996 " + phone.slice(0, 3) + phone.slice(3, 6) + phone.slice(6);
    try {
      const response = await axios.post(`${url}/auth/reset-password`, {
        phone: phoneNumber,
      });

      const formattedPhone = "+996 " + phone;
      await AsyncStorage.setItem("phone", JSON.stringify(formattedPhone));

      if (response.data.response === true) {
        router.push("auth/ActivationForgot");
        Alert.alert("Успешно!", response.data.message);
      } else {
        Alert.alert("Ошибка!", response.data.message || "Произошла ошибка");
      }

      if (response.data.phone) {
        setErrorActivation({ phone: [response.data.phone] });
        Alert.alert("Ошибка!", response.data.phone || "Произошла ошибка");
      }
    } catch (error: any) {
      Alert.alert(
        "Ошибка!",
        error.message || "Произошла непредвиденная ошибка"
      );
    } finally {
      setLoading(false);
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
          <Text style={stylesAll.header_name}>Забыл(-а) пароль</Text>
          <View style={stylesAll.header_back_btn}></View>
        </View>
        <Text style={stylesAll.auth_text}>
          Мы отправим 4-х значный код на этот номер телефона
        </Text>
        <View style={{ gap: 20, marginTop: 20 }}>
          <View style={styles.input_block}>
            <Text style={stylesAll.label}>Номер телефона</Text>
            <View style={stylesAll.phone_input_mask_block}>
              <Text>+996</Text>
              <TextInputMask
                type={"custom"}
                options={{ mask: "(999) 99-99-99" }}
                value={phone}
                onChangeText={setPhone}
                style={[
                  stylesAll.input,
                  stylesAll.input_mask,
                  styles.input_box,
                ]}
                placeholder="(700) 10-20-30"
                keyboardType="phone-pad"
              />
            </View>
            {errorActivation.phone && (
              <Text style={styles.error_text_registr}>
                {errorActivation.phone[0]}
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={[stylesAll.button]}
            disabled={loading}
            onPress={handleLoginEvent}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={stylesAll.buttonText}>Получить код</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input_block: {
    flexDirection: "column",
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

export default ForgotPassword;
