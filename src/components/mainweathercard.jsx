export default function MainWeatherCard({ weather }) {
  const date = new Date();
  
  const formatDate = (date) => {
    return date.toLocaleDateString("en", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  return (
    <div className="glass p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
      <div className="space-y-4 md:space-y-6">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
            {weather.location.country} • {weather.location.name}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold mt-1">
            {formatDate(date)}
          </h1>
        </div>
        
        <div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold">
            {Math.round(weather.current.temp_c)}°C
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
            Feels like {Math.round(weather.current.feelslike_c)}°C
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <img
            src={weather.current.condition.icon}
            className="w-12 h-12"
            alt={weather.current.condition.text}
          />
          <p className="text-lg">{weather.current.condition.text}</p>
        </div>
      </div>
      
      <div className="space-y-4 md:space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white/50 dark:bg-white/5">
            <p className="text-sm text-gray-500 dark:text-gray-400">Sunrise</p>
            <p className="text-xl font-semibold mt-1">6:30 AM</p>
          </div>
          <div className="p-4 rounded-xl bg-white/50 dark:bg-white/5">
            <p className="text-sm text-gray-500 dark:text-gray-400">Sunset</p>
            <p className="text-xl font-semibold mt-1">7:45 PM</p>
          </div>
        </div>
        
        <div className="p-4 rounded-xl bg-white/50 dark:bg-white/5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">AQI</span>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-600 dark:text-green-400">
              Good
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full w-3/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
}