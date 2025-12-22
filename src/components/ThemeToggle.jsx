export default function ThemeToggle({ dark, setDark }) {
  return (
    <button
      onClick={() => setDark(!dark)}
      className="
        relative w-14 h-8 rounded-full 
        bg-gradient-to-r from-gray-300 to-gray-400
        dark:from-gray-700 dark:to-gray-800
        transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-blue-500/50
        shadow-inner
      "
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className={`
        absolute top-1 w-6 h-6 rounded-full bg-white
        shadow-lg transform transition-transform duration-300
        flex items-center justify-center text-lg
        ${dark ? 'translate-x-7' : 'translate-x-1'}
      `}>
        {dark ? "🌙" : "☀️"}
      </div>
    </button>
  );
}