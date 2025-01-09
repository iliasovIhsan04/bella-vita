import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { stylesAll } from "../../style";
import { router } from "expo-router";
import axios from "axios";
import { url } from "@/Api";

interface NotificationsItem {
  title: string;
  description: string;
  date: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<NotificationsItem[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get<NotificationsItem[]>(
          `${url}/notifications/`
        );
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchUserData();
  }, []);

  if (notifications.length === 0) {
    return (
      <View style={stylesAll.loading}>
        <ActivityIndicator color="red" size="small" />
      </View>
    );
  }

  const cleanText = (text: string) => {
    return text.replace(/<\/?[^>]+(>|$)/g, "");
  };

  return (
    <View style={stylesAll.background_block}>
      <View style={stylesAll.container}>
        <View style={[stylesAll.header, stylesAll.header_nav]}>
          <TouchableOpacity
            style={stylesAll.header_back_btn}
            onPress={() => router.push("(tabs)/")}
          >
            <Image
              style={{ width: 24, height: 24 }}
              source={require("../../assets/images/moreLeft.png")}
            />
          </TouchableOpacity>
          <Text style={stylesAll.header_name}>Уведомления</Text>
          <View style={stylesAll.header_back_btn}></View>
        </View>
        <View style={{ flexDirection: "column", gap: 10 }}>
          {notifications.map((el, index) => (
            <View key={index} style={styles.notification_box}>
              <Text style={styles.title}>{cleanText(el.title)}</Text>
              <Text style={styles.description_text}>
                {cleanText(el.description)}
              </Text>
              <Text style={styles.date_text}>{el.date}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  notification_box: {
    width: "100%",
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#F5F7FA",
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#191919",
    lineHeight: 16,
  },
  description_text: {
    fontSize: 14,
    fontWeight: "400",
    color: "#6B6B6B",
    lineHeight: 16,
  },
  date_text: {
    fontSize: 12,
    fontWeight: "400",
    color: "#AAAAAA",
  },
});

export default Notifications;
