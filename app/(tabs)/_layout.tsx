import { Tabs } from "expo-router";
import React from "react";
import { Image, View, Platform } from "react-native";
import { stylesAll } from "../../style";
import Main from '../../assets/svg/main';
import MainActive from '../../assets/svg/mainActive';
import Delivery from '../../assets/svg/delivery';
import DeliveryActive from '../../assets/svg/delveryActive'
import Profile from '../../assets/svg/user';
import ProfileActive from '../../assets/svg/userActive';
import Cart from '../../assets/svg/shoppingCart'
import CartActive from '../../assets/svg/shoppingCartActive'
import GrCode from '../../assets/svg/grCod'
import {colors} from '../../assets/styles/components/colors'


export default function TabLayout() {
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
          title: "Доставка",
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
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Корзина",
          tabBarIcon: ({ focused }) => (
            <View>
              {focused ? (
          <CartActive/>
              ) : (
                <Cart/>
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
