import React from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import Column from "../../assets/styles/components/Column";
import TextContent from "../styles/components/TextContent";
import image from "../../assets/images/imgTest.png";
import { colors } from "../styles/components/colors";
import Wave from "../../assets/styles/components/Wave";
import Flex from "../styles/components/Flex";
const containerWidth = (Dimensions.get("window").width - 32) / 2 - 5;

const Card = ({ img, newBlock, present }) => {
  return (
    <Wave style={styles.cardContainer}>
      <Column>
        <View style={styles.img_block}>
          <Image style={styles.img_box} source={image} />
          <Flex gap={2}>
            <View style={styles.new_block}>
              <TextContent fontSize={10} fontWeight={500} color={colors.white}>
                NEW
              </TextContent>
            </View>
            <View style={[styles.new_block, styles.present_box]}>
              <TextContent fontSize={10} fontWeight={400} color={colors.white}>
                -20%
              </TextContent>
            </View>
          </Flex>
        </View>
      </Column>
    </Wave>
  );
};
const styles = StyleSheet.create({
  cardContainer: {
    width: containerWidth,
  },
  present_box: {
    backgroundColor: "#904BE8",
  },
  new_block: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: "#CA9037",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  img_block: {
    width: "100%",
    backgroundColor: colors.phon,
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  img_box: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
    borderRadius: 6,
  },
});
export default Card;
