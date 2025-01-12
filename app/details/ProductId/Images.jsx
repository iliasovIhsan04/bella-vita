import { colors } from "@/assets/styles/components/colors";
import TextContent from "@/assets/styles/components/TextContent";
import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Animated,
  Text,
} from "react-native";

const Images = ({ data, newBlock, percentage }) => {
  const { width } = Dimensions.get("window");
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleScroll = (event) => {
    Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {
              x: scrollX,
            },
          },
        },
      ],
      {
        useNativeDriver: false,
      }
    )(event);
  };

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index ?? 0;
      setCurrentIndex(index);
    }
  }).current;
  const renderItem = ({ item }) => (
    <View style={[styles.imageWrapper, { width }]} key={item?.id}>
      {item?.img ? (
        <Image
          source={{ uri: item?.img }}
          style={styles.img}
          resizeMode="cover"
        />
      ) : (
        <Text>Image not found</Text>
      )}
    </View>
  );
  return (
    <View style={styles.container}>
      <View style={styles.new_persentage_box}>
        {newBlock && (
          <View style={styles.new_block}>
            <TextContent fontSize={10} fontWeight={500} color={colors.white}>
              NEW
            </TextContent>
          </View>
        )}
        <View style={[styles.new_block, styles.present_box]}>
          <TextContent fontSize={10} fontWeight={400} color={colors.white}>
            {percentage}
          </TextContent>
        </View>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={handleScroll}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        keyExtractor={(item) => item.id.toString()}
      />
      <View style={styles.dotsContainer}>
        {data?.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const outputRange = [10, 10, 10];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange,
            extrapolate: "clamp",
          });
          const dotColor =
            i === currentIndex
              ? "rgba(25, 25, 25, 1)"
              : "rgba(170, 170, 170, 1)";
          return (
            <Animated.View
              key={i.toString()}
              style={[
                styles.dot,
                { width: dotWidth, backgroundColor: dotColor },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  present_box: {
    backgroundColor: colors.late,
    minWidth: 34,
  },
  new_block: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    backgroundColor:colors.phon
  },
  new_persentage_box: {
    position: "absolute",
    bottom: 10,
    left: 16,
  },
  imageWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: 0,
  },
  img: {
    width: "80%",
    height: 260,
    borderRadius: 16,
    objectFit: "cover",
    overflow: "hidden",
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 11,
  },
  dot: {
    height: 10,
    borderRadius: 6,
    backgroundColor: "rgba(210, 210, 210, 1)",
    marginHorizontal: 5,
  },
});

export default Images;
