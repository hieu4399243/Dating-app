import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
  TextInput,
  Button,
  FlatList,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Entypo, AntDesign } from "@expo/vector-icons";
import Carousel from "react-native-snap-carousel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const index = () => {
  const [option, setOption] = useState("AD");
  const [description, setDescription] = useState("");
  const [activeSlide, setActiveSlide] = React.useState(0);
  const [userId, setUserId] = useState("");
  const [selectTurnOn, setSelectTurnOn] = useState([]);
  const [lookingOptions, setLookingOtions] = useState([]);
  const profileImages = [
    {
      image:
        "https://images.pexels.com/photos/1042140/pexels-photo-1042140.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      image:
        "https://images.pexels.com/photos/1215695/pexels-photo-1215695.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      image:
        "https://images.pexels.com/photos/7580971/pexels-photo-7580971.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
  ];
  const turnons = [
    {
      id: "0",
      name: "Music",
      description: "Pop Rock-Indie pick our sound track",
    },
    {
      id: "10",
      name: "Kissing",
      description:
        " It's a feeling of closeness, where every touch of lips creates a symphony of emotions.",
    },
    {
      id: "1",
      name: "Fantasies",
      description:
        "Fantasies can be deeply personal, encompassing diverse elements such as romance",
    },
    {
      id: "2",
      name: "Nibbling",
      description:
        "playful form of biting or taking small, gentle bites, typically done with the teeth",
    },
    {
      id: "3",
      name: "Desire",
      description: "powerful emotion or attainment of a particular person.",
    },
  ];
  const data = [
    {
      id: "0",
      name: "Casual",
      description: "Let's keep it easy and see where it goes",
    },
    {
      id: "1",
      name: "Long Term",
      description: "How about a one life stand",
    },
    {
      id: "2",
      name: "Virtual",
      description: "Let's have some virtual fun",
    },
    {
      id: "3",
      name: "Open for Anything",
      description: "Let's Vibe and see where it goes",
    },
  ];
  
  useEffect(() => {
    const fectchUser = async () => {
      const token = await AsyncStorage.getItem("auth");
      const decodeToken = jwtDecode(token);
      const userId = decodeToken.userId;
      setUserId(userId);
    };
    fectchUser();
  }, []);
  const fetchUserDescription = async() => {
    try {
      const response = await axios.get(`http://localhost:3000/users/${userId}`);
      const user = response.data;
      setDescription(user?.user?.description);
      setSelectTurnOn(user?.user?.turnOns);
    } catch (error) {
      console.log("Error", error);
    }
  }
  useEffect(()=>{
    if(userId){
      fetchUserDescription();
    }
  }, [userId]);

  const handleUpdateDescription = async () =>{
      try {
        const response = await axios.put(
          `http://localhost:3000/users/${userId}/description`,
          {
            description: description,
          }
        );
        console.log(response.data);
        if (response.status === 200) {
          Alert.alert("Success", "Description updated successfully");
        }
      } catch (error) {
        console.log("Error", error);
      }
  } 

  const renderImage = ({ item }) => {
    return (
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          style={{
            width: "85%",
            resizeMode: "cover",
            height: 290,
            borderRadius: 10,
            transform: [{ rotate: "-5deg" }],
          }}
          source={{ uri: item?.image }}
        />
        <Text
          style={{ position: "absolute", top: 10, right: 10, color: "black" }}
        >
          {activeSlide + 1}/{profileImages.length}
        </Text>
      </View>
    );
  };

  const handleTurnOns = (turnon) =>{
    if(selectTurnOn.includes(turnon)){
      removeTurnOn(turnon);
    }else{
      addTurnOn(turnon);
    }
  }

  const handleOption = (lookingFor) =>{
    console.log(lookingFor);
    if(lookingOptions.includes(lookingFor)){
      removeOptions(lookingFor);
    }else{
      addOptions(lookingFor);
    }
  }

  const addOptions = async(lookingFor)=>{
    try {
      const response = await axios.put(
        `http://localhost:3000/users/${userId}/looking-for`,
        {
          lookingFor: lookingFor,
        }
      );

      console.log(response.data);

      if (response.status == 200) {
        setLookingOtions([...lookingOptions, lookingFor]);
      }
    } catch (error) {
      console.log("Error addding looking for", error);
    }
  }

  const removeOptions = async (lookingFor) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/users/${userId}/looking-for/remove`,
        {
          lookingFor: lookingFor,
        }
      );
      if (response.status === 200) {
        setLookingOtions(lookingOptions.filter((item) => item !== lookingFor));
      }
    } catch (error) {
      console.error("Error removing looking for:", error);
    }
  };

  const addTurnOn = async (turnOn) =>{
    try {
      const response = await axios.put(
        `http://localhost:3000/users/${userId}/turn-ons/add`,
        {
          turnOn: turnOn,
        }
      );

      console.log(response.data);

      if (response.status == 200) {
        setSelectTurnOn([...selectTurnOn, turnOn]);
      }
    } catch (error) {
      console.log("Error adding turn on", error);
    }
  }

  const removeTurnOn = async (turnOn) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/users/${userId}/turn-ons/remove`,
        {
          turnOn: turnOn,
        }
      );

      console.log(response.data);

      if (response.status == 200) {
        setSelectTurnOn(selectTurnOn.filter((item) => item !== turnOn));
      }
    } catch (error) {
      console.log("error removing turn on", error);
    }
  }

  return (
    <ScrollView>
      <View>
        <Image
          style={{ width: "100%", height: 200, resizeMode: "cover" }}
          source={{
            uri: "https://static.vecteezy.com/system/resources/thumbnails/018/977/074/original/animated-backgrounds-with-liquid-motion-graphic-background-cool-moving-animation-for-your-background-free-video.jpg",
          }}
        />
        <View>
          <View>
            <Pressable
              style={{
                padding: 10,
                backgroundColor: "#DDA0DD",
                width: 300,
                marginLeft: "auto",
                marginRight: "auto",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
                position: "absolute",
                top: -60,
                left: "50%",
                transform: [{ translateX: -150 }],
              }}
            >
              <Image
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  resizeMode: "cover",
                }}
              />
              <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 6 }}>
                Bangalore
              </Text>
              <Text style={{ marginTop: 4, fontSize: 15 }}>
                22 years 110 days
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View
        style={{
          marginTop: 80,
          marginHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
          gap: 25,
          justifyContent: "center",
        }}
      >
        <Pressable onPress={() => setOption("AD")}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: option == "AD" ? "black" : "gray",
            }}
          >
            AD
          </Text>
        </Pressable>
        <Pressable onPress={() => setOption("Photos")}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: option == "Photos" ? "black" : "gray",
            }}
          >
            Photos
          </Text>
        </Pressable>
        <Pressable onPress={() => setOption("Turn-ons")}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: option == "Turn-ons" ? "black" : "gray",
            }}
          >
            Turn-ons
          </Text>
        </Pressable>
        <Pressable onPress={() => setOption("Looking For")}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: option == "Looking For" ? "black" : "gray",
            }}
          >
            Looking For
          </Text>
        </Pressable>
      </View>
      <View style={{ marginHorizontal: 14, marginVertical: 15 }}>
        {option == "AD" && (
          <View
            style={{
              borderColor: "#202020",
              borderWidth: 1,
              padding: 10,
              borderRadius: 10,
              height: 300,
            }}
          >
            <TextInput
              value={description}
              onChangeText={(text) => setDescription(text)}
              style={{
                fontFamily: "Helvetica",
              }}
              placeholder="Write your AD for people to like you"
            />
            <Pressable
              onPress={handleUpdateDescription}
              style={{
                marginTop: "auto",
                flexDirection: "row",
                alignItems: "center",
                gap: 15,
                backgroundColor: "black",
                borderRadius: 5,
                justifyContent: "center",
                padding: 10,
              }}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontSize: 15,
                  fontWeight: "500",
                }}
              >
                Publish in feed
              </Text>
              <Entypo name="mask" size={24} color="white" />
            </Pressable>
          </View>
        )}
      </View>
      <View style={{ marginHorizontal: 14 }}>
        {option == "Photos" && (
          <View>
            <Carousel
              data={profileImages}
              renderItem={renderImage}
              sliderWidth={350}
              itemWidth={300}
              onSnapToItem={(index) => setActiveSlide(index)}
            />
            <View style={{ marginTop: 25 }}>
              <Text>Add a picture of yourself</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  paddingVertical: 5,
                  borderRadius: 5,
                  marginTop: 10,
                  backgroundColor: "#DCDCDC",
                }}
              >
                <Entypo
                  style={{ marginLeft: 8 }}
                  name="image"
                  size={24}
                  color="gray"
                />
                <TextInput
                  style={{ color: "gray", marginVertical: 10, width: 300 }}
                  placeholder="enter your image url"
                />
              </View>
              <Button style={{ marginTop: 5 }} title="Add Image" />
            </View>
          </View>
        )}
      </View>
      <View style={{ marginHorizontal: 14 }}>
        {option == "Turn-ons" && (
          <View>
            {turnons?.map((item, index) => (
              <Pressable
                onPress={() => handleTurnOns(item?.name)}
                style={{
                  backgroundColor: "#FFFDD0",
                  padding: 10,
                  marginVertical: 10,
                }}
                key={index}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 15,
                      fontWeight: "bold",
                      flex: 1,
                    }}
                  >
                    {item?.name}
                    {selectTurnOn.includes(item?.name) && (
                      <AntDesign name="checkcircle" size={18} color="#17B169" />
                    )}
                  </Text>

                </View>
                <Text
                  style={{
                    marginTop: 4,
                    fontSize: 15,
                    color: "gray",
                    textAlign: "center",
                  }}
                >
                  {item?.description}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
      <View style={{ marginHorizontal: 14 }}>
        {option == "Looking For" && (
          <>
            <View>
              <FlatList
                columnWrapperStyle={{ justifyContent: "space-between" }}
                numColumns={2}
                data={data}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => handleOption(item?.name)}
                    style={{
                      backgroundColor: lookingOptions.includes(item?.name)
                        ? "#fd5c63"
                        : "white",
                      padding: 16,
                      justifyContent: "center",
                      alignItems: "center",
                      width: 150,
                      margin: 10,
                      borderRadius: 5,
                      borderColor: "#fd5c63",
                      borderWidth: lookingOptions.includes(item?.name)
                        ? "transparent"
                        : 0.7,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontWeight: "500",
                        fontSize: 13,
                        color: lookingOptions.includes(item?.name)
                          ? "white"
                          : "black",
                      }}
                    >
                      {item?.name}
                    </Text>
                    <Text
                      style={{
                        color: lookingOptions.includes(item?.name)
                          ? "white"
                          : "gray",
                        textAlign: "center",
                        width: 140,
                        marginTop: 10,
                        fontSize: 13,
                      }}
                    >
                      {item?.description}
                    </Text>
                  </Pressable>
                )}
              />
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default index;

const styles = StyleSheet.create({});
