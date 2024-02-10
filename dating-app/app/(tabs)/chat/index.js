import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import "core-js/stable/atob";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useFocusEffect, useRouter } from "expo-router";

const index = () => {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fectchUser = async () => {
      const token = await AsyncStorage.getItem("auth");
      const decodeToken = jwtDecode(token);
      const userId = decodeToken.userId;
      setUserId(userId);
    };

    fectchUser();
  }, []);

  const fetchRecievedLikesDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/received-likes/${userId}/details`
      );

      console.log(response);

      const receivedLikesDetails = response.data.receivedLikesDetails;

      setProfiles(receivedLikesDetails);
    } catch (error) {
      console.log("error fetching the details", error);
    }
  };

  const fetchUserMatches = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/users/${userId}/matches`
      );

      const userMatches = response.data.matches;
      console.log(userMatches);
      setMatches(userMatches);
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserMatches();
    }
  }, [userId]);

  useEffect(() => {
    fetchRecievedLikesDetails();
  }, [userId]);
  console.log("Profiles: ", profiles);
  useFocusEffect(
    useCallback(() => {
      if (userId) {
        fetchUserMatches();
      }
    }, [])
  );
  console.log("Matches", matches);
  return (
    <View style={{ backgroundColor: "white", flex: 1, padding: 10 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "500" }}>CHATS</Text>
        <Ionicons name="chatbox-ellipses-outline" size={25} color="black" />
      </View>
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/chat/select",
            params: {
              profiles: JSON.stringify(profiles),
              userId: userId,
            },
          })
        }
        style={{
          marginVertical: 12,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: "#E0E0E0",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Feather name="heart" size={24} color="black" />
        </View>
        <Text style={{ fontSize: 17, marginLeft: 10, flex: 1 }}>
          You have got {profiles.length} likes
        </Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
      </Pressable>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
