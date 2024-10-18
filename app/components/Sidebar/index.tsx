// _components/Sidebar.tsx
import { FaClipboardList, FaTasks, FaUsers } from "react-icons/fa";
import Link from "next/link"; // For navigation
import { GrDocumentPerformance, GrDocumentTime } from "react-icons/gr";
import { IoDocumentsOutline } from "react-icons/io5";
import { AiOutlineDashboard } from "react-icons/ai";
import { useState } from "react";

export default function Sidebar() {

    const [isAdminToolOpen, setIsAdminToolOpen] = useState(false);

    const toggleAdminTool = () => {
      setIsAdminToolOpen(!isAdminToolOpen);
    };
    
  return (
    <aside className="w-64 bg-gray-800 text-white">
      <nav>
        <ul className="space-y-4 p-4">
          <li className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded">
            <AiOutlineDashboard />
            <Link href="/dashboard" className="font-semibold">
              Dashboard
            </Link>
          </li>
          <li className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded">
            <FaTasks />
            <Link href="/tasks" className="font-semibold">
              Tasks
            </Link>
          </li>
            {/* Administrator Tool Accordion */}
            <li className="hover:bg-gray-700 p-2 rounded">
            <div
              className="flex items-center justify-between cursor-pointer font-semibold"
              onClick={toggleAdminTool}
            >
              <span>Administrator Tool</span>
              <span>{isAdminToolOpen ? "-" : "+"}</span>
            </div>
            {isAdminToolOpen && (
              <ul className="ml-4 mt-2 space-y-2">
                <li className="hover:bg-gray-700 p-2 rounded">
                  <Link href="/categories" className="font-semibold">
                    Categories
                  </Link>
                </li>
              </ul>
            )}
       </li>
        </ul>
      </nav>
    </aside>
  );
}
