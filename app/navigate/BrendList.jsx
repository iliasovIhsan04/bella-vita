import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import Header from "../../components/Main/HeaderAll";
import Column from "../../assets/styles/components/Column";
import axios from "axios";
import { colors } from "../../assets/styles/components/colors";
import Wave from "../../assets/styles/components/Wave";
import TextContent from "../../assets/styles/components/TextContent";
import Flex from "../../assets/styles/components/Flex";
import More from "../../assets/svg/more";
import Between from "../../assets/styles/components/Between";
import { router } from "expo-router";
import SubAll from '../../assets/svg/subAll'
import Loading from "@/assets/ui/Loading";
import { url } from "@/Api";

const BrendList = () => {
  const [brendList, setBrendList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const CategoryBrend = async () => {
      setLoading(true); 
      try {
        const response = await axios.get(url + "/brand/");
        setBrendList(response.data); 
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      } finally {
        setLoading(false); 
      }
    };
    CategoryBrend();
  }, []);

  if (loading) {
    return <Loading />;
  }
  return (
    <View style={{ flex: 1, backgroundColor: colors.white, paddingHorizontal: 16 }}>
      <Header back={true}>Макияж</Header>
      <Column>
        <Wave handle={() => router.push(`details/brand_${''}`)}>
          <View style={styles.sub_cat_block}>
            <Between center={"center"}>
              <Flex gap={14}>
                <View style={styles.img_block}>
                  <SubAll />
                </View>
                <TextContent fontSize={16} fontWeight={500} color={colors.black}>
                  Все продукты
                </TextContent>
              </Flex>
              <More />
            </Between>
          </View>
        </Wave>
        {brendList?.map((el, id) => (
          <Wave handle={() => router.push(`details/brand_${el.id}`)} key={id}>
            <View style={styles.sub_cat_block}>
              <Between center={"center"}>
                <Flex gap={14}>
                  <View style={styles.img_block}>
                    <Image style={styles.img_sub_cat} source={{ uri: el.img }} />
                  </View>
                  <TextContent fontSize={16} fontWeight={500} color={colors.black}>
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
  img_sub_cat: {
    width: "100%",
    height: "100%",
  },
  img_block: {
    width: 40,
    height: 40,
    backgroundColor: colors.phon,
    borderRadius: 6,
    padding: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sub_cat_block: {
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: colors.phon,
  },
});

export default BrendList;
