export default function HighlightCard({ title, value, icon, subtitle, level }) {
  return (
    <div className="glass p-5 md:p-6 rounded-2xl hover:scale-[1.02] transition-transform duration-200 group cursor-pointer">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{icon}</span>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {title}
            </p>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">
            {value}
          </h2>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        
        {level && (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${level.color} ${level.color.replace('text', 'bg')}/20`}>
            {level.text}
          </span>
        )}
      </div>
      
      {/* Progress bar for certain metrics */}
      {(title === "Humidity" || title === "Rain Chance") && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>0%</span>
            <span>100%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                title === "Humidity" 
                  ? "bg-blue-500" 
                  : "bg-violet-500"
              }`}
              style={{ 
                width: `${parseInt(value)}%` 
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}