import React, { useState } from "react";
import { StyleSheet, View, Button, Text } from "react-native";
import CustomTextInput from "./customTextInput";

type Props = {
  searchWeather: (location: string) => void;
};

const WeatherSearch = ({ searchWeather }: Props) => {
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  const handlePress = () => {
    if (location.trim() === "") {
      setError("Please enter a city name.");
      return;
    }
    setError("");
    searchWeather(location);
  };

  return (
    <View>
      <CustomTextInput
        placeholder="Search the weather of your city"
        numberOfLines={1}
        textValue={location}
        onChange={(text) => {
          setLocation(text);
          if (error) setError("");
        }}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <View style={styles.buttonWrapper}>
        <Button title="Search" onPress={handlePress} />
      </View>
    </View>
  );
};

export default WeatherSearch;

const styles = StyleSheet.create({
  buttonWrapper: {
    marginTop: 20,
    marginBottom: 20,
    justifyContent: "center",
  },
  errorText: {
    color: "red",
    marginTop: 4,
    fontSize: 12,
  },
});
