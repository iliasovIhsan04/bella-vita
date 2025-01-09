import { Tabs } from "expo-router";
import React from "react";
import { Image, View, Platform } from "react-native";
import { stylesAll } from "../../style";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#DC0200",  
        headerShown: false, 
        tabBarStyle: {
          ...(Platform.OS === 'android' && {
            height:65
          }),
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
                <Image
                  style={{ width: 26, height: 26 }}
                  source={require("../../assets/images/home_red.png")}
                />
              ) : (
                <Image
                  style={{ width: 26, height: 26 }}
                  source={require("../../assets/images/home_gray.png")}
                />
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
                <Image
                  style={{ width: 26, height: 26 }}
                  source={require("../../assets/images/catalog_red.png")}
                />
              ) : (
                <Image
                  style={{ width: 26, height: 26 }}
                  source={require("../../assets/images/category_gray.png")}
                />
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
                <Image
                  style={{ width: 26, height: 26 }}
                  source={require("../../assets/images/card_white.png")}
                />
              ) : (
                <Image
                  style={{ width: 26, height: 26 }}
                  source={require("../../assets/images/card_white.png")}
                />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Локации",
          tabBarIcon: ({ focused }) => (
            <View>
              {focused ? (
                <Image
                  style={{ width: 26, height: 26 }}
                  source={require("../../assets/images/map_red.png")}
                />
              ) : (
                <Image
                  style={{ width: 26, height: 26 }}
                  source={require("../../assets/images/map_gray.png")}
                />
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
                <Image
                  style={{ width: 26, height: 26 }}
                  source={require("../../assets/images/profile_red.png")}
                />
              ) : (
                <Image
                  style={{ width: 26, height: 26 }}
                  source={require("../../assets/images/profile_gray.png")}
                />
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
