import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import InstaStory from "react-native-insta-story";

type ImageURL = string;

interface Story {
  story_id: number;
  story_image: ImageURL;
  duration: number;
  created_at: string;
  type: "image";
}
interface User {
  user_id: number;
  user_image: ImageURL;
  user_name: string;
  stories: Story[];
}

export default function StoryComponent() {
  const [fetchedStories, setFetchedStories] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchStories = async () => {
      try {
        const response = await fetch("https://alma-market.online/stories");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const storiesData = await response.json();
        if (!isMounted) return;

        const transformedStories: User[] = storiesData
          .filter((user: any) => user !== null && typeof user === 'object')
          .map((user: any) => ({
            user_id: Number(user.id) || Date.now(),
            user_image: user.img || "https://placeholder.com/user.jpg",
            user_name: user.title || "User",
            stories: Array.isArray(user.stories) 
              ? user.stories
                  .filter((story: any) => story !== null && typeof story === 'object')
                  .map((story: any) => ({
                    story_id: Number(story.id) || Date.now(),
                    story_image: story.url || story.story_image || "",
                    duration: Number(story.duration) || 5000,
                    created_at: story.created_at || new Date().toISOString(),
                    type: "image" as const,
                  }))
              : []
          }))
          .filter((user: User) => user.stories.length > 0);

        if (isMounted) {
          setFetchedStories(transformedStories);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setError("Error loading data. Please try again later.");
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
      return <ActivityIndicator size="large" color="#DC0200" />;
    }

    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }

    if (fetchedStories.length === 0) {
      return <Text style={styles.noStoriesText}>No stories available</Text>;
    }

    return (
      <View style={styles.storiesBlock}>
        <InstaStory
          data={fetchedStories}
          duration={5}
          // onStorySeen={null}
          avatarImageStyle={styles.avatarImage}
          swipeText={() => {""}}
          renderCloseComponent={({ onPress }: { onPress: () => void }) => (
            <TouchableOpacity style={styles.closeButton} onPress={onPress}>
              <Image
                style={styles.closeButtonImage}
                source={require("../../assets/images/close.png")}
              />
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  return <View style={styles.storyContainer}>{renderContent()}</View>;
}

const styles = StyleSheet.create({
  storyContainer: {
    flex: 1,
    marginLeft: 10,
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
    width: 53,
    height: 53,
    borderRadius: 50,
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
});

