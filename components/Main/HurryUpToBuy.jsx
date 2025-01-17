import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import Wave from '../../assets/styles/components/Wave'
import Morees from "../../assets/svg/more";
import { router, useFocusEffect } from "expo-router";
import Wrapper from '../../assets/styles/components/Wrapper';
import TextContent from "@/assets/styles/components/TextContent";
import { colors } from "@/assets/styles/components/colors";
import Flex from "@/assets/styles/components/Flex";
import Card from "@/assets/customs/Card";
import { url } from "@/Api";
import { useCondition } from "@/context/FavoriteContext";

const HurryUpToBuy = () => {
  const {favoriteItemsLocal} = useCondition()
  const [data, setData] = useState([]);
  const api = url+`/product/list`
  const [loading, setLoading] = useState(false);
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(api);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserData(); 
  }, []);

  console.log(data)

  useFocusEffect(
    React.useCallback(() => {
      if (favoriteItemsLocal) {
        fetchUserData(); 
      }
    }, [favoriteItemsLocal])
  );



  return (
    <Wrapper padding={[20, 24]}>
      {loading ? (
        <TextContent>Loading...</TextContent>
      ) : (
        <>
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
                {
                  item.is_popular && (
                    <Card id={item.id} title={item.title} percentage={item.discount_percentage} mini_description={item.description} price={item.price} old_price={item.discount_price} harry={data} love={true} newBlock={item.new}  handle={() => router.push(`/details/ProductId/${item.id}`)}/>
                  )
                }
                </>
              ))}
            </View>
          </ScrollView>
        </>
      )}
    </Wrapper>
  );
};

const styles = StyleSheet.create({})

export default HurryUpToBuy;
