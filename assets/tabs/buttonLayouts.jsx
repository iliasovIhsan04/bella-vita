import React from "react";
import { Platform, View } from "react-native";
import Button from "../customs/Button";
import { colors } from "../../assets/styles/components/colors";

const ButtonLayouts = ({
  container,
  color,
  title,
  loading,
  children,
  disabled,
  handle,
}) => {
  return (
    <View
      style={[
        {
          flex: 1,
          position: "relative",
        },
        container && {
          paddingHorizontal: 16,
        },
      ]}
    >
      {children}
      <View
        style={{
          flexDirection: "row",
          position: "absolute",
          padding: 16,
          paddingBottom: Platform.OS === "ios" ? 26 : 16,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colors.white,
        //   shadowColor: "#474747",
        //   shadowOffset: { width: 0, height: 0 },
        //   shadowOpacity: 0.1,
        //   shadowRadius: 4,
        //   elevation: 3,
          gap: 10,
        }}
      >
        <View style={{ flex: 1 }}>
          <Button
            handle={handle}
            loading={loading}
            color={color ? color : colors.feuillet}
            disabled={disabled}
          >
            {title ? title : ""}
          </Button>
        </View>
      </View>
    </View>
  );
};

export default ButtonLayouts;
