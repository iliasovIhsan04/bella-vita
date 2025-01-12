import { colors } from "@/assets/styles/components/colors";
import Column from "@/assets/styles/components/Column";
import TextContent from "@/assets/styles/components/TextContent";
import Wave from "@/assets/styles/components/Wave";
import { stylesAll } from "@/style";
import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import Brend1 from "../assets//svg/brendImg1";
import Brend2 from "../assets//svg/brendImg2";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import Loading from "@/assets/ui/Loading";
const containerWidth = (Dimensions.get("window").width - 34) / 3 - 5;
const CatalogPage = () => {
  const [data, setData] = useState([]);
  const api = "https://alma-market.online/product/categories";
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(api);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchUserData();
  }, []);

  if (data.length === 0) {
    return <Loading />;
  }
  return (
    <View style={styles.shop_block}>
      <View style={styles.brend_block}>
        <Column style={styles.block_brend}>
          <TextContent fontSize={13} fontWeight={500}>
            Бренды
          </TextContent>
          <View style={styles.catalog_brend}>
            <View style={styles.brend_box}>
              <Brend1 style={styles.box_img} />
            </View>
            <View style={styles.brend_box}>
              <Brend2 style={styles.box_img} />
            </View>
          </View>
        </Column>
      </View>
      {data.map((item, id) => (
        <Wave
          handle={() => router.push(`/details/CategoryId/${item.id}`)}
          key={item.id}
        >
          <View
            key={item.id}
            style={[styles.shop_box, { backgroundColor: colors.phon }]}
          >
            <TextContent
              fontSize={14}
              fontWeight={500}
              color={colors.black}
              numberOfLines={2}
            >
              {item.name}
            </TextContent>
            <Image style={styles.image_shop} source={{ uri: item.img }} />
          </View>
        </Wave>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  box_img: {
    width: "100",
    height: "100%",
  },
  brend_box: {
    width: 34,
    height: 34,
    borderRadius: 50,
    backgroundColor: colors.red,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },
  block_brend: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  catalog_brend: {
    width: "100%",
    height: 34,
    flexDirection: "row",
  },
  brend_block: {
    width: "66%",
    height: 96,
    backgroundColor: colors.feuilletOpacity,
    borderRadius: 14,
    padding: 10,
  },
  shop_block: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 8,
  },
  shop_box: {
    width: containerWidth,
    height: 104,
    borderRadius: 14,
    position: "relative",
    padding: 10,
  },
  image_shop: {
    width: 70,
    height: 60,
    position: "absolute",
    right: 0,
    bottom: 0,
    resizeMode: "cover",
    borderBottomRightRadius: 16,
  },
});

export default CatalogPage;
