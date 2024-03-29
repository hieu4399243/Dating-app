import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Profile from "../../../components/Profile";

const index = () => {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState("");
  const [profiles, setProfiles] = useState([]);
  useEffect(() => {
    const fectchUser = async () => {
      const token = await AsyncStorage.getItem("auth");
      const decodeToken = jwtDecode(token);
      const userId = decodeToken.userId;
      setUserId(userId);
    };
    fectchUser();
  }, []);
  console.log(userId);
  const fetchUserDescription = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/users/${userId}`);
      const user = response.data;
      setUser(user?.user);
    } catch (error) {
      console.log("Error", error);
    }
  };
  const fetchProfiles = async () => {
    try {
      const response = await axios.get("http://localhost:3000/profiles", {
        params: {
          userId: userId,
          gender: user?.gender,
          turnOns: user?.turnOns,
          lookingFor: user?.lookingFor,
        },
      });

      setProfiles(response.data.profiles);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    if (userId) {
      fetchUserDescription();
    }
  }, [userId]);
  useEffect(() => {
    if (user && userId) {
      fetchProfiles();
    }
  }, [userId, user]);
  console.log("profiles: ", profiles);


  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index}) => ( 
          <Profile
            key={index}
            item={item}
            userId={userId}
            setProfiles={setProfiles}
            isEven={index%2}
          />
        )}
      />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
