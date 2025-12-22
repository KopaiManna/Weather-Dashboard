import { useEffect, useState, useCallback } from "react";
import { fetchWeather, searchLocations } from "./services/weatherService";
import Sidebar from "./components/sidebar";
import TopBar from "./components/topbar";
import MainWeatherCard from "./components/mainweathercard";
import HighlightCard from "./components/highlightcard";
import HourlyChart from "./components/HourlyCharts";
import WeeklyChart from "./components/WeeklyCharts";
import debounce from "lodash/debounce";

export default function App() {
  const [weather, setWeather] = useState(null);
  const [dark, setDark] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searching, setSearching] = useState(false);

  // Dark mode
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(dark));
    
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  // Load default weather on mount
  useEffect(() => {
    const loadDefaultWeather = async () => {
      try {
        setLoading(true);
        const data = await fetchWeather("Delhi");
        setWeather(data);
        setError("");
      } catch (err) {
        setError("Failed to load weather data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDefaultWeather();
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (query.length < 2) {
        setSearchSuggestions([]);
        return;
      }
      
      setSearching(true);
      try {
        const results = await searchLocations(query);
        setSearchSuggestions(results);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Search error:", err);
        setSearchSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 300),
    []
  );

  // Handle search input change
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    debouncedSearch(value);
  };

  // Handle location selection from search or click
  const handleLocationSelect = async (location) => {
    setShowSuggestions(false);
    setSearchQuery(location);
    
    try {
      setLoading(true);
      const data = await fetchWeather(location);
      setWeather(data);
      setError("");
    } catch (err) {
      setError(`Failed to load weather for ${location}. Please try another location.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle current location button
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            setLoading(true);
            const coords = `${position.coords.latitude},${position.coords.longitude}`;
            const data = await fetchWeather(coords);
            setWeather(data);
            setSearchQuery(`${data.location.name}, ${data.location.country}`);
            setError("");
          } catch (err) {
            setError("Failed to get weather for your location. Please try again.");
            console.error(err);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setError("Unable to access your location. Please enable location services.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (error && !weather) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg max-w-md">
          <div className="text-4xl mb-4">🌩️</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md mr-2"
          >
            Try Again
          </button>
          <button
            onClick={handleCurrentLocation}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md"
          >
            Use Current Location
          </button>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  const hourlyData = weather.forecast.forecastday[0].hour;
  const currentHour = new Date().getHours();
  const next12Hours = hourlyData.slice(currentHour, currentHour + 12);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-indigo-100 text-gray-800">
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
        <TopBar 
          dark={dark} 
          setDark={setDark}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onLocationSelect={handleLocationSelect}
          onCurrentLocation={handleCurrentLocation}
          searchSuggestions={searchSuggestions}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
          searching={searching}
        />
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Left Column - Main Weather Info */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Current Weather Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Temperature */}
                <div className="md:col-span-2">
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm font-medium">
                          {weather.location.country} • {weather.location.name}
                        </p>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-1">
                          {new Date().toLocaleDateString("en", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                          })}
                        </h1>
                      </div>
                      <button
                        onClick={handleCurrentLocation}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        title="Use current location"
                      >
                        📍 Current Location
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-end gap-4">
                    <div>
                      <h2 className="text-6xl md:text-7xl font-bold text-gray-900">
                        {Math.round(weather.current.temp_c)}°C
                      </h2>
                      <p className="text-gray-600 mt-2">
                        Feels like {Math.round(weather.current.feelslike_c)}°C
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <img
                        src={weather.current.condition.icon}
                        className="w-16 h-16"
                        alt={weather.current.condition.text}
                      />
                      <p className="text-lg text-gray-700">{weather.current.condition.text}</p>
                    </div>
                  </div>
                </div>
                
                {/* Sunrise/Sunset */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                      <p className="text-sm text-gray-600 font-medium">Sunrise</p>
                      <p className="text-xl font-semibold text-gray-800 mt-1">6:30 AM</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
                      <p className="text-sm text-gray-600 font-medium">Sunset</p>
                      <p className="text-xl font-semibold text-gray-800 mt-1">7:45 PM</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 font-medium">AQI</span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Good
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 gap-6">
              <HourlyChart hours={next12Hours} />
              <WeeklyChart days={weather.forecast.forecastday} />
            </div>
          </div>
          
          {/* Right Column - Highlights */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Highlights</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                <HighlightCard 
                  title="UV Index" 
                  value={weather.current.uv} 
                  icon="☀️"
                  level={getUVLevel(weather.current.uv)}
                />
                <HighlightCard 
                  title="Wind" 
                  value={`${weather.current.wind_kph} km/h`}
                  icon="💨"
                  subtitle={weather.current.wind_dir}
                />
                <HighlightCard 
                  title="Humidity" 
                  value={`${weather.current.humidity}%`}
                  icon="💧"
                  level={getHumidityLevel(weather.current.humidity)}
                />
                <HighlightCard 
                  title="Rain Chance" 
                  value={`${weather.forecast.forecastday[0].day.daily_chance_of_rain}%`}
                  icon="🌧️"
                />
                <HighlightCard 
                  title="Feels Like" 
                  value={`${Math.round(weather.current.feelslike_c)}°C`}
                  icon="🌡️"
                />
                <HighlightCard 
                  title="Visibility" 
                  value={`${weather.current.vis_km} km`}
                  icon="👁️"
                />
              </div>
            </div>
            
            {/* Additional Info */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Weather Tips</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">🌤️</span>
                  <span>Perfect day for outdoor activities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">👕</span>
                  <span>Light jacket recommended</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">🌅</span>
                  <span>Best time for sunrise: 6:30 AM</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper functions
function getUVLevel(uv) {
  if (uv <= 2) return { text: "Low", color: "text-green-600", bg: "bg-green-100" };
  if (uv <= 5) return { text: "Moderate", color: "text-yellow-600", bg: "bg-yellow-100" };
  if (uv <= 7) return { text: "High", color: "text-orange-600", bg: "bg-orange-100" };
  if (uv <= 10) return { text: "Very High", color: "text-red-600", bg: "bg-red-100" };
  return { text: "Extreme", color: "text-purple-600", bg: "bg-purple-100" };
}

function getHumidityLevel(humidity) {
  if (humidity < 30) return { text: "Low", color: "text-yellow-600", bg: "bg-yellow-100" };
  if (humidity < 60) return { text: "Comfortable", color: "text-green-600", bg: "bg-green-100" };
  if (humidity < 80) return { text: "High", color: "text-orange-600", bg: "bg-orange-100" };
  return { text: "Very High", color: "text-red-600", bg: "bg-red-100" };
}