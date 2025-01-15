import { colors } from "@/assets/styles/components/colors";
import Loading from "@/assets/ui/Loading";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import InstaStory from "react-native-insta-story";

export default function StoryComponent() {
  const [fetchedStories, setFetchedStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchStories = async () => {
      try {
        const response = await fetch('https://bella.navisdevs.ru/stories');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const storiesData = await response.json();
        if (!isMounted) return;

        const transformedStories = storiesData
          .filter((user) => user && typeof user === 'object')
          .map((user) => ({
            user_id: Number(user.id) || Date.now(),
            user_image: user.img || "https://placeholder.com/user.jpg",
            // user_name: user.title || "User",
            stories: Array.isArray(user.stories) && user.stories.length > 0
              ? user.stories
                  .filter((story) => story && typeof story === 'object')
                  .map((story) => ({
                    story_id: Number(story.id) || Date.now(),
                    story_image: story.url || story.story_image || "",
                    duration: Number(story.duration) || 5000,
                    created_at: story.created_at || new Date().toISOString(),
                    type: "image",
                  }))
              : []
          }))
          .filter((user) => user.stories.length > 0);

        if (isMounted) {
          setFetchedStories(transformedStories);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setError(`Ошибка загрузки данных: ${error.message}. Пожалуйста, попробуйте позже.`);
          setLoading(false);
        }
      }
    };

    fetchStories();
    return () => {
      isMounted = false;
    };
  }, []);

  const renderContent = () => {
    if (loading) {
      return <Loading />;
    }
    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }

    if (fetchedStories.length === 0) {
      return <Text style={styles.noStoriesText}>Нет доступных историй</Text>;
    }

    return (
      <View style={styles.storiesBlock}>
        <InstaStory
          data={fetchedStories}
          avatarSize={96}
          pressedBorder={10}
          duration={10}
          avatarWrapperStyle={styles.avatar_wrapper}
          unPressedBorderColor={colors.feuillet}
          avatarImageStyle={styles.avatarImage}
          swipeText={() => {""}}
          renderCloseComponent={({ onPress }) => (
            <TouchableOpacity style={styles.closeButton} onPress={onPress}>
              <Image
                style={styles.closeButtonImage}
                source={require("../../assets/images/close.png")}
              />
            </TouchableOpacity>
          )}
          storyContainerStyle={styles.storyContainerStyle}
        />
      </View>
    );
  };

  return <View style={styles.storyContainer}>{renderContent()}</View>;
}
const styles = StyleSheet.create({
  storyContainer: {
    flex: 1,
  },
  avatar_wrapper: {
borderRadius:22,
padding:2
  },
  closeButton: {
    backgroundColor: "rgba(107, 107, 107, 0.3)",
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginRight: -10,
  },
  closeButtonImage: {
    width: 24,
    height: 24,
  },
  storiesBlock: {
    flex: 1,
  },
  avatarImage: {
    width:'100%',
    height: '100%',
    borderRadius: 22,
  },
  errorText: {
    color: "#DC0200",
    textAlign: "center",
    marginTop: 10,
  },
  noStoriesText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  storyContainerStyle: {
    marginBottom: 10,
  },
});

