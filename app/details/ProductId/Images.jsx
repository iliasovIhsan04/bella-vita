import { colors } from "@/assets/styles/components/colors";
import Flex from "@/assets/styles/components/Flex";
import TextContent from "@/assets/styles/components/TextContent";
import React, { useState, useRef } from "react";
import { Modal, Platform } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Animated,
  Text,
  TouchableOpacity,
} from "react-native";

const Images = ({ data, newBlock, percentage }) => {
  const { width } = Dimensions.get("window");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const scrollX = useRef(new Animated.Value(0)).current;
  const openModal = (index) => {
    setSelectedImageIndex(index);
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  const renderItem = ({ item, index }) => (
    <View style={[styles.imageWrapper, { width }]} key={item?.id}>
      {item?.img ? (
        <View style={styles.img_block}>
          <TouchableOpacity onPress={() => openModal(index)}>
            <Image
              source={{ uri: item?.img }}
              style={styles.img}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
      ) : (
        <Text>Image not found</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.new_persentage_box}>
        <Flex gap={10}>
          {newBlock && (
            <View style={styles.new_block}>
              <TextContent fontSize={10} fontWeight={500} color={colors.white}>
                NEW
              </TextContent>
            </View>
          )}
          {percentage && (
            <View style={[styles.new_block, styles.present_box]}>
              <TextContent fontSize={10} fontWeight={400} color={colors.white}>
                {percentage}%
              </TextContent>
            </View>
          )}
        </Flex>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
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
            i === selectedImageIndex
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
      <View style={styles.frr}>
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <ImageViewer
          imageUrls={data.map((item) => ({ url: item?.img }))}
          index={selectedImageIndex}
          onSwipeDown={closeModal}
          enableSwipeDown={true}
        />
      </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  present_box: {
    backgroundColor: colors.late,
    minWidth: 34,
  },
  frr :{
  paddingTop: Platform.OS === "ios" ? 60 : 42,
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
    backgroundColor: colors.phon,
  },
  new_persentage_box: {
    position: "absolute",
    bottom: 10,
    left: 16,
  },
  imageWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  img_block: {
    width: "100%",
    height: 260,
  },
  img: {
    width: "80%",
    height: 260,
    borderRadius: 16,
    objectFit: "cover",
    overflow: "hidden",
    margin: "auto",
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
