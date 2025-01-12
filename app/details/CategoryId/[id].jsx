import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Header from "../../../components/Main/HeaderAll";
import Column from "../../../assets/styles/components/Column";
import axios from "axios";
import { colors } from "../../../assets/styles/components/colors";
import Wave from "../../../assets/styles/components/Wave";
import TextContent from "../../../assets/styles/components/TextContent";
import Flex from "../../../assets/styles/components/Flex";
import More from "../../../assets/svg/more";
import Between from "../../../assets/styles/components/Between";
import { router } from "expo-router";
const Category = () => {
  const route = useRoute();
  const { id } = route.params || {};
  const [category, setCategory] = useState([]);

  useEffect(() => {
    const CategoryData = async () => {
      try {
        const response = await axios.get(
          `https://alma-market.online/product/sub-categories/${id}`
        );
        setCategory(response.data);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };
    CategoryData();
  }, [id]);

  return (
    <View
      style={{ flex: 1, backgroundColor: colors.white, paddingHorizontal: 16 }}
    >
      <Header back={true}>Макияж</Header>
      <Column>
      <Wave handle={() => router.push(`details/${id}`)}>
            <View style={styles.sub_cat_block}>
              <Between center={"center"}>
                <Flex gap={14}>
                  <View style={styles.img_block}></View>
                  <TextContent
                    fontSize={16}
                    fontWeight={500}
                    color={colors.black}
                  >
                   Все продукты
                  </TextContent>
                </Flex>
                <More />
              </Between>
            </View>
          </Wave>
        {category?.map((el, id) => (
          <Wave handle={() => router.push(`details/${id}`)}>
            <View style={styles.sub_cat_block}>
              <Between center={"center"}>
                <Flex gap={14}>
                  <View style={styles.img_block}></View>
                  <TextContent
                    fontSize={16}
                    fontWeight={500}
                    color={colors.black}
                  >
                    {el.name}
                  </TextContent>
                </Flex>
                <More />
              </Between>
            </View>
          </Wave>
        ))}
      </Column>
    </View>
  );
};

const styles = StyleSheet.create({
  img_block: {
    width: 40,
    height: 40,
    backgroundColor: colors.phon,
    borderRadius: 6,
    padding: 4,
  },
  sub_cat_block: {
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: colors.phon,
  },
});
export default Category;
