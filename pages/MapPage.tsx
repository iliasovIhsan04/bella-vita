import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  Animated,
  Platform,
} from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import { WebView } from "react-native-webview";
import { stylesAll } from "@/style";
import { url } from "@/Api";

type LocationType = {
  id: string;
  address: string;
  lat: number;
  lon: number;
  time: string;
};

type CoordinatesType = {
  latitude: number;
  longitude: number;
};

const sections = [
  { id: "section1", title: "Список" },
  { id: "section2", title: "Карта" },
];

const screenWidth = Dimensions.get("window").width;
const indicatorWidth = screenWidth / sections.length;

export default function MapPage() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentCoordinates, setCurrentCoordinates] = useState<CoordinatesType>(
    {
      latitude: 42.8746,
      longitude: 74.5698,
    }
  );
  const [locations, setLocations] = useState<LocationType[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(
    null
  );

  const get2GISURL = (latitude: number, longitude: number) => {
    return `https://2gis.kg/bishkek/geo/${longitude},${latitude}`;
  };

  const handleMarkerPress = (latitude: number, longitude: number) => {
    const url = get2GISURL(latitude, longitude);
    Linking.openURL(url);
  };

  const handleLocationPress = (location: LocationType) => {
    setSelectedLocation(location);
    smoothScroll("section2");
    handleMarkerPress(location.lat, location.lon);
  };

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location was denied");
          return;
        }
        let location = await Location.getCurrentPositionAsync({
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        });
        setCurrentCoordinates({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        console.error("Error retrieving location", error);
      }
    })();
  }, []);

  useEffect(() => {
    axios
      .get<LocationType[]>(url+"/map/")
      .then((response) => {
        setLocations(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const smoothScroll = (sectionId: string) => {
    const sectionIndex = sections.findIndex(
      (section) => section.id === sectionId
    );
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: sectionIndex * screenWidth,
        animated: true,
      });
      setActiveSection(sectionId);
    }
  };

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="ru">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Яндекс Карта</title>
      <script src="https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=YOUR_API_KEY" type="text/javascript"></script>
      <style>
          #map {
              width: 100%;
              height: 100vh;
              position: absolute; 
              top: 0;
              left: 0;
          }
          html, body {
              height: 100%; 
              margin: 0;
              padding: 0;
              overflow: hidden; 
          }
      </style>
  </head>
  <body>
      <div id="map"></div>
      <script>
          ymaps.ready(function() {
              var myMap = new ymaps.Map("map", {
                  center: [${currentCoordinates.latitude}, ${
    currentCoordinates.longitude
  }],
                  zoom: 12,
                  controls: []
              });
              const locations = ${JSON.stringify(locations)};
  
              locations.forEach(function(location) {
                  var myPlacemark = new ymaps.Placemark([location.lat, location.lon], {
                      hintContent: location.address,
                      balloonContent: location.address
                  });
                  myMap.geoObjects.add(myPlacemark);
              });
              const selectedCoords = ${JSON.stringify(selectedLocation)};
              if (selectedCoords) {
                  const startCoords = [${currentCoordinates.latitude}, ${
    currentCoordinates.longitude
  }];
                  const endCoords = [selectedCoords.lat, selectedCoords.lon];
                  myMap.geoObjects.add(new ymaps.LineString([startCoords, endCoords], {
                      strokeWidth: 4,
                      strokeColor: "#FF0000"
                  }));
              }

              // Enable dragging with one finger
              myMap.behaviors.enable('drag'); // Enable drag behavior
              myMap.behaviors.enable('scrollZoom'); // Enable scroll zoom behavior
          });
      </script>
  </body>
  </html>
`;

  return (
    <View style={styles.container_flex}>
      <View style={styles.nav}>
        {sections.map((section) => (
          <TouchableOpacity
            key={section.id}
            onPress={() => smoothScroll(section.id)}
            style={styles.navItem}
          >
            <Text
              style={[
                styles.navText,
                activeSection === section.id && styles.activeNavText,
              ]}
            >
              {section.title}
            </Text>
          </TouchableOpacity>
        ))}
        <Animated.View
          ref={scrollViewRef}
          horizontal={false} 
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          style={[
            styles.indicator,
            {
              transform: [
                {
                  translateX: scrollX.interpolate({
                    inputRange: [0, screenWidth],
                    outputRange: [0, indicatorWidth],
                  }),
                },
              ],
            },
          ]}
        />
      </View>
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {sections.map((section) => (
          <View
            key={section.id}
            style={[styles.container_flex, { width: screenWidth }]}
          >
            {section.id === "section1" ? (
              <View style={stylesAll.container}>
                <View style={styles.sectionMaps}>
                  {locations.length > 0 ? (
                    locations.map((location) => (
                      <TouchableOpacity
                        key={location.id}
                        onPress={() => handleLocationPress(location)}
                        style={styles.section_map_block}
                      >
                        <View style={styles.mapItem}>
                          <Image
                            style={styles.maps}
                            source={require("../assets/images/maps.png")}
                          />
                          <Text style={styles.navTextAdres}>
                            {location.address}
                          </Text>
                        </View>
                        <View style={styles.mapItem}>
                          <Image
                            style={styles.maps}
                            source={require("../assets/images/timer.png")}
                          />
                          <Text style={styles.timerText}>
                            График работы:{" "}
                            <Text style={styles.span}>{location.time}</Text>
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <Text>Нет доступных данных</Text>
                  )}
                </View>
              </View>
            ) : (
              <View style={styles.container_flex}>
                <WebView
                  originWhitelist={["*"]}
                  source={{ html: htmlContent }}
                  style={{ flex: 1 }}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  onHttpError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.warn("HTTP error: ", nativeEvent);
                  }}
                  onError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.warn("WebView error: ", nativeEvent);
                  }}
                />
              </View>
            )}
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  homePanelContentViewCatalog: {
    padding: 10,
    backgroundColor: "#F5F7FA",
    borderRadius: 12,
    marginVertical: 10,
  },
  maps: {
    width: 30,
    height: 30,
  },
  span: {
    fontSize: 14,
    color: "#68B936",
    fontWeight: "500",
  },
  navItem: {
    paddingTop: 10,
    paddingLeft: 50,
    paddingRight: 50,
    paddingBottom: 10,
  },
  navText: {
    color: "#000",
    fontWeight: "500",
    fontSize: 20,
  },
  navTextAdres: {
    color: "#191919",
    fontWeight: "700",
    fontSize: 16,
    width: "88%",
  },
  activeNavText: {
    color: "#000",
  },
  mapItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  timerText: {
    color: "#6B6B6B",
    fontSize: 12,
    fontWeight: "400",
  },
  section_map_block: {
    backgroundColor: "#F5F7FA",
    padding: 16,
    borderRadius: 14,
    flexDirection: "column",
    gap: 8,
  },
  sectionMaps: {
    marginTop: 100,
    flexDirection: "column",
    gap: 10,
  },
  nav: {
    position: "absolute",
    paddingTop: Platform.OS === "ios" ? 50 : 32,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    width: "100%",
  },
  container_flex: {
    flex: 1,
    backgroundColor: "#fff",
  },
  indicator: {
    position: "absolute",
    bottom: 0,
    height: 3,
    backgroundColor: "#DC0200",
    width: "45%",
    marginLeft: 17,
  },
});
