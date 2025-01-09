import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { stylesAll } from "../../style";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { url } from "@/Api";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedAddress } from "@/Redux/address/addressesSlice";
import { RootState } from "@/Redux/reducer/store";

interface Address {
  id: number;
  street: string;
  number: string;
  building: string;
  apartment: string;
  floor: string;
  active: boolean;
}

const EmptyAddress = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState<Address[]>([]);
  const [orderDelete, setOrderDelete] = useState<number[]>([]);
  const [local, setLocal] = useState<string | null>(null);

  const addressId = useSelector(
    (state: RootState) => state.selectedAddress.selectedId
  );

  const handleActive = (id: number, address: string) => {
    router.push("/navigate/PlacingOrder");
    dispatch(setSelectedAddress({ id, address }));
  };

  const getToken = async () => {
    const token = await AsyncStorage.getItem("tokenActivation");
    setLocal(token);
  };

  const ordering = async () => {
    try {
      const response = await axios.get(`${url}/order/address/list/`, {
        headers: { Authorization: `Token ${local}` },
      });
      setData(response.data);
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    getToken();
    if (local) ordering();
  }, [local]);

  const delite = async (id: number) => {
    try {
      await axios.get(`${url}/order/address/delete/${id}`, {
        headers: { Authorization: `Token ${local}` },
      });
      setOrderDelete((prev) => prev.filter((el) => el !== id));
    } catch (error) {
      console.log("Error", error);
    }
  };

  const datas = data[0]?.active;

  return (
    <View style={stylesAll.background_block}>
      <View style={stylesAll.container}>
        <View style={stylesAll.header}>
          <TouchableOpacity
            style={stylesAll.header_back_btn}
            onPress={() => router.push("/navigate/PlacingOrder")}
          >
            <Image
              style={{ width: 24, height: 24 }}
              source={require("../../assets/images/moreLeft.png")}
            />
          </TouchableOpacity>
          <Text style={stylesAll.header_name}>Адрес доставки</Text>
          <View style={stylesAll.header_back_btn}></View>
        </View>
        <View style={{ marginTop: 30 }}>
          <TouchableOpacity
            style={[stylesAll.button, styles.btn_address]}
            onPress={() => router.push("/navigate/NewAddress")}
          >
            <Ionicons name="add-outline" size={24} color="#DC0200" />
            <Text style={[stylesAll.button_text, { color: "#DC0200" }]}>
              Добавить адрес
            </Text>
          </TouchableOpacity>
          {datas === false ? (
            <View style={{ marginTop: 20 }}>
              {data.map((item) => (
                <TouchableOpacity
                  onPress={() => handleActive(item.id, item.street)}
                  key={item.id}
                  style={[stylesAll.input, styles.input_box, { marginTop: 10 }]}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <View style={stylesAll.cell_box}>
                      <View>
                        {addressId === item.id && (
                          <View style={styles.line}></View>
                        )}
                      </View>
                    </View>
                    <Text style={styles.placeholder_static} numberOfLines={1}>
                      {item.street} {item.number} {item.building}{" "}
                      {item.apartment} {item.floor}
                    </Text>
                  </View>
                  <Ionicons
                    name="trash-outline"
                    size={24}
                    color="#DC0200"
                    onPress={async () => {
                      await delite(item.id);
                      ordering();
                    }}
                  />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 30,
                marginTop: 40,
              }}
            >
              <Image
                style={styles.empty_address}
                source={require("../../assets/images/empty_address.png")}
              />
              <View style={{ flexDirection: "column" }}>
                <Text style={stylesAll.history_text_one}>Пока тут пусто</Text>
                <Text style={stylesAll.history_text_two}>
                  Здесь будут храниться ваши адреса
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  placeholder_static: {
    fontSize: 16,
    fontWeight: "400",
    color: "#191919",
    width: 240,
  },
  line: {
    width: 15,
    height: 15,
    backgroundColor: "rgb(220, 2, 0)",
    borderRadius: 50,
  },
  input_box: {
    backgroundColor: "#F5F7FA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  btn_address: {
    width: "100%",
    backgroundColor: "none",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#DC0200",
  },
  empty_address: {
    width: 260,
    height: 235,
  },
});

export default EmptyAddress;
