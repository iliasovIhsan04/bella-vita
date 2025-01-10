import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Pressable,

} from "react-native";
import Wave from '../../assets/styles/components/Wave'
import Morees from "../../assets/svg/More";
import { router } from "expo-router";
import Wrapper from '../../assets/styles/components/Wrapper';
import TextContent from "@/assets/styles/components/TextContent";
import { colors } from "@/assets/styles/components/colors";
import Flex from "@/assets/styles/components/Flex";
import Card from "@/assets/customs/Card";
interface HarryBuy {
  id: number;
  title: string;
  net: string;
  where: string;
  prom_price: string;
  price: string;
  percentage: string;
  img: string;
  date: string;
}

const HurryUpToBuy = () => {
  const [data, setData] = useState<HarryBuy[]>([]);

  const api = "https://alma-market.online/card/type/one";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get<HarryBuy[]>(api);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchUserData();
  }, []);

  console.log(data);
  return (
    <Wrapper padding={[20, 24]}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <TextContent fontSize={20} fontWeight={600} color={colors.black}>Успей купить</TextContent>
        <Wave
          handle={() => router.push("/navigate/HarryBuyDetails")}
        >
          <Flex>
          <TextContent fontSize={16} fontFamily={400} color={colors.black}>Все</TextContent>
          <Morees />
          </Flex>
        </Wave>
      </View>
      <ScrollView
        horizontal={true}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={{ gap: 10, flexDirection: "row" }}>
          {data.map((item) => (
            <Pressable
              key={item.id}
              style={styles.harry_block}
              onPress={() => router.push(`/details/HarryDetailsId/${item.id}`)}
            >
              <View style={{ flexDirection: "row", gap: 10 }}>
                <View style={styles.block_red}>
                  <Image
                    style={styles.list_img}
                    source={require("../../assets/images/list.png")}
                  />
                  <Text style={styles.percentage_text}>{item.percentage}</Text>
                  <Text style={styles.prom_price}>{item.prom_price}</Text>
                  <Text style={styles.price_text}>{item.price}</Text>
                  <View style={styles.line_price}></View>
                </View>
                <View style={styles.title_text_box}>
                  <Text style={styles.harry_title} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.harry_net_text}>{item.net}</Text>
                  <Text style={styles.harry_where_text}>{item.where}</Text>
                </View>
              </View>
              <View style={styles.prom_img_box}>
                <Image style={styles.prom_img} source={{ uri: item.img }} />
              </View>
              <View style={{ flexDirection: "row" }}>
                <View style={styles.date_box}>
                  <Text style={styles.date_text}>{item.date}</Text>
                  <View style={styles.data_right_rotate}></View>
                  <View style={styles.data_left_rotate}></View>
                </View>
              </View>
            </Pressable>
          ))}
          <Card/>
        </View>
      </ScrollView>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  data_right_rotate: {
    width: 15,
    height: 15,
    backgroundColor: "#fff",
    position: "absolute",
    right: -8,
    transform: [{ rotate: "45deg" }],
  },
  data_left_rotate: {
    width: 15,
    height: 15,
    backgroundColor: "#fff",
    position: "absolute",
    left: -8,
    transform: [{ rotate: "45deg" }],
  },
  date_text: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  date_box: {
    width: 110,
    height: 20,
    backgroundColor: "#68b936",
    margin: "auto",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    bottom: 0,
  },
  prom_img_box: {
    width: 150,
    height: 115,
    margin: "auto",
    marginTop: 10,
  },
  prom_img: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  line_price: {
    width: 25,
    height: 1,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 13,
    margin: "auto",
    transform: [{ rotate: "160deg" }],
  },
  percentage_text: {
    fontSize: 10,
    color: "#FFFFFF",
    position: "absolute",
    top: 0,
    right: 7,
  },
  list_img: {
    width: 41,
    height: 23,
    position: "absolute",
    top: -5,
    right: 0,
  },
  price_text: {
    fontSize: 13,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  harry_block: {
    width: 260,
    height: 260,
    borderRadius: 20,
    borderColor: "#DC0200",
    borderWidth: 2,
    padding: 10,
  },
  block_red: {
    width: "29%",
    height: 68,
    borderRadius: 50,
    backgroundColor: "#fe211f",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
  },
  title_text_box: {
    width: "68%",
  },
  harry_title: {
    fontSize: 12,
    fontWeight: "700",
    color: "#191919",
    overflow: "hidden",
    marginBottom: 0,
  },
  harry_net_text: {
    fontSize: 14,
    fontWeight: "400",
    color: "#6B6B6B",
    lineHeight: 16,
  },
  harry_where_text: {
    fontSize: 11,
    fontWeight: "400",
    color: "#68B936",
  },
  prom_price: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});

export default HurryUpToBuy;
