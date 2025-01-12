import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import Wave from '../../assets/styles/components/Wave'
import Morees from "../../assets/svg/more";
import { router } from "expo-router";
import Wrapper from '../../assets/styles/components/Wrapper';
import TextContent from "@/assets/styles/components/TextContent";
import { colors } from "@/assets/styles/components/colors";
import Flex from "@/assets/styles/components/Flex";
import Card from "@/assets/customs/Card";

const HurryUpToBuy = () => {
  const [data, setData] = useState([]);
  const api = "https://alma-market.online/card/type/one";
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
      >
        <View style={{ gap: 8,flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between",}}>
          {data.map((item) => (
            <>
             <Card id={item.id} title={item.title} percentage={item.percentage} mini_description={item.net} price={item.price} old_price={item.prom_price} harry={data} love={true}/>
            </>
          ))}
        </View>
      </ScrollView>
    </Wrapper>
  );
};

const styles = StyleSheet.create({})

export default HurryUpToBuy;
