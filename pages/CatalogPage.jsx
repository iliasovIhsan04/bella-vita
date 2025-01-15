import { colors } from "@/assets/styles/components/colors";
import Column from "@/assets/styles/components/Column";
import TextContent from "@/assets/styles/components/TextContent";
import Wave from "@/assets/styles/components/Wave";
import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import Header from "../components/Main/HeaderAll";
import { View, StyleSheet, Image, Dimensions, Text } from "react-native";
import Loading from "@/assets/ui/Loading";
import { ScrollView } from "react-native";
import { url } from "@/Api";
const containerWidth = (Dimensions.get("window").width - 34) / 3 - 5;
const CatalogPage = () => {
  const [data, setData] = useState([]);
  const [brendData, setBrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = url + "/product/categories";
  useEffect(() => {
    const fetchBrendData = async () => {
      try {
        const response = await axios.get(url + "/brand/");
        setBrendData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchBrendData();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(api);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (data.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, color: colors.black, fontWeight:'700' }}>Товара нету!</Text>
      </View>
    );
  }

  return (
    <View style={{flex:1}}>
      <Header container={true}>Каталог</Header>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.shop_block}>
          <Wave style={styles.brend_block} handle={() => router.push('navigate/BrendList')}>
            <View style={styles.block_brend}>
              <TextContent fontSize={13} fontWeight={500}>
                Бренды
              </TextContent>
              <View style={styles.catalog_brend}>
                {brendData.slice(0, 4).map((el, id) => (
                  <View
                    style={[styles.brend_box, { marginLeft: id > 0 ? -16 : 0 }]}
                    key={id}
                  >
                    <Image style={styles.box_img} source={{ uri: el.img }} />
                  </View>
                ))}
                {brendData.length > 4 && (
                  <View style={styles.remaining_brend_box}>
                    <View style={styles.breand_box}>
                      <TextContent
                        fontSize={12}
                        fontWeight={500}
                        color={colors.white}
                      >
                        +{brendData.length - 4}
                      </TextContent>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </Wave>
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  box_img: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  brend_box: {
    position: "relative",
    width: 34,
    height: 34,
    borderRadius: 50,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
    backgroundColor: colors.white,
  },
  block_brend: {
    flexDirection: "column",
    justifyContent: "space-between",
    height:'100%'
  },
  catalog_brend: {
    width: "100%",
    height: 34,
    flexDirection: "row",
  },
  brend_block: {
    width: "66%",
    height:104,
    backgroundColor: colors.feuilletOpacity,
    borderRadius: 14,
    padding: 10,
  },
  shop_block: {
    flex:1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom:200
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
  remaining_brend_box: {
    position: "absolute",
    bottom: 0,
    left: 72,
    minWidth: 34,
    height: 34,
    borderRadius: 50,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    padding:2
  },
  breand_box: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.black,
    borderRadius:50,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
});

export default CatalogPage;
