import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { url } from "@/Api";
import { stylesAll } from "@/style";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const PurchaseHistory = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);
  const [isSelectingFromDate, setIsSelectingFromDate] = useState<boolean>(true);

  const fetchData = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("tokenActivation");
    if (token) {
      const headers = { Authorization: `Token ${token}` };
      const urlWithDates =
        dateFrom && dateTo
          ? `${url}/order/list/?date_from=${dateFrom}&date_to=${dateTo}`
          : `${url}/order/list/`;

      try {
        const response = await axios.get(urlWithDates, { headers });
        setOrders(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [dateFrom, dateTo]);

  const handleConfirm = (date: Date) => {
    const isoDate = date.toISOString().split("T")[0];
    isSelectingFromDate ? setDateFrom(isoDate) : setDateTo(isoDate);
    hideDatePicker();
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  return (
    <View style={stylesAll.background_block}>
      <View style={stylesAll.container}>
        <View style={[stylesAll.header, stylesAll.header_nav]}>
          <TouchableOpacity
            style={stylesAll.header_back_btn}
            onPress={() => router.push("/(tabs)/profile")}
          >
            <Image
              style={{ width: 24, height: 24 }}
              source={require("../../assets/images/moreLeft.png")}
            />
          </TouchableOpacity>
          <Text style={stylesAll.header_name}>История покупок</Text>
          <View style={stylesAll.header_back_btn}></View>
        </View>
        {loading ? (
          <View style={stylesAll.loading_catalog_page}>
            <ActivityIndicator size="small" color="#DC0200" />
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.history_block}>
              <View style={styles.oclock_block}>
                <Pressable
                  style={styles.oclock_box}
                  onPress={() => {
                    setIsSelectingFromDate(true);
                    setDatePickerVisibility(true);
                  }}
                >
                  <View style={styles.dataCalender}>
                    <Text style={styles.from_text}>От</Text>
                    <Text
                      style={[
                        styles.add_calender_text,
                        !dateFrom && styles.placeholderText,
                      ]}
                    >
                      {dateFrom ? `:${dateFrom}` : ""} 
                    </Text>
                  </View>
                  <Image
                    style={styles.calendar}
                    source={require("../../assets/images/calendar_days.png")}
                  />
                </Pressable>
                <Pressable
                  style={styles.oclock_box}
                  onPress={() => {
                    setIsSelectingFromDate(false);
                    setDatePickerVisibility(true);
                  }}
                >
                  <View style={styles.dataCalender}>
                    <Text style={styles.from_text}>До</Text>
                    <Text
                      style={[
                        styles.add_calender_text,
                        !dateTo && styles.placeholderText,
                      ]}
                    >
                   {dateTo ?`: ${dateTo}` : ""}
                    </Text>
                  </View>
                  <Image
                    style={styles.calendar}
                    source={require("../../assets/images/calendar_days.png")}
                  />
                </Pressable>
              </View>
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <View key={index}>
                    <Text style={styles.dateTextInput}>{order.date}</Text>
                    {order.data.map((item, id) => (
                      <TouchableOpacity
                        style={styles.historyItem}
                        key={id}
                        onPress={() =>
                          router.push(`/details/PurchaseId/${item.id}`)
                        }
                      >
                        <View style={styles.itemInfo}>
                          <Text style={stylesAll.itemName}>
                            Покупка на сумму
                          </Text>
                          <Text style={stylesAll.itemSum}>{item.sum}</Text>
                        </View>
                        <Text style={stylesAll.itemAddress}>
                          {item.address_from || "Адрес не указан"}
                        </Text>
                        <View style={stylesAll.itemFooter}>
                          <Text style={stylesAll.date_text}>
                            {item.date} {item.time}
                          </Text>
                          <View>
                            <Text style={[stylesAll.bonus]}>
                              {item.total_accrued}
                            </Text>
                            <Text style={[stylesAll.bonus, styles.bonus_minus]}>
                              {item.total_written}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                ))
              ) : (
                <View style={styles.purchase_history_text}>
                  <Text style={styles.history_text}>Нет заказов!</Text>
                </View>
              )}
            </View>
          </ScrollView>
        )}
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bonus_minus: {
    color: "red",
  },
  history_text: {
    fontSize: 18,
    fontWeight: "500",
    color: "#DC0200",
  },

  purchase_history_text: {
    width: "100%",
    height: 600,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  calendar: {
    width: 24,
    height: 24,
  },
  from_text: {
    fontSize: 14,
    color: "#6B6B6B",
    fontWeight: "600",
  },
  history_block: {
    marginBottom: 150,
  },
  placeholderText: {
    fontSize: 14,
    marginTop: 2,
  },
  add_calender_text: {
    fontSize: 12,
    color: "#191919",
    fontWeight: "400",
  },
  dataCalender: {
    flexDirection: "row",
    gap: 3,
    alignItems: "center",
  },
  oclock_block: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
  },
  oclock_box: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "48%",
    backgroundColor: "#F5F7FA",
    padding: 10,
    height: 45,
    borderRadius: 10,
    marginTop: 10,
  },
  dateTextInput: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B6B6B",
    textAlign: "center",
    marginTop: 30,
    marginBottom: 14,
  },
  historyItem: {
    width: "100%",
    backgroundColor: "#F5F7FA",
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: "column",
    gap: 12,
  },
  itemInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default PurchaseHistory;
