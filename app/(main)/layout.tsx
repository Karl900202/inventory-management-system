// app/(dashboard)/layout.tsx
"use client";

import Sidebar from "@/components/Sidebar";
import { Toaster } from "react-hot-toast";
import { useSidebarStore } from "@/store/SidebarStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        <main
          className={`p-8 transition-all duration-300 ${
            isCollapsed ? "ml-22" : "ml-64"
          }`}
          style={{
            width: isCollapsed ? "calc(100% - 4rem)" : "calc(100% - 16rem)",
          }}
        >
          {children}
          <Toaster position="bottom-center" />
        </main>
      </div>
    </div>
  );
}
