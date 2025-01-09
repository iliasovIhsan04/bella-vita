import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ViewToken,
  Text,
} from "react-native";

interface ImagesProps {
  data: Array<{ id: number; img: string }>;
}

const Images: React.FC<ImagesProps> = ({ data }) => {
  const { width } = Dimensions.get("window");
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
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
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
      if (viewableItems.length > 0) {
        const index = viewableItems[0].index ?? 0;
        setCurrentIndex(index);
      }
    }
  ).current;

  const renderItem = ({ item }: { item: { id: number; img: string } }) => (
    <View style={[styles.imageWrapper, { width }]} key={item.id}>
      {item.img ? (
        <Image
          source={{ uri: item.img }}
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
  container: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
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
    marginBottom: 20,
  },
  dot: {
    height: 10,
    borderRadius: 6,
    backgroundColor: "rgba(210, 210, 210, 1)",
    marginHorizontal: 5,
  },
});

export default Images;
