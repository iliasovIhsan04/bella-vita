import { url } from "@/Api";
import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Wrapper from "../../assets/styles/components/Wrapper";
import { colors } from "@/assets/styles/components/colors";
import TextContent from "@/assets/styles/components/TextContent";
import Wave from "@/assets/styles/components/Wave";
import Flex from "@/assets/styles/components/Flex";
import Morees from "../../assets/svg/more";

const Promotion = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${url}/card/type/two`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchUserData();
  }, []);
  return (
    <Wrapper padding={[24, 20]} style={{paddingHorizontal:0 , height:'100%'}} bottom={true}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal:16
        }}
      >
        <TextContent fontSize={20} fontWeight={600} color={colors.black}>Акции</TextContent>
        <Wave
          style={{ flexDirection: "row", alignItems: "center" }}
          handle={() => router.push("/navigate/PromotionDetails")}
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
        {
          <View style={{ flexDirection: "row", gap: 10, marginTop:10,marginHorizontal:16 }}>
            {data.map((el, id) => (
              <Pressable
                key={el.id}
                style={styles.promotion_box}
                onPress={() => router.push(`/details/PromotionId/${el.id}`)}
              >
                  <Image style={styles.promotion_img_box}
                    source={{ uri: el.img }}
                  />
              </Pressable>
            ))}
          </View>
        }
      </ScrollView>
    </Wrapper>
  );
};
const styles = StyleSheet.create({
  promotion_img_box: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius:16
  },
  promotion_box: {
    width: 330,
    height: 140,
    borderRadius: 16,
    backgroundColor: colors.phon,
  },
});

export default Promotion;
