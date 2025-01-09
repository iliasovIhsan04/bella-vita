import Main from "@/components/Main/Main";
import { StyleSheet, View, Text } from "react-native";
import { stylesAll } from "../../style";

export default function HomeScreen() {
  return (
    <View style={stylesAll.background_block}>
        <Main />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
});
