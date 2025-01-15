import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { stylesAll } from "../../style";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { url } from "@/Api";
import { colors } from "@/assets/styles/components/colors";
import Header from "../../components/Main/HeaderAll";
import { Dropdown } from "react-native-element-dropdown";

const NewAddress = () => {
  const [address, setAddress] = useState({
    street: "",
    number: "",
    building: "",
    apartment: "",
    floor: "",
    region: {},
  });
  const [local, setLocal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cityValue, setCityValue] = useState(null);
  const [region, setRegion] = useState([]);
  const [regionValue, setRegionValue] = useState(null);

  React.useEffect(() => {
    AsyncStorage.getItem("tokenActivation").then((token) => setLocal(token));
  }, []);

  const headers = {
    Authorization: `Token ${local}`,
  };

  const handleChange = (name, value) => {
    setAddress({ ...address, [name]: value });
  };
  const handleSubmit = () => {
    setIsLoading(true);
    axios
      .post(url + "/order/address/add", address, { headers })
      .then((response) => {
        if (response.data.response === true) {
          setIsLoading(false);
          router.push("/navigate/EmptyAddress");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
      });
  };
  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const response = await axios.get(url + "/region/");
        console.log(response.data);
        const formattedRegions = response.data.map((region) => ({
          label: region.name,
          value: region.id,
        }));
        setRegion(formattedRegions);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchUserAddress();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={stylesAll.background_block}>
          <View style={stylesAll.container}>
            <Header back={true}>Новый адрес</Header>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "space-between",
                width: "100%",
                height: "100%",
                position: "relative",
              }}
            >
              <View style={stylesAll.input_block_all}>
                <View>
                  <Text style={stylesAll.label}>
                    Регион <Text style={styles.required}>*</Text>
                  </Text>
                  <Dropdown
                    style={[stylesAll.input, styles.input_box]}
                    placeholder="Выберите регион"
                    data={region}
                    labelField="label"
                    valueField="value"
                    value={regionValue}
                    onChange={(item) => {
                      setRegionValue(item.value);
                      handleChange("region", item.value);
                    }}
                  />
                </View>
                <View>
                  <Text style={stylesAll.label}>
                    Улица <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    placeholder="Введите название улицы"
                    placeholderTextColor={"#AAAAAA"}
                    style={[stylesAll.input, styles.input_box]}
                    value={address.street}
                    onChangeText={(value) => handleChange("street", value)}
                  />
                </View>
                <View>
                  <Text style={stylesAll.label}>
                    Дом <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    placeholder="Введите номер дома"
                    placeholderTextColor={"#AAAAAA"}
                    style={[stylesAll.input, styles.input_box]}
                    value={address.number}
                    onChangeText={(value) => handleChange("number", value)}
                  />
                </View>
                <View>
                  <Text style={stylesAll.label}>Корпус</Text>
                  <TextInput
                    placeholder="Введите номер корпуса"
                    placeholderTextColor={"#AAAAAA"}
                    style={[stylesAll.input, styles.input_box]}
                    value={address.building}
                    onChangeText={(value) => handleChange("building", value)}
                  />
                </View>
                <View>
                  <Text style={stylesAll.label}>Подъезд</Text>
                  <TextInput
                    placeholder="Введите номер подъезда"
                    placeholderTextColor={"#AAAAAA"}
                    style={[stylesAll.input, styles.input_box]}
                    value={address.apartment}
                    onChangeText={(value) => handleChange("apartment", value)}
                  />
                </View>
                <View>
                  <Text style={stylesAll.label}>Этаж</Text>
                  <TextInput
                    placeholder="Введите номер этажа"
                    placeholderTextColor={"#AAAAAA"}
                    style={[stylesAll.input, styles.input_box]}
                    value={address.floor}
                    onChangeText={(value) => handleChange("floor", value)}
                  />
                </View>
              </View>
              <TouchableOpacity
                style={[
                  styles.btn_new_address,
                  address.street && address.number && address.region
                    ? styles.btn_active
                    : styles.btn_inactive,
                ]}
                onPress={handleSubmit}
                disabled={
                  !address.street ||
                  !address.number ||
                  !address.region ||
                  isLoading
                }
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={"white"} />
                ) : (
                  <Text style={stylesAll.button_text}>Сохранить</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  btn_new_address: {
    width: "100%",
    height: 45,
    backgroundColor: colors.phon,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 225,
    left: 0,
  },
  btn_active: {
    backgroundColor: colors.feuillet,
  },
  btn_inactive: {
    backgroundColor: colors.gray,
  },
  input_box: {
    backgroundColor: colors.phon,
  },
  required: {
    fontSize: 14,
    color: "#DC0200",
  },
});

export default NewAddress;
