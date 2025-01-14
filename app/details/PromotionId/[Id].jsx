import { url } from "@/Api";
import { stylesAll } from "@/style";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Header } from "react-native/Libraries/NewAppScreen";

const PromotionId = () => {
  const [harryId, setHarryId] = useState(null);
  const { id } = useLocalSearchParams();

  useEffect(() => {
    if (id) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            `${url}/card/${id}`
          );
          setHarryId(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchUserData();
    }
  }, [id]);

  if (!harryId) {
    return (
      <View style={stylesAll.loading}>
        <ActivityIndicator color="red" size="small" />
      </View>
    );
  }
  const cleanText = (text) => {
    return text.replace(/<\/?[^>]+(>|$)/g, "");
  };

  return (
    <View style={stylesAll.background_block}>
      <View style={stylesAll.container}>
     <Header>
      
     </Header>
        <View style={styles.promotion_block}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.prom_text}>Акции</Text>
            <Text style={styles.prom_dateto}>{harryId.dateto}</Text>
          </View>
          <View style={styles.promotion_img_box}>
            <Image style={stylesAll.image_all} source={{ uri: harryId.img }} />
          </View>
          <Text style={styles.prom_title}>{cleanText(harryId.title)}</Text>
          <Text style={styles.prom_text_all}>{cleanText(harryId.text)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  promotion_block: {
    flexDirection: "column",
    gap: 14,
  },
  prom_text_all: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    color: "#191919",
  },
  prom_title: {
    fontSize: 22,
    color: "#191919",
    fontWeight: "700",
  },
  prom_dateto: {
    fontSize: 18,
    fontWeight: "500",
    color: "#DC0200",
  },
  prom_text: {
    fontSize: 18,
    fontWeight: "500",
    color: "#191919",
  },
  promotion_img_box: {
    width: "100%",
    height: 360,
    borderRadius: 14,
    overflow: "hidden",
  },
});

export default PromotionId;
