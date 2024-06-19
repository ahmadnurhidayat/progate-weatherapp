import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

const WeatherInfo = () => {
  return (
    <View style={styles.marginTop20}>
      <Text>The weather of Jakarta</Text>
      <Text>15 C</Text>
      <View>
        <Image
          source={{ uri: "https://openweathermap.org/img/w/04d.png" }}
          style={styles.weatherIcon}
        />
        <Text>Clouds</Text>
        <Text>overcast clouds</Text>
        <View>
          <Text>Visibility</Text>
          <Text>10 Km</Text>
        </View>
        <View>
          <Text>Wind Speed</Text>
          <Text>10 m/s</Text>
        </View>
      </View>
    </View>
  );
};

export default WeatherInfo;

const styles = StyleSheet.create({
  marginTop20: {
    marginTop: 20,
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
});
