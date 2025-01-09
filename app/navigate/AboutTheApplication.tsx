import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { stylesAll } from "../../style";
import { router } from "expo-router";

const AboutTheApplication = () => {
  return (
    <View style={stylesAll.background_block}>
      <View style={stylesAll.container}>
        <View style={stylesAll.header}>
          <TouchableOpacity
          
            style={stylesAll.header_back_btn}
            onPress={() => router.push("/(tabs)/profile")}
          >
            <Image
              style={{ width: 24, height: 24 }}
              source={require("../../assets/images/moreLeft.png")}
            />
          </TouchableOpacity>
          <Text style={stylesAll.header_name}>О приложении</Text>
          <View style={stylesAll.header_back_btn}></View>
        </View>
        <View style={styles.application_block}>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 16,
            }}
          >
            <Text style={styles.application_text}>
              Правила программы лояльности
            </Text>
            <Image
              style={{ width: 24, height: 24, tintColor: "#B3B4B4" }}
              source={require("../../assets/images/moreRight.png")}
            />
          </TouchableOpacity>
          <Image
            style={styles.line}
            source={require("../../assets/images/line.png")}
          />
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 16,
            }}
          >
            <Text style={styles.application_text}>
              Пользовательское соглашение
            </Text>
            <Image
              style={{ width: 24, height: 24, tintColor: "#B3B4B4" }}
              source={require("../../assets/images/moreRight.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  application_block: {
    width: "100%",
    height: 112,
    backgroundColor: "#F5F7FA",
    borderRadius: 14,
    flexDirection: "column",
    justifyContent: "space-between",
    paddingVertical: 18,
    marginTop: 30,
  },
  line: {
    width: "95%",
    height: 1,
    marginLeft: "auto",
  },
  application_text: {
    fontSize: 16,
    fontWeight: "700",
    color: "#191919",
  },
});

export default AboutTheApplication;
