import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { stylesAll } from "../../style";
import { router } from "expo-router";
import axios from "axios";
import { url } from "@/Api";

interface PromotionDetailInter {
  id: number;
  title: string;
  img: string;
}
const PromotionDetails = () => {
  const [harry, setHarry] = useState<PromotionDetailInter[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get<PromotionDetailInter[]>(
          `${url}/card/type/two`
        );
        setHarry(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchUserData();
  }, []);
  if (harry.length === 0) {
    return (
      <View style={stylesAll.loading}>
        <ActivityIndicator color="red" size="small" />
      </View>
    );
  }
  return (
    <View style={stylesAll.background_block}>
      <View style={stylesAll.container}>
        <View style={[stylesAll.header, stylesAll.header_nav]}>
          <TouchableOpacity
            style={stylesAll.header_back_btn}
            onPress={() => router.back()}
          >
            <Image
              style={{ width: 24, height: 24 }}
              source={require("../../assets/images/moreLeft.png")}
            />
          </TouchableOpacity>
          <Text style={stylesAll.header_name}>Акции</Text>
          <View style={stylesAll.header_back_btn}></View>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={{ flexDirection: "column", gap: 10, marginBottom: 200 }}>
            {harry.map((el) => (
              <Pressable
                style={styles.promotion_block}
                onPress={() => router.push(`/details/PromotionId/${el.id}`)}
              >
                <View style={styles.prom_img_box}>
                  <Image
                    style={{ width: "100%", height: "100%" }}
                    source={{ uri: el.img }}
                  />
                </View>
                <Text style={stylesAll.promtion_title}>{el.title}</Text>
                <Pressable
                  style={[stylesAll.btn_all, styles.prom_btn]}
                  onPress={() => router.push(`/details/PromotionId/${el.id}`)}
                >
                  <Text style={styles.prom_btn_text}>Подробнее</Text>
                  <Image
                    style={{ width: 24, height: 24, tintColor: "#DC0200" }}
                    source={require("../../assets/images/moreRight.png")}
                  />
                </Pressable>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  promotion_block: {
    width: "100%",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: "#F5F7FA",
    flexDirection: "column",
    gap: 10,
  },
  prom_img_box: {
    width: "100%",
    height: 260,
    borderRadius: 14,
    overflow: "hidden",
  },
  prom_btn: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#DC0200",
  },
  prom_btn_text: {
    color: "#DC0200",
    fontSize: 16,
  },
});

export default PromotionDetails;
