import { stylesAll } from "@/style";
import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
  ActivityIndicator,
} from "react-native";

interface CatalogItem {
  id: string;
  color: string;
  img: string;
  name: string;
}

const CatalogPage = () => {
  const [data, setData] = useState<CatalogItem[]>([]);

  const api = "https://alma-market.online/product/categories";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get<CatalogItem[]>(api);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchUserData();
  }, []);

  if (data.length === 0) {
    return (
      <View style={stylesAll.loading_catalog_page}>
        <ActivityIndicator color="red" size="small" />
      </View>
    );
  }
  return (
    <View style={styles.shop_block}>
      {data.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.shop_box, { backgroundColor: item.color }]}
          onPress={() => router.push(`/details/${item.id}`)}
        >
          <Text style={styles.shop_text}>{item.name}</Text>
          <Image style={styles.image_shop} source={{ uri: item.img }} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  shop_block: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 10,
  },
  shop_box: {
    width: "48%",
    height: 140,
    borderRadius: 16,
    position: "relative",
    padding: 12,
  },
  image_shop: {
    width: 100,
    height: 100,
    position: "absolute",
    right: 0,
    bottom: 0,
    resizeMode: "cover",
    borderBottomRightRadius: 16,
  },
  shop_text: {
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 14,
  },
});

export default CatalogPage;
