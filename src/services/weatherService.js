const API_KEY = '7b860e8fbe5d4d1fac7103050252012';
const BASE_URL = 'https://api.weatherapi.com/v1';

export const fetchWeather = async (query) => {
  try {
    // Check if query is coordinates or location name
    let url;
    if (/^-?\d+\.?\d*,-?\d+\.?\d*$/.test(query)) {
      // If it's coordinates (lat,lon)
      url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${query}&days=7&aqi=yes&alerts=no`;
    } else {
      // If it's location name
      url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${query}&days=7&aqi=yes&alerts=no`;
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Format the data to match your component structure
    return {
      location: {
        name: data.location.name,
        country: data.location.country,
        lat: data.location.lat,
        lon: data.location.lon,
        localtime: data.location.localtime
      },
      current: {
        temp_c: data.current.temp_c,
        feelslike_c: data.current.feelslike_c,
        condition: {
          text: data.current.condition.text,
          icon: data.current.condition.icon
        },
        wind_kph: data.current.wind_kph,
        wind_dir: data.current.wind_dir,
        humidity: data.current.humidity,
        uv: data.current.uv,
        vis_km: data.current.vis_km,
        pressure_mb: data.current.pressure_mb,
        precip_mm: data.current.precip_mm,
        cloud: data.current.cloud,
        gust_kph: data.current.gust_kph
      },
      forecast: {
        forecastday: data.forecast.forecastday.map(day => ({
          date: day.date,
          day: {
            maxtemp_c: day.day.maxtemp_c,
            mintemp_c: day.day.mintemp_c,
            avgtemp_c: day.day.avgtemp_c,
            maxwind_kph: day.day.maxwind_kph,
            totalprecip_mm: day.day.totalprecip_mm,
            avgvis_km: day.day.avgvis_km,
            avghumidity: day.day.avghumidity,
            daily_chance_of_rain: day.day.daily_chance_of_rain,
            daily_chance_of_snow: day.day.daily_chance_of_snow,
            condition: {
              text: day.day.condition.text,
              icon: day.day.condition.icon
            }
          },
          hour: day.hour.map(hour => ({
            time: hour.time,
            temp_c: hour.temp_c,
            condition: {
              text: hour.condition.text,
              icon: hour.condition.icon
            },
            chance_of_rain: hour.chance_of_rain,
            chance_of_snow: hour.chance_of_snow,
            wind_kph: hour.wind_kph,
            humidity: hour.humidity
          }))
        }))
      }
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
};

// Auto-complete function for search suggestions
export const searchLocations = async (query) => {
  if (!query || query.length < 2) return [];
  
  try {
    const response = await fetch(
      `${BASE_URL}/search.json?key=${API_KEY}&q=${query}`
    );
    
    if (!response.ok) {
      throw new Error(`Search API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
};