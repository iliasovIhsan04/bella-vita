import { router, Tabs, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, View, Platform, TouchableOpacity } from "react-native";
import { stylesAll } from "../../style";
import Main from '../../assets/svg/main';
import MainActive from '../../assets/svg/mainActive';
import Delivery from '../../assets/svg/delivery';
import DeliveryActive from '../../assets/svg/delveryActive'
import Profile from '../../assets/svg/user';
import ProfileActive from '../../assets/svg/userActive';

import GrCode from '../../assets/svg/grCod'
import {colors} from '../../assets/styles/components/colors'
import Map from '../../assets/svg/map'
import MapActive from '../../assets/svg/mapActive'
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function TabLayout() {

  const [storedToken, setStoredToken] = useState(null);
  const navigation = useNavigation(); 

  useEffect(() => {
    const fetchToken = async () => {
      const token = await AsyncStorage.getItem("tokenActivation");
      setStoredToken(token);
    };
    fetchToken();
  }, []); 

  return (
<Tabs
  screenOptions={{
    tabBarActiveTintColor:colors.feuillet, 
    tabBarInactiveTintColor: colors.gray,
    headerShown: false,
    tabBarStyle: {
      ...(Platform.OS === "android" && {
        height: 60, 
      }),
    },
    tabBarLabelStyle: {
      fontSize: 11,
      fontWeight: "500", 
    },
  }}
>
      <Tabs.Screen
        name="index"
        options={{
          title: "Главная",
          tabBarIcon: ({ focused }) => (
            <View>
              {focused ? (
             <MainActive/>
              ) : (
                <Main/>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: "Каталог",
          tabBarIcon: ({ focused }) => (
            <View>
              {focused ? (
            <DeliveryActive/>
              ) : (
                <Delivery/>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="qrCode"
        options={{
          title: "Карта",
          tabBarIcon: ({ focused }) => (
            <View style={stylesAll.footer_absolute}>
              {focused ? (
                <GrCode/>
              ) : (
                <GrCode/>
              )}
            </View>
          ),
          tabBarButton: (props) => {
            const handlePress = async () => {
              const token = await AsyncStorage.getItem("tokenActivation");
              if (token) {
                props.onPress();
              } else {
               router.push('auth/Login');
              }
            };
            return <TouchableOpacity {...props} onPress={handlePress} />;
          },
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Локация",
          tabBarIcon: ({ focused }) => (
            <View>
              {focused ? (
          <MapActive/>
              ) : (
                <Map/>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Профиль",
          tabBarIcon: ({ focused }) => (
            <View>
              {focused ? (
            <ProfileActive/>
              ) : (
                <Profile/>
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
