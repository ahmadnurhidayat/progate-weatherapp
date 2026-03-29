import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import React from "react";
import { colors, radius, spacing } from "../theme";
import { DailyForecast } from "../App";

type Props = {
  name: string;
  address: string;
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  pressure: number;
  weatherDesc: string;
  icon: string;
  visibility: number;
  windSpeed: number;
  sunrise: number;
  sunset: number;
  forecast: DailyForecast[];
};

function formatTime(unix: number): string {
  return new Date(unix * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

type StatCardProps = { emoji: string; value: string; label: string };
const StatCard = ({ emoji, value, label }: StatCardProps) => (
  <View style={styles.statCard}>
    <Text style={styles.statEmoji}>{emoji}</Text>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const WeatherInfo = ({
  name, address, temp, feelsLike, tempMin, tempMax,
  humidity, pressure, weatherDesc, icon,
  visibility, windSpeed, sunrise, sunset, forecast,
}: Props) => {
  return (
    <View>
      {/* Hero Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View style={styles.heroLeft}>
            <Text style={styles.cityName}>{name}</Text>
            <Text style={styles.addressText}>{address}</Text>
          </View>
          <Image
            source={{ uri: `https://openweathermap.org/img/w/${icon}.png` }}
            style={styles.heroIcon}
          />
        </View>

        <Text style={styles.tempText}>{Math.round(temp)}°</Text>
        <Text style={styles.descText}>{weatherDesc}</Text>

        <View style={styles.heroBottom}>
          <View style={styles.heroBottomItem}>
            <Text style={styles.heroBottomLabel}>Feels like</Text>
            <Text style={styles.heroBottomValue}>{Math.round(feelsLike)}°C</Text>
          </View>
          <View style={styles.heroDivider} />
          <View style={styles.heroBottomItem}>
            <Text style={styles.heroBottomLabel}>Min</Text>
            <Text style={styles.heroBottomValue}>{Math.round(tempMin)}°C</Text>
          </View>
          <View style={styles.heroDivider} />
          <View style={styles.heroBottomItem}>
            <Text style={styles.heroBottomLabel}>Max</Text>
            <Text style={styles.heroBottomValue}>{Math.round(tempMax)}°C</Text>
          </View>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.sectionWrapper}>
        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.statsGrid}>
          <StatCard emoji="💧" value={`${humidity}%`} label="Humidity" />
          <StatCard emoji="💨" value={`${windSpeed} m/s`} label="Wind Speed" />
          <StatCard emoji="👁️" value={`${visibility} km`} label="Visibility" />
          <StatCard emoji="📊" value={`${pressure} hPa`} label="Pressure" />
        </View>
      </View>

      {/* Sunrise / Sunset */}
      <View style={styles.sectionWrapper}>
        <Text style={styles.sectionTitle}>Sun</Text>
        <View style={styles.sunCard}>
          <View style={styles.sunItem}>
            <Text style={styles.sunEmoji}>🌅</Text>
            <Text style={styles.sunValue}>{formatTime(sunrise)}</Text>
            <Text style={styles.sunLabel}>Sunrise</Text>
          </View>
          <View style={styles.sunDivider} />
          <View style={styles.sunItem}>
            <Text style={styles.sunEmoji}>🌇</Text>
            <Text style={styles.sunValue}>{formatTime(sunset)}</Text>
            <Text style={styles.sunLabel}>Sunset</Text>
          </View>
        </View>
      </View>

      {/* 5-Day Forecast */}
      <View style={styles.sectionWrapper}>
        <Text style={styles.sectionTitle}>5-Day Forecast</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.forecastScroll}>
          {forecast.map((item, index) => (
            <View key={index} style={styles.forecastCard}>
              <Text style={styles.forecastDay}>{item.day}</Text>
              <Image
                source={{ uri: `https://openweathermap.org/img/w/${item.icon}.png` }}
                style={styles.forecastIcon}
              />
              <Text style={styles.forecastMax}>{item.tempMax}°</Text>
              <Text style={styles.forecastMin}>{item.tempMin}°</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default WeatherInfo;

const styles = StyleSheet.create({
  // Hero card
  heroCard: {
    backgroundColor: colors.dark,
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: radius.lg,
    padding: 20,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  heroLeft: { flex: 1 },
  cityName: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "700",
  },
  addressText: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
    lineHeight: 17,
    paddingRight: 8,
  },
  heroIcon: {
    width: 60,
    height: 60,
  },
  tempText: {
    color: colors.white,
    fontSize: 80,
    fontWeight: "700",
    marginTop: 8,
    lineHeight: 88,
  },
  descText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "600",
    textTransform: "capitalize",
    marginBottom: 20,
  },
  heroBottom: {
    flexDirection: "row",
    backgroundColor: "#2E2E2E",
    borderRadius: radius.md,
    paddingVertical: 12,
  },
  heroBottomItem: {
    flex: 1,
    alignItems: "center",
  },
  heroDivider: {
    width: 1,
    backgroundColor: "#444",
  },
  heroBottomLabel: {
    color: colors.textMuted,
    fontSize: 11,
    marginBottom: 4,
  },
  heroBottomValue: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
  },

  // Section
  sectionWrapper: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },

  // Stats grid
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statCard: {
    backgroundColor: colors.cardBg,
    borderRadius: radius.md,
    padding: 16,
    alignItems: "flex-start",
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statEmoji: { fontSize: 22, marginBottom: 8 },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  // Sun
  sunCard: {
    backgroundColor: colors.cardBg,
    borderRadius: radius.md,
    flexDirection: "row",
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sunItem: {
    flex: 1,
    alignItems: "center",
  },
  sunDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  sunEmoji: { fontSize: 26, marginBottom: 6 },
  sunValue: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 2,
  },
  sunLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  // Forecast
  forecastScroll: { marginHorizontal: -4 },
  forecastCard: {
    backgroundColor: colors.cardBg,
    borderRadius: radius.md,
    padding: 14,
    alignItems: "center",
    marginHorizontal: 4,
    width: 80,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  forecastDay: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 6,
  },
  forecastIcon: { width: 40, height: 40 },
  forecastMax: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: 4,
  },
  forecastMin: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
});
