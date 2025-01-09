import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { stylesAll } from "../../style";
import CatalogPage from "@/pages/CatalogPage";

export default function CatalogScreen() {
  return (
    <View style={stylesAll.background_block}>
      <View style={stylesAll.container}>
        <View style={[styles.header, stylesAll.header_nav]}>
          <TouchableOpacity style={styles.header_back_btn}></TouchableOpacity>
          <Image
            style={stylesAll.logotip}
            source={require("../../assets/images/logotipCenter.png")}
          />
          <View style={styles.header_back_btn}></View>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={{ marginBottom: 125 }}>
            <CatalogPage />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
  },
  header_back_btn: {
    width: 30,
    height: 30,
    flexDirection: "row",
    alignItems: "center",
  },
});
