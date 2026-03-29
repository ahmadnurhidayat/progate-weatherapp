import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
import WeatherSearch from "./components/WeatherSearch";
import WeatherInfo from "./components/WeatherInfo";
import axios from "axios";
import { API_KEY, BASE_URL } from "./constant";
import { useReducer } from "react";

type WeatherData = {
  name: string;
  main: { temp: number };
  weather: { description: string; icon: string }[];
  visibility: number;
  wind: { speed: number };
};

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: WeatherData }
  | { status: "error" };

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: WeatherData }
  | { type: "FETCH_ERROR" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_START":
      return { status: "loading" };
    case "FETCH_SUCCESS":
      return { status: "success", data: action.payload };
    case "FETCH_ERROR":
      return { status: "error" };
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, { status: "idle" });

  const handleSearch = async (location: string) => {
    if (location.trim() === "") return;

    dispatch({ type: "FETCH_START" });
    try {
      const res = await axios.get(`${BASE_URL}?q=${location}&appid=${API_KEY}`);
      const data: WeatherData = res.data;
      data.visibility = parseFloat((data.visibility / 1000).toFixed(2));
      data.main.temp = parseFloat((data.main.temp - 273.15).toFixed(2));

      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (error) {
      dispatch({ type: "FETCH_ERROR" });
      console.error("error catch:", error);
    }
  };

  const renderComponent = () => {
    switch (state.status) {
      case "loading":
        return <ActivityIndicator size="large" />;
      case "success":
        return (
          <WeatherInfo
            name={state.data.name}
            temp={state.data.main.temp}
            weatherDesc={state.data.weather[0].description}
            icon={state.data.weather[0].icon}
            visibility={state.data.visibility}
            windSpeed={state.data.wind.speed}
          />
        );
      case "error":
        return (
          <Text style={styles.errorText}>
            Something went wrong. Please try again with a correct city name.
          </Text>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <WeatherSearch searchWeather={handleSearch} />
      {renderComponent()}
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
  errorText: {
    marginTop: 42,
  },
});
