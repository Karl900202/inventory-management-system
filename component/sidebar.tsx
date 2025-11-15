import { UserButton } from "@stackframe/stack";
import { BarChart3, Package, Plus, Settings } from "lucide-react";
import Link from "next/link";

export default function Sidebar({
  currentPath = "/dashboard",
}: {
  currentPath: string;
}) {
  const navigation = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: BarChart3,
    },
    {
      name: "Inventory",
      path: "/inventory",
      icon: Package,
    },
    {
      name: "Add Product",
      path: "/add-product",
      icon: Plus,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];
  return (
    <div className="fixed left-0 top-0 bg-gray-900 text-white w-64 min-h-screen p-6 z-10">
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-6">
          <BarChart3 className="w-6 h-6" />
          <span className="text-lg font-semibold">Inventory App</span>
        </div>
        <nav className="space-y-3">
          <div className="text-xs font-semibold text-gray-400 uppercase">
            inventory
          </div>
          {navigation.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentPath === item.path;
            return (
              <Link
                href={item.path}
                key={item.path}
                className={`flex item-center space-x-3 py-2 px-3 my-1 rounded-lg ${
                  isActive
                    ? "bg-purple-100 text-gray-800"
                    : "hover:bg-gray-800 text-gray-300"
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-6 borter-t border-gray-700">
          <div className="flex items-center justify-between ">
            <UserButton showUserInfo></UserButton>
          </div>
        </div>
      </div>
    </div>
  );
}
