import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import CustomTextInput from "./customTextInput";
import { colors, radius } from "../theme";

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
      <View style={styles.row}>
        <View style={styles.inputWrapper}>
          <CustomTextInput
            placeholder="Search city..."
            numberOfLines={1}
            textValue={location}
            onChange={(text) => {
              setLocation(text);
              if (error) setError("");
            }}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handlePress} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

export default WeatherSearch;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  inputWrapper: {
    flex: 1,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    height: 48,
    paddingHorizontal: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
  errorText: {
    color: "#FF4D4D",
    fontSize: 12,
    marginTop: 6,
  },
});
