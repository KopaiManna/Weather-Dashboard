import ThemeToggle from "./ThemeToggle";

export default function TopBar({ 
  dark, 
  setDark,
  searchQuery,
  onSearchChange,
  onLocationSelect,
  onCurrentLocation,
  searchSuggestions,
  showSuggestions,
  setShowSuggestions,
  searching 
}) {
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onLocationSelect(searchQuery);
    }
  };

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 md:gap-6">
      {/* Search Bar with Suggestions */}
      <div className="relative flex-1 max-w-xl">
        <form onSubmit={handleSubmit} className="relative">
          <input
            className="w-full px-4 py-3 pl-12 pr-10 rounded-xl 
                     bg-white/90 
                     text-gray-900
                     border border-gray-300
                     placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-blue-500/50
                     focus:border-blue-500
                     transition-all duration-200
                     shadow-sm hover:shadow-md"
            type="text"
            placeholder="Search city or location..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
            🔍
          </div>
          
          {/* Clear button */}
          {searchQuery && (
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => {
                onSearchChange("");
                setSearchSuggestions([]);
                setShowSuggestions(false);
              }}
            >
              ✕
            </button>
          )}
          
          {/* Current location button */}
          <button
            type="button"
            onClick={onCurrentLocation}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-600"
            title="Use current location"
          >
            📍
          </button>
        </form>
        
        {/* Search Suggestions Dropdown */}
        {showSuggestions && searchSuggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-64 overflow-y-auto">
            {searching ? (
              <div className="p-4 text-center text-gray-500">
                <div className="inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                Searching...
              </div>
            ) : (
              <>
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.id}-${index}`}
                    className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                    onClick={() => {
                      const locationString = `${suggestion.name}, ${suggestion.country}`;
                      onLocationSelect(locationString);
                      setShowSuggestions(false);
                    }}
                  >
                    <span className="text-gray-400">📍</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{suggestion.name}</p>
                      <p className="text-sm text-gray-500">
                        {suggestion.region}, {suggestion.country}
                      </p>
                    </div>
                  </button>
                ))}
              </>
            )}
          </div>
        )}
        
        {/* Click outside to close suggestions */}
        {showSuggestions && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowSuggestions(false)}
          />
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center justify-end gap-3 md:gap-6">
        {/* Theme Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 hidden sm:block">
            {dark ? "Dark" : "Light"}
          </span>
          <ThemeToggle dark={dark} setDark={setDark} />
        </div>
        
        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-md">
              U
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="hidden sm:block">
            <p className="font-medium text-sm md:text-base">Weather User</p>
            <p className="text-xs text-gray-500">Premium Plan</p>
          </div>
        </div>
      </div>
    </header>
  );
}