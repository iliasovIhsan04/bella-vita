import { StyleSheet, ScrollView, View } from "react-native";
import { stylesAll } from "../../style";
import { colors } from "@/assets/styles/components/colors";
import Header from "../../components/Main/HeaderAll";
import CatalogPage from "@/pages/CatalogPage";

export default function CatalogScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <Header container={true} >Каталог</Header>
      <View style={stylesAll.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={{ height:'100%'}}
        >
            <CatalogPage />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
