import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import WeatherSearch from "./components/WeatherSearch";
import WeatherInfo from "./components/WeatherInfo";
import axios from "axios";
import { API_KEY, BASE_URL, FORECAST_URL } from "./constant";
import { useReducer } from "react";
import { colors } from "./theme";

export type WeatherData = {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    temp_min: number;
    temp_max: number;
  };
  weather: { description: string; icon: string }[];
  visibility: number;
  wind: { speed: number };
  coord: { lat: number; lon: number };
  sys: { sunrise: number; sunset: number; country: string };
  clouds: { all: number };
};

export type ForecastItem = {
  dt: number;
  main: { temp: number; temp_min: number; temp_max: number };
  weather: { description: string; icon: string }[];
  dt_txt: string;
};

export type DailyForecast = {
  day: string;
  icon: string;
  description: string;
  tempMin: number;
  tempMax: number;
};

type NominatimAddress = {
  village?: string;
  town?: string;
  city?: string;
  suburb?: string;
  municipality?: string;
  county?: string;
  state?: string;
  country?: string;
  postcode?: string;
};

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: WeatherData; address: string; forecast: DailyForecast[] }
  | { status: "error" };

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: WeatherData; address: string; forecast: DailyForecast[] }
  | { type: "FETCH_ERROR" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_START":
      return { status: "loading" };
    case "FETCH_SUCCESS":
      return { status: "success", data: action.payload, address: action.address, forecast: action.forecast };
    case "FETCH_ERROR":
      return { status: "error" };
    default:
      return state;
  }
}

function formatAddress(addr: NominatimAddress): string {
  const parts = [
    addr.village || addr.town || addr.city || addr.suburb,
    addr.municipality || addr.county,
    addr.state,
    addr.country,
  ].filter(Boolean);
  const postcode = addr.postcode ? ` ${addr.postcode}` : "";
  return parts.join(", ") + postcode;
}

function groupForecastByDay(list: ForecastItem[]): DailyForecast[] {
  const days: Record<string, ForecastItem[]> = {};
  list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!days[date]) days[date] = [];
    days[date].push(item);
  });

  return Object.entries(days).slice(0, 5).map(([date, items]) => {
    const midday = items.find((i) => i.dt_txt.includes("12:00:00")) || items[Math.floor(items.length / 2)];
    const allTemps = items.flatMap((i) => [i.main.temp_min, i.main.temp_max]);
    return {
      day: new Date(date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" }),
      icon: midday.weather[0].icon,
      description: midday.weather[0].description,
      tempMin: Math.round(Math.min(...allTemps)),
      tempMax: Math.round(Math.max(...allTemps)),
    };
  });
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, { status: "idle" });

  const handleSearch = async (location: string) => {
    if (location.trim() === "") return;

    dispatch({ type: "FETCH_START" });
    try {
      const [weatherRes, forecastRes] = await Promise.all([
        axios.get(`${BASE_URL}?q=${location}&appid=${API_KEY}&units=metric`),
        axios.get(`${FORECAST_URL}?q=${location}&appid=${API_KEY}&units=metric`),
      ]);

      const data: WeatherData = weatherRes.data;
      data.visibility = parseFloat((data.visibility / 1000).toFixed(1));

      const forecast = groupForecastByDay(forecastRes.data.list as ForecastItem[]);

      // Try to get full address from Nominatim, fallback to city + country
      let address = `${data.name}, ${data.sys.country}`;
      try {
        const { lat, lon } = data.coord;
        const geoRes = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
          { headers: { "User-Agent": "WeatherApp/1.0" } }
        );
        address = formatAddress(geoRes.data.address as NominatimAddress);
      } catch {
        // silently fall back to city + country
      }

      dispatch({ type: "FETCH_SUCCESS", payload: data, address, forecast });
    } catch (error) {
      dispatch({ type: "FETCH_ERROR" });
      console.error("error catch:", error);
    }
  };

  const renderContent = () => {
    switch (state.status) {
      case "loading":
        return (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Fetching weather...</Text>
          </View>
        );
      case "success":
        return (
          <WeatherInfo
            name={state.data.name}
            address={state.address}
            temp={state.data.main.temp}
            feelsLike={state.data.main.feels_like}
            tempMin={state.data.main.temp_min}
            tempMax={state.data.main.temp_max}
            humidity={state.data.main.humidity}
            pressure={state.data.main.pressure}
            weatherDesc={state.data.weather[0].description}
            icon={state.data.weather[0].icon}
            visibility={state.data.visibility}
            windSpeed={state.data.wind.speed}
            sunrise={state.data.sys.sunrise}
            sunset={state.data.sys.sunset}
            forecast={state.forecast}
          />
        );
      case "error":
        return (
          <View style={styles.centered}>
            <Text style={styles.errorEmoji}>⚠️</Text>
            <Text style={styles.errorText}>City not found.</Text>
            <Text style={styles.errorSub}>Try a city name like "Jakarta" or "Magelang".</Text>
          </View>
        );
      default:
        return (
          <View style={styles.centered}>
            <Text style={styles.idleEmoji}>🌤</Text>
            <Text style={styles.idleText}>Search a city to see the weather</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.searchSection}>
              <Text style={styles.appTitle}>Weather</Text>
              <WeatherSearch searchWeather={handleSearch} />
            </View>
            <View style={styles.contentSection}>{renderContent()}</View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.dark,
    ...(Platform.OS === "web"
      ? { maxWidth: 480, width: "100%", marginHorizontal: "auto" as unknown as number }
      : {}),
  },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  searchSection: {
    backgroundColor: colors.dark,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  appTitle: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
  },
  contentSection: {
    flex: 1,
    backgroundColor: colors.bgLight,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: 500,
    paddingBottom: 32,
  },
  centered: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 12,
    color: colors.textSecondary,
    fontSize: 14,
  },
  errorEmoji: { fontSize: 40, marginBottom: 12 },
  errorText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 6,
  },
  errorSub: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
  },
  idleEmoji: { fontSize: 56, marginBottom: 16 },
  idleText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
