import { url } from "@/Api";
import { stylesAll } from "@/style";
import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface PromotionInter {
  id: number;
  title: string;
  img: string;
}

const Promotion = () => {
  const [data, setData] = useState<PromotionInter[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get<PromotionInter[]>(
          `${url}/card/type/two`
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchUserData();
  }, []);

  console.log(data);
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 30,
          marginBottom: 10,
          paddingHorizontal:20
        }}
      >
        <Text style={styles.prom_text}>Акции</Text>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => router.push("/navigate/PromotionDetails")}
        >
          <Text>Все</Text>
          <View style={styles.back_btn}>
            <Image
              style={{ width: 24, height: 24 }}
              source={require("../../assets/images/moreRight.png")}
            />
          </View>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal={true}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{marginLeft:20}}
      >
        {
          <View style={{ flexDirection: "row", gap: 10 }}>
            {data.map((el) => (
              <Pressable
                key={el.id}
                style={styles.promotion_box}
                onPress={() => router.push(`/details/PromotionId/${el.id}`)}
              >
                <View style={styles.promotion_img_box}>
                  <Image
                    style={{ width: "100%", height: "100%" }}
                    source={{ uri: el.img }}
                  />
                </View>
                <Text style={stylesAll.promtion_title} numberOfLines={2}>
                  {el.title}
                </Text>
              </Pressable>
            ))}
          </View>
        }
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  promotion_img_box: {
    width: "100%",
    height: 145,
    borderRadius: 14,
    overflow: "hidden",
  },
  back_btn: {
    width: 24,
    height: 24,
  },
  prom_text: {
    fontSize: 20,
    fontWeight: "700",
    color: "#191919",
  },
  promotion_box: {
    width: 240,
    height: 208,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: "#F5F7FA",
    flexDirection: "column",
    justifyContent: "space-between",
  },
});

export default Promotion;
