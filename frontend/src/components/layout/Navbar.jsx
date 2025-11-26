import { Button, TextInput, Dropdown, DropdownItem } from "flowbite-react";
import { MagnifyingGlassIcon, UserIcon } from "@heroicons/react/24/outline";

export function Navbar() {
  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-xl rounded-b-2xl px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Thoughts Out Loud</h1>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline transition-colors duration-200">
            Home
          </a>
          <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline transition-colors duration-200">
            Explore
          </a>
          <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline transition-colors duration-200">
            Profile
          </a>
        </div>

        {/* Search Input */}
        <div className="flex-1 max-w-md mx-6">
          <TextInput
            id="search"
            type="text"
            placeholder="Search thoughts..."
            icon={MagnifyingGlassIcon}
            sizing="lg"
            className="w-full"
            style={{ borderRadius: '0.75rem' }}
          />
        </div>

        {/* User Dropdown */}
        <Dropdown
          inline
          label={
            <div className="flex items-center space-x-2">
              <UserIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">User</span>
            </div>
          }
          className="rounded-2xl shadow-xl"
        >
          <DropdownItem>
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">
              Profile
            </a>
          </DropdownItem>
          <DropdownItem>
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">
              Settings
            </a>
          </DropdownItem>
          <DropdownItem>
            <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">
              Logout
            </a>
          </DropdownItem>
        </Dropdown>
      </div>
    </nav>
  );
}
