import React  from "react";
import { Platform, StyleSheet, View } from "react-native";
import Flex from "../../assets/styles/components/Flex";
import BackLeft from "../../assets/svg/moreLeft";
import Wave from "../../assets/styles/components/Wave";
import Between from "../../assets/styles/components/Between"
import TextContent from "@/assets/styles/components/TextContent";
import { colors } from "@/assets/styles/components/colors";
import { router, } from "expo-router";

const Header = ({
  iks,
  back,
  container,
  children,
  style,
  reset,
  handleBack
}) => { 
    return (
    <View
      style={[
        {
          paddingTop: Platform.OS === "ios" ? 60 : 42,
          backgroundColor: colors.white,
          paddingBottom: 12,
        },
        container && {
          paddingHorizontal: 16,
        },
        style,
      ]}
    >
      <Between center={"center"} style={{ alignItems: "center" }}>
        <Flex
          style={{
            flex: 1,
            alignItems: "center",
          }}
          gap={20}
        >
          {back  && (
            <Wave handle={() => router.back() }>
              <BackLeft />
            </Wave>
          )} 
          {
            handleBack && (
              <Wave handle={() => router.push(handleBack) }>
              <BackLeft />
            </Wave>
            )
          }
          <TextContent
            style={{
              flex: 1,
            }}
            numberOfLines={1}
            fontSize={22}
            fontWeight={600}
            color={colors.black}
          >
            {children}
          </TextContent>
        </Flex>
        <Wave
          style={{
            marginRight: 40,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 5,
          }}
        >
        </Wave>
        {iks && (
          <Wave handle={reset}>
            <TextContent fontSize={14} fontWeight={500} color={colors.black}>
              Сбросить
            </TextContent>
          </Wave>
        )}
      </Between>
    </View>
  );
};

const styles = StyleSheet.create({

});

export default Header;
