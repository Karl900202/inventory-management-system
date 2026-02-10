"use client";

import { UserButton } from "@stackframe/stack";
import { BarChart3, Package, Plus, Settings, ArrowLeftToLine } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebarStore } from "@/store/SidebarStore";

export default function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebarStore();

  const navigation = [
    { name: "Dashboard", path: "/dashboard", icon: BarChart3 },
    { name: "Inventory", path: "/inventory", icon: Package },
    { name: "Add Product", path: "/add-product", icon: Plus },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div
      className={`fixed left-0 top-0 bg-gray-900 text-white min-h-screen z-10 transition-all duration-300 ${
        isCollapsed ? "w-22" : "w-64"
      } p-6`}
    >
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 flex-shrink-0" />
            {!isCollapsed && (
              <span className="text-lg font-semibold whitespace-nowrap">
                Inventory App
              </span>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-800 rounded transition-colors flex-shrink-0"
            aria-label="Toggle sidebar"
          >
            <ArrowLeftToLine
              className={`w-5 h-5 text-white transition-transform duration-300 ${
                isCollapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        <nav className="space-y-3">
          {!isCollapsed && (
            <div className="text-xs font-semibold text-gray-400 uppercase">
              inventory
            </div>
          )}

          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.path);

            return (
              <Link
                href={item.path}
                key={item.path}
                className={`flex items-center ${
                  isCollapsed
                    ? "justify-center w-10 h-10 rounded"
                    : "space-x-3 py-2 px-3 rounded-lg"
                } my-1 transition-colors ${
                  isActive
                    ? isCollapsed
                      ? "bg-purple-100 text-gray-800"
                      : "bg-purple-100 text-gray-800"
                    : "hover:bg-gray-800 text-gray-300"
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="text-sm font-medium whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div
          className={`absolute bottom-0 left-0 right-0 border-t border-gray-700 ${
            isCollapsed ? "p-4 flex justify-center" : "p-6"
          }`}
        >
          <UserButton showUserInfo={!isCollapsed} />
        </div>
      </div>
    </div>
  );
}
