import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, TextInput } from "react-native";
import WeatherSearch from "./components/WeatherSearch";
import WeatherInfo from "./components/WeatherInfo";
import axios from "axios";
import { API_KEY, BASE_URL } from "./constant";
import { useEffect, useState } from "react";

export default function App() {
  const [weatherData, setWeatherData] = useState();

  function handleSearch(location) {
    axios
      .get(`${BASE_URL}?q=${location}&appid=${API_KEY}`)
      .then((res) => {
        const data = res.data;
        data.visibility /= 1000;
        data.visibility = data.visibility.toFixed(2);
        data.main.temp -= 273.15;
        data.main.temp = data.main.temp.toFixed(2);

        setWeatherData(data);
      })
      .catch((err) => console.error("gagal cur", err));
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <WeatherSearch searchWeather={handleSearch} />
      <WeatherInfo />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
