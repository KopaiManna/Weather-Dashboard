export default function Sidebar() {
  const navItems = [
    { icon: "🏠", label: "Dashboard", active: true },
    { icon: "📊", label: "Analytics" },
    { icon: "📍", label: "Locations" },
    { icon: "⚙️", label: "Settings" },
  ];

  return (
    <>
      {/* Mobile Sidebar Toggle (hidden on desktop) */}
      <button className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-lg glass flex items-center justify-center text-xl">
        ☰
      </button>

      {/* Sidebar */}
      <aside className="fixed md:relative z-40 md:z-auto transform -translate-x-full md:translate-x-0 transition-transform duration-300 md:flex w-20 lg:w-24 min-h-screen flex-col items-center py-6 glass border-r border-gray-200 dark:border-white/10">
        
        {/* Logo */}
        <div className="text-3xl font-bold text-violet-500 mb-12">
          ⚡
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-6 w-full px-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`
                relative p-3 rounded-xl text-2xl
                transition-all duration-200
                ${item.active 
                  ? 'text-violet-500 bg-violet-500/10' 
                  : 'text-gray-400 hover:text-violet-400 hover:bg-white/5 dark:hover:bg-white/10'
                }
                group
              `}
              title={item.label}
            >
              {item.icon}
              <span className="
                absolute left-full ml-2 px-2 py-1 rounded-md
                bg-gray-900 dark:bg-gray-800 text-white text-xs
                opacity-0 group-hover:opacity-100
                transition-opacity duration-200
                pointer-events-none
                whitespace-nowrap
              ">
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto pt-6 border-t border-gray-200 dark:border-white/10 w-full px-2">
          <button className="
            w-full p-3 rounded-xl text-2xl text-gray-400
            hover:text-red-400 hover:bg-red-500/10
            transition-all duration-200
            group
          ">
            ⏻
            <span className="
              absolute left-full ml-2 px-2 py-1 rounded-md
              bg-gray-900 dark:bg-gray-800 text-white text-xs
              opacity-0 group-hover:opacity-100
              transition-opacity duration-200
              pointer-events-none
              whitespace-nowrap
            ">
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}