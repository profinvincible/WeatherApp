import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  Image,
} from "react-native";
import axios from "axios";

// Function to get custom background image based on weather condition
const getWeatherBackground = (weather) => {
  if (!weather) return require("./assets/backgroundWeather.jpg");
  const condition = weather.weather[0].main.toLowerCase();
  switch (condition) {
    case "clear":
      return require("./assets/animations/sunnyBackgrounds.jpeg");
    case "clouds":
      return require("./assets/animations/cloudyBackground.jpg");
    case "rain":
      return require("./assets/animations/rainyBackgrounds.jpeg");
    case "snow":
      return require("./assets/animations/snowyBackground.png");
    default:
      return require("./assets/backgroundWeather.jpg");
  }
};

const WeatherScreen = ({ weather, onBack }) => {
  return (
    <ImageBackground
      source={getWeatherBackground(weather)}
      style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.weatherText}>
          {weather.name}, {weather.sys.country}
        </Text>
        <Text style={styles.weatherText}>
          Temperature: {weather.main.temp}°C
        </Text>
        <Text style={styles.weatherText}>
          Weather: {weather.weather[0].description}
        </Text>
        <Image
          source={{
            uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
          }}
          style={styles.weatherIcon}
        />
        <TouchableOpacity onPress={onBack} style={styles.button}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const App = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = "7b1b324e35bd239c356b59e62378370e";

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data);
    } catch (err) {
      setError("City not found. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (weather) {
    return <WeatherScreen weather={weather} onBack={() => setWeather(null)} />;
  }

  return (
    <ImageBackground
      source={require("./assets/backgroundWeather.jpg")}
      style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>🌤 Weather App</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter city name"
          value={city}
          onChangeText={setCity}
          placeholderTextColor="#555"
        />
        <TouchableOpacity onPress={fetchWeather} style={styles.button}>
          <Text style={styles.buttonText}>Get Weather</Text>
        </TouchableOpacity>
        {loading && <ActivityIndicator size="large" color="#ffdd00" />}
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    // backgroundColor: "rgba(0,0,0,0.5)",
  },
  weatherPageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  weatherBox: {
    backgroundColor: "green",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffdd00",
    marginBottom: 16,
  },
  input: {
    width: "90%",
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ffdd00",
    borderRadius: 8,
    backgroundColor: "#fff",
    color: "#333",
  },
  button: {
    backgroundColor: "#ff6347",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  error: {
    color: "#ff4444",
    marginTop: 8,
  },
  weatherText: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 8,
  },
  weatherIcon: {
    width: 100,
    height: 100,
  },
});

export default App;

// eas build --profile preview --platform android
// eas build --profile preview --platform all
// for google playstore
// For Android: eas build --profile production --platform android
// For iOS: eas build --profile production --platform ios
