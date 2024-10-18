"use client"
import { useState } from "react";
import Link from "next/link";
import { FaThLarge, FaBell, FaCog, FaUser } from 'react-icons/fa';

export default function Header() {
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
   // Toggle dropdown visibility
   const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  return (
    <>
      <div className="bg-gray-800 shadow-md p-4 flex justify-between items-center">
        <div className="p-2 font-bold text-2xl text-white">Task Management</div>
        <div className="flex items-center space-x-6">
          <FaThLarge className="text-white"/>
          <FaBell className="text-white"/>
          <FaCog className="text-white"/>
          <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center" onClick={toggleDropdown}><FaUser /></div>
        </div>
      </div>
      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mr-4 w-48 bg-white shadow-lg rounded-lg">
          <ul className="py-2">
            <li className="px-4 py-2 hover:bg-gray-100">
              <Link href="/profile">User Profile</Link>
            </li>
            <li className="px-4 py-2 hover:bg-gray-100">
              <button onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
