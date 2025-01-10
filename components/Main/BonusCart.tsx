import { colors } from "@/assets/styles/components/colors";
import { AppDispatch, RootState } from "@/Redux/reducer/store";
import { fetchUserInfo } from "@/Redux/reducer/UserInfo";
import { stylesAll } from "@/style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import TextContent from '../../assets/styles/components/TextContent'
import LogoMini from '../../assets/svg/logo'
import {
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Column from "@/assets/styles/components/Column";

const BonusCart = () => {
  const dispatch: AppDispatch = useDispatch();
  const [token, setToken] = useState<string | null>(null);

  const getToken = async (): Promise<void> => {
    try {
      const storedToken = await AsyncStorage.getItem("tokenActivation");
      setToken(storedToken);
    } catch (error) {
      console.error("Error retrieving token:", error);
      setToken(null);
    }
  };
  useEffect(() => {
    const loadUserInfo = async () => {
      await getToken();
      if (token) {
        dispatch(fetchUserInfo());
      }
    };
    loadUserInfo();
  }, [dispatch, token]);

  const data = useSelector((state: RootState) => state.users);
  const user = data?.user;

  return (
    <>
      {token && user ? (
        <Pressable onPress={() => router.push("/(tabs)/qrCode")}>
          <View
            style={styles.bonus_block}
          >
            <View style={styles.mini_logo}>
            <LogoMini/>
            </View>
              <Column gap={2} style={{marginLeft:10}}>
              <TextContent fontSize={28} fontWeight={600} color={colors.white}>{user.bonus}</TextContent>
                <TextContent fontSize={28} fontWeight={600} color={colors.white}>бонусов</TextContent>
              </Column>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
              </View>
            <View style={styles.bonus_image_box}>
              <Image style={styles.bonus_img} source={{ uri: user.qrimg }} />
            </View>
          </View>
        </Pressable>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  bonus_block: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 166,
    backgroundColor: colors.feuillet,
    borderRadius: 20,
    padding: 10,
    position:'relative',
  },
  mini_logo :{
position: 'absolute',
top:-14,
left: 24,
  },
  bonus_text: {
  },
  bonus_image_box: {
    width: 150,
    height: "100%",
    borderRadius: 10,
    overflow: "hidden",
  },
  bonus_img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});

export default BonusCart;
