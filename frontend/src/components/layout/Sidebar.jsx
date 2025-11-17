import { Button } from "flowbite-react";
import {
  HomeIcon,
  UserIcon
} from "@heroicons/react/24/outline";

export function Sidebar() {
  const navItems = [
    { icon: HomeIcon, label: "Home", href: "#" },
    { icon: UserIcon, label: "Profile", href: "#" },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-xl rounded-r-2xl p-6">
      <nav className="space-y-4">
        {navItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-colors duration-200 group"
          >
            <item.icon className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
            <span className="font-medium">{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}
